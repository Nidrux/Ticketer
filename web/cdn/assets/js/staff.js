/* eslint-disable no-undef */
let amount = [];
let names = [];

staff.forEach(async (staff) => {
  if (!names.includes(staff.user.tag)) {
    names.push(staff.user.tag);
    amount.push(staff.tickets);
  }
});

const data = {
  labels: names,
  datasets: [
    {
      label: 'Tickets',
      data: amount,
      fill: false,
      borderColor: 'rgb(255, 255, 255)',
      tension: 0,
      backgroundColor: '#5865F2',
    },
  ],
};

const config = {
  type: 'bar',
  data,
  options: {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            beginAtZero: true,
            userCallback(label, index, labels) {
              if (Math.floor(label) === label) {
                return label;
              }
            },
          },
          gridLines: {
            color: 'rgba(255, 255, 255, .1)',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: 'rgba(255, 255, 255, .1)',
          },
        },
      ],
    },
  },
};

const ticketChart = new Chart(document.getElementById('tickets'), config);
document.querySelectorAll('.ticket-script').forEach((elem) => elem.remove())
