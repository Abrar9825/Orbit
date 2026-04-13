const mongoose = require('mongoose');
const Stock = require('../models/Stock');
const Parts = require('../models/Parts');
const BOM = require('../models/BOM');

const VALVE_STATUSES = ['Operational', 'Under Maintenance'];

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

function parseNonNegativeNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(parsed, 0);
}

function normalizeValveStatus(value) {
  return cleanText(value) || 'Operational';
}

function isValidValveStatus(value) {
  return VALVE_STATUSES.includes(value);
}

async function createStock(req, res) {
  try {
    const {
      itemType,
      partId,
      bomId,
      itemName: payloadItemName,
      valveType: payloadValveType,
      size: payloadSize,
      endConnection: payloadEndConnection,
      class: payloadClass,
      openingQty,
      minStockLevel,
      reorderQty,
      plan,
      available,
      committed,
      unit,
      lastPurchasePrice,
      remarks,
      sourceInvoiceNo,
      sourceParty,
      workOrderNumber,
      referenceNumber,
      sourcePONumber,
      stockDate,
      qtyOnHand: payloadQtyOnHand,
      serialNo,
      status,
      presentLocation,
      moc: payloadMoc,
    } = req.body;

    const cleanedReferenceNumber = cleanText(referenceNumber);
    const cleanedSourceInvoiceNo = cleanText(sourceInvoiceNo);
    const cleanedSourceParty = cleanText(sourceParty);
    const cleanedPresentLocation = cleanText(presentLocation);
    const parsedStockDate = parseOptionalDate(stockDate);

    const requestedQtyRaw = payloadQtyOnHand === undefined ? openingQty : payloadQtyOnHand;
    const requestedQty = parseNonNegativeNumber(requestedQtyRaw, 0);

    if (requestedQty <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Qty must be greater than 0',
      });
    }

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

      if (!cleanedReferenceNumber) {
        return res.status(400).json({ status: 'error', message: 'MRN No. is required for stock item' });
      }

      if (!cleanedSourceInvoiceNo) {
        return res.status(400).json({ status: 'error', message: 'Invoice Number is required for stock item' });
      }

      if (!cleanedSourceParty) {
        return res.status(400).json({ status: 'error', message: 'Source Party is required for stock item' });
      }

      if (!parsedStockDate) {
        return res.status(400).json({ status: 'error', message: 'Valid Date is required for stock item' });
      }

      if (!cleanedPresentLocation) {
        return res.status(400).json({ status: 'error', message: 'Present Location is required for stock item' });
      }

      const part = await Parts.findOne({ _id: partId, isActive: true });
      if (!part) {
        return res.status(404).json({ status: 'error', message: 'Part not found or inactive' });
      }

      const requiredPartMeta = [
        { key: 'size', label: 'Size' },
        { key: 'moc', label: 'MOC' },
        { key: 'class', label: 'Class' },
      ].filter((entry) => !cleanText(part[entry.key]));

      if (requiredPartMeta.length) {
        return res.status(400).json({
          status: 'error',
          message: `Selected part is missing required values: ${requiredPartMeta
            .map((entry) => entry.label)
            .join(', ')}`,
        });
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
      const normalizedStatus = normalizeValveStatus(status);
      if (!isValidValveStatus(normalizedStatus)) {
        return res.status(400).json({
          status: 'error',
          message: `Status must be one of: ${VALVE_STATUSES.join(', ')}`,
        });
      }

      const cleanedItemName = cleanText(payloadItemName);
      const cleanedValveType = cleanText(payloadValveType);
      const cleanedSize = cleanText(payloadSize);
      const cleanedEndConnection = cleanText(payloadEndConnection);
      const cleanedClass = cleanText(payloadClass);

      if (bomId) {
        if (!mongoose.Types.ObjectId.isValid(bomId)) {
          return res.status(400).json({ status: 'error', message: 'bomId must be a valid ID' });
        }

        const bom = await BOM.findOne({ _id: bomId, isActive: true });
        if (!bom) {
          return res.status(404).json({ status: 'error', message: 'BOM not found or inactive' });
        }

        stockData = {
          itemType,
          bomId: bom._id,
          itemName: cleanedItemName || bom.templateName,
          valveType: cleanedValveType || bom.valveType,
          size: cleanedSize || bom.size,
          moc: cleanText(payloadMoc),
          endConnection: cleanedEndConnection || bom.endConnection,
          class: cleanedClass || bom.class,
          unit: bom.unit,
          status: normalizedStatus,
        };
      } else {
        if (!cleanedItemName) {
          return res.status(400).json({
            status: 'error',
            message: 'Item / Equipment Name is required for pattern item',
          });
        }

        stockData = {
          itemType,
          itemName: cleanedItemName,
          valveType: cleanedValveType || cleanedItemName,
          size: cleanedSize,
          moc: cleanText(payloadMoc),
          endConnection: cleanedEndConnection,
          class: cleanedClass,
          status: normalizedStatus,
        };
      }
    }

    const safeQtyOnHand = requestedQty;

    const safeOpeningQty = openingQty === undefined ? safeQtyOnHand : parseNonNegativeNumber(openingQty, 0);
    const safeCommitted = Math.min(parseNonNegativeNumber(committed, 0), safeQtyOnHand);
    const safeAvailable = available === undefined
      ? Math.max(safeQtyOnHand - safeCommitted, 0)
      : Math.min(parseNonNegativeNumber(available, 0), safeQtyOnHand);
    const safePlan = parseNonNegativeNumber(plan, 0);

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
      minStockLevel: parseNonNegativeNumber(minStockLevel, 0),
      reorderQty: parseNonNegativeNumber(reorderQty, 0),
      plan: safePlan,
      available: safeAvailable,
      committed: safeCommitted,
      unit: unit || stockData.unit || 'NOS',
      lastPurchasePrice: lastPurchasePrice === undefined ? undefined : Number(lastPurchasePrice),
      remarks: cleanText(remarks),
      sourceInvoiceNo: cleanedSourceInvoiceNo,
      sourceParty: cleanedSourceParty,
      workOrderNumber: cleanText(workOrderNumber),
      referenceNumber: cleanedReferenceNumber,
      sourcePONumber: cleanText(sourcePONumber),
      serialNo: cleanText(serialNo),
      status: itemType === 'VALVE' ? stockData.status : null,
      presentLocation: cleanedPresentLocation,
      stockDate: parsedStockDate,
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
        { serialNo: regex },
        { status: regex },
        { presentLocation: regex },
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

