import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../services/authStorage';
import {
  deleteBom,
  deleteMachine,
  deletePart,
  getBoms,
  getMachines,
  getMasterConfig,
  getParts,
  getUsers,
  updateMasterConfig
} from '../../services/configurationApi';
import {
  createPaginationState,
  MASTER_DATA_FILTER_OPTIONS,
  PROCESS_TYPES,
  VIEW_SYSTEM_PAGES
} from './configuration.model';

function getTotalPages(totalItems, itemsPerPage) {
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}

function getPageRange(currentPage, itemsPerPage, totalItems) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const startLabel = totalItems === 0 ? 0 : startIndex + 1;

  return { startIndex, endIndex, startLabel };
}

function encodeQueryParams(params = {}) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function mapMachine(item) {
  return {
    id: item._id,
    process: item.procesType || '',
    name: item.machineName || '',
    code: item.machineCode || '',
    size: item.capacity || ''
  };
}

function mapPart(item) {
  return {
    id: item._id,
    category: item.category || 'Valve',
    itemName: item.itemName || '',
    item: item.itemName || '',
    part_name: item.itemName || '',
    modelNo: item.modelNumber || '',
    model: item.modelNumber || item.equipment || '',
    size: item.size || '',
    moc: item.moc || '',
    class: item.class || '',
    remark: item.remarks || '',
    remarks: item.remarks || '',
    qty: item.quantity === undefined || item.quantity === null ? '' : String(item.quantity),
    equipment: item.equipment || '',
    invoice: item.invoice || '',
    party: item.party || '',
    date: item.date || ''
  };
}

function mapBom(item) {
  return {
    id: item._id,
    type: 'Valve',
    templateName: item.templateName || '',
    valveName: item.templateName || '',
    partName: item.valveType || '',
    displayName: item.templateName || item.valveType || '',
    valveType: item.valveType || '',
    valveClass: item.class || '',
    valveEndConnection: item.endConnection || '',
    valveSize: item.size || '',
    unit: item.unit || '',
    items: Array.isArray(item.items) ? item.items : []
  };
}

function mapUser(item) {
  return {
    id: item.id || item._id,
    name: item.name || '',
    email: item.email || '',
    password: '',
    role: item.role || 'User',
    permissions: item.permissions || {}
  };
}

