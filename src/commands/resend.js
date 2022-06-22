/* Import packages */
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
  MessageEmbed, MessageButton, MessageActionRow, Permissions,
} = require('discord.js');

/* Import files */
const { errorLog } = require('../util/functions/error');
const guild = require('../util/functions/guild');

/* Export */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('resend')
    .setDescription('Resends the ticket message')
    .addSubcommand((option) => option
      .setName('default')
      .setDescription('Resends the default ticket messages'))
    .addSubcommand((option) => option
      .setName('panel')
      .setDescription('Sends a specified panel')
      .addStringOption((option) => option
        .setName('id')
        .setAutocomplete(false)
        .setRequired(true)
        .setDescription('The id of the panel'))),

  async execute(interaction, client, dbGuild) {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      if (interaction.options._subcommand) {
        switch (interaction.options.getSubcommand()) {
          case 'default':
            const defaultPanel = dbGuild.panels[dbGuild.panels.findIndex((p) => p.id == 'default')];
            if (!defaultPanel) {
              const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('> Error')
                .setDescription('This guild has no default panel. Configure one using the id `default`')
                .setFooter({
                  text: interaction.user.tag,
                  iconURL: interaction.user.avatarURL({ dynamic: true }),
                });

              return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const ticketEmbed = new MessageEmbed()
              .setTitle(`> ${defaultPanel.name}`)
              .setColor('BLURPLE')
              .setDescription(
                defaultPanel.description.replaceAll('\\n', '\n'),
              )
              .setFooter({
                text: client.user.tag,
                iconURL: client.user.avatarURL({ dynamic: true }),
              });

            const row = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId('ticket-panel_default')
                .setDisabled(false)
                .setEmoji('🎫')
                .setStyle('SUCCESS'),
            );

            interaction.deferReply();
            interaction.deleteReply();
            if (dbGuild.settings.message !== 'none') {
              try {
                const msg = await interaction.channel.messages.fetch(
                  dbGuild.settings.message,
                );
                msg.delete();
              } catch (e) {
                errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `commands/${interaction.commandName}.js`);
              }
            }

            const message = await interaction.channel.send({
              embeds: [ticketEmbed],
              components: [row],
            });
            defaultPanel.message = message.id;
            defaultPanel.channel = interaction.channel.id;
            dbGuild.save();
            guild.log(client, interaction, `**${interaction.user.tag}** resent the ticket message.`, dbGuild);
            break;
          case 'panel':
            const panelId = interaction.options.getString('id');
            let customPanel = dbGuild.panels[dbGuild.panels.findIndex((p) => p.id == panelId)];
            if (!customPanel) {
              const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('> Error')
                .setDescription(`This guild has no panel with the id **${panelId}**`)
                .setFooter({
                  text: interaction.user.tag,
                  iconURL: interaction.user.avatarURL({ dynamic: true }),
                });

              return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            const customTicketEmbed = new MessageEmbed()
              .setTitle(`> ${customPanel.name}`)
              .setColor('BLURPLE')
              .setDescription(
                customPanel.description.replaceAll('\\n', '\n'),
              )
              .setFooter({
                text: client.user.tag,
                iconURL: client.user.avatarURL({ dynamic: true }),
              });

            const customRow = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId(`ticket-panel_${customPanel.id}`)
                .setDisabled(false)
                .setEmoji('🎫')
                .setStyle('SUCCESS'),
            );

            interaction.deferReply();
            interaction.deleteReply();
            if (dbGuild.settings.message !== 'none') {
              try {
                const msg = await interaction.channel.messages.fetch(
                  dbGuild.settings.message,
                );
                msg.delete();
              } catch (e) {
                errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `commands/${interaction.commandName}.js`);
              }
            }

            const customMessage = await interaction.channel.send({
              embeds: [customTicketEmbed],
              components: [customRow],
            });
            customPanel.message = customMessage.id;
            customPanel.channel = interaction.channel.id;
            dbGuild.save();
            guild.log(client, interaction, `**${interaction.user.tag}** resent the ticket message.`, dbGuild);

            break;
        }
      } else {
        const errorEmbed = new MessageEmbed()
          .setTitle('> Error')
          .setColor('RED')
          .setDescription(
            'No sub command selected!',
          )
          .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL({ dynamic: true }),
          });

        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
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
