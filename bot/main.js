/* Import modules */
const {
  Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu,
} = require('discord.js');
const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { join } = require('path');
const { ChalkAdvanced } = require('chalk-advanced');
const { fetchDungeon, fetchDungeonSingle } = require('dungeon-api')

/* Import modules */
const { staffCommands } = require('../config.json');
const Guild = require('../db/models/guild');
const { log } = require('../functions/console');

/* Export */

module.exports = (client) => {
  // Create client

  // Wait for client to connect
  client.on('ready', async () => {

    fetchDungeonSingle("ticketer", process.env.DEVELOPERSDUNGEON, client)
    fetchDungeon("ticketer", process.env.DEVELOPERSDUNGEON, client)

    Guild.find();

    console.log(ChalkAdvanced.bgGreen(ChalkAdvanced.black(' [BOT] Bot is ready ')));

    setInterval(async () => {
      const guilds = await Guild.find();
      let ticketCount = 0;
      await guilds.forEach((g) => {
        ticketCount += g.tickets.length;
      });
      client.user.setActivity(`${ticketCount} total tickets`, { type: 'WATCHING' });
    }, 42000);
    client.user.setStatus('online');

    /* Initialize website */
    require('../web/main')(client);
  });

  // Log in into client
  client.login(process.env.TOKEN);

  // Setup Interactions
  client.interactions = new Collection();
  const interactions = [];

  const interactionFiles = readdirSync(join('./bot/interactions')).filter((f) => f.endsWith('.js'));

  interactionFiles.forEach((interactionFile) => {
    const interaction = require(`./interactions/${interactionFile}`);
    client.interactions.set(interaction.data.name, interaction);
    interactions.push(interaction.data.toJSON());
    console.log(ChalkAdvanced.bgBlue(ChalkAdvanced.black(` [BOT] Loaded interaction ${interaction.data.name} `)));
  });

  const restClient = new REST({ version: '10' }).setToken(process.env.TOKEN);

  console.log(ChalkAdvanced.bgGreen(ChalkAdvanced.black(' [BOT] Loaded interactions ')));

  restClient.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEVGUILD_ID), { body: interactions })
    .catch(console.error);

  restClient.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: interactions },
  );

  // Listen for slash commands
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.guild) {
      interaction.reply({
        content: 'You need to be in a server to use this command.',
        ephemeral: true,
      });
    } else {
      Guild.findOne({ id: interaction.guild.id }).then(async (dbGuild) => {
        if (!dbGuild) {
          const g = new Guild({
            id: interaction.guild.id,
            botJoined: (Date.now() / 1000) | 0,
          });

          g.save();
          dbGuild = g;
        }

        if (!interaction.isCommand()) return;

        const command = client.interactions.get(interaction.commandName);

        if (command) {
          try {
            await command.execute(interaction, client);
          } catch (e) {
            log(e, client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, interaction.commandName);
            console.log(e);
          }
        }
      });
    }
  });

  // Button listener
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.guild) {
    } else {
      Guild.findOne({ id: interaction.guild.id }).then(async (dbGuild) => {
        if (!dbGuild) return;

        if (interaction.isButton() || interaction.isSelectMenu()) {
          try {
            require(`./handler/${interaction.customId}`)(interaction, client, dbGuild);
          } catch (e) {
            log(e, client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, interaction.customId);
          }
        } else return;
      });
    }
  });

  client.on('modalSubmit', async (interaction) => {
    try {
      Guild.findOne({ id: interaction.guild.id }).then(async (dbGuild) => {
        if (!dbGuild) return;
        require(`./handler/${interaction.customId}`)(interaction, client, dbGuild);
      });
    } catch (e) {
      log('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, interaction.customId);
    }
  });

  // Message listener
  client.on('messageCreate', (message) => {
    Guild.findOne({ id: message.guild.id }).then(async (dbGuild) => {
      if (!dbGuild || message.author.bot) return;

      const ticket = dbGuild.tickets[dbGuild.tickets.findIndex((t) => t.channel == message.channel.id)];
      if (ticket) {
        if (ticket.members.findIndex((m) => m.id == message.author.id)) ticket.members.push({ id: message.author.id, name: message.author.tag });
        ticket.messages.push({
          message: message.content, author: message.author.id, name: message.author.tag, timestamp: new Date(),
        });

        Guild.findOneAndUpdate({ id: message.guild.id }, { tickets: dbGuild.tickets }).catch();
      }
    });

    const { client } = message;

    if (message.content == `<@${client.user.id}>`) {
      const msgEmbed = new MessageEmbed()
        .setTitle('> Hey :wave:')
        .setColor('BLURPLE')
        .setDescription(`This bot uses \`/\` commands. Use \`/help\` to get a list of commands or visit our [website](${process.env.WEB}/commands).`)
        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) });
  
      return message.channel.send({ embeds: [msgEmbed] });
    }
});

  // Shit code
  client.on('guildCreate', (guild) => {
    Guild.findOne({ id: guild.id }).then(async (dbGuild) => {
      if (dbGuild) return;
      const g = new Guild({
        id: guild.id,
        botJoined: (Date.now() / 1000) | 0,
      });

      g.save();
    });
  });
};
