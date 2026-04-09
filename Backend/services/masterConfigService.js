const MasterConfig = require('../models/MasterConfig');

const ALLOWED_KEYS = ['endConnections', 'classes', 'sizes', 'units'];

function normalizeMasterValue(value) {
  return String(value || '').trim().toUpperCase();
}

function sanitizeArray(values) {
  const seen = new Set();
  const output = [];

  (values || []).forEach((value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) {
      return;
    }

    const key = normalizeMasterValue(trimmed);
    if (!seen.has(key)) {
      seen.add(key);
      output.push(trimmed);
    }
  });

  return output;
}

function ensureAllowedKey(key) {
  if (!ALLOWED_KEYS.includes(key)) {
    const error = new Error(`Invalid key. Allowed keys: ${ALLOWED_KEYS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
}

async function getMasterConfigDocument() {
  let doc = await MasterConfig.findOne({ singletonKey: 'GLOBAL' });

  if (!doc) {
    doc = await MasterConfig.create({
      singletonKey: 'GLOBAL',
      endConnections: [],
      classes: [],
      sizes: [],
      units: [],
    });
  }

  return {
    endConnections: sanitizeArray(doc.endConnections),
    classes: sanitizeArray(doc.classes),
    sizes: sanitizeArray(doc.sizes),
    units: sanitizeArray(doc.units),
  };
}

async function addMasterConfigValue(key, value) {
  ensureAllowedKey(key);

  const trimmedValue = String(value || '').trim();
  if (!trimmedValue) {
    const error = new Error('Value is required');
    error.statusCode = 400;
    throw error;
  }

  const doc = await MasterConfig.findOneAndUpdate(
    { singletonKey: 'GLOBAL' },
    {
      $setOnInsert: {
        singletonKey: 'GLOBAL',
        endConnections: [],
        classes: [],
        sizes: [],
        units: [],
      },
      $addToSet: {
        [key]: trimmedValue,
      },
    },
    { new: true, upsert: true }
  );

  doc[key] = sanitizeArray(doc[key]);
  await doc.save();

  return getMasterConfigDocument();
}

async function isMasterValueAllowed(key, value, options = {}) {
  ensureAllowedKey(key);
  const { allowEmpty = true } = options;

  if ((value === undefined || value === null || String(value).trim() === '') && allowEmpty) {
    return true;
  }

  const config = await getMasterConfigDocument();
  const list = config[key] || [];
  const lookup = normalizeMasterValue(value);
  return list.some((item) => normalizeMasterValue(item) === lookup);
}

module.exports = {
  ALLOWED_KEYS,
  getMasterConfigDocument,
  addMasterConfigValue,
  isMasterValueAllowed,
};
