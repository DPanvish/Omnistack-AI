import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      default: 'Untitled Workspace',
    },
    files: {
      type: Object,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);