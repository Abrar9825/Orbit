import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, hasUsableAuthToken } from '../../services/authStorage';
import { createStock, getPartsList, getStockById, getStockSummary, updateStock } from '../../services/stockApi';
import {
  createInitialPartForm,
  createInitialValveForm,
  toPayloadFromPart,
  toPayloadFromValve
} from './stockAssets.model';

function normalizeTab(tabValue) {
  if (tabValue === 'pattern') {
    return 'pattern';
  }
  return 'stock';
}

function cleanText(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

function normalizeDateInput(value) {
  const raw = cleanText(value);
  if (!raw) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
}

function formatPartLabel(part) {
  if (!part) {
    return '';
  }

  const itemName = cleanText(part.itemName);
  const model = cleanText(part.modelNumber || part.equipment);
  const size = cleanText(part.size);
  const tokens = [itemName, model, size].filter(Boolean);
  return tokens.join(' - ');
}

function matchesPartQuery(part, query) {
  const lookup = [
    part.itemName,
    part.modelNumber,
    part.equipment,
    part.size,
    part.moc,
    part.class,
    part.invoice,
    part.party
  ]
    .map((value) => cleanText(value).toLowerCase())
    .filter(Boolean)
    .join(' ');

  return lookup.includes(query);
}

const ALLOWED_PATTERN_STATUSES = ['Operational', 'Under Maintenance'];

function isAllowedPatternStatus(value) {
  return ALLOWED_PATTERN_STATUSES.includes(cleanText(value));
}

function parsePositiveNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function isAuthError(error) {
  const message = cleanText(error?.message).toLowerCase();
  return (
    message.includes('token') ||
    message.includes('access denied') ||
    message.includes('login again') ||
    message.includes('login first') ||
    message.includes('unauthorized')
  );
}

export default function useStockAssetsController() {
  const navigate = useNavigate();
  const location = useLocation();
  const partSearchRequestRef = useRef(0);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'create';
  const stockId = searchParams.get('id');
  const initialTab = normalizeTab(searchParams.get('tab'));

  const [activeTab, setActiveTab] = useState(initialTab);
  const [partForm, setPartForm] = useState(createInitialPartForm());
  const [valveForm, setValveForm] = useState(createInitialValveForm());
  const [parts, setParts] = useState([]);
  const [partSearchQuery, setPartSearchQuery] = useState('');
  const [partSearchResults, setPartSearchResults] = useState([]);
  const [searchingParts, setSearchingParts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStock: 0,
    lowStock: 0,
    totalAssets: 0,
    activeAssets: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!hasUsableAuthToken()) {
      clearAuthSession();
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    document.title = mode === 'edit' ? 'Edit Stock - Orbit' : 'Stock & Assets - Orbit';
  }, [mode]);

  const loadDropdownData = async () => {
    try {
      setLoading(true);
      setError('');
      const partsResponse = await getPartsList();
      const nextParts = Array.isArray(partsResponse?.data) ? partsResponse.data : [];
      nextParts.sort((left, right) =>
        cleanText(left.itemName).localeCompare(cleanText(right.itemName), undefined, { sensitivity: 'base' })
      );

      setParts(nextParts);
    } catch (nextError) {
      if (isAuthError(nextError)) {
        clearAuthSession();
        navigate('/');
        return;
      }

      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSummaryData = async () => {
    try {
      setStatsLoading(true);
      const response = await getStockSummary();
      const summary = response?.data || {};
      setStats({
        totalStock: Number(summary.totalStock || 0),
        lowStock: Number(summary.lowStock || 0),
        totalAssets: Number(summary.totalAssets || 0),
        activeAssets: Number(summary.activeAssets || 0)
      });
    } catch (nextError) {
      if (isAuthError(nextError)) {
        clearAuthSession();
        navigate('/');
        return;
      }

      setStats({
        totalStock: 0,
        lowStock: 0,
        totalAssets: 0,
        activeAssets: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const applyPartDefaults = (part) => {
    if (!part) {
      return;
    }

    const partQty = Number(part.quantity);
    const qty = Number.isFinite(partQty) && partQty > 0 ? String(partQty) : '';
    const date = normalizeDateInput(part.date);
    const modelNo = cleanText(part.modelNumber || part.equipment);
    const size = cleanText(part.size);
    const moc = cleanText(part.moc);
    const className = cleanText(part.class);
    const invoiceNo = cleanText(part.invoice);
    const sourceParty = cleanText(part.party);
    const remarks = cleanText(part.remarks);

    setPartForm((prev) => ({
      ...prev,
      partId: part._id,
      modelNo,
      size,
      moc,
      className,
      qty,
      invoiceNo,
      sourceParty,
      date,
      remarks
    }));
    setPartSearchQuery(formatPartLabel(part));
    setPartSearchResults([]);
  };

  const onSelectPart = (partId) => {
    const selectedId = String(partId || '').trim();
    if (!selectedId) {
      setPartForm((prev) => ({ ...prev, partId: '' }));
      setPartSearchQuery('');
      setPartSearchResults([]);
      return;
    }

    const selectedPart =
      parts.find((part) => String(part._id) === selectedId) ||
      partSearchResults.find((part) => String(part._id) === selectedId);

    if (!selectedPart) {
      setPartForm((prev) => ({ ...prev, partId: selectedId }));
      return;
    }

    applyPartDefaults(selectedPart);
  };

  const onPartSearchChange = (value) => {
    setPartSearchQuery(value);
    setError('');

    if (mode !== 'edit') {
      setPartForm((prev) => ({
        ...prev,
        partId: '',
        modelNo: '',
        size: '',
        moc: '',
        className: ''
      }));
    }

    if (!cleanText(value)) {
      setPartSearchResults([]);
    }
  };

  const validatePartForm = () => {
    if (!partForm.partId) {
      return 'Please select Item Name.';
    }

    const requiredFields = [
      { key: 'mrnNo', label: 'MRN No.' },
      { key: 'size', label: 'Size' },
      { key: 'moc', label: 'MOC' },
      { key: 'className', label: 'Class' },
      { key: 'invoiceNo', label: 'Invoice Number' },
      { key: 'sourceParty', label: 'Source Party' },
      { key: 'date', label: 'Date' },
      { key: 'presentLocation', label: 'Present Location' }
    ];

    for (const field of requiredFields) {
      if (!cleanText(partForm[field.key])) {
        return `${field.label} is required.`;
      }
    }

    if (parsePositiveNumber(partForm.qty) <= 0) {
      return 'Qty must be greater than 0.';
    }

    return '';
  };

  const validateValveForm = () => {
    if (!cleanText(valveForm.itemName)) {
      return 'Item / Equipment Name is required.';
    }

    if (parsePositiveNumber(valveForm.qty) <= 0) {
      return 'Qty must be greater than 0.';
    }

    if (!isAllowedPatternStatus(valveForm.status)) {
      return 'Invalid status selected.';
    }

    return '';
  };

  const hydrateEditForm = async () => {
    if (mode !== 'edit' || !stockId) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getStockById(stockId);
      const item = response?.data;
      if (!item) {
        return;
      }

      if (item.itemType === 'VALVE') {
        setActiveTab('pattern');
        const nextStatus = cleanText(item.status);
        setValveForm({
          bomId: item.bomId?._id || item.bomId || '',
          assetType: cleanText(item.valveType),
          itemName: cleanText(item.itemName),
          serialNo: cleanText(item.serialNo),
          moc: cleanText(item.moc),
          size: cleanText(item.size),
          qty: String(item.openingQty ?? item.qtyOnHand ?? 0),
          status: isAllowedPatternStatus(nextStatus) ? nextStatus : 'Operational',
          remarks: cleanText(item.remarks)
        });
      } else {
        setActiveTab('stock');
        setPartForm({
          partId: item.partId?._id || item.partId || '',
          modelNo: cleanText(item.modelNumber),
          mrnNo: cleanText(item.referenceNumber),
          size: cleanText(item.size),
          moc: cleanText(item.moc),
          className: cleanText(item.class),
          qty: String(item.openingQty ?? item.qtyOnHand ?? 0),
          invoiceNo: cleanText(item.sourceInvoiceNo),
          sourceParty: cleanText(item.sourceParty),
          date: item.stockDate ? String(item.stockDate).slice(0, 10) : '',
          presentLocation: cleanText(item.presentLocation),
          remarks: cleanText(item.remarks)
        });
        setPartSearchQuery(formatPartLabel(item.partId) || cleanText(item.itemName));
      }
    } catch (nextError) {
      if (isAuthError(nextError)) {
        clearAuthSession();
        navigate('/');
        return;
      }

      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDropdownData();
    loadSummaryData();
  }, []);

  useEffect(() => {
    hydrateEditForm();
  }, [mode, stockId]);

  useEffect(() => {
    const query = cleanText(partSearchQuery).toLowerCase();
    if (activeTab !== 'stock' || query.length < 2) {
      setSearchingParts(false);
      if (query.length < 2) {
        setPartSearchResults([]);
      }
      return;
    }

    let isActive = true;
    const requestId = partSearchRequestRef.current + 1;
    partSearchRequestRef.current = requestId;

    const handle = window.setTimeout(async () => {
      try {
        setSearchingParts(true);
        const response = await getPartsList({ q: query, limit: 20 });
        if (!isActive || requestId !== partSearchRequestRef.current) {
          return;
        }

        const results = Array.isArray(response?.data) ? response.data : [];
        setPartSearchResults(results);
      } catch {
        if (isActive && requestId === partSearchRequestRef.current) {
          setPartSearchResults([]);
        }
      } finally {
        if (isActive && requestId === partSearchRequestRef.current) {
          setSearchingParts(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      window.clearTimeout(handle);
    };
  }, [activeTab, partSearchQuery]);

  const selectedPart = useMemo(() => {
    const selectedId = String(partForm.partId || '').trim();
    if (!selectedId) {
      return null;
    }

    return (
      parts.find((part) => String(part._id) === selectedId) ||
      partSearchResults.find((part) => String(part._id) === selectedId) ||
      null
    );
  }, [partForm.partId, parts, partSearchResults]);

  const filteredParts = useMemo(() => {
    const query = cleanText(partSearchQuery).toLowerCase();
    if (!query) {
      return parts.slice(0, 12);
    }

    const preferredPool = partSearchResults.length ? partSearchResults : parts;
    return preferredPool.filter((part) => matchesPartQuery(part, query)).slice(0, 12);
  }, [partSearchQuery, partSearchResults, parts]);

  const showPartSuggestions = useMemo(() => {
    const query = cleanText(partSearchQuery).toLowerCase();
    if (!query) {
      return false;
    }

    if (!filteredParts.length) {
      return false;
    }

    const selectedName = cleanText(selectedPart?.itemName).toLowerCase();
    const selectedLabel = cleanText(formatPartLabel(selectedPart)).toLowerCase();
    return !selectedPart || (query !== selectedName && query !== selectedLabel);
  }, [partSearchQuery, selectedPart, filteredParts]);

  const onChangePart = (field, value) => {
    if (field === 'partId') {
      onSelectPart(value);
      return;
    }

    setPartForm((prev) => ({ ...prev, [field]: value }));
  };

  const onChangeValve = (field, value) => {
    if (field === 'status') {
      const nextStatus = cleanText(value);
      setValveForm((prev) => ({
        ...prev,
        status: isAllowedPatternStatus(nextStatus) ? nextStatus : 'Operational'
      }));
      return;
    }

    setValveForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitPart = async () => {
    const validationMessage = validatePartForm();
    if (validationMessage) {
      setError(validationMessage);
      window.alert(validationMessage);
      return;
    }

    const payload = toPayloadFromPart(partForm);

    try {
      setSubmitLoading(true);
      setError('');
      if (mode === 'edit' && stockId) {
        await updateStock(stockId, payload);
      } else {
        await createStock(payload);
      }
      navigate('/stock');
    } catch (nextError) {
      if (isAuthError(nextError)) {
        clearAuthSession();
        navigate('/');
        return;
      }

      setError(nextError.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const submitValve = async () => {
    const validationMessage = validateValveForm();
    if (validationMessage) {
      setError(validationMessage);
      window.alert(validationMessage);
      return;
    }

    const payload = toPayloadFromValve(valveForm);

    try {
      setSubmitLoading(true);
      setError('');
      if (mode === 'edit' && stockId) {
        await updateStock(stockId, payload);
      } else {
        await createStock(payload);
      }
      navigate('/stock');
    } catch (nextError) {
      if (isAuthError(nextError)) {
        clearAuthSession();
        navigate('/');
        return;
      }

      setError(nextError.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    mode,
    activeTab,
    setActiveTab,
    parts,
    partSearchQuery,
    filteredParts,
    selectedPart,
    searchingParts,
    showPartSuggestions,
    partForm,
    valveForm,
    loading,
    submitLoading,
    stats,
    statsLoading,
    error,
    onPartSearchChange,
    onSelectPart,
    onChangePart,
    onChangeValve,
    submitPart,
    submitValve,
    goBack: () => navigate('/stock')
  };
}
