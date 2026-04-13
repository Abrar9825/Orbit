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

async function setMasterConfigValues(payload = {}) {
  const updates = {};

  ALLOWED_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      updates[key] = sanitizeArray(payload[key]);
    }
  });

  if (!Object.keys(updates).length) {
    const error = new Error(`At least one key is required. Allowed keys: ${ALLOWED_KEYS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  await MasterConfig.findOneAndUpdate(
    { singletonKey: 'GLOBAL' },
    {
      $setOnInsert: {
        singletonKey: 'GLOBAL',
      },
      $set: updates,
    },
    { new: true, upsert: true }
  );

  return getMasterConfigDocument();
}

async function removeMasterConfigValue(key, value) {
  ensureAllowedKey(key);

  const trimmedValue = String(value || '').trim();
  if (!trimmedValue) {
    const error = new Error('Value is required');
    error.statusCode = 400;
    throw error;
  }

  const currentConfig = await getMasterConfigDocument();
  const nextValues = (currentConfig[key] || []).filter(
    (item) => normalizeMasterValue(item) !== normalizeMasterValue(trimmedValue)
  );

  return setMasterConfigValues({ [key]: nextValues });
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
  setMasterConfigValues,
  removeMasterConfigValue,
  isMasterValueAllowed,
};
