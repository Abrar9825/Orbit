const BOM = require('../models/BOM');
const Parts = require('../models/Parts');

async function createBOM(req, res) {
  try {
    const { templateName, valveType, class: className, endConnection, size, unit, items } = req.body;

    // Validation
    if (!templateName || !valveType || !className || !endConnection || !size || !unit) {
      return res.status(400).json({
        status: 'error',
        message: 'Template Name, Valve Type, Class, End Connection, Size, and Unit are required',
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one part item is required',
      });
    }

    // Verify all parts exist
    const partIds = items.map((item) => item.partId);
    const parts = await Parts.find({ _id: { $in: partIds }, isActive: true });

    if (parts.length !== partIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more parts not found or inactive',
      });
    }

    // Validate items
    const validItems = items.map((item) => ({
      partId: item.partId,
      quantity: item.quantity,
      remark: item.remark || undefined,
    }));

    const newBOM = new BOM({
      templateName,
      valveType,
      class: className,
      endConnection,
      size,
      unit,
      items: validItems,
    });

    await newBOM.save();
    await newBOM.populate('items.partId');

    res.status(201).json({
      status: 'success',
      message: 'BOM template created successfully',
      data: newBOM,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getAllBOMs(req, res) {
  try {
    const boms = await BOM.find({ isActive: true })
      .populate('items.partId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      message: 'BOM templates fetched successfully',
      data: boms,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getBOMById(req, res) {
  try {
    const { id } = req.params;
    const bom = await BOM.findById(id).populate('items.partId');

    if (!bom) {
      return res.status(404).json({ status: 'error', message: 'BOM not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'BOM fetched successfully',
      data: bom,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function searchBOMs(req, res) {
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

    const boms = await BOM.find({
      isActive: true,
      $or: [
        { templateName: regex },
        { valveType: regex },
        { class: regex },
        { endConnection: regex },
        { size: regex },
        { unit: regex },
      ],
    })
      .populate('items.partId')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      status: 'success',
      message: 'BOM search completed successfully',
      count: boms.length,
      data: boms,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateBOM(req, res) {
  try {
    const { id } = req.params;
    const { templateName, valveType, class: className, endConnection, size, unit, items } = req.body;

    const bom = await BOM.findById(id);

    if (!bom) {
      return res.status(404).json({ status: 'error', message: 'BOM not found' });
    }

    // Validation
    if (!templateName || !valveType || !className || !endConnection || !size || !unit) {
      return res.status(400).json({
        status: 'error',
        message: 'Template Name, Valve Type, Class, End Connection, Size, and Unit are required',
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one part item is required',
      });
    }

    // Verify all parts exist
    const partIds = items.map((item) => item.partId);
    const parts = await Parts.find({ _id: { $in: partIds }, isActive: true });

    if (parts.length !== partIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more parts not found or inactive',
      });
    }

    bom.templateName = templateName;
    bom.valveType = valveType;
    bom.class = className;
    bom.endConnection = endConnection;
    bom.size = size;
    bom.unit = unit;
    bom.items = items.map((item) => ({
      partId: item.partId,
      quantity: item.quantity,
      remark: item.remark || undefined,
    }));

    await bom.save();
    await bom.populate('items.partId');

    res.status(200).json({
      status: 'success',
      message: 'BOM updated successfully',
      data: bom,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteBOM(req, res) {
  try {
    const { id } = req.params;
    const bom = await BOM.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!bom) {
      return res.status(404).json({ status: 'error', message: 'BOM not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'BOM deleted successfully',
      data: bom,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function addItemToBOM(req, res) {
  try {
    const { id } = req.params;
    const { partId, quantity, remark } = req.body;

    if (!partId || !quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Part ID and Quantity are required',
      });
    }

    const part = await Parts.findById(partId);

    if (!part || !part.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Part not found or inactive',
      });
    }

    const bom = await BOM.findById(id);

    if (!bom) {
      return res.status(404).json({ status: 'error', message: 'BOM not found' });
    }

    bom.items.push({
      partId,
      quantity,
      remark: remark || undefined,
    });

    await bom.save();
    await bom.populate('items.partId');

    res.status(200).json({
      status: 'success',
      message: 'Item added to BOM successfully',
      data: bom,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function removeItemFromBOM(req, res) {
  try {
    const { id, itemId } = req.params;

    const bom = await BOM.findById(id);

    if (!bom) {
      return res.status(404).json({ status: 'error', message: 'BOM not found' });
    }

    bom.items = bom.items.filter((item) => item._id.toString() !== itemId);
    await bom.save();
    await bom.populate('items.partId');

    res.status(200).json({
      status: 'success',
      message: 'Item removed from BOM successfully',
      data: bom,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  createBOM,
  getAllBOMs,
  getBOMById,
  searchBOMs,
  updateBOM,
  deleteBOM,
  addItemToBOM,
  removeItemFromBOM,
};
