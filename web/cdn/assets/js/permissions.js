/* eslint-disable no-undef */
let changes = [];

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
      if (data.saved) window.location.reload();
    });
};

const saveReason = () => {
  if (!changes.includes('reasonSelect')) return;
  let reasons = [];

  document.querySelectorAll('.tableContent tr').forEach((element) => {
    const reason = {
      value: element.id,
      permissions: element.querySelector('.reasonSelect').value,
    };

    reasons.push(reason);
  });

  if (reasons.length < document.querySelectorAll('.tableContent tr').length) return;

  fetch('/api/setting/permissions/reasons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guildId,
      userId,
      value: reasons,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload();
    });
};

const saveChanges = () => {
  saveStaff();
  saveReason();
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
