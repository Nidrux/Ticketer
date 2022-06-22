const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guildSchema = new Schema({
  id: { type: String, unique: true },
  badges: { type: Array, default: [] },
  tickets: { type: Array, default: [] },
  options: {
    type: Array,
    default: [{
      label: 'No reason provided',
      description: 'This reason has no further description.',
      value: '0',
      permissions: 'none',
    }],
  },
  botJoined: {
    type: Number,
    required: true,
  },
  settings: {
    staff: {
      role: { type: String, default: 'none' },
      members: { type: Array, default: [] },
    },
    transcript: {
      type: { type: String, default: 'simple' },
      enabled: { type: Boolean, default: false },
      channel: { type: String, default: 'none' },
    },
    messages: {
      create: { type: String, default: 'To create a ticket please use the button below.' },
    },
    permissions: {
      blacklist: { type: Array, default: [] },

    },
    log: { type: String, default: 'none' },
    channel: { type: String, default: 'none' },
    category: { type: String, default: 'none' },
    nameprefix: { type: String, default: 'ticket-{id}' },
    maxtickets: { type: String, default: '3' },
    message: { type: String, default: 'none' },
  },
  log: { type: Array, default: [] },
  ticketid: { type: Number, default: 1 },
}, { timestamps: true });

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;
