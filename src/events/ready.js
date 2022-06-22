/* Import packages */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
require('dotenv').config();
const { ChalkAdvanced } = require('chalk-advanced');

/* Import files */
const Guild = require('../util/models/guild');

/* Export */
module.exports = async (client) => {
  /* Command handler */
  const commandFiles = readdirSync('./src/commands/').filter((file) => file.endsWith('.js'));

  const commands = [];

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const CLIENT_ID = client.user.id;

  const rest = new REST({
    version: '10',
  }).setToken(process.env.TOKEN);

  (async () => {
    try {
      if (process.env.STATUS === 'PRODUCTION') { // If the bot is in production mode it will load slash commands for all guilds
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: commands,
        });
        console.log(`${ChalkAdvanced.white('Ticketer')} ${ChalkAdvanced.gray('>')} ${ChalkAdvanced.green('Successfully registered commands globally')}`);
      } else {
        await rest.put(
          Routes.applicationCommands(CLIENT_ID, process.env.GUILD_ID),
          {
            body: commands,
          },
        );

        console.log(`${ChalkAdvanced.white('Ticketer')} ${ChalkAdvanced.gray('>')} ${ChalkAdvanced.green('Successfully registered commands locally')}`);
      }
    } catch (err) {
      if (err) console.error(err);
    }
  })();

  /* User presence */
  function abbrNum(number) {
    let decPlaces = 10 ** 1;
    let abbrev = ['k', 'm', 'b', 't'];

    for (let i = abbrev.length - 1; i >= 0; i -= 1) {
      let size = 10 ** ((i + 1) * 3);

      if (size <= number) {
        number = Math.round(number * decPlaces / size) / decPlaces;
        if ((number == 1000) && (i < abbrev.length - 1)) {
          number = 1;
          i += 1;
        }

        number += abbrev[i];
        break;
      }
    }

    return number;
  }

  client.user.setPresence({
    activities: [{ name: 'system startup', type: 'PLAYING' }],
    status: 'dnd',
  });

  setInterval(async () => {
    let totalTickets = 0;
    const guilds = await Guild.find();
    guilds.forEach((g) => totalTickets += g.tickets.length);

    client.user.setPresence({
      activities: [{ name: `${abbrNum(totalTickets)} total tickets`, type: 'WATCHING' }],
      status: 'dnd',
    });
  }, 30000);

  /* Load api */
  require('../util/routes/dungeon')(client);

  /* Load website */
  require('../util/website')(client);
};
