const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, version: djsversion } = require('discord.js');

const os = require('os');
const Guild = require('../../db/models/guild');
const { version } = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows some information about the bot.'),
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id })
      .then(async (result) => {
        const guilds = await Guild.find();
        let ticketCount = 0;
        let ticketOpen = 0;

        await guilds.forEach((g) => {
          ticketCount += g.tickets.length;
          ticketOpen += g.tickets.filter((t) => t.state === 'open' || t.state == 'stopped').length;
        });

        const botJoinInt = result.botJoined;

        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        const core = os.cpus()[0];

        const infoEmbed = new MessageEmbed()
          .setAuthor({
            name: `${client.user.username}`,
            iconURL: client.user.avatarURL(),
          })
          .setColor('#5865f4')
          .setTitle('Bot Info')
          .setThumbnail(client.user.displayAvatarURL())
          .addField(
            '> General',
            [
              '**<:right:977610957985558628>  Developer Team:** [Developers Dungeon Studios](https://developersdungeon.xyz/)',
              '**<:right:977610957985558628>  Discord:** [Invite](https://discord.gg/KfBkKKydfg)',
              '**<:right:977610957985558628>  Client:** [Ticketer Invite](https://discord.com/api/oauth2/authorize?client_id=977591057711792178&permissions=137909037169&scope=bot%20applications.commands)',
              `**<:right:977610957985558628>  Servers:** ${client.guilds.cache.size.toLocaleString()} `,
              `**<:right:977610957985558628>  Bot Joined** <t:${botJoinInt}:f>`,
              `**<:right:977610957985558628>  Users:** ${client.guilds.cache
                .reduce((a, b) => a + b.memberCount, 0)
                .toLocaleString()}`,
              `**<:right:977610957985558628>  Channels:** ${client.channels.cache.size.toLocaleString()}`,
              '**<:right:977610957985558628>  Creation Date:** <t:1653146270:R>',
              `**<:right:977610957985558628>  Bot Version:** v${version}`,
              `**<:right:977610957985558628>  Node.js:** ${process.version}`,
              `**<:right:977610957985558628>  Discord.js:** v${djsversion}`,
            ].join('\n'),
          )
          .addField(
            '> System',
            [
              `**<:right:977610957985558628>  Platform:** ${process.platform}`,
              `**<:right:977610957985558628>  Uptime:** ${`${days}d ${hours}h ${minutes}m ${seconds}s`}`,
              '**<:right:977610957985558628>  CPU:**',
              `<:right:977610957985558628>  Cores: ${os.cpus().length}`,
              `<:right:977610957985558628>  Threads: ${os.cpus().length * 2}`,
              `<:right:977610957985558628>  Model: ${core.model}`,
              `<:right:977610957985558628>  Base Speed: ${core.speed}MHz`,
            ].join('\n'),
          )
          .addField(
            '> Tickets',
            [
              `**<:right:977610957985558628>  Tickets:** ${ticketCount}`,
              `**<:right:977610957985558628>  Tickets open:** ${ticketOpen}`,
              `**<:right:977610957985558628>  Tickets closed:** ${ticketCount - ticketOpen}`,
            ].join('\n'),
          )
          .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          })
          .setTimestamp();

        interaction.reply({ embeds: [infoEmbed], ephemeral: false });
      });
  },
};
