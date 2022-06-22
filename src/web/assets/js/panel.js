/* eslint-disable no-undef */
let changes = [];
let responses = [];

const savePanel = () => {
  if (!changes.includes('setting')) return;
  const value = {
    id: String(document.getElementById('idInput').value).toLowerCase(),
    name: document.getElementById('nameInput').value,
    prefix: document.getElementById('prefixInput').value,
    description: document.getElementById('messageInput').value,
    category: document.getElementById('categorySelect').value,
    channel: document.getElementById('channelSelect').value,
  };

  fetch('/api/setting/panel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guildId,
      userId,
      panelId,
      value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.querySelector('.saveChanges').classList.remove('active');
        return newMessage(data.error);
      }
      if (data.saved && !responses.includes('setting')) responses.push('setting');
      if (responses.length == changes.length) {
        responses = [];
        panelId = value.id.replaceAll(' ', '-');
        newMessage('The settings have been saved.');
        window.history.pushState('Page', 'Ticketer - Easily manage users\' concerns', `/dashboard/${guildId}/settings/panels/${panelId}`);
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const createReason = () => {
  if (document.querySelectorAll('.setting .items .item').length >= 10) return newMessage('You have reached the maximum of options.');
  const reason = document.createElement('div');
  reason.classList.add('item');
  reason.id = document.querySelectorAll('.setting .items .item').length;
  let roleList = '';
  roles.forEach((role) => {
    roleList += `<option  class="option" value="${role.id}">${role.name}</option>`;
  });

  reason.innerHTML = `
    <input class="textarea inpset name" placeholder="Name"  maxlength="40">
    <input class="textarea inpset description" placeholder="Description" maxlength="50">
    <select name="whishlist" class="textarea select inpset role">
    <option value="none" class="option" selected>- None -</option>
    ${roleList}
    </select>
    <a class="icon" onclick="deleteReason('${document.querySelectorAll('.setting .items .item').length}')"><i class='bx bx-x'></i></a>
  `;

  document.querySelector('.setting .items').appendChild(reason);
  reason.querySelectorAll('.inpset').forEach((elem) => {
    try {
      elem.addEventListener('change', (e) => {
        if (elem.id && !changes.includes('setting')) changes.push('setting');
        if (!elem.id && !changes.includes('options')) changes.push('options');
        document.querySelector('.saveChanges').classList.add('active');
      });
    } catch (e) {}

    try {
      elem.addEventListener('keydown', (e) => {
        if (elem.id && !changes.includes('setting')) changes.push('setting');
        if (!elem.id && !changes.includes('options')) changes.push('options');
        document.querySelector('.saveChanges').classList.add('active');
      });
    } catch (e) {}
  });
};

const deleteReason = (id) => {
  if (document.querySelectorAll('.setting .items .item').length <= 1) return newMessage('You cannot delete the last option.');
  document.getElementById(id).remove();
};

const saveOptions = () => {
  if (!changes.includes('options')) return;
  const options = [];
  let errored = false;
  document.querySelectorAll('.setting .items .item').forEach((item) => {
    if (options.findIndex((o) => o.name == item.querySelector('.name').value) !== -1) return item.classList.add('errored');
    if (!item.querySelector('.name').value || !item.querySelector('.description').value) {
      item.classList.add('errored');
      return errored = true;
    }
    options.push({
      id: item.id,
      name: item.querySelector('.name').value,
      description: item.querySelector('.description').value,
      permissions: item.querySelector('.role').value,
    });
  });

  if (errored) return newMessage('Invalid options values provided.');

  fetch('/api/setting/panel/options', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guildId,
      userId,
      panelId,
      value: options,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.querySelector('.saveChanges').classList.remove('active');
        return newMessage(data.error);
      }
      if (data.saved && !responses.includes('reasonArray')) responses.push('reasonArray');
      if (responses.length == changes.length) {
        responses = [];
        newMessage('The options have been saved.');
        window.history.pushState('Page', 'Ticketer - Easily manage users\' concerns', `/dashboard/${guildId}/settings/panels/${panelId}`);
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveChanges = () => {
  savePanel();
  saveOptions();
};

document.querySelectorAll('.inpset').forEach((elem) => {
  try {
    elem.addEventListener('change', (e) => {
      if (elem.id && !changes.includes('setting')) changes.push('setting');
      if (!elem.id && !changes.includes('options')) changes.push('options');
      document.querySelector('.saveChanges').classList.add('active');
    });
  } catch (e) {}

  try {
    elem.addEventListener('keydown', (e) => {
      if (elem.id && !changes.includes('setting')) changes.push('setting');
      if (!elem.id && !changes.includes('options')) changes.push('options');
      document.querySelector('.saveChanges').classList.add('active');
    });
  } catch (e) {}
});

document.querySelectorAll('.role-script').forEach((elem) => elem.remove());
