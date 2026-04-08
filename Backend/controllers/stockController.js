const mongoose = require('mongoose');
const Stock = require('../models/Stock');
const Parts = require('../models/Parts');
const BOM = require('../models/BOM');

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanText(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  const nextValue = String(value).trim();
  return nextValue || undefined;
}

function parseOptionalDate(value) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

async function createStock(req, res) {
  try {
    const {
      itemType,
      partId,
      bomId,
      openingQty,
      qtyOnHand,
      minStockLevel,
      reorderQty,
      unit,
      lastPurchasePrice,
      remarks,
      sourceInvoiceNo,
      sourceParty,
      workOrderNumber,
      referenceNumber,
      sourcePONumber,
      stockDate,
    } = req.body;

    if (!itemType || !['PART', 'VALVE'].includes(itemType)) {
      return res.status(400).json({
        status: 'error',
        message: 'itemType is required and must be PART or VALVE',
      });
    }

    let stockData;

    if (itemType === 'PART') {
      if (!partId || !mongoose.Types.ObjectId.isValid(partId)) {
        return res.status(400).json({ status: 'error', message: 'Valid partId is required for PART stock' });
      }

      const part = await Parts.findOne({ _id: partId, isActive: true });
      if (!part) {
        return res.status(404).json({ status: 'error', message: 'Part not found or inactive' });
      }

      stockData = {
        itemType,
        partId: part._id,
        itemName: part.itemName,
        modelNumber: part.modelNumber,
        size: part.size,
        moc: part.moc,
        endConnection: part.endConnection,
        class: part.class,
      };
    } else {
      if (!bomId || !mongoose.Types.ObjectId.isValid(bomId)) {
        return res.status(400).json({ status: 'error', message: 'Valid bomId is required for VALVE stock' });
      }

      const bom = await BOM.findOne({ _id: bomId, isActive: true });
      if (!bom) {
        return res.status(404).json({ status: 'error', message: 'BOM not found or inactive' });
      }

      stockData = {
        itemType,
        bomId: bom._id,
        itemName: bom.templateName,
        valveType: bom.valveType,
        size: bom.size,
        endConnection: bom.endConnection,
        class: bom.class,
        unit: bom.unit,
      };
    }

    const parsedQtyOnHand = qtyOnHand === undefined
      ? Number(openingQty || 0)
      : Number(qtyOnHand);

    const safeQtyOnHand = Math.max(parsedQtyOnHand, 0);
    const safeOpeningQty = openingQty === undefined
      ? safeQtyOnHand
      : Math.max(Number(openingQty), 0);

    const openingMovements = [];
    if (safeOpeningQty > 0) {
      openingMovements.push({
        movementType: 'IN',
        quantity: safeOpeningQty,
        sourceType: 'MANUAL',
        referenceNo: cleanText(referenceNumber) || cleanText(sourceInvoiceNo) || cleanText(sourcePONumber),
        note: 'Opening qty set during stock creation',
        movedBy: req.user?.userName || 'system',
      });
    }

    const stock = new Stock({
      ...stockData,
      openingQty: safeOpeningQty,
      qtyOnHand: safeQtyOnHand,
      minStockLevel: Math.max(Number(minStockLevel || 0), 0),
      reorderQty: Math.max(Number(reorderQty || 0), 0),
      unit: unit || stockData.unit || 'NOS',
      lastPurchasePrice: lastPurchasePrice === undefined ? undefined : Number(lastPurchasePrice),
      remarks: cleanText(remarks),
      sourceInvoiceNo: cleanText(sourceInvoiceNo),
      sourceParty: cleanText(sourceParty),
      workOrderNumber: cleanText(workOrderNumber),
      referenceNumber: cleanText(referenceNumber),
      sourcePONumber: cleanText(sourcePONumber),
      stockDate: parseOptionalDate(stockDate),
      movements: openingMovements,
    });

    await stock.save();

    const allocation = null;

    const refreshedStock = await Stock.findById(stock._id).populate('partId bomId');

    return res.status(201).json({
      status: 'success',
      message: 'Stock created successfully',
      data: refreshedStock,
      allocation,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'Stock already exists for this item. Use movement API to update quantity.',
      });
    }
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getAllStock(req, res) {
  try {
    const { itemType, q, lowStock } = req.query;

    const filters = { isActive: true };
    if (itemType && ['PART', 'VALVE'].includes(itemType)) {
      filters.itemType = itemType;
    }

    if (String(lowStock || '').toLowerCase() === 'true') {
      filters.$expr = { $lt: ['$qtyOnHand', '$minStockLevel'] };
    }

    if (q) {
      const regex = new RegExp(escapeRegex(String(q).trim()), 'i');
      filters.$or = [
        { itemName: regex },
        { modelNumber: regex },
        { valveType: regex },
        { size: regex },
        { moc: regex },
        { endConnection: regex },
        { class: regex },
        { sourceInvoiceNo: regex },
        { sourceParty: regex },
        { workOrderNumber: regex },
        { referenceNumber: regex },
        { sourcePONumber: regex },
        { remarks: regex },
      ];
    }

    const stock = await Stock.find(filters)
      .populate('partId bomId')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      status: 'success',
      message: 'Stock fetched successfully',
      count: stock.length,
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getStockById(req, res) {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id).populate('partId bomId');

    if (!stock || !stock.isActive) {
      return res.status(404).json({ status: 'error', message: 'Stock item not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Stock item fetched successfully',
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateStock(req, res) {
  try {
    const { id } = req.params;
    const {
      openingQty,
      minStockLevel,
      reorderQty,
      unit,
      lastPurchasePrice,
      remarks,
      sourceInvoiceNo,
      sourceParty,
      workOrderNumber,
      referenceNumber,
      sourcePONumber,
      stockDate,
    } = req.body;

    const stock = await Stock.findById(id);
    if (!stock || !stock.isActive) {
      return res.status(404).json({ status: 'error', message: 'Stock item not found' });
    }

    if (openingQty !== undefined) {
      const nextOpeningQty = Math.max(Number(openingQty), 0);
      if (nextOpeningQty !== stock.openingQty) {
        stock.movements.push({
          movementType: 'ADJUST',
          quantity: stock.qtyOnHand,
          sourceType: 'MANUAL',
          referenceNo: cleanText(referenceNumber) || cleanText(sourceInvoiceNo) || cleanText(sourcePONumber),
          note: `Opening qty updated from ${stock.openingQty} to ${nextOpeningQty}`,
          movedBy: req.user?.userName || 'system',
        });
      }
      stock.openingQty = nextOpeningQty;
    }
    if (minStockLevel !== undefined) stock.minStockLevel = Math.max(Number(minStockLevel), 0);
    if (reorderQty !== undefined) stock.reorderQty = Math.max(Number(reorderQty), 0);
    if (unit !== undefined) stock.unit = unit;
    if (lastPurchasePrice !== undefined) stock.lastPurchasePrice = Number(lastPurchasePrice);
    if (remarks !== undefined) stock.remarks = cleanText(remarks);
    if (sourceInvoiceNo !== undefined) stock.sourceInvoiceNo = cleanText(sourceInvoiceNo);
    if (sourceParty !== undefined) stock.sourceParty = cleanText(sourceParty);
    if (workOrderNumber !== undefined) stock.workOrderNumber = cleanText(workOrderNumber);
    if (referenceNumber !== undefined) stock.referenceNumber = cleanText(referenceNumber);
    if (sourcePONumber !== undefined) stock.sourcePONumber = cleanText(sourcePONumber);
    if (stockDate !== undefined) stock.stockDate = parseOptionalDate(stockDate);

    await stock.save();

    return res.status(200).json({
      status: 'success',
      message: 'Stock updated successfully',
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function addStockMovement(req, res) {
  try {
    const { id } = req.params;
    const { movementType, quantity, sourceType, referenceNo, note } = req.body;

    const qty = Number(quantity);
    if (!movementType || !['IN', 'OUT', 'ADJUST'].includes(movementType)) {
      return res.status(400).json({ status: 'error', message: 'movementType is required (IN, OUT, ADJUST)' });
    }

    if (!Number.isFinite(qty) || qty < 0) {
      return res.status(400).json({ status: 'error', message: 'Valid quantity is required' });
    }

    const stock = await Stock.findById(id);
    if (!stock || !stock.isActive) {
      return res.status(404).json({ status: 'error', message: 'Stock item not found' });
    }

    let nextQty = stock.qtyOnHand;

    if (movementType === 'IN') {
      nextQty += qty;
    } else if (movementType === 'OUT') {
      if (qty > stock.qtyOnHand) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient stock for OUT movement',
        });
      }
      nextQty -= qty;
    } else {
      nextQty = qty;
    }

    stock.qtyOnHand = nextQty;
    stock.movements.push({
      movementType,
      quantity: qty,
      sourceType: sourceType || 'MANUAL',
      referenceNo: referenceNo || undefined,
      note: note || undefined,
      movedBy: req.user?.userName || 'system',
    });

    await stock.save();

    const allocation = null;

    const refreshedStock = await Stock.findById(stock._id).populate('partId bomId');

    return res.status(200).json({
      status: 'success',
      message: 'Stock movement applied successfully',
      data: refreshedStock,
      allocation,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getReorderSuggestions(req, res) {
  try {
    const stockItems = await Stock.find({ isActive: true }).sort({ itemName: 1 });

    const suggestions = stockItems
      .map((item) => {
        const shortage = Math.max((item.minStockLevel || 0) - (item.qtyOnHand || 0), 0);
        const suggestedOrderQty = Math.max(shortage, item.reorderQty || 0);

        return {
          stockId: item._id,
          itemType: item.itemType,
          itemName: item.itemName,
          partId: item.partId,
          bomId: item.bomId,
          openingQty: item.openingQty,
          qtyOnHand: item.qtyOnHand,
          minStockLevel: item.minStockLevel,
          reorderQty: item.reorderQty,
          shortage,
          suggestedOrderQty,
          shouldCreatePO: suggestedOrderQty > 0,
          unit: item.unit,
        };
      })
      .filter((item) => item.shouldCreatePO);

    return res.status(200).json({
      status: 'success',
      message: 'Reorder suggestion fetched successfully',
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteStock(req, res) {
  try {
    const { id } = req.params;
    const stock = await Stock.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!stock) {
      return res.status(404).json({ status: 'error', message: 'Stock item not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Stock item deleted successfully',
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  createStock,
  getAllStock,
  getStockById,
  updateStock,
  addStockMovement,
  getReorderSuggestions,
  deleteStock,
};
