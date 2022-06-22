/* Import modules */
const mongoose = require('mongoose');
const { ChalkAdvanced } = require('chalk-advanced');
const { readdirSync } = require('fs');
const { join } = require('path');

/* Export */
module.exports = () => {
  mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log(ChalkAdvanced.bgGreen(ChalkAdvanced.black(' [DB] Database connected ')));
    })
    .catch((err) => console.log(err));

  const models = readdirSync(join('./db/models')).filter((f) => f.endsWith('.js'));
  models.forEach((model) => {
    console.log(ChalkAdvanced.bgBlue(ChalkAdvanced.black(` [DB] Loaded model ${model.replace('.js', '')} `)));
  });
};
