/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),

  async execute(interaction, client, dbGuild) {
    interaction.deferReply();
    const user = await interaction.guild.members.fetch(interaction.user.id);
    console.log(new Date(user.joinedTimestamp));
  },
};
