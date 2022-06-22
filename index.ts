/* Import modules */
import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';

/* Misc */
console.clear();
dotenv.config();

/* Import database */
require('./db/main.js')();

/* Initialize client */
const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
});

const bot = async () => {
  await require('./bot/main.js')(client);
}

bot();