export default function useConfigurationViewController() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('machines');
  const [processFilter, setProcessFilter] = useState('');
  const [partsCategoryFilter, setPartsCategoryFilter] = useState('');
  const [masterDataFilter, setMasterDataFilter] = useState('endConnections');
  const [pagination, setPagination] = useState(createPaginationState());

  const [machines, setMachinesState] = useState([]);
  const [parts, setPartsState] = useState([]);
  const [boms, setBomsState] = useState([]);
  const [users, setUsersState] = useState([]);
  const [masterData, setMasterDataState] = useState({
    endConnections: [],
    sizes: [],
    classes: []
  });

  const [permissionModalUser, setPermissionModalUser] = useState(null);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/');
    }
  }, [navigate]);

  const refreshData = async () => {
    try {
      const [machinesResponse, partsResponse, bomsResponse, usersResponse, masterResponse] =
        await Promise.all([getMachines(), getParts(), getBoms(), getUsers(), getMasterConfig()]);

      setMachinesState(Array.isArray(machinesResponse?.data) ? machinesResponse.data.map(mapMachine) : []);
      setPartsState(Array.isArray(partsResponse?.data) ? partsResponse.data.map(mapPart) : []);
      setBomsState(Array.isArray(bomsResponse?.data) ? bomsResponse.data.map(mapBom) : []);
      setUsersState(Array.isArray(usersResponse?.data) ? usersResponse.data.map(mapUser) : []);

      const master = masterResponse?.data || {};
      setMasterDataState({
        endConnections: master.endConnections || [],
        sizes: master.sizes || [],
        classes: master.classes || []
      });
    } catch (error) {
      window.alert(error.message);
    }
  };

  useEffect(() => {
    document.title = 'Configuration View - Orbit MES';
    refreshData();
  }, []);

  const filteredMachines = useMemo(() => {
    if (!processFilter) {
      return [...machines].reverse();
    }

    const filtered = machines.filter((item) => (item.process || '') === processFilter);
    return filtered.reverse();
  }, [machines, processFilter]);

  const filteredParts = useMemo(() => {
    if (!partsCategoryFilter) {
      return parts;
    }

    return parts.filter(
      (item) => (item.category || '').toString().toLowerCase() === partsCategoryFilter.toLowerCase()
    );
  }, [parts, partsCategoryFilter]);

  const filteredBoms = useMemo(() => boms, [boms]);

  const filteredUsers = useMemo(() => users, [users]);

  const filteredMasterData = useMemo(() => {
    return masterData[masterDataFilter] || [];
  }, [masterData, masterDataFilter]);

  const getItemsForTab = (tab) => {
    if (tab === 'machines') return filteredMachines;
    if (tab === 'parts') return filteredParts;
    if (tab === 'bom') return filteredBoms;
    if (tab === 'users') return filteredUsers;
    if (tab === 'masterdata') return filteredMasterData;
    return [];
  };

  const clampPageForTab = (tab) => {
    const items = getItemsForTab(tab);
    const totalPages = getTotalPages(items.length, pagination[tab].itemsPerPage);

    if (pagination[tab].currentPage > totalPages) {
      setPagination((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          currentPage: totalPages
        }
      }));
    }
  };

  useEffect(() => {
    clampPageForTab('machines');
    clampPageForTab('parts');
    clampPageForTab('bom');
    clampPageForTab('users');
    clampPageForTab('masterdata');
  }, [filteredMachines, filteredParts, filteredBoms, filteredUsers, filteredMasterData]);

  const getPaginationMeta = (tab) => {
    const items = getItemsForTab(tab);
    const state = pagination[tab];
    const totalItems = items.length;
    const totalPages = getTotalPages(totalItems, state.itemsPerPage);
    const { startIndex, endIndex, startLabel } = getPageRange(
      state.currentPage,
      state.itemsPerPage,
      totalItems
    );

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      startLabel
    };
  };

  const getPageItems = (tab) => {
    const items = getItemsForTab(tab);
    const meta = getPaginationMeta(tab);
    return items.slice(meta.startIndex, meta.endIndex);
  };

  const goToPage = (tab, pageNumber) => {
    const meta = getPaginationMeta(tab);
    const bounded = Math.min(Math.max(pageNumber, 1), meta.totalPages);

    setPagination((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        currentPage: bounded
      }
    }));
  };

  const prevPage = (tab) => {
    goToPage(tab, pagination[tab].currentPage - 1);
  };

  const nextPage = (tab) => {
    goToPage(tab, pagination[tab].currentPage + 1);
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    if (tabName !== 'machines') {
      setProcessFilter('');
    }
    if (tabName !== 'parts') {
      setPartsCategoryFilter('');
    }
    if (tabName !== 'masterdata') {
      setMasterDataFilter('endConnections');
    }
  };

  const openConfigurationForm = (tab = activeTab, extraQuery = {}) => {
    const queryString = encodeQueryParams({ tab, ...extraQuery });
    navigate(`/configuration${queryString ? `?${queryString}` : ''}`);
  };

  const handleEditMachine = (machine) => {
    openConfigurationForm('machines', {
      machineId: machine.id
    });
  };

  const handleDeleteMachine = async (machine) => {
    if (!window.confirm(`Are you sure you want to delete machine "${machine.name || 'this machine'}"?`)) {
      return;
    }

    try {
      await deleteMachine(machine.id);
      await refreshData();
      window.alert('Machine deleted successfully!');
    } catch (error) {
      window.alert(error.message);
    }
  };

  const handleEditPart = (part) => {
    openConfigurationForm('parts', {
      partId: part.id
    });
  };

  const handleDeletePart = async (part) => {
    if (!window.confirm(`Are you sure you want to delete "${part.item || part.itemName || part.part_name || 'this part'}"?`)) {
      return;
    }

    try {
      await deletePart(part.id);
      await refreshData();
      window.alert('Part deleted successfully!');
    } catch (error) {
      window.alert(error.message);
    }
  };

  const handleEditBom = (bom) => {
    openConfigurationForm('bom', {
      bomId: bom.id
    });
  };

  const handleDeleteBom = async (bom) => {
    const displayName = bom.templateName || bom.valveType || bom.displayName || 'this BOM';
    if (!window.confirm(`Are you sure you want to delete "${displayName}"?`)) {
      return;
    }

    try {
      await deleteBom(bom.id);
      await refreshData();
      window.alert('BOM deleted successfully!');
    } catch (error) {
      window.alert(error.message);
    }
  };

  const handleDeleteMasterData = async (type, index) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const currentValues = [...(masterData[type] || [])];
    if (currentValues[index] === undefined) {
      return;
    }

    currentValues.splice(index, 1);

    try {
      const response = await updateMasterConfig({ [type]: currentValues });
      const payload = response?.data || {};
      setMasterDataState((prev) => ({
        ...prev,
        endConnections: payload.endConnections || prev.endConnections,
        sizes: payload.sizes || prev.sizes,
        classes: payload.classes || prev.classes
      }));
      window.alert('Item deleted successfully!');
    } catch (error) {
      window.alert(error.message);
    }
  };

  const viewUserPermissionsFromView = (user) => {
    setPermissionModalUser(user);
  };

  const closePermissionsModal = () => {
    setPermissionModalUser(null);
  };

  const userRoleColorMap = {
    Admin: 'bg-red-100 text-red-700',
    Manager: 'bg-blue-100 text-blue-700',
    User: 'bg-green-100 text-green-700'
  };

  const machineCount = machines.length;
  const partCount = parts.length;
  const bomCount = boms.length;
  const userCount = users.length;
  const masterDataCount =
    (masterData.endConnections || []).length +
    (masterData.sizes || []).length +
    (masterData.classes || []).length;

  return {
    activeTab,
    processFilter,
    setProcessFilter,
    partsCategoryFilter,
    setPartsCategoryFilter,
    masterDataFilter,
    setMasterDataFilter,
    pagination,
    switchTab,
    goToPage,
    prevPage,
    nextPage,
    getPaginationMeta,
    getPageItems,
    openConfigurationForm,
    handleEditMachine,
    handleDeleteMachine,
    handleEditPart,
    handleDeletePart,
    handleEditBom,
    handleDeleteBom,
    handleDeleteMasterData,
    viewUserPermissionsFromView,
    closePermissionsModal,
    permissionModalUser,
    machineCount,
    partCount,
    bomCount,
    userCount,
    masterDataCount,
    userRoleColorMap,
    processTypes: PROCESS_TYPES,
    masterDataFilterOptions: MASTER_DATA_FILTER_OPTIONS,
    systemPages: VIEW_SYSTEM_PAGES,
    machines,
    parts,
    boms,
    users,
    filteredMasterData
  };
}
