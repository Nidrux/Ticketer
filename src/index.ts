/* Import packages */
const { Collection, Client } = require('discord.js');
require('dotenv').config();

/* Create client */
const client = new Client({
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_WEBHOOKS',
    'GUILD_INVITES',
    'DIRECT_MESSAGES',
    'GUILD_MESSAGES',
  ],
});

/* Clear console */
console.clear();

/* Load events */
require('./util/eventLoader')(client);
require('./util/interactionHandler')(client);

/* Create command collection */
client.commands = new Collection();

/* Log in client */
client.login(process.env.TOKEN);

/* Load database */
require('./util/database.ts');

/* Temp files */
require('./util/functions/intervall')();