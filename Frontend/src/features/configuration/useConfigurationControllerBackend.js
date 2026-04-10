import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../services/authStorage';
import {
  createBom,
  createMachine,
  createPart,
  createUser,
  getBomById,
  getMasterConfig,
  getMachineById,
  getPartById,
  getParts,
  getUserById,
  getUsers,
  updateBom,
  updateMachine,
  updateMasterConfig,
  updatePart,
  updateUser
} from '../../services/configurationApi';
import {
  CONFIG_SYSTEM_PAGES,
  PROCESS_TYPES,
  createDefaultUserPermissions,
  createInitialBomState,
  createInitialMachineDetail,
  createInitialPartState,
  createInitialUserForm
} from './configuration.model';

function toRows(values = []) {
  if (!values.length) {
    return [{ id: 1, value: '' }];
  }

  return values.map((value, index) => ({ id: index + 1, value }));
}

function getNextRowId(rows = []) {
  if (!rows.length) {
    return 1;
  }

  return Math.max(...rows.map((row) => row.id)) + 1;
}

function createPermissionTemplate() {
  return createDefaultUserPermissions();
}

function mapMachineToForm(machine) {
  return {
    processType: machine?.procesType || '',
    machineDetails: [
      {
        id: 1,
        name: machine?.machineName || '',
        code: machine?.machineCode || '',
        size: machine?.capacity || ''
      }
    ]
  };
}

function mapPartToForm(part) {
  return {
    state: {
      valve: {
        itemName: part?.itemName || '',
        modelNo: part?.modelNumber || part?.equipment || '',
        size: part?.size || '',
        moc: part?.moc || '',
        class: part?.class || '',
        remark: part?.remarks || ''
      },
      parts: createInitialPartState().parts
    }
  };
}

function mapBomToForm(bom) {
  return {
    bomState: {
      valve: {
        templateName: bom?.templateName || '',
        valveType: bom?.valveType || '',
        valveSize: bom?.size || '',
        valveClass: bom?.class || '',
        valveMOC: '',
        valveEndConnection: bom?.endConnection || '',
        valveFlangedStd: '',
        valveOperation: ''
      },
      parts: createInitialBomState().parts
    },
    bomParts: Array.isArray(bom?.items)
      ? bom.items.map((item, index) => ({
          id: index + 1,
          partId: item?.partId?._id || item?.partId || '',
          quantity: item?.quantity === undefined || item?.quantity === null ? '' : String(item.quantity),
          remark: item?.remark || ''
        }))
      : []
  };
}

function buildPermissionsFromState(userPermissions) {
  const permissions = {};

  CONFIG_SYSTEM_PAGES.forEach((page) => {
    const pagePerms = userPermissions[page.id] || {
      create: false,
      read: false,
      update: false,
      delete: false
    };

    if (pagePerms.create || pagePerms.read || pagePerms.update || pagePerms.delete) {
      permissions[page.id] = {
        create: Boolean(pagePerms.create),
        read: Boolean(pagePerms.read),
        update: Boolean(pagePerms.update),
        delete: Boolean(pagePerms.delete)
      };
    }
  });

  return permissions;
}

