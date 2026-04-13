const mongoose = require('mongoose');

const partsSchema = new mongoose.Schema(
  {
    itemKey: {
      type: String,
      trim: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Valve',
    },
    modelNumber: {
      type: String,
      trim: true,
    },
    equipment: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    length: {
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
    remarks: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    invoice: {
      type: String,
      trim: true,
    },
    party: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    dynamicFields: {
      type: [String],
      default: [],
    },
    dynamicValues: {
      type: Map,
      of: String,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Parts', partsSchema);
