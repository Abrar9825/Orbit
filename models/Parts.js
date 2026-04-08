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
    modelNumber: {
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
