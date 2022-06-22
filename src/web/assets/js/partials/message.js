let messages = [];
const newMessage = (message) => {
  if (document.querySelector('.message').classList.contains('active')) return messages.push(message);
  document.querySelector('.message .text').innerHTML = message;
  document.querySelector('.message').classList.add('active');
  document.querySelector('.message').style = 'animation: msgIn .5s';

  setTimeout(() => {
    document.querySelector('.message').style = 'animation: msgOut .5s';
    setTimeout(() => {
      document.querySelector('.message').classList.remove('active');
      if (messages.length > 0) {
        newMessage(messages[0]);
        messages.splice(0, 1);
      }
    }, 400);
  }, 5000);
};

const closeMessage = () => {
  document.querySelector('.message').style = 'animation: msgOut .5s';
  setTimeout(() => {
    document.querySelector('.message').classList.remove('active');
    if (messages.length > 0) {
      newMessage(messages[0]);
      messages.splice(0, 1);
    }
  }, 400);
};
