/* eslint-disable no-undef */
let changes = [];
let responses = [];

const saveNickname = () => {
  if (!changes.includes('nicknameInput')) return;
  const value = document.getElementById('nicknameInput').value;

  fetch('/api/setting/nickname', {
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
      if (data.saved && !responses.includes('nicknameInput')) responses.push('nicknameInput');
      if (changes.length == responses.length) {
        changes = [];
        responses = [];
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveMaxtickets = () => {
  if (!changes.includes('maxticketsInput')) return;
  const value = document.getElementById('maxticketsInput').value;

  fetch('/api/setting/maxtickets', {
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
      if (data.saved && !responses.includes('maxticketsInput')) responses.push('maxticketsInput');
      if (changes.length == responses.length) {
        changes = [];
        responses = [];
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveFeedback = () => {
  if (!changes.includes('feedbackType')) return;
  const value = document.querySelector('#feedbackType').classList.contains('active');

  fetch('/api/setting/feedback', {
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
      if (data.saved && !responses.includes('feedbackType')) responses.push('feedbackType');
      if (changes.length == responses.length) {
        changes = [];
        responses = [];
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveRaid = () => {
  if (!changes.includes('raidType')) return;
  const value = document.querySelector('#raidType').classList.contains('active');

  fetch('/api/setting/raid', {
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
      if (data.saved && !responses.includes('raidType')) responses.push('raidType');
      if (changes.length == responses.length) {
        changes = [];
        responses = [];
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveStaff = () => {
  if (!changes.includes('staffSelect')) return;
  const value = document.getElementById('staffSelect').value;

  fetch('/api/setting/permissions/staff', {
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
      if (data.saved && !responses.includes('staffSelect')) responses.push('staffSelect');
      if (changes.length == responses.length) {
        changes = [];
        responses = [];
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveChanges = () => {
  saveMaxtickets();
  saveNickname();
  saveRaid();
  saveStaff();
  saveFeedback();
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

document.querySelector('#raidType').addEventListener('click', (e) => {
  changes.push('raidType');
  document.querySelector('.saveChanges').classList.add('active');
  if (document.querySelector('#raidType').classList.contains('active')) {
    document.querySelector('#raidType').classList.remove('active');
    document.querySelector('#raidType .icon i').classList = 'bx bxs-checkbox';
    document.getElementById('raidType').style = 'animation: settingsOut .5s;';
    setTimeout(() => {
      document.getElementById('raidType').classList.add('inactive');
    }, 400);
  } else {
    document.querySelector('#raidType').classList.add('active');
    setTimeout(() => {
      document.querySelector('#raidType .icon i').classList = 'bx bxs-checkbox-checked';
      document.getElementById('raidType').style = 'animation: settingsIn .5s;';
      document.getElementById('raidType').classList.remove('inactive');
    }, 100);
  }
});

document.querySelector('#feedbackType').addEventListener('click', (e) => {
  changes.push('feedbackType');
  document.querySelector('.saveChanges').classList.add('active');
  if (document.querySelector('#feedbackType').classList.contains('active')) {
    document.querySelector('#feedbackType').classList.remove('active');
    document.querySelector('#feedbackType .icon i').classList = 'bx bxs-checkbox';
    document.getElementById('feedbackType').style = 'animation: settingsOut .5s;';
    setTimeout(() => {
      document.getElementById('feedbackType').classList.add('inactive');
    }, 400);
  } else {
    document.querySelector('#feedbackType').classList.add('active');
    setTimeout(() => {
      document.querySelector('#feedbackType .icon i').classList = 'bx bxs-checkbox-checked';
      document.getElementById('feedbackType').style = 'animation: settingsIn .5s;';
      document.getElementById('feedbackType').classList.remove('inactive');
    }, 100);
  }
});
