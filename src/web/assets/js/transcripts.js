/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
let changes = [];
let responses = [];

document.querySelector('.checkbox').addEventListener('click', (e) => {
  changes.push('enableCheck');
  document.querySelector('.saveChanges').classList.add('active');
  if (document.querySelector('.checkbox').classList.contains('active')) {
    document.querySelector('.checkbox').classList.remove('active');
    document.querySelector('.checkbox .icon i').classList = 'bx bxs-checkbox';
    document.getElementById('settingType').style = 'animation: settingsOut .5s;';
    setTimeout(() => {
      document.getElementById('settingType').classList.add('inactive');
    }, 400);
  } else {
    document.querySelector('.checkbox').classList.add('active');
    setTimeout(() => {
      document.querySelector('.checkbox .icon i').classList = 'bx bxs-checkbox-checked';
      document.getElementById('settingType').style = 'animation: settingsIn .5s;';
      document.getElementById('settingType').classList.remove('inactive');
    }, 100);
  }
});

const saveEnabled = () => {
  if (!changes.includes('enableCheck') && !changes.includes('typeSelect')) return;
  let value;
  document.getElementById('enableCheck').classList.contains('active') ? value = true : value = false;

  fetch('/api/setting/transcript/state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guildId,
      userId,
      value,
      type: document.getElementById('typeSelect').value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.querySelector('.saveChanges').classList.remove('active');
        return newMessage(data.error);
      }
      if (data.saved && !responses.includes('enableCheck')) responses.push('enableCheck');
      if (changes.length == responses.length) {
        changes = [];
        responses = [];
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveChannel = () => {
  if (!changes.includes('channelSelect')) return;
  const value = document.getElementById('channelSelect').value;

  fetch('/api/setting/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guildId,
      userId,
      value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.querySelector('.saveChanges').classList.remove('active');
        return newMessage(data.error);
      }
      if (data.saved && !responses.includes('channelSelect')) responses.push('channelSelect');
      if (changes.length == responses.length) {
        changes = [];
        responses = [];
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveChanges = () => {
  saveEnabled();
  saveChannel();
};

document.querySelectorAll('.inpset').forEach((elem) => {
  try {
    elem.addEventListener('change', (e) => {
      document.querySelector('.saveChanges').classList.add('active');
      if (!changes.includes(e.target.id)) changes.push(e.target.id);
    });
  } catch (e) {}

  try {
    elem.addEventListener('keydown', (e) => {
      document.querySelector('.saveChanges').classList.add('active');
      if (!changes.includes(e.target.id)) changes.push(e.target.id);
    });
  } catch (e) {}
});
