import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, hasUsableAuthToken } from '../../services/authStorage';
import { deleteStock, getStockList } from '../../services/stockApi';
import { formatDate, formatNumber, mapStockForView, STOCK_STATUS_COLORS, STOCK_TABS } from './stock.model';

function parsePoData() {
  try {
    const value = localStorage.getItem('OrbitPO');
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isAuthError(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('token') ||
    message.includes('access denied') ||
    message.includes('login again') ||
    message.includes('login first') ||
    message.includes('unauthorized')
  );
}

export default function useStockManagementController() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [poRows, setPoRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    if (!hasUsableAuthToken()) {
      clearAuthSession();
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    document.title = 'Stock Management - Orbit';
  }, []);

  const loadRows = async (tab = activeTab, query = searchQuery) => {
    if (tab === 'po') {
      setPoRows(parsePoData());
      return;
    }

    try {
      setLoading(true);
      setError('');
      const itemType = tab === 'pattern' ? 'VALVE' : 'PART';
      const response = await getStockList({ itemType, q: query || undefined });
      const mapped = Array.isArray(response?.data)
        ? response.data.map(mapStockForView)
        : [];
      setRows(mapped);
    } catch (nextError) {
      if (isAuthError(nextError)) {
        clearAuthSession();
        navigate('/');
        return;
      }

      setError(nextError.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      loadRows(activeTab, searchQuery);
      setCurrentPage(1);
    }, 250);

    return () => window.clearTimeout(handle);
  }, [searchQuery]);

  const visibleRows = useMemo(() => {
    if (activeTab === 'po') {
      return poRows;
    }
    return rows;
  }, [activeTab, rows, poRows]);

  const totals = useMemo(() => {
    if (activeTab === 'po') {
      const pending = poRows.filter((item) => item.status === 'Pending').length;
      const approved = poRows.filter((item) => item.status === 'Approved').length;
      const completed = poRows.filter((item) => item.status === 'Completed').length;
      return {
        total: poRows.length,
        secondary: pending,
        tertiary: approved,
        quaternary: completed,
        labels: ['Total PO', 'Pending', 'Approved', 'Completed']
      };
    }

    const lowStock = rows.filter((item) => item.health === 'low' || item.health === 'critical').length;
    const totalAvailable = rows.reduce((sum, item) => sum + Number(item.available || 0), 0);
    const totalCommitted = rows.reduce((sum, item) => sum + Number(item.committed || 0), 0);

    return {
      total: rows.length,
      secondary: lowStock,
      tertiary: totalAvailable,
      quaternary: totalCommitted,
      labels: ['Total Items', 'Low Stock', 'Available', 'Committed']
    };
  }, [activeTab, poRows, rows]);

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / itemsPerPage));
  const boundedPage = Math.min(currentPage, totalPages);
  const startIndex = (boundedPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, visibleRows.length);
  const pageRows = visibleRows.slice(startIndex, endIndex);

  const onSwitchTab = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const onAdd = () => {
    navigate(`/stock/assets?tab=${activeTab}`);
  };

  const onEdit = (id) => {
    navigate(`/stock/assets?mode=edit&id=${id}&tab=${activeTab}`);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock item?')) {
      return;
    }

    try {
      await deleteStock(id);
      await loadRows(activeTab, searchQuery);
    } catch (nextError) {
      if (isAuthError(nextError)) {
        clearAuthSession();
        navigate('/');
        return;
      }

      window.alert(nextError.message);
    }
  };

  const onDeletePo = (index) => {
    if (!window.confirm('Delete this PO row?')) {
      return;
    }

    const next = [...poRows];
    next.splice(index, 1);
    setPoRows(next);
    localStorage.setItem('OrbitPO', JSON.stringify(next));
  };

  return {
    STOCK_TABS,
    STOCK_STATUS_COLORS,
    activeTab,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    totals,
    pageRows,
    currentPage: boundedPage,
    totalPages,
    showingStart: visibleRows.length ? startIndex + 1 : 0,
    showingEnd: endIndex,
    totalItems: visibleRows.length,
    formatDate,
    formatNumber,
    onSwitchTab,
    onAdd,
    onEdit,
    onDelete,
    onDeletePo,
    prevPage: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
    nextPage: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
    goToPage: (page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages))
  };
}
