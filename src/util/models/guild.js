const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  id: { type: String, unique: true },
  badges: { type: Array, default: [] },
  tickets: { type: Array, default: [] },
  settings: {
    staff: {
      role: { type: String, default: 'none' },
      members: { type: Array, default: [] },
    },
    transcript: {
      type: { type: String, default: 'simple' },
      enabled: { type: Boolean, default: false },
    },
    permissions: {
      blacklist: { type: Array, default: [] },
    },
    log: { type: String, default: 'none' },
    maxtickets: { type: String, default: '3' },
    raid: { type: Boolean, default: false },
    feedback: { type: Boolean, default: false },
  },
  panels: {
    type: Array,
    default: [{
      id: 'default',
      name: 'Create ticket',
      description: 'To create a ticket please use the button below.',
      options: [{
        label: 'No reason provided',
        description: 'This reason has no further description.',
        value: '0',
        permissions: 'none',
      }],
      category: 'none',
      channel: 'none',
      message: 'none',
      prefix: 'ticket-{id}',
    }],
  },
  feedback: {
    type: Array,
    default: [],
  },
  botJoined: { type: Number, required: true },
  ticketid: { type: Number, default: 1 },
}, { timestamps: true });

const Guild = model('Guild', guildSchema);
module.exports = Guild;
