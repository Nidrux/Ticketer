/* Import packages */
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const {
  Permissions, MessageEmbed, MessageActionRow, MessageButton,
} = require('discord.js');
const { encrypt, decrypt } = require('simple-encryptor')(process.env.DECRYPT_KEY);

/* Import files */
const Guild = require('../models/guild');
const { errorLog } = require('../functions/error');

/* Export */
module.exports = (app, client) => {
  passport.use(new DiscordStrategy(
    {
      clientID: client.user.id,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.WEB}/api/callback`,
      scope: ['identify', 'guilds'],
    },
    (async (accessToken, refreshToken, profile, cb) => {
      await process.nextTick(async () => {
        if (profile.guilds == undefined) return cb(null, false);

        return cb(null, profile);
      });
    }),
  ));

  passport.serializeUser((user, done) => {
    if (!user) return;
    return done(null, user);
  });
  passport.deserializeUser((obj, done) => done(null, obj));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api', (req, res) => {
    res.send('Api online');
  });

  app.get('/api/login', passport.authenticate('discord'));

  app.get('/api/callback', passport.authenticate('discord', {
    failureRedirect: '/',
    session: true,
  }), async (req, res) => {
    await res.redirect('/dashboard');
  });

  app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  app.post('/api/transcript/create', (req, res) => {
    const { guild, ticket } = req.body;

    let members = '';
    let memberCount = 0;
    ticket.members.forEach((member) => {
      if (members.includes(member.name)) return;
      memberCount += 1;
      members += `<div class="user"><div class="img"></div><a class="name">${member.name}</a></div>`;
    });

    let messages = '';
    if (ticket.messages) {
      ticket.messages.forEach((message) => {
        const date = new Date(message.timestamp);
        messages += `<div class="message"><div class="user"><div class="img"></div><a>${message.name} (${date.getMonth()}.${date.getDate()}.${date.getFullYear()}, ${date.getMinutes()}:${date.getHours()})</a></div><a class="value">${decrypt(message.message)}</a></div>`;
      });
    }

    const file = `
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Transcript - Ticket ${ticket.id}</title>
              <link rel="shortcut icon" href="/assets/img/logo-round.webp" type="image/x-icon">
          </head>
          <body>
              <nav>
                  <a class="logo">Ticketer</a>
                  <p>Ticket ${ticket.id}</p>
              </nav>
              <div class="content">
                  <div class="messages">
                      ${messages}${ticket.state == 'closed' ? '<div class="message"><div class="user"><div class="img"></div><a>System</a></div><a class="value">This ticket has been closed</a></div>' : ''}
                  </div>
                  <div class="users">
                      <div class="list">
                          <div class="head">
                              <p>Members</p>
                              <p>${memberCount}</p>
                          </div>
                          ${members}
                      </div>
                  </div>
              </div>
              <style>@import url(https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap);body{padding:0;margin:0;top:0;left:0;overflow:hidden;font-family:Poppins,sans-serif;font-size:14px;background-color:#111}nav{padding:10px 20px;width:100vw;user-select:none;display:flex;flex-direction:row;align-items:flex-end}nav a{color:#fff;font-weight:600;font-size:1.6rem}nav p{color:#bcbcbc;font-weight:500;font-size:1.2rem;padding:0;margin:0 15px 2px}.content{display:flex;flex-direction:row;color:#fff;height:100%;width:100%}.content .users{height:100%;width:20%;display:flex;flex-direction:row;justify-content:center}.content .list{background-color:#181818;height:85%;width:300px;border-radius:9px;padding:10px}.content .list .head{color:#fff;display:flex;flex-direction:row;align-items:flex-end;justify-content:space-between;margin-bottom:10px}.content .list .head p{margin:0;font-size:1.1rem}.content .list .head p:nth-child(1){margin:0;font-size:1.25rem;font-weight:500}.content .list .head p:nth-child(2){color:#979797}.content .list .user{display:flex;flex-direction:row;align-items:center;padding:0;margin:12px 0}.content .list .user .img{width:34px;height:34px;background-color:#464646;border-radius:100%}.content .list .user{margin-left:10px;font-size:1.15rem}.content .list .user .name{margin-left:10px;font-size:1.15rem}.content .messages{height:90%;width:80%;padding:10px 20px;overflow-y:scroll}.content .messages::-webkit-scrollbar{width:8px;background-color:#000;position:absolute;border-radius:10px}.content .messages::-webkit-scrollbar-thumb{background:#2361ff;border-radius:10px}.content .messages::-webkit-scrollbar-thumb:hover{background:#2150c9}.content .messages .message{background-color:#181818;border-radius:9px;max-width:90%;padding:10px}.content .messages .message:not(:first-child){margin-top:10px}.content .messages .message .user{display:flex;flex-direction:row;align-items:center;margin-bottom:10px}.content .messages .message .user .img{width:32px;height:32px;border-radius:100%;background-color:#6a6a6a}.content .messages .message .user a{margin-left:10px;font-size:1rem;font-weight:500}.content .messages .message .value{overflow-wrap:break-word}</style>
          </body>
      </html>
    `;

    if (!existsSync(join(__dirname, `../../web/views/tickets/${guild}/`))) {
      mkdirSync(join(__dirname, `../../web/views/tickets/${guild}/`), { recursive: true });
    }

    writeFileSync(
      join(__dirname, `../../web/views/tickets/${guild}/${ticket.channel}.html`),
      file,
      { overwrite: true },
    );

    res.json({ saved: true, error: '' });
  });

  app.post('/api/setting/nickname', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (!guildId || !userId) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      if (guild.me.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
        guild.members.cache.get(client.user.id).setNickname(value);
      }

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/maxtickets', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (!value || !guildId || !userId || Number(value) < 1 || Number(value) > 10) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.maxtickets = String(value);
      dbGuild.save();

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/feedback', async (req, res) => {
    return res.json({ saved: true, error: '' });
    const { value, guildId, userId } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (value !== true && value !== false || !guildId || !userId) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.feedback = value;
      dbGuild.save();

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/raid', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (value !== true && value !== false || !guildId || !userId) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.raid = value;
      dbGuild.save();

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/panels', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (!value || !guildId || !userId || Number(value.length) < 1 || Number(value.length) > 10) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      try {
        value.forEach((panel) => {
          const dbPanel = dbGuild.panels[dbGuild.panels.findIndex((p) => p.id === panel.id)];

          if (dbPanel) return;
          dbGuild.panels.push({
            id: panel.id,
            name: panel.name,
            description: 'No description has been set',
            options: [{
              label: 'No reason provided',
              description: 'This reason has no further description.',
              value: '0',
              permissions: 'none',
            }],
            category: 'none',
            channel: 'none',
            message: 'none',
            prefix: 'ticket-{id}',
          });
        });

        dbGuild.save();
      } catch (e) {
        errorLog('', client, e, guildId, userId, 'dashboard', '/api/settings/panels');
      }

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/panel', async (req, res) => {
    const {
      value, guildId, userId, panelId,
    } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (!value || !guildId || !userId || !panelId) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');
      const panel = dbGuild.panels[dbGuild.panels.findIndex((p) => p.id === panelId)];
      if (!panel) return res.redirect(`/dashboard/${guildId}/settings/panels`);
      if (dbGuild.panels.findIndex((p) => p.id === value.id) !== -1 && panelId !== value.id) return res.json({ saved: false, error: 'Invalid information was given.' });

      if (!value.id) value.id = panel.id;
      if (!value.name) value.name = panel.name;
      if (!value.prefix) value.prefix = panel.prefix;
      if (!value.description) value.description = panel.description;
      if (!value.category) value.category = panel.category;
      if (!value.channel) value.channel = panel.channel;

      dbGuild.tickets.filter((t) => t.panel == panelId).forEach((ticket) => {
        ticket.panel = value.id;
      });

      panel.id = value.id.replaceAll(' ', '-');
      panel.name = value.name;
      panel.prefix = value.prefix.replaceAll(' ', '-');
      panel.description = value.description;
      panel.category = value.category;
      panel.channel = value.channel;

      dbGuild.panels[dbGuild.panels.findIndex((p) => p.id === panelId)] = panel;

      Guild.findOneAndUpdate({ id: guildId }, { panels: dbGuild.panels, tickets: dbGuild.tickets }).catch();

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/panel/options', async (req, res) => {
    const {
      value, guildId, userId, panelId,
    } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (!value || !guildId || !userId || !panelId) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');
      const panel = dbGuild.panels[dbGuild.panels.findIndex((p) => p.id === panelId)];
      if (!panel) return res.redirect(`/dashboard/${guildId}/settings/panels`);

      let options = [];
      value.forEach((op) => {
        const id = value.findIndex((p) => p.id === op.id);
        if (options.findIndex((p) => p.value == id) !== -1) return;

        options.push({
          label: op.name,
          description: op.description,
          value: id,
          permissions: op.permissions,
        });
      });

      if (options.length == 0) return res.json({ saved: false, error: 'Not enough information was given.' });
      dbGuild.panels[dbGuild.panels.findIndex((p) => p.id === panelId)].options = options;
      Guild.findOneAndUpdate({ id: guildId }, { panels: dbGuild.panels }).catch();

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/log', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (!value || !guildId || !userId) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      if (value !== 'none') {
        try {
          const channel = await guild.channels.fetch(value);
          if (channel) {
            const logEmbed = new MessageEmbed()
              .setTitle('> Log')
              .setColor('BLURPLE')
              .setDescription('This channel has been configured as the log channel.')
              .setFooter({ text: client.user.tag, iconURL: client.user.avatarURL({ dynamic: true }) });

            channel.send({ embeds: [logEmbed] });
          }
        } catch (e) {
          errorLog('', client, e, guildId, userId, 'dashboard', '/api/settings/channel');
        }
      }

      dbGuild.settings.log = value;
      dbGuild.save();

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/transcript/state', async (req, res) => {
    const {
      value, type, guildId, userId,
    } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (value !== true && value !== false || !['simple', 'extebded'].includes(type) || !type || !guildId || !userId) return res.json({ saved: false, error: 'Not enough information was given.' });
    if (!['simple'].includes(type)) return res.json({ saved: false, error: 'Invalid information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.transcript.enabled = value;
      dbGuild.settings.transcript.type = type;
      dbGuild.save();

      res.json({ saved: true, error: '' });
    });
  });

  app.post('/api/setting/permissions/staff', async (req, res) => {
    const { value, guildId, userId } = req.body;
    if (!req.session.passport || userId !== req.session.passport.user.id) return res.redirect('/dashboard');
    if (!value || !guildId || !userId) return res.json({ saved: false, error: 'Not enough information was given.' });

    Guild.findOne({ id: guildId }).then(async (dbGuild) => {
      const guild = await client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
      if (!dbGuild || !guild) return res.json({ saved: false, error: 'The server was not found.' });
      if (!user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect('/dashboard');

      dbGuild.settings.staff.role = value;
      dbGuild.save();

      res.json({ saved: true, error: '' });
    });
  });

  return app;
};
