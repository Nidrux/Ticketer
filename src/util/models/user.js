const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    voted: {
      type: Boolean,
      default: false,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    lastVote: {
      type: Number,
      default: 0,
    },
    totalVotes: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

const User = model('User', userSchema);
module.exports = User;
