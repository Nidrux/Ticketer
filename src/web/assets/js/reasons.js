/* eslint-disable no-undef */
const addReason = () => {
  if (Number(reasons) > 10) return;
  const tr = document.createElement('tr');
  tr.classList = 'reason';
  tr.id = Number(reasons);
  tr.innerHTML = `
    <td class="value">${Number(reasons)}</td>
    <td><input type="text" value="" placeholder="Label..." class="input labelInput" maxlength="40"></td>
    <td><input type="text" value="" placeholder="Description..." class="input descInput" maxlength="80"></td>
    <td class="button red" onclick="deleteReason('${Number(reasons)}')"><i class='bx bx-x'></i></td>
    `;

  reasons = String(Number(reasons) + 1);

  document.querySelector('.tableContent').appendChild(tr);
  document.querySelector('.saveChanges').classList.add('active');
};

document.querySelector('.input').addEventListener('keydown', (e) => {
  document.querySelector('.saveChanges').classList.add('active');
});

document.querySelector('.descInput').addEventListener('keydown', (e) => {
  document.querySelector('.saveChanges').classList.add('active');
});

const deleteReason = (id) => {
  if (id == '0') return;
  document.getElementById(id).remove();
  reasons = String(Number(reasons) - 1);

  let reason = 0;
  document.querySelectorAll('.tableContent tr').forEach((element) => {
    element.id = String(reason);
    element.querySelector('.value').innerText = String(reason);
    element.querySelector('.button').setAttribute('onclick', `deleteReason('${reason}')`);
    reason += 1;
  });

  reason = 0;
  document.querySelector('.saveChanges').classList.add('active');
};

const saveReason = () => {
  let reasons = [];

  document.querySelectorAll('.tableContent tr').forEach((element) => {
    if (!element.querySelector('.labelInput').value || !element.querySelector('.descInput').value) return element.classList.add('error');
    const reason = {
      label: element.querySelector('.labelInput').value,
      description: element.querySelector('.descInput').value,
      value: element.id,
      permissions: element.querySelector('.value').id,
    };

    reasons.push(reason);
  });

  if (reasons.length < document.querySelectorAll('.tableContent tr').length) return;

  fetch('/api/setting/reasons', {
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
  saveReason();
};
