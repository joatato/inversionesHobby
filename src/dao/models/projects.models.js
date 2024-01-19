import mongoose, { model } from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  amountNecessary: {
    type: Number,
    required: true,
  },
  amountAlready: {
    type: Number,
    default: 0,
  },
  steps: {
    type: [String], // Array de pasos del proyecto
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    },
  ],
  location: {
    address: {
      type: String,
    },
    city: String,
    state: String,
    country: String,
    province: String,
  },
  investors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      amount: {
        type: Number,
        required: true,
      },
    }
  }],
  score: {
    type: Number,
    default: 0,
  },
  interests: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  deadlineDate: {
    type: Date,
  },
  returnInterestDate: {
    type: Date,
  },
  // Otros campos según tus necesidades
});

export const projectsModel = mongoose.model('projects', projectSchema);