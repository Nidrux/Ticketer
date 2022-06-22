const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Permissions,
} = require('discord.js');

const Guild = require('../../db/models/guild');
const { guildLog } = require('../../functions/bot');
const { log } = require('../../functions/console');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resend')
    .setDescription('Provides you a list of default commands'),
  async execute(interaction, client) {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      Guild.findOne({ id: interaction.guild.id }).then(async (dbGuild) => {
        const helpEmbed = new MessageEmbed()
          .setTitle('> Ticket')
          .setColor('BLURPLE')
          .setDescription(
            dbGuild.settings.messages.create.replaceAll('\\n', '\n'),
          )
          .setFooter({
            text: client.user.tag,
            iconURL: client.user.avatarURL({ dynamic: true }),
          })
          .setTimestamp();

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('ticket-create')
            .setDisabled(false)
            .setEmoji('🎫')
            .setStyle('SUCCESS'),
        );

        interaction.deferReply();
        interaction.deleteReply();
        if(dbGuild.settings.message !== 'none') {
          try {
            const msg = await interaction.channel.messages.fetch(
              dbGuild.settings.message,
            );
            msg.delete();
          } catch (e) {
            log('', client, e, interaction.commandName);
          }
        }

        const message = await interaction.channel.send({
          embeds: [helpEmbed],
          ephemeral: false,
          components: [row],
        });
        dbGuild.settings.message = message.id;
        dbGuild.settings.channel = interaction.channel.id;
        dbGuild.save();
        guildLog(dbGuild.settings.log, interaction.user, `**${interaction.user.tag}** resended the ticket message.`, client);
      });
    } else {
      const errorEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('> Settings')
        .setDescription('You are not a server administrator.')
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp();

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
