const Parts = require('../models/Parts');
const { PART_TEMPLATES } = require('../config/partTemplates');
const { getMasterConfigDocument, isMasterValueAllowed } = require('../services/masterConfigService');

function toItemKey(value) {
  return String(value || '').trim().toUpperCase();
}

function sanitizeDynamicValues(rawValues, fields) {
  const payload = rawValues && typeof rawValues === 'object' ? rawValues : {};
  return fields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      acc[field] = String(payload[field] ?? '').trim();
    } else {
      acc[field] = '';
    }
    return acc;
  }, {});
}

async function getPartTemplates(req, res) {
  return res.status(200).json({
    status: 'success',
    message: 'Part templates fetched successfully',
    data: PART_TEMPLATES,
  });
}

async function createPart(req, res) {
  try {
    const {
      itemName,
      modelNumber,
      size,
      length,
      moc,
      endConnection,
      class: className,
      remarks,
      dynamicValues,
    } = req.body;

    if (!itemName) {
      return res.status(400).json({ status: 'error', message: 'Item Name is required' });
    }

    const masterConfig = await getMasterConfigDocument();

    if (!(await isMasterValueAllowed('sizes', size, { allowEmpty: true }))) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid Size. Allowed values: ${masterConfig.sizes.join(', ')}`,
      });
    }

    if (!(await isMasterValueAllowed('endConnections', endConnection, { allowEmpty: true }))) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid End Connection. Allowed values: ${masterConfig.endConnections.join(', ')}`,
      });
    }

    if (!(await isMasterValueAllowed('classes', className, { allowEmpty: true }))) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid Class. Allowed values: ${masterConfig.classes.join(', ')}`,
      });
    }

    const itemKey = toItemKey(itemName);
    const templateFields = PART_TEMPLATES[itemKey] || [];
    const safeDynamicValues = sanitizeDynamicValues(dynamicValues, templateFields);

    const newPart = new Parts({
      itemKey,
      itemName,
      modelNumber: modelNumber || undefined,
      size: size || undefined,
      length: length || undefined,
      moc: moc || undefined,
      endConnection: endConnection || undefined,
      class: className || undefined,
      remarks: remarks || undefined,
      dynamicFields: templateFields,
      dynamicValues: safeDynamicValues,
    });

    await newPart.save();

    res.status(201).json({
      status: 'success',
      message: 'Part created successfully',
      data: newPart,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getAllParts(req, res) {
  try {
    const parts = await Parts.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      message: 'Parts fetched successfully',
      data: parts,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getPartById(req, res) {
  try {
    const { id } = req.params;
    const part = await Parts.findById(id);

    if (!part) {
      return res.status(404).json({ status: 'error', message: 'Part not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Part fetched successfully',
      data: part,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function searchParts(req, res) {
  try {
    const rawQuery = String(req.query.q || req.query.search || '').trim();
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    if (!rawQuery) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required (use q or search query param)',
      });
    }

    const escaped = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');

    const parts = await Parts.find({
      isActive: true,
      $or: [
        { itemName: regex },
        { modelNumber: regex },
        { size: regex },
        { moc: regex },
        { endConnection: regex },
        { class: regex },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      status: 'success',
      message: 'Parts search completed successfully',
      count: parts.length,
      data: parts,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updatePart(req, res) {
  try {
    const { id } = req.params;
    const {
      itemName,
      modelNumber,
      size,
      length,
      moc,
      endConnection,
      class: className,
      remarks,
      dynamicValues,
    } = req.body;

    const part = await Parts.findById(id);

    if (!part) {
      return res.status(404).json({ status: 'error', message: 'Part not found' });
    }

    if (!itemName) {
      return res.status(400).json({ status: 'error', message: 'Item Name is required' });
    }

    const masterConfig = await getMasterConfigDocument();

    if (!(await isMasterValueAllowed('sizes', size, { allowEmpty: true }))) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid Size. Allowed values: ${masterConfig.sizes.join(', ')}`,
      });
    }

    if (!(await isMasterValueAllowed('endConnections', endConnection, { allowEmpty: true }))) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid End Connection. Allowed values: ${masterConfig.endConnections.join(', ')}`,
      });
    }

    if (!(await isMasterValueAllowed('classes', className, { allowEmpty: true }))) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid Class. Allowed values: ${masterConfig.classes.join(', ')}`,
      });
    }

    part.itemName = itemName;
    part.itemKey = toItemKey(itemName);
    part.modelNumber = modelNumber || part.modelNumber;
    part.size = size || part.size;
    part.length = length || part.length;
    part.moc = moc || part.moc;
    part.endConnection = endConnection || part.endConnection;
    part.class = className || part.class;
    part.remarks = remarks || part.remarks;

    const templateFields = PART_TEMPLATES[part.itemKey] || [];
    part.dynamicFields = templateFields;
    if (dynamicValues && typeof dynamicValues === 'object') {
      part.dynamicValues = sanitizeDynamicValues(dynamicValues, templateFields);
    }

    await part.save();

    res.status(200).json({
      status: 'success',
      message: 'Part updated successfully',
      data: part,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deletePart(req, res) {
  try {
    const { id } = req.params;
    const part = await Parts.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!part) {
      return res.status(404).json({ status: 'error', message: 'Part not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Part deleted successfully',
      data: part,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getPartTemplates,
  createPart,
  getAllParts,
  getPartById,
  searchParts,
  updatePart,
  deletePart,
};
