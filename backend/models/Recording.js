const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    file_name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    file_path: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    mime_type: {
      type: String,
      required: [true, 'Mime type is required'],
      default: 'audio/webm',
    },
    duration: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

recordingSchema.index({ user: 1, created_at: -1 });

module.exports = mongoose.model('Recording', recordingSchema);
