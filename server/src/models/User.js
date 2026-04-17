import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscriptionTier: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    generationsCount: {
      type: Number,
      default: 0,
    },
    lastGenerationDate: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);
export default User;