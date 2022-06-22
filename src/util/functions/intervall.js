/* Import packages */
const { ChalkAdvanced } = require('chalk-advanced');
const fs = require('fs');
const path = require('path');

/* Import files */
const Guild = require('../models/guild');

module.exports = () => {
  let transcriptCount = 0;
  const deleteTranscripts = () => {
    transcriptCount = 0;
    const now = new Date() - (1000 * 60 * 60 * 3);
    Guild.find().then((dbGuilds) => {
      dbGuilds.forEach((dbGuild) => {
        if (!dbGuild.settings.transcript.enabled) {
          try {
            fs.rmdir(path.join(__dirname, `../../web/views/tickets/${dbGuild.id}`), { recursive: true, force: true });
          } catch (e) {
            return;
          }
        } else {
          let transcripts = [];
          try {
            transcripts = fs.readdirSync(path.join(__dirname, `../../web/views/tickets/${dbGuild.id}`)).filter((f) => f.endsWith('.html'));
          } catch (e) {
            return;
          }
          transcriptCount += transcripts.length;
          dbGuild.tickets.forEach((ticket) => {
            if (ticket.closed == 'none') return;
            if (!ticket.closed || new Date(ticket.closed) < now && transcripts.includes(`${ticket.channel}.html`)) {
              try {
                fs.unlinkSync(path.join(__dirname, `../../web/views/tickets/${dbGuild.id}/${ticket.channel}.html`), { recursive: true, force: true });
              } catch (e) {
                return;
              }
            }
          });
        }
      });
    });

    setTimeout(deleteTranscripts, 1000 * 60 * 60 * 6);
  };

  deleteTranscripts();
};
