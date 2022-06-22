/* eslint-disable no-restricted-globals */
document.querySelectorAll('.command').forEach((elem) => {
  elem.addEventListener('click', (e) => {
    document.querySelectorAll('.command').forEach((e1) => {
      let i1 = e1.querySelector('.info');
      if (i1.classList.contains('active')) {
        i1.style = 'animation: heightOut .1s ease-in-out;';
        setTimeout(() => {
          i1.classList.remove('active');
        }, 75);
      }
    });

    let info = elem.querySelector('.info');

    if (info.classList.contains('active')) {
      info.style = 'animation: heightOut .1s ease-in-out;';
      setTimeout(() => {
        info.classList.remove('active');
      }, 75);
    } else {
      info.style = 'animation: heightIn .1s ease-in-out;';
      info.classList.add('active');
    }
  });
});

const colapseAll = () => {
  document.querySelectorAll('.command').forEach((elem) => {
    let info = elem.querySelector('.info');

    info.style = 'animation: heightIn .1s ease-in-out;';
    info.classList.add('active');
  });
};

if (name !== 'none') {
  const elem = document.getElementById(`${name.replace('/', '')}`);
  if (elem) {
    document.querySelectorAll('.command').forEach((e1) => {
      let i1 = e1.querySelector('.info');
      if (i1.classList.contains('active')) {
        i1.style = 'animation: heightOut .1s ease-in-out;';
        setTimeout(() => {
          i1.classList.remove('active');
        }, 75);
      }
    });

    let info = elem.querySelector('.info');
    info.style = 'animation: heightIn .1s ease-in-out;';
    info.classList.add('active');
  }
}
