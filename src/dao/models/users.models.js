import mongoose, { Schema, model } from "mongoose";

const usersCollection = "users";

const usersSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      min: 3,
      max: 255
    },
    lastName: String,
    location: {
      address: {
        type: String,
        required: true,
      },
      city: String,
      state: String,
      country: String,
      province: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 11,
      max: 1024
    },
    password: String,
    birthDate: Date,
    role: {
      type: String,
      enum: ["USER", "INVESTOR", "ENTREPRENEUR", "ADMIN"],
      default: 'USER'
    },
    github: Boolean,
    githubProfile: Object,
    lastOrder: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now
    },
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'projects',
      required: true,
    }],
    investments: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'projects',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        gains: {
          type: String,
        },
      },
    ],
    enter: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

export const usersModel = model(usersCollection, usersSchema);
