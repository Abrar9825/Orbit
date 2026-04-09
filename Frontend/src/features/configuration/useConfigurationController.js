import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CONFIG_SYSTEM_PAGES,
  PROCESS_TYPES,
  createDefaultUserPermissions,
  createInitialBomState,
  createInitialMachineDetail,
  createInitialPartState,
  createInitialUserForm
} from './configuration.model';
import {
  getBoms,
  getMachines,
  getMasterData,
  getOrbitUsers,
  getParts,
  initializeConfigurationSampleData,
  setBoms,
  setMachines,
  setMasterData,
  setOrbitUsers,
  setParts
} from '../../services/configStorage';

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

function normalizePartCategory(category = '') {
  const lower = String(category || '').toLowerCase();
  if (lower === 'valve') return 'valve';
  return 'parts';
}

function normalizeBomType(type = '') {
  const lower = String(type || '').toLowerCase();
  if (lower === 'parts') return 'parts';
  return 'valve';
}

function createPermissionTemplate() {
  return createDefaultUserPermissions();
}

export default function useConfigurationController() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('machines');
  const [successMessage, setSuccessMessage] = useState('');

  const [processType, setProcessType] = useState('');
  const [machineDetails, setMachineDetails] = useState([{ id: 1, ...createInitialMachineDetail() }]);
  const [editingMachineIndex, setEditingMachineIndex] = useState(null);

  const [selectedPartCategory, setSelectedPartCategory] = useState('valve');
  const [partState, setPartState] = useState(createInitialPartState());
  const [editingPartIndex, setEditingPartIndex] = useState(null);

  const [selectedBomType, setSelectedBomType] = useState('valve');
  const [bomState, setBomState] = useState(createInitialBomState());
  const [bomParts, setBomParts] = useState([]);
  const [editingBomIndex, setEditingBomIndex] = useState(null);

  const [orbitUsers, setOrbitUsersState] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState(createInitialUserForm());
  const [userPermissions, setUserPermissions] = useState(createPermissionTemplate());

  const [permissionModalUser, setPermissionModalUser] = useState(null);

  const [masterDataRows, setMasterDataRows] = useState({
    endConnections: [{ id: 1, value: '' }],
    sizes: [{ id: 1, value: '' }],
    classes: [{ id: 1, value: '' }]
  });

  useEffect(() => {
    const token = localStorage.getItem('orbitAuthToken');
    if (!token) {
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

  const loadUsers = () => {
    const users = getOrbitUsers();
    setOrbitUsersState(users);
    return users;
  };

  const loadMasterRows = () => {
    const masterData = getMasterData();
    setMasterDataRows({
      endConnections: toRows(masterData.endConnections || []),
      sizes: toRows(masterData.sizes || []),
      classes: toRows(masterData.classes || [])
    });
  };

  useEffect(() => {
    initializeConfigurationSampleData();
    loadUsers();
    loadMasterRows();
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
    setMachineDetails((prev) => prev.map((row) => ({ ...row, name: '', code: '', size: '' })));
    setEditingMachineIndex(null);
  };

  const handleAddMachine = () => {
    if (!processType.trim()) {
      window.alert('Please select a process');
      return;
    }

    const entries = machineDetails
      .filter((row) => row.name.trim() && row.code.trim())
      .map((row) => ({
        name: row.name.trim(),
        code: row.code.trim(),
        size: row.size.trim(),
        process: processType.trim()
      }));

    if (!entries.length) {
      window.alert('Please fill in at least one machine detail');
      return;
    }

    const existing = getMachines();
    let updated = [...existing];

    if (editingMachineIndex !== null && updated[editingMachineIndex]) {
      updated[editingMachineIndex] = entries[0];
      if (entries.length > 1) {
        updated = [...updated, ...entries.slice(1)];
      }
      setMachines(updated);
      showSuccess('Machine updated successfully!');
      setEditingMachineIndex(null);
      window.setTimeout(() => {
        navigate('/configuration/view?tab=machines');
      }, 800);
      return;
    }

    updated = [...updated, ...entries];
    setMachines(updated);
    showSuccess('Machine(s) added successfully!');
    resetMachineForm();
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

  const selectPartCategory = (category) => {
    setSelectedPartCategory(normalizePartCategory(category));
  };

  const resetPartForm = () => {
    setPartState(createInitialPartState());
    setEditingPartIndex(null);
  };

  const handleAddPart = () => {
    let part = null;

    if (selectedPartCategory === 'valve') {
      const valve = partState.valve;
      if (!valve.itemName.trim() || !valve.size.trim() || !valve.moc.trim()) {
        window.alert('Please fill in required fields');
        return;
      }

      part = {
        category: 'Valve',
        itemName: valve.itemName.trim(),
        modelNo: valve.modelNo.trim(),
        size: valve.size.trim(),
        moc: valve.moc.trim(),
        class: valve.class.trim(),
        remark: valve.remark.trim()
      };
    } else {
      const parts = partState.parts;
      if (!parts.item.trim() || !parts.moc.trim() || !String(parts.qty).trim()) {
        window.alert('Please fill in required fields');
        return;
      }

      part = {
        category: 'Parts',
        item: parts.item.trim(),
        equipment: parts.equipment.trim(),
        moc: parts.moc.trim(),
        remarks: parts.remarks.trim(),
        qty: String(parts.qty).trim(),
        invoice: parts.invoice.trim(),
        party: parts.party.trim(),
        date: parts.date
      };
    }

    const existing = getParts();
    const updated = [...existing];

    if (editingPartIndex !== null && updated[editingPartIndex]) {
      updated[editingPartIndex] = part;
      setParts(updated);
      showSuccess('Part updated successfully!');
      setEditingPartIndex(null);
      window.setTimeout(() => {
        navigate('/configuration/view?tab=parts');
      }, 800);
      return;
    }

    updated.push(part);
    setParts(updated);
    showSuccess('Part added successfully!');
    resetPartForm();
  };

  const selectBomType = (type) => {
    setSelectedBomType(normalizeBomType(type));
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
        partName: '',
        size: '',
        quantity: ''
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
    setEditingBomIndex(null);
  };

  const handleAddBom = () => {
    const additionalParts = bomParts
      .filter((row) => row.partName.trim() && row.size.trim() && String(row.quantity).trim())
      .map((row) => ({
        partName: row.partName.trim(),
        size: row.size.trim(),
        quantity: String(row.quantity).trim()
      }));

    const payload = {
      type: selectedBomType === 'parts' ? 'Parts' : 'Valve',
      additionalParts
    };

    if (selectedBomType === 'valve') {
      const valve = bomState.valve;
      if (
        !valve.valveName.trim() ||
        !valve.valveSize.trim() ||
        !valve.valveClass.trim() ||
        !valve.valveMOC.trim() ||
        !valve.valveEndConnection.trim() ||
        !valve.valveFlangedStd.trim() ||
        !valve.valveOperation.trim()
      ) {
        window.alert('Please fill in all required valve fields');
        return;
      }

      Object.assign(payload, {
        valveName: valve.valveName.trim(),
        valveSize: valve.valveSize.trim(),
        valveClass: valve.valveClass.trim(),
        valveMOC: valve.valveMOC.trim(),
        valveEndConnection: valve.valveEndConnection.trim(),
        valveFlangedStd: valve.valveFlangedStd.trim(),
        valveOperation: valve.valveOperation.trim()
      });
    } else {
      const parts = bomState.parts;
      if (!parts.partName.trim() || !parts.partSize.trim() || !String(parts.partQuantity).trim()) {
        window.alert('Please fill in part name, size and quantity');
        return;
      }

      Object.assign(payload, {
        partName: parts.partName.trim(),
        partSize: parts.partSize.trim(),
        partQuantity: String(parts.partQuantity).trim(),
        partRemarks: parts.partRemarks.trim()
      });
    }

    const existing = getBoms();
    const updated = [...existing];

    if (editingBomIndex !== null && updated[editingBomIndex]) {
      updated[editingBomIndex] = payload;
      setBoms(updated);
      showSuccess('BOM template updated successfully!');
      setEditingBomIndex(null);
      window.setTimeout(() => {
        navigate('/configuration/view?tab=bom');
      }, 800);
      return;
    }

    updated.push(payload);
    setBoms(updated);
    showSuccess('BOM Template created successfully!');
    resetBomForm();
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
    setEditingUserId(null);
    setUserForm(createInitialUserForm());
    setUserPermissions(createPermissionTemplate());
  };

  const saveUser = () => {
    const name = userForm.name.trim();
    const email = userForm.email.trim();
    const password = userForm.password;

    if (!name || !email || !password) {
      window.alert('Please fill in user name, email and password');
      return;
    }

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

    const existing = [...orbitUsers];

    if (editingUserId) {
      const index = existing.findIndex((item) => String(item.id) === String(editingUserId));
      if (index !== -1) {
        existing[index] = {
          ...existing[index],
          name,
          email,
          password,
          role: userForm.role,
          permissions
        };
      }
      showSuccess('User updated successfully!');
      setEditingUserId(null);
    } else {
      const newId = `U${String(existing.length + 1).padStart(3, '0')}`;
      existing.push({
        id: newId,
        name,
        email,
        password,
        role: userForm.role,
        permissions
      });
      showSuccess('User created successfully!');
    }

    setOrbitUsers(existing);
    setOrbitUsersState(existing);
    clearUserForm();
  };

  const editOrbitUser = (userId) => {
    const users = orbitUsers.length ? orbitUsers : getOrbitUsers();
    const user = users.find((item) => String(item.id) === String(userId));
    if (!user) {
      return;
    }

    setEditingUserId(String(user.id));
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      password: user.password || '',
      role: user.role || 'User'
    });

    setUserPermissions({
      ...createPermissionTemplate(),
      ...(user.permissions || {})
    });
  };

  const deleteOrbitUser = (userId) => {
    const user = orbitUsers.find((item) => String(item.id) === String(userId));
    if (!user) {
      return;
    }

    if (!window.confirm(`Delete user "${user.name}"? This action cannot be undone.`)) {
      return;
    }

    const next = orbitUsers.filter((item) => String(item.id) !== String(userId));
    setOrbitUsers(next);
    setOrbitUsersState(next);
    showSuccess('User deleted successfully!');
  };

  const viewUserPermissions = (userId) => {
    const user = orbitUsers.find((item) => String(item.id) === String(userId));
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

  const saveMasterDataValues = () => {
    const payload = {
      endConnections: masterDataRows.endConnections
        .map((row) => row.value.trim())
        .filter(Boolean),
      sizes: masterDataRows.sizes.map((row) => row.value.trim()).filter(Boolean),
      classes: masterDataRows.classes.map((row) => row.value.trim()).filter(Boolean)
    };

    setMasterData(payload);
    showSuccess('Master Data saved successfully!');
  };

  const applyMachinePayload = (values = {}) => {
    setProcessType(values.process || values.processType || '');
    setMachineDetails([
      {
        id: 1,
        name: values.machineName || values.name || '',
        code: values.machineCode || values.code || '',
        size: values.size || ''
      }
    ]);
  };

  const applyPartPayload = (values = {}) => {
    const category = normalizePartCategory(values.category || values.partCategory || 'valve');
    setSelectedPartCategory(category);

    if (category === 'valve') {
      setPartState((prev) => ({
        ...prev,
        valve: {
          itemName: values.itemName || values.item || values.part_name || values.partName || '',
          modelNo: values.modelNo || values.model || '',
          size: values.size || '',
          moc: values.moc || '',
          class: values.class || '',
          remark: values.remark || values.remarks || ''
        }
      }));
      return;
    }

    setPartState((prev) => ({
      ...prev,
      parts: {
        item: values.item || values.part_name || values.partName || values.itemName || '',
        equipment: values.equipment || '',
        moc: values.moc || '',
        remarks: values.remarks || values.remark || '',
        qty: values.qty || values.quantity || '',
        invoice: values.invoice || '',
        party: values.party || '',
        date: values.date || ''
      }
    }));
  };

  const applyBomPayload = (values = {}) => {
    const type = normalizeBomType(values.bomCategory || values.type || 'valve');
    setSelectedBomType(type);

    if (type === 'parts') {
      setBomState((prev) => ({
        ...prev,
        parts: {
          partName: values.partName || '',
          partSize: values.partSize || values.size || '',
          partQuantity: values.partQuantity || values.qty || '',
          partRemarks: values.partRemarks || values.remarks || ''
        }
      }));
      return;
    }

    setBomState((prev) => ({
      ...prev,
      valve: {
        valveName: values.valveName || '',
        valveSize: values.valveSize || '',
        valveClass: values.valveClass || '',
        valveMOC: values.valveMOC || '',
        valveEndConnection: values.valveEndConnection || '',
        valveFlangedStd: values.valveFlangedStd || '',
        valveOperation: values.valveOperation || ''
      }
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const userId = params.get('userId');
    const machineIndexParam = params.get('machineIndex');
    const partIndexParam = params.get('partIndex');
    const bomIndexParam = params.get('bomIndex');

    if (machineIndexParam !== null && machineIndexParam !== '') {
      const machineIndex = Number(machineIndexParam);
      const machines = getMachines();
      if (!Number.isNaN(machineIndex) && machines[machineIndex]) {
        setActiveTab('machines');
        setEditingMachineIndex(machineIndex);
        applyMachinePayload(machines[machineIndex]);
      }
      return;
    }

    if (partIndexParam !== null && partIndexParam !== '') {
      const partIndex = Number(partIndexParam);
      const parts = getParts();
      if (!Number.isNaN(partIndex) && parts[partIndex]) {
        setActiveTab('parts');
        setEditingPartIndex(partIndex);
        applyPartPayload(parts[partIndex]);
      }
      return;
    }

    if (bomIndexParam !== null && bomIndexParam !== '') {
      const bomIndex = Number(bomIndexParam);
      const boms = getBoms();
      if (!Number.isNaN(bomIndex) && boms[bomIndex]) {
        setActiveTab('bom');
        setEditingBomIndex(bomIndex);
        applyBomPayload(boms[bomIndex]);
      }
      return;
    }

    if (userId) {
      setActiveTab('pages');
      editOrbitUser(userId);
      return;
    }

    if (tabParam) {
      const normalizedTab = tabParam === 'users' ? 'pages' : tabParam;
      setActiveTab(normalizedTab);
    }

    const legacyMachinePayload = {
      machineCode: params.get('machineCode'),
      machineName: params.get('machineName'),
      process: params.get('process'),
      size: params.get('size')
    };

    if (Object.values(legacyMachinePayload).some(Boolean)) {
      setActiveTab('machines');
      applyMachinePayload(legacyMachinePayload);
    }

    const legacyPartPayload = {
      category: params.get('category'),
      partCategory: params.get('partCategory'),
      item: params.get('item'),
      itemName: params.get('itemName'),
      partName: params.get('partName'),
      part_name: params.get('part_name'),
      model: params.get('model'),
      modelNo: params.get('modelNo'),
      size: params.get('size'),
      moc: params.get('moc'),
      class: params.get('class'),
      remark: params.get('remark'),
      remarks: params.get('remarks'),
      qty: params.get('qty'),
      equipment: params.get('equipment'),
      invoice: params.get('invoice'),
      party: params.get('party'),
      date: params.get('date')
    };

    if (Object.values(legacyPartPayload).some(Boolean)) {
      setActiveTab('parts');
      applyPartPayload(legacyPartPayload);
    }

    const legacyBomPayload = {
      bomCategory: params.get('bomCategory'),
      partName: params.get('partName'),
      qty: params.get('qty'),
      remarks: params.get('remarks')
    };

    if (Object.values(legacyBomPayload).some(Boolean)) {
      setActiveTab('bom');
      applyBomPayload(legacyBomPayload);
    }
  }, [location.search]);

  useEffect(() => {
    const hash = location.hash.replace('#', '').trim().toLowerCase();
    if (hash === 'parts' || hash === 'bom') {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const currentPartForm = useMemo(() => {
    if (selectedPartCategory === 'valve') {
      return partState.valve;
    }

    return partState.parts;
  }, [partState, selectedPartCategory]);

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
    isMachineEditMode: editingMachineIndex !== null,

    selectedPartCategory,
    selectPartCategory,
    partState,
    currentPartForm,
    setPartField,
    resetPartForm,
    handleAddPart,
    isPartEditMode: editingPartIndex !== null,

    selectedBomType,
    selectBomType,
    bomState,
    setBomField,
    bomParts,
    addBomPart,
    removeBomPart,
    setBomPartField,
    resetBomForm,
    handleAddBom,
    isBomEditMode: editingBomIndex !== null,

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
    isUserEditMode: editingUserId !== null,

    permissionModalUser,
    closePermissionsModal,

    masterDataRows,
    addMasterDataRow,
    removeMasterDataRow,
    setMasterDataRowValue,
    saveMasterDataValues,

    processTypes: PROCESS_TYPES,

    goToDashboard: () => navigate('/cards'),
    goToViewPage: () => navigate('/configuration/view')
  };
}