export default function useConfigurationController() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('machines');
  const [successMessage, setSuccessMessage] = useState('');

  const [processType, setProcessType] = useState('');
  const [machineDetails, setMachineDetails] = useState([{ id: 1, ...createInitialMachineDetail() }]);
  const [editingMachineId, setEditingMachineId] = useState('');

  const [partState, setPartState] = useState(createInitialPartState());
  const [editingPartId, setEditingPartId] = useState('');

  const [bomState, setBomState] = useState(createInitialBomState());
  const [bomParts, setBomParts] = useState([]);
  const [editingBomId, setEditingBomId] = useState('');

  const [orbitUsers, setOrbitUsersState] = useState([]);
  const [editingUserId, setEditingUserId] = useState('');
  const [userForm, setUserForm] = useState(createInitialUserForm());
  const [userPermissions, setUserPermissions] = useState(createPermissionTemplate());

  const [permissionModalUser, setPermissionModalUser] = useState(null);

  const [masterDataRows, setMasterDataRows] = useState({
    endConnections: [{ id: 1, value: '' }],
    sizes: [{ id: 1, value: '' }],
    classes: [{ id: 1, value: '' }]
  });
  const [masterDataOptions, setMasterDataOptions] = useState({
    endConnections: [],
    sizes: [],
    classes: [],
    units: []
  });

  const [availableParts, setAvailableParts] = useState([]);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    document.title = 'Configuration Management - Orbit MES';
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    window.setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const loadUsers = async () => {
    const response = await getUsers();
    const users = Array.isArray(response?.data) ? response.data : [];
    setOrbitUsersState(users);
    return users;
  };

  const loadParts = async () => {
    const response = await getParts();
    const parts = Array.isArray(response?.data) ? response.data : [];
    setAvailableParts(parts);
    return parts;
  };

  const loadMasterRows = async () => {
    const response = await getMasterConfig();
    const masterData = response?.data || {
      endConnections: [],
      sizes: [],
      classes: [],
      units: []
    };

    setMasterDataOptions({
      endConnections: masterData.endConnections || [],
      sizes: masterData.sizes || [],
      classes: masterData.classes || [],
      units: masterData.units || []
    });

    setMasterDataRows({
      endConnections: toRows(masterData.endConnections || []),
      sizes: toRows(masterData.sizes || []),
      classes: toRows(masterData.classes || [])
    });
  };

  const loadReferenceData = async () => {
    try {
      await Promise.all([loadUsers(), loadParts(), loadMasterRows()]);
    } catch (error) {
      window.alert(error.message);
    }
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  const addMachineDetail = () => {
    setMachineDetails((prev) => [
      ...prev,
      {
        id: getNextRowId(prev),
        ...createInitialMachineDetail()
      }
    ]);
  };

  const removeMachineDetail = (id) => {
    setMachineDetails((prev) => prev.filter((row) => row.id !== id));
  };

  const setMachineField = (id, field, value) => {
    setMachineDetails((prev) =>
      prev.map((row) => {
        if (row.id !== id) {
          return row;
        }

        return {
          ...row,
          [field]: value
        };
      })
    );
  };

  const resetMachineForm = () => {
    setProcessType('');
    setMachineDetails([{ id: 1, ...createInitialMachineDetail() }]);
    setEditingMachineId('');
  };

  const handleAddMachine = async () => {
    const cleanProcessType = processType.trim();
    if (!cleanProcessType) {
      window.alert('Please select a process');
      return;
    }

    const entries = machineDetails
      .filter((row) => row.name.trim() && row.code.trim() && row.size.trim())
      .map((row) => ({
        machineName: row.name.trim(),
        machineCode: row.code.trim(),
        capacity: row.size.trim(),
        procesType: cleanProcessType
      }));

    if (!entries.length) {
      window.alert('Please fill in at least one machine detail with name, code and size');
      return;
    }

    try {
      if (editingMachineId) {
        await updateMachine(editingMachineId, entries[0]);
        for (let index = 1; index < entries.length; index += 1) {
          await createMachine(entries[index]);
        }
        showSuccess('Machine updated successfully!');
        setEditingMachineId('');
        window.setTimeout(() => {
          navigate('/configuration/view?tab=machines');
        }, 600);
        return;
      }

      for (const entry of entries) {
        await createMachine(entry);
      }

      showSuccess('Machine(s) added successfully!');
      resetMachineForm();
    } catch (error) {
      window.alert(error.message);
    }
  };

  const setPartField = (section, field, value) => {
    setPartState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const resetPartForm = () => {
    setPartState(createInitialPartState());
    setEditingPartId('');
  };

  const handleAddPart = async () => {
    const valve = partState.valve;
    if (!valve.itemName.trim() || !valve.size.trim() || !valve.moc.trim()) {
      window.alert('Please fill in required part fields');
      return;
    }

    const payload = {
      category: 'Valve',
      itemName: valve.itemName.trim(),
      modelNumber: valve.modelNo.trim(),
      size: valve.size.trim(),
      moc: valve.moc.trim(),
      class: valve.class.trim(),
      remarks: valve.remark.trim()
    };

    try {
      if (editingPartId) {
        await updatePart(editingPartId, payload);
        showSuccess('Part updated successfully!');
        setEditingPartId('');
        await loadParts();
        window.setTimeout(() => {
          navigate('/configuration/view?tab=parts');
        }, 600);
        return;
      }

      await createPart(payload);
      showSuccess('Part added successfully!');
      await loadParts();
      resetPartForm();
    } catch (error) {
      window.alert(error.message);
    }
  };

  const setBomField = (section, field, value) => {
    setBomState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addBomPart = () => {
    setBomParts((prev) => [
      ...prev,
      {
        id: getNextRowId(prev),
        partId: '',
        quantity: '',
        remark: ''
      }
    ]);
  };

  const removeBomPart = (id) => {
    setBomParts((prev) => prev.filter((part) => part.id !== id));
  };

  const setBomPartField = (id, field, value) => {
    setBomParts((prev) =>
      prev.map((part) => {
        if (part.id !== id) {
          return part;
        }

        return {
          ...part,
          [field]: value
        };
      })
    );
  };

  const resetBomForm = () => {
    setBomState(createInitialBomState());
    setBomParts([]);
    setEditingBomId('');
  };

  const handleAddBom = async () => {
    const normalizedItems = bomParts
      .filter((row) => row.partId && String(row.quantity).trim())
      .map((row) => ({
        partId: row.partId,
        quantity: Math.max(Number(row.quantity) || 0, 1),
        remark: row.remark?.trim() || ''
      }));

    if (!normalizedItems.length) {
      window.alert('Please add at least one part in BOM items');
      return;
    }

    const valve = bomState.valve;
    if (
      !valve.templateName.trim() ||
      !valve.valveType.trim() ||
      !valve.valveSize.trim() ||
      !valve.valveClass.trim() ||
      !valve.valveEndConnection.trim()
    ) {
      window.alert('Please fill in required BOM template fields');
      return;
    }

    const payload = {
      templateName: valve.templateName.trim(),
      valveType: valve.valveType.trim(),
      class: valve.valveClass.trim(),
      endConnection: valve.valveEndConnection.trim(),
      size: valve.valveSize.trim(),
      unit: masterDataOptions.units[0] || 'NOS',
      items: normalizedItems
    };

    try {
      if (editingBomId) {
        await updateBom(editingBomId, payload);
        showSuccess('BOM template updated successfully!');
        setEditingBomId('');
        window.setTimeout(() => {
          navigate('/configuration/view?tab=bom');
        }, 600);
        return;
      }

      await createBom(payload);
      showSuccess('BOM Template created successfully!');
      resetBomForm();
    } catch (error) {
      window.alert(error.message);
    }
  };

  const setUserField = (field, value) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const approveAllPages = () => {
    setUserPermissions(
      CONFIG_SYSTEM_PAGES.reduce((acc, page) => {
        acc[page.id] = { create: true, read: true, update: true, delete: true };
        return acc;
      }, {})
    );
  };

  const togglePermission = (pageId, permissionType, checked) => {
    setUserPermissions((prev) => ({
      ...prev,
      [pageId]: {
        ...(prev[pageId] || { create: false, read: false, update: false, delete: false }),
        [permissionType]: checked
      }
    }));
  };

  const clearUserForm = () => {
    setEditingUserId('');
    setUserForm(createInitialUserForm());
    setUserPermissions(createPermissionTemplate());
  };

  const saveUser = async () => {
    const name = userForm.name.trim();
    const email = userForm.email.trim();
    const password = userForm.password;

    if (!name || !email) {
      window.alert('Please fill in user name and email');
      return;
    }

    if (!editingUserId && !password) {
      window.alert('Please provide password for new user');
      return;
    }

    const payload = {
      name,
      email,
      role: userForm.role,
      permissions: buildPermissionsFromState(userPermissions)
    };

    if (password) {
      payload.password = password;
    }

    try {
      if (editingUserId) {
        await updateUser(editingUserId, payload);
        showSuccess('User updated successfully!');
        setEditingUserId('');
      } else {
        await createUser(payload);
        showSuccess('User created successfully!');
      }

      await loadUsers();
      clearUserForm();
    } catch (error) {
      window.alert(error.message);
    }
  };

  const editOrbitUser = async (userId) => {
    try {
      const response = await getUserById(userId);
      const user = response?.data;
      if (!user) {
        return;
      }

      setEditingUserId(String(user.id || user._id));
      setUserForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'User'
      });

      setUserPermissions({
        ...createPermissionTemplate(),
        ...(user.permissions || {})
      });
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteOrbitUser = () => {
    window.alert('Delete user from Configuration View page table');
  };

  const viewUserPermissions = (userId) => {
    const user = orbitUsers.find((item) => String(item.id || item._id) === String(userId));
    if (!user) {
      return;
    }

    setPermissionModalUser(user);
  };

  const closePermissionsModal = () => {
    setPermissionModalUser(null);
  };

  const addMasterDataRow = (type) => {
    setMasterDataRows((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          id: getNextRowId(prev[type]),
          value: ''
        }
      ]
    }));
  };

  const removeMasterDataRow = (type, id) => {
    setMasterDataRows((prev) => {
      const nextRows = prev[type].filter((row) => row.id !== id);
      return {
        ...prev,
        [type]: nextRows.length ? nextRows : [{ id: 1, value: '' }]
      };
    });
  };

  const setMasterDataRowValue = (type, id, value) => {
    setMasterDataRows((prev) => ({
      ...prev,
      [type]: prev[type].map((row) => {
        if (row.id !== id) {
          return row;
        }

        return {
          ...row,
          value
        };
      })
    }));
  };

  const saveMasterDataValues = async () => {
    const payload = {
      endConnections: masterDataRows.endConnections
        .map((row) => row.value.trim())
        .filter(Boolean),
      sizes: masterDataRows.sizes.map((row) => row.value.trim()).filter(Boolean),
      classes: masterDataRows.classes.map((row) => row.value.trim()).filter(Boolean)
    };

    try {
      const response = await updateMasterConfig(payload);
      const masterData = response?.data || payload;

      setMasterDataOptions((prev) => ({
        ...prev,
        endConnections: masterData.endConnections || [],
        sizes: masterData.sizes || [],
        classes: masterData.classes || []
      }));
      setMasterDataRows({
        endConnections: toRows(masterData.endConnections || []),
        sizes: toRows(masterData.sizes || []),
        classes: toRows(masterData.classes || [])
      });

      showSuccess('Master Data saved successfully!');
    } catch (error) {
      window.alert(error.message);
    }
  };

  useEffect(() => {
    const applyQueryPayload = async () => {
      const params = new URLSearchParams(location.search);
      const tabParam = params.get('tab');
      const userId = params.get('userId');
      const machineId = params.get('machineId');
      const partId = params.get('partId');
      const bomId = params.get('bomId');

      if (tabParam) {
        const normalizedTab = tabParam === 'users' ? 'pages' : tabParam;
        setActiveTab(normalizedTab);
      }

      if (machineId) {
        try {
          const response = await getMachineById(machineId);
          const mapped = mapMachineToForm(response?.data);
          setActiveTab('machines');
          setEditingMachineId(String(machineId));
          setProcessType(mapped.processType);
          setMachineDetails(mapped.machineDetails);
        } catch {
          setEditingMachineId('');
        }
        return;
      }

      if (partId) {
        try {
          const response = await getPartById(partId);
          const mapped = mapPartToForm(response?.data);
          setActiveTab('parts');
          setEditingPartId(String(partId));
          setPartState(mapped.state);
        } catch {
          setEditingPartId('');
        }
        return;
      }

      if (bomId) {
        try {
          const response = await getBomById(bomId);
          const mapped = mapBomToForm(response?.data);
          setActiveTab('bom');
          setEditingBomId(String(bomId));
          setBomState(mapped.bomState);
          setBomParts(mapped.bomParts);
        } catch {
          setEditingBomId('');
        }
        return;
      }

      if (userId) {
        setActiveTab('pages');
        await editOrbitUser(userId);
      }
    };

    applyQueryPayload();
  }, [location.search]);

  useEffect(() => {
    const hash = location.hash.replace('#', '').trim().toLowerCase();
    if (hash === 'parts' || hash === 'bom') {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const currentPartForm = useMemo(() => partState.valve, [partState]);

  return {
    activeTab,
    switchTab,
    successMessage,
    setSuccessMessage,

    processType,
    setProcessType,
    machineDetails,
    addMachineDetail,
    removeMachineDetail,
    setMachineField,
    resetMachineForm,
    handleAddMachine,
    isMachineEditMode: Boolean(editingMachineId),

    partState,
    currentPartForm,
    setPartField,
    resetPartForm,
    handleAddPart,
    isPartEditMode: Boolean(editingPartId),

    bomState,
    setBomField,
    bomParts,
    addBomPart,
    removeBomPart,
    setBomPartField,
    resetBomForm,
    handleAddBom,
    isBomEditMode: Boolean(editingBomId),

    systemPages: CONFIG_SYSTEM_PAGES,
    orbitUsers,
    userForm,
    setUserField,
    userPermissions,
    togglePermission,
    approveAllPages,
    saveUser,
    clearUserForm,
    editOrbitUser,
    deleteOrbitUser,
    viewUserPermissions,
    isUserEditMode: Boolean(editingUserId),

    permissionModalUser,
    closePermissionsModal,

    masterDataRows,
    addMasterDataRow,
    removeMasterDataRow,
    setMasterDataRowValue,
    saveMasterDataValues,

    masterDataOptions,
    availableParts,

    processTypes: PROCESS_TYPES,

    goToDashboard: () => navigate('/cards'),
    goToViewPage: () => navigate('/configuration/view')
  };
}
