const mongoose = require('mongoose');

const masterConfigSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: 'GLOBAL',
      unique: true,
      index: true,
    },
    endConnections: {
      type: [String],
      default: [],
    },
    classes: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    units: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MasterConfig', masterConfigSchema);
