export const VIEW_SYSTEM_PAGES = [
  { id: '1.1', name: 'Dashboard', file: '1.1_dashboard.html' },
  { id: '01', name: 'Dashboard', file: '01_dashboard.html' },
  { id: '02', name: 'New Order', file: '02_new_order.html' },
  { id: '03', name: 'Stock Assets', file: '03_stock_assets.html' },
  { id: '04', name: 'Order Details', file: '04_order_details.html' },
  { id: '05', name: 'Client Tracking', file: '05_client_tracking.html' },
  { id: '06', name: 'Worker Management', file: '06_worker_management_new.html' },
  { id: '07', name: 'Stock Management', file: '07_stock_management.html' },
  { id: '08', name: 'Order', file: '08_order.html' },
  { id: '09', name: 'Expense Management', file: '09_expense_management.html' },
  { id: '10', name: 'Configuration', file: '10_configuration.html' }
];

export const CONFIG_SYSTEM_PAGES = [
  { id: '01', name: 'Orders Dashboard', file: '01_dashboard.html' },
  { id: '06', name: 'Worker Management', file: '06_worker_management_new.html' },
  { id: '07', name: 'Stock Management', file: '07_stock_management.html' },
  { id: '09', name: 'Expense Management', file: '09_expense_management.html' },
  { id: '10.1', name: 'Configuration View', file: '10.1_configuration_view.html' }
];

export const PROCESS_TYPES = ['Casting', 'Machining', 'Assembly', 'QC', 'Paint', 'Final QC'];

export const PART_CATEGORY_OPTIONS = [
  { id: 'valve', label: 'Valve' },
  { id: 'parts', label: 'Parts' }
];

export const BOM_CATEGORY_OPTIONS = [
  { id: 'valve', label: 'Valve' },
  { id: 'parts', label: 'Parts' }
];

export const MASTER_DATA_FILTER_OPTIONS = [
  { id: 'endConnections', label: 'End Connections' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'classes', label: 'Classes' }
];

export function createPaginationState() {
  return {
    machines: { currentPage: 1, itemsPerPage: 10 },
    parts: { currentPage: 1, itemsPerPage: 10 },
    bom: { currentPage: 1, itemsPerPage: 10 },
    users: { currentPage: 1, itemsPerPage: 10 },
    masterdata: { currentPage: 1, itemsPerPage: 10 }
  };
}

export function createDefaultCrudPermissions() {
  return { create: true, read: true, update: true, delete: true };
}

export function createDefaultUserPermissions() {
  return CONFIG_SYSTEM_PAGES.reduce((acc, page) => {
    acc[page.id] = createDefaultCrudPermissions();
    return acc;
  }, {});
}

export function createInitialMachineDetail() {
  return {
    name: '',
    code: '',
    size: ''
  };
}

export function createInitialPartState() {
  return {
    valve: {
      itemName: '',
      modelNo: '',
      size: '',
      moc: '',
      class: '',
      remark: ''
    },
    parts: {
      item: '',
      equipment: '',
      moc: '',
      remarks: '',
      qty: '',
      invoice: '',
      party: '',
      date: ''
    }
  };
}

export function createInitialBomState() {
  return {
    valve: {
      valveName: '',
      valveSize: '',
      valveClass: '',
      valveMOC: '',
      valveEndConnection: '',
      valveFlangedStd: '',
      valveOperation: ''
    },
    parts: {
      partName: '',
      partSize: '',
      partQuantity: '',
      partRemarks: ''
    }
  };
}

export function createInitialUserForm() {
  return {
    name: '',
    email: '',
    password: '',
    role: 'User'
  };
}
