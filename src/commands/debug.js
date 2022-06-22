/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, MessageButton, MessageActionRow, Permissions,
} = require('discord.js');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Debug the bots permissions'),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      const permissionEmbed = new MessageEmbed()
        .setColor('BLURPLE')
        .setTitle('> Debug')
        .setDescription('This command lists potential errors and is not responsible for validity')
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .addField('> Permission', [
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Manage Roles`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Manage Channels`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.CREATE_INSTANT_INVITE]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Create Invite`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_NICKNAMES]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Manage Nicknames`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.CHANGE_NICKNAME]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Change Nickname`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.CONNECT]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Read Messages`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.SEND_MESSAGES]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Send Messages`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Manage Messages`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.EMBED_LINKS]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Embed Links`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.ATTACH_FILES]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Attach Files`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.READ_MESSAGE_HISTORY]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Read Message History`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.ADD_REACTIONS]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Add Ractions`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.USE_EXTERNAL_EMOJIS]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Use External Emojis`,
          `${interaction.guild.me.permissions.has([Permissions.FLAGS.USE_EXTERNAL_STICKERS]) ? '<:check:977921614651981824>' : '<:cross:977712715554488391>'} Use External Stickets`,
        ].join('\n'));

      interaction.reply({ embeds: [permissionEmbed] });
    } else {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('> Error')
        .setDescription('You are missing the `MANAGE_GUILD` permission.')
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        });

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
