import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createPaginationState,
  MASTER_DATA_FILTER_OPTIONS,
  PROCESS_TYPES,
  VIEW_SYSTEM_PAGES
} from './configuration.model';
import {
  encodeQueryParams,
  getBoms,
  getMachines,
  getMasterData,
  getOrbitUsers,
  getParts,
  initializeConfigurationSampleData,
  setBoms,
  setMachines,
  setMasterData,
  setParts
} from '../../services/configStorage';

function getTotalPages(totalItems, itemsPerPage) {
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}

function getPageRange(currentPage, itemsPerPage, totalItems) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const startLabel = totalItems === 0 ? 0 : startIndex + 1;

  return { startIndex, endIndex, startLabel };
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
    const token = localStorage.getItem('orbitAuthToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const refreshData = () => {
    setMachinesState(getMachines());
    setPartsState(getParts());
    setBomsState(getBoms());
    setUsersState(getOrbitUsers());
    setMasterDataState(getMasterData());
  };

  useEffect(() => {
    document.title = 'Configuration View - Orbit MES';
    initializeConfigurationSampleData();
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

  const handleEditMachine = (machine, reversedGlobalIndex) => {
    const originalIndex = machines.length - 1 - reversedGlobalIndex;
    openConfigurationForm('machines', {
      machineIndex: originalIndex,
      machineCode: machine.code,
      machineName: machine.name,
      process: machine.process,
      size: machine.size
    });
  };

  const handleDeleteMachine = (machine, reversedGlobalIndex) => {
    const originalIndex = machines.length - 1 - reversedGlobalIndex;
    if (!window.confirm(`Are you sure you want to delete machine "${machine.name || 'this machine'}"?`)) {
      return;
    }

    const updated = [...machines];
    updated.splice(originalIndex, 1);
    setMachines(updated);
    refreshData();
    window.alert('Machine deleted successfully!');
  };

  const handleEditPart = (part) => {
    const partIndex = parts.findIndex((entry) => entry === part);
    openConfigurationForm('parts', {
      partIndex,
      ...part
    });
  };

  const handleDeletePart = (part) => {
    if (!window.confirm(`Are you sure you want to delete "${part.item || part.itemName || part.part_name || 'this part'}"?`)) {
      return;
    }

    const partIndex = parts.findIndex((entry) => entry === part);
    if (partIndex < 0) {
      return;
    }

    const updated = [...parts];
    updated.splice(partIndex, 1);
    setParts(updated);
    refreshData();
    window.alert('Part deleted successfully!');
  };

  const handleEditBom = (bom) => {
    const bomIndex = boms.findIndex((entry) => entry === bom);
    openConfigurationForm('bom', {
      bomIndex,
      ...bom
    });
  };

  const handleDeleteBom = (bom) => {
    const displayName = bom.type === 'Valve' ? bom.valveName || 'this BOM' : bom.partName || 'this BOM';
    if (!window.confirm(`Are you sure you want to delete "${displayName}"?`)) {
      return;
    }

    const bomIndex = boms.findIndex((entry) => entry === bom);
    if (bomIndex < 0) {
      return;
    }

    const updated = [...boms];
    updated.splice(bomIndex, 1);
    setBoms(updated);
    refreshData();
    window.alert('BOM deleted successfully!');
  };

  const handleDeleteMasterData = (type, index) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const next = getMasterData();
    if (next[type] && next[type][index] !== undefined) {
      next[type].splice(index, 1);
      setMasterData(next);
      refreshData();
      window.alert('Item deleted successfully!');
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

  const machineCount = filteredMachines.length;
  const partCount = filteredParts.length;
  const bomCount = filteredBoms.length;
  const userCount = filteredUsers.length;
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
