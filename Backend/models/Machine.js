const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    procesType: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: [
        'Design',
        'Casting',
        'Machining',
        'Assembly',
        'QC',
        'Paint',
        'Final QC',
        'Testing',
        'Finishing',
        'Packaging',
        'Dispatch',
        'Remove',
        'Quality',
        'Other',
      ],
    },
    machineName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    machineCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    capacity: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Machine', machineSchema);
