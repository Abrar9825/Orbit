function parseJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getMachines() {
  return parseJSON('machines', []);
}

export function setMachines(machines) {
  setJSON('machines', machines);
}

export function getParts() {
  return parseJSON('parts', []);
}

export function setParts(parts) {
  setJSON('parts', parts);
}

export function getBoms() {
  return parseJSON('boms', []);
}

export function setBoms(boms) {
  setJSON('boms', boms);
}

export function getOrbitUsers() {
  return parseJSON('OrbitUsers', []);
}

export function setOrbitUsers(users) {
  setJSON('OrbitUsers', users);
}

export function getMasterData() {
  return parseJSON('masterData', {
    endConnections: [],
    sizes: [],
    classes: []
  });
}

export function setMasterData(masterData) {
  setJSON('masterData', masterData);
}

export function initializeConfigurationSampleData() {
  if (!localStorage.getItem('parts')) {
    const sampleParts = [
      {
        category: 'Valve',
        item: 'Gate Valve',
        part_name: 'Gate Valve',
        model: 'GV-300',
        size: '100mm',
        moc: 'Carbon Steel',
        endConn: 'Flanged',
        class: '150',
        remarks: 'Mainline isolation',
        qty: '12',
        invoice: 'INV-VAL-101',
        party: 'Orbit Steel',
        date: '2025-12-01'
      },
      {
        category: 'Valve',
        item: 'Globe Valve',
        part_name: 'Globe Valve',
        model: 'GL-210',
        size: '80mm',
        moc: 'Stainless Steel',
        endConn: 'Butt Weld',
        class: '300',
        remarks: 'High precision control',
        qty: '8',
        invoice: 'INV-VAL-102',
        party: 'Valve Experts',
        date: '2025-11-25'
      },
      {
        category: 'Pump',
        item: 'Centrifugal Pump',
        part_name: 'Centrifugal Pump',
        model: 'CP-450',
        moc: 'Cast Iron',
        std: 'IS 9078',
        mechSeal: 'Single',
        accessories: 'Coupling + Baseplate',
        qty: '2',
        invoice: 'INV-PMP-201',
        party: 'Pump Tech',
        date: '2025-12-05'
      },
      {
        category: 'Pump',
        item: 'Vertical Turbine Pump',
        part_name: 'Vertical Turbine Pump',
        model: 'VT-220',
        moc: 'Ductile Iron',
        std: 'ISO 5199',
        mechSeal: 'Double',
        accessories: 'Vibration pads',
        qty: '1',
        invoice: 'INV-PMP-202',
        party: 'Vertical Flow',
        date: '2025-12-08'
      },
      {
        category: 'Parts',
        item: 'Control Panel',
        part_name: 'Control Panel',
        equipment: 'Hydraulic Station',
        moc: 'Mild Steel',
        remarks: 'Touchscreen PLC',
        qty: '3',
        invoice: 'INV-PRT-301',
        party: 'Orbit Controls',
        date: '2025-12-02'
      },
      {
        category: 'Parts',
        item: 'Pressure Sensor',
        part_name: 'Pressure Sensor',
        equipment: 'Injection Unit',
        moc: 'Aluminum',
        remarks: 'High accuracy',
        qty: '20',
        invoice: 'INV-PRT-302',
        party: 'Sensors Co',
        date: '2025-12-09'
      }
    ];
    setParts(sampleParts);
  }

  if (!localStorage.getItem('boms')) {
    const sampleBoms = [
      {
        template_name: 'BOM-VALVE-001',
        product_type: 'Valve Control Block',
        category: 'Valve',
        parts_count: 4,
        valveName: 'Valve Assembly A',
        parts: [
          { partName: 'Gate Valve', quantity: '2', remarks: 'Primary' },
          { partName: 'Flange', quantity: '4', remarks: 'Standard' },
          { partName: 'Bolt Set', quantity: '8', remarks: 'M16' },
          { partName: 'Gasket', quantity: '4', remarks: 'PTFE' }
        ]
      },
      {
        template_name: 'BOM-PUMP-001',
        product_type: 'Industrial Pump',
        category: 'Pump',
        parts_count: 5,
        partName: 'Pump Unit A',
        parts: [
          { partName: 'Casing', quantity: '1', remarks: 'Cast' },
          { partName: 'Impeller', quantity: '1', remarks: 'SS' },
          { partName: 'Shaft', quantity: '1', remarks: 'Hardened' },
          { partName: 'Seal Kit', quantity: '1', remarks: 'Double' },
          { partName: 'Bearing Set', quantity: '2', remarks: 'SKF' }
        ]
      },
      {
        template_name: 'BOM-PARTS-001',
        product_type: 'Hydraulic Assembly',
        category: 'Parts',
        parts_count: 4,
        partName: 'Hydraulic Kit',
        parts: [
          { partName: 'Control Panel', quantity: '1', remarks: 'PLC' },
          { partName: 'Sensor', quantity: '2', remarks: 'Pressure' },
          { partName: 'Harness', quantity: '1', remarks: 'Wiring' },
          { partName: 'Bracket', quantity: '4', remarks: 'MS' }
        ]
      }
    ];
    setBoms(sampleBoms);
  }

  if (!localStorage.getItem('OrbitUsers')) {
    const allTruePermissions = {
      '01': { create: true, read: true, update: true, delete: true },
      '06': { create: true, read: true, update: true, delete: true },
      '07': { create: true, read: true, update: true, delete: true },
      '09': { create: true, read: true, update: true, delete: true },
      '10.1': { create: true, read: true, update: true, delete: true }
    };

    const sampleUsers = [
      {
        id: 'U001',
        name: 'Admin User',
        email: 'admin@Orbit.com',
        password: 'admin123',
        role: 'Admin',
        permissions: allTruePermissions
      },
      {
        id: 'U002',
        name: 'Manager User',
        email: 'manager@Orbit.com',
        password: 'manager123',
        role: 'Manager',
        permissions: {
          '01': { create: true, read: true, update: true, delete: false },
          '06': { create: true, read: true, update: false, delete: false },
          '07': { create: true, read: true, update: true, delete: false },
          '09': { create: false, read: true, update: false, delete: false },
          '10.1': { create: false, read: true, update: false, delete: false }
        }
      },
      {
        id: 'U003',
        name: 'Operator User',
        email: 'operator@Orbit.com',
        password: 'operator123',
        role: 'User',
        permissions: {
          '01': { create: false, read: true, update: false, delete: false },
          '06': { create: false, read: true, update: false, delete: false },
          '07': { create: true, read: true, update: false, delete: false },
          '09': { create: false, read: true, update: false, delete: false },
          '10.1': { create: false, read: true, update: false, delete: false }
        }
      }
    ];
    setOrbitUsers(sampleUsers);
  }
}

export function encodeQueryParams(params = {}) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}
