const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema(
  {
    movementType: {
      type: String,
      required: true,
      enum: ['IN', 'OUT', 'ADJUST'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    sourceType: {
      type: String,
      trim: true,
      enum: ['PO', 'ORDER', 'MANUAL', 'PRODUCTION'],
      default: 'MANUAL',
    },
    referenceNo: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    movedBy: {
      type: String,
      trim: true,
    },
    movedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const stockSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      required: true,
      enum: ['PART', 'VALVE'],
      index: true,
    },
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parts',
    },
    bomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BOM',
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    modelNumber: {
      type: String,
      trim: true,
    },
    valveType: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    moc: {
      type: String,
      trim: true,
    },
    endConnection: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      trim: true,
    },
    sourceInvoiceNo: {
      type: String,
      trim: true,
    },
    sourceParty: {
      type: String,
      trim: true,
    },
    workOrderNumber: {
      type: String,
      trim: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
    },
    sourcePONumber: {
      type: String,
      trim: true,
    },
    stockDate: {
      type: Date,
    },
    unit: {
      type: String,
      trim: true,
      default: 'NOS',
    },
    openingQty: {
      type: Number,
      min: 0,
      default: 0,
    },
    qtyOnHand: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minStockLevel: {
      type: Number,
      min: 0,
      default: 0,
    },
    reorderQty: {
      type: Number,
      min: 0,
      default: 0,
    },
    lastPurchasePrice: {
      type: Number,
      min: 0,
    },
    remarks: {
      type: String,
      trim: true,
    },
    movements: [movementSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

stockSchema.index(
  { itemType: 1, partId: 1 },
  { unique: true, partialFilterExpression: { itemType: 'PART', partId: { $exists: true } } }
);

stockSchema.index(
  { itemType: 1, bomId: 1 },
  { unique: true, partialFilterExpression: { itemType: 'VALVE', bomId: { $exists: true } } }
);

module.exports = mongoose.model('Stock', stockSchema);
