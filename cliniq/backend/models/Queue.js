const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed'],
      default: 'waiting',
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    calledAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    consultationDuration: {
      type: Number, // milliseconds
      default: null,
    },
    sessionDate: {
      type: String, // YYYY-MM-DD, for daily reset scoping
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for fast queue lookups
queueSchema.index({ status: 1, tokenNumber: 1 });
queueSchema.index({ sessionDate: 1, status: 1 });

// Auto-set sessionDate on save
queueSchema.pre('save', function (next) {
  if (!this.sessionDate) {
    const d = new Date();
    this.sessionDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Queue', queueSchema);
