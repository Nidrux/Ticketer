/* Import packages */
const { readdirSync } = require('fs');
const { join } = require('path');
const { errorLog } = require('./functions/error');

/* Import files */
const Guild = require('./models/guild');

/* Export */
module.exports = async (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.guild) {
      interaction.reply({
        content: 'You need to be in a server to use this command.',
        ephemeral: true,
      });
    } else {
      if (!interaction.customId) return;

      const customId = interaction.customId.includes('_') ? interaction.customId.substring(0, interaction.customId.indexOf('_')) : interaction.customId;
      try {
        Guild.findOne({ id: interaction.guild.id }).then((dbGuild) => {
          const interactions = readdirSync(join(__dirname, '../interactions')).filter((f) => f.endsWith('.js'));
          if (!dbGuild || !interactions.includes(`${customId}.js`)) {
            return interaction.reply({
              content: 'An error occurred while executing that interaction.',
              ephemeral: true,
            });
          }
          require(`../interactions/${customId}`)(client, interaction, dbGuild);
        });
      } catch (e) {
        errorLog('', client, e, interaction.guild.id, interaction.user.id, interaction.channel.id, `interactions/${interaction.commandName}.js`);
        return interaction.reply({
          content: 'An error occurred while executing that interaction.',
          ephemeral: true,
        });
      }
    }
  });
};
