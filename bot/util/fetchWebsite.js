const axios = require('axios');
require('dotenv').config();
const { ChalkAdvanced } = require('chalk-advanced');

console.log(ChalkAdvanced.bgGreen(ChalkAdvanced.black(' [GUILDS] Developers Dungeon Fetched ')));

async function FetchWebsite(client) {
  let data;
  await axios({
    method: 'POST',
    url: `https://developersdungeon.xyz/api/servers?code=${process.env.DEVELOPERSDUNGEON}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: {
      bot: 'ticketer',
      servers: client.guilds.cache.size,
    },
  }).then((res) => {
    data = res.data;
    // console.log(data)
  });
}

module.exports = { FetchWebsite };
