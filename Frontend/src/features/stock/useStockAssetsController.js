import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createStock, getBomsList, getPartsList, getStockById, updateStock } from '../../services/stockApi';
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

export default function useStockAssetsController() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'create';
  const stockId = searchParams.get('id');
  const initialTab = normalizeTab(searchParams.get('tab'));

  const [activeTab, setActiveTab] = useState(initialTab);
  const [partForm, setPartForm] = useState(createInitialPartForm());
  const [valveForm, setValveForm] = useState(createInitialValveForm());
  const [parts, setParts] = useState([]);
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('orbitAuthToken');
    if (!token) {
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
      const [partsResponse, bomsResponse] = await Promise.all([getPartsList(), getBomsList()]);
      setParts(Array.isArray(partsResponse?.data) ? partsResponse.data : []);
      setBoms(Array.isArray(bomsResponse?.data) ? bomsResponse.data : []);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
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
        setValveForm({
          bomId: item.bomId?._id || item.bomId || '',
          openingQty: String(item.openingQty ?? item.qtyOnHand ?? 0),
          minStockLevel: String(item.minStockLevel ?? 0),
          reorderQty: String(item.reorderQty ?? 0),
          plan: String(item.plan ?? 0),
          committed: String(item.committed ?? 0),
          sourceInvoiceNo: item.sourceInvoiceNo || '',
          sourceParty: item.sourceParty || '',
          workOrderNumber: item.workOrderNumber || '',
          referenceNumber: item.referenceNumber || '',
          sourcePONumber: item.sourcePONumber || '',
          stockDate: item.stockDate ? String(item.stockDate).slice(0, 10) : '',
          remarks: item.remarks || ''
        });
      } else {
        setActiveTab('stock');
        setPartForm({
          partId: item.partId?._id || item.partId || '',
          openingQty: String(item.openingQty ?? item.qtyOnHand ?? 0),
          minStockLevel: String(item.minStockLevel ?? 0),
          reorderQty: String(item.reorderQty ?? 0),
          plan: String(item.plan ?? 0),
          committed: String(item.committed ?? 0),
          sourceInvoiceNo: item.sourceInvoiceNo || '',
          sourceParty: item.sourceParty || '',
          workOrderNumber: item.workOrderNumber || '',
          referenceNumber: item.referenceNumber || '',
          sourcePONumber: item.sourcePONumber || '',
          stockDate: item.stockDate ? String(item.stockDate).slice(0, 10) : '',
          remarks: item.remarks || ''
        });
      }
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDropdownData();
  }, []);

  useEffect(() => {
    hydrateEditForm();
  }, [mode, stockId]);

  const onChangePart = (field, value) => {
    setPartForm((prev) => ({ ...prev, [field]: value }));
  };

  const onChangeValve = (field, value) => {
    setValveForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitPart = async () => {
    if (!partForm.partId) {
      window.alert('Please select a part');
      return;
    }

    const payload = toPayloadFromPart(partForm);

    try {
      setSubmitLoading(true);
      if (mode === 'edit' && stockId) {
        await updateStock(stockId, payload);
      } else {
        await createStock(payload);
      }
      navigate('/stock');
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const submitValve = async () => {
    if (!valveForm.bomId) {
      window.alert('Please select a BOM template');
      return;
    }

    const payload = toPayloadFromValve(valveForm);

    try {
      setSubmitLoading(true);
      if (mode === 'edit' && stockId) {
        await updateStock(stockId, payload);
      } else {
        await createStock(payload);
      }
      navigate('/stock');
    } catch (nextError) {
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
    boms,
    partForm,
    valveForm,
    loading,
    submitLoading,
    error,
    onChangePart,
    onChangeValve,
    submitPart,
    submitValve,
    goBack: () => navigate('/stock')
  };
}
