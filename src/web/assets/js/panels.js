/* eslint-disable no-undef */
const createPanel = () => {
  let newLength = 0;
  document.querySelectorAll('.id').forEach((item) => { if (item.innerText == 'new-panel') newLength += 1; });
  if (newLength > 0) return newMessage('There is already a panel with this id.');
  const panel = document.createElement('div');
  panel.classList.add('item');
  panel.setAttribute('onclick', `window.location.href=/dashboard/${guildId}/settings/panels/new-panel`);
  panel.innerHTML = `
  <h2 class="name">New panel</h2>
  <p class="id">new-panel</p>
  `;

  document.querySelector('.list').appendChild(panel);
  document.querySelector('.saveChanges').classList.add('active');
};

const savePanels = () => {
  const panels = [];
  document.querySelectorAll('.content .item').forEach((item) => {
    const name = item.querySelector('.name').innerText;
    const id = item.querySelector('.id').innerText;

    if (panels.findIndex((p) => p.id == id) !== -1) return;
    panels.push({ name, id });
  });

  if (panels.length !== document.querySelectorAll('.content .item').length) return;

  fetch('/api/setting/panels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guildId,
      userId,
      value: panels,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.querySelector('.saveChanges').classList.remove('active');
        return newMessage(data.error);
      }
      if (data.saved) {
        newMessage('The settings have been saved.');
        document.querySelector('.saveChanges').classList.remove('active');
      }
    });
};

const saveChanges = () => {
  savePanels();
};