async function getStockSummary(req, res) {
  try {
    const [partSummary, valveSummary, activeAssets] = await Promise.all([
      Stock.aggregate([
        {
          $match: {
            isActive: true,
            itemType: 'PART',
          },
        },
        {
          $group: {
            _id: null,
            totalStock: { $sum: 1 },
            lowStock: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gt: ['$minStockLevel', 0] },
                      { $lte: ['$qtyOnHand', '$minStockLevel'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      Stock.aggregate([
        {
          $match: {
            isActive: true,
            itemType: 'VALVE',
          },
        },
        {
          $group: {
            _id: null,
            totalAssets: { $sum: 1 },
          },
        },
      ]),
      Stock.countDocuments({
        isActive: true,
        itemType: 'VALVE',
        status: 'Operational',
      }),
    ]);

    const partData = partSummary[0] || {};
    const valveData = valveSummary[0] || {};

    return res.status(200).json({
      status: 'success',
      message: 'Stock summary fetched successfully',
      data: {
        totalStock: Number(partData.totalStock || 0),
        lowStock: Number(partData.lowStock || 0),
        totalAssets: Number(valveData.totalAssets || 0),
        activeAssets: Number(activeAssets || 0),
      },
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
      qtyOnHand,
      itemName,
      valveType,
      size,
      endConnection,
      class: className,
      minStockLevel,
      reorderQty,
      plan,
      available,
      committed,
      unit,
      lastPurchasePrice,
      remarks,
      sourceInvoiceNo,
      sourceParty,
      workOrderNumber,
      referenceNumber,
      sourcePONumber,
      stockDate,
      serialNo,
      status,
      presentLocation,
      moc,
    } = req.body;

    const stock = await Stock.findById(id);
    if (!stock || !stock.isActive) {
      return res.status(404).json({ status: 'error', message: 'Stock item not found' });
    }

    const nextReferenceNumber = referenceNumber !== undefined ? cleanText(referenceNumber) : stock.referenceNumber;
    const nextSourceInvoiceNo =
      sourceInvoiceNo !== undefined ? cleanText(sourceInvoiceNo) : stock.sourceInvoiceNo;
    const nextSourceParty = sourceParty !== undefined ? cleanText(sourceParty) : stock.sourceParty;
    const nextPresentLocation =
      presentLocation !== undefined ? cleanText(presentLocation) : stock.presentLocation;
    const nextStockDate = stockDate !== undefined ? parseOptionalDate(stockDate) : stock.stockDate;

    if (stock.itemType === 'PART') {
      if (!nextReferenceNumber) {
        return res.status(400).json({ status: 'error', message: 'MRN No. is required for stock item' });
      }

      if (!nextSourceInvoiceNo) {
        return res.status(400).json({ status: 'error', message: 'Invoice Number is required for stock item' });
      }

      if (!nextSourceParty) {
        return res.status(400).json({ status: 'error', message: 'Source Party is required for stock item' });
      }

      if (!nextStockDate) {
        return res.status(400).json({ status: 'error', message: 'Valid Date is required for stock item' });
      }

      if (!nextPresentLocation) {
        return res.status(400).json({ status: 'error', message: 'Present Location is required for stock item' });
      }
    }

    if (stock.itemType === 'VALVE' && status !== undefined) {
      const normalizedStatus = normalizeValveStatus(status);
      if (!isValidValveStatus(normalizedStatus)) {
        return res.status(400).json({
          status: 'error',
          message: `Status must be one of: ${VALVE_STATUSES.join(', ')}`,
        });
      }
      stock.status = normalizedStatus;
    }

    if (stock.itemType === 'VALVE') {
      if (itemName !== undefined) {
        const cleanedItemName = cleanText(itemName);
        if (!cleanedItemName) {
          return res.status(400).json({
            status: 'error',
            message: 'Item / Equipment Name is required for pattern item',
          });
        }
        stock.itemName = cleanedItemName;
      }

      if (valveType !== undefined) stock.valveType = cleanText(valveType);
      if (size !== undefined) stock.size = cleanText(size);
      if (endConnection !== undefined) stock.endConnection = cleanText(endConnection);
      if (className !== undefined) stock.class = cleanText(className);
    }

    const isQtyUpdateRequested = qtyOnHand !== undefined;
    if (isQtyUpdateRequested) {
      const nextQtyOnHand = parseNonNegativeNumber(qtyOnHand, stock.qtyOnHand);
      if (nextQtyOnHand <= 0) {
        return res.status(400).json({ status: 'error', message: 'Qty must be greater than 0' });
      }

      if (nextQtyOnHand !== stock.qtyOnHand) {
        stock.movements.push({
          movementType: 'ADJUST',
          quantity: nextQtyOnHand,
          sourceType: 'MANUAL',
          referenceNo: nextReferenceNumber || nextSourceInvoiceNo || cleanText(sourcePONumber),
          note: `Qty updated from ${stock.qtyOnHand} to ${nextQtyOnHand}`,
          movedBy: req.user?.userName || 'system',
        });
      }

      stock.qtyOnHand = nextQtyOnHand;
      stock.committed = Math.min(stock.committed || 0, stock.qtyOnHand);
      stock.available = Math.max(stock.qtyOnHand - (stock.committed || 0), 0);
    }

    if (openingQty !== undefined) {
      const nextOpeningQty = parseNonNegativeNumber(openingQty, 0);
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
    if (minStockLevel !== undefined) stock.minStockLevel = parseNonNegativeNumber(minStockLevel, stock.minStockLevel);
    if (reorderQty !== undefined) stock.reorderQty = parseNonNegativeNumber(reorderQty, stock.reorderQty);
    if (plan !== undefined) stock.plan = parseNonNegativeNumber(plan, stock.plan);
    if (committed !== undefined) {
      stock.committed = Math.min(parseNonNegativeNumber(committed, stock.committed), stock.qtyOnHand || 0);
    }
    if (available !== undefined) {
      stock.available = Math.min(parseNonNegativeNumber(available, stock.available), stock.qtyOnHand || 0);
    } else if (committed !== undefined || isQtyUpdateRequested) {
      stock.available = Math.max((stock.qtyOnHand || 0) - (stock.committed || 0), 0);
    }
    if (unit !== undefined) stock.unit = unit;
    if (lastPurchasePrice !== undefined) stock.lastPurchasePrice = Number(lastPurchasePrice);
    if (remarks !== undefined) stock.remarks = cleanText(remarks);
    if (sourceInvoiceNo !== undefined) stock.sourceInvoiceNo = nextSourceInvoiceNo;
    if (sourceParty !== undefined) stock.sourceParty = nextSourceParty;
    if (workOrderNumber !== undefined) stock.workOrderNumber = cleanText(workOrderNumber);
    if (referenceNumber !== undefined) stock.referenceNumber = nextReferenceNumber;
    if (sourcePONumber !== undefined) stock.sourcePONumber = cleanText(sourcePONumber);
    if (serialNo !== undefined) stock.serialNo = cleanText(serialNo);
    if (status !== undefined && stock.itemType !== 'VALVE') stock.status = cleanText(status);
    if (presentLocation !== undefined) stock.presentLocation = nextPresentLocation;
    if (moc !== undefined && stock.itemType === 'VALVE') stock.moc = cleanText(moc);
    if (stockDate !== undefined) stock.stockDate = nextStockDate;

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
    stock.committed = Math.min(stock.committed || 0, stock.qtyOnHand);
    stock.available = Math.max(stock.qtyOnHand - (stock.committed || 0), 0);
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
        const shortage = Math.max((item.minStockLevel || 0) - (item.available || 0), 0);
        const suggestedOrderQty = Math.max(shortage, item.reorderQty || 0);

        return {
          stockId: item._id,
          itemType: item.itemType,
          itemName: item.itemName,
          partId: item.partId,
          bomId: item.bomId,
          openingQty: item.openingQty,
          qtyOnHand: item.qtyOnHand,
          plan: item.plan,
          available: item.available,
          committed: item.committed,
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
  getStockSummary,
  getStockById,
  updateStock,
  addStockMovement,
  getReorderSuggestions,
  deleteStock,
};
