/* eslint-disable no-undef */
let changes = [];

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
      if (data.saved) window.location.reload();
    });
};

const saveName = () => {
  if (!changes.includes('channelInput')) return;
  const value = document.getElementById('channelInput').value;

  fetch('/api/setting/name', {
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
      if (data.saved) window.location.reload();
    });
};

const saveChannel = () => {
  if (!changes.includes('channelSelect')) return;
  const value = document.getElementById('channelSelect').value;

  fetch('/api/setting/channel', {
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
      if (data.saved) window.location.reload();
    });
};

const saveCategory = () => {
  if (!changes.includes('categorySelect')) return;
  const value = document.getElementById('categorySelect').value;

  fetch('/api/setting/category', {
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
      if (data.saved) window.location.reload();
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
      if (data.saved) window.location.reload();
    });
};

const saveMessage = () => {
  if (!changes.includes('messageInput')) return;
  const value = String(document.getElementById('messageInput').value.replace(/\r?\n/g, '\\n'));

  fetch('/api/setting/message', {
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
      window.location.reload();
    });
};

const saveChanges = () => {
  saveName();
  saveChannel();
  saveCategory();
  saveMaxtickets();
  saveMessage();
  saveNickname();
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

document.getElementById('messageInput').addEventListener('keydown', (e) => {
  document.getElementById('messageInputChars').innerText = `${400 - e.target.value.length} characters left`;

  setTimeout(() => {
    document.getElementById('messageInputChars').innerText = `${400 - document.getElementById('messageInput').value.length} characters left`;
  }, 1);
});
