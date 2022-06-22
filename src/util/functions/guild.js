/* Import packages */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { MessageEmbed } = require('discord.js');

/* Import files */
const Guild = require('../models/guild');
const { errorLog } = require('./error');

/* Export */
module.exports = {
  log: async (client, interaction, message, dbGuild) => {
    if (dbGuild.settings.log == 'none') return;
    const logEmbed = new MessageEmbed()
      .setTitle('> Log')
      .setColor('BLURPLE')
      .setDescription(message)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) });

    try {
      const channel = await interaction.guild.channels.fetch(dbGuild.settings.log);
      if (channel) channel.send({ embeds: [logEmbed] });
    } catch (e) {
      errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `functions/guild.js (\`${interaction.customId ? interaction.customId : interaction.commandName}\`)`);
      return;
    }
  },
  createTranscript: async (id, ticket, client) => {
    try {
      fetch(`http://localhost:${process.env.PORT}/api/transcript/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guild: id,
          ticket,
        }),
      });
    } catch (e) {
      errorLog('', client, e, id, 'unknown', 'unknown', 'functions/guild.js (`transcript/create`)');
    }
  },
};
