const mongoose = require('mongoose');

const bomItemSchema = new mongoose.Schema(
  {
    partId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parts',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    remark: {
      type: String,
      trim: true,
    },
  },
  { _id: true, timestamps: true }
);

const bomSchema = new mongoose.Schema(
  {
    templateName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    valveType: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
      trim: true,
    },
    endConnection: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    items: [bomItemSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BOM', bomSchema);
