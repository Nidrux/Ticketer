try {
    document.querySelector('.dropdown-toggle').addEventListener('click', () => {
        let dropdown = document.querySelector('.dropdown-content')
        if(dropdown.classList.contains('active')) {
            dropdown.style = 'animation: dropout .5s';
            setTimeout(() => {
                dropdown.classList.remove('active')
            }, 450)
        } else {
            dropdown.classList.add('active')
            dropdown.style = 'animation: dropin .5s';
        }
    });
} catch(e) {};

try {
    document.querySelector('.icon').addEventListener('click', () => {
        if(document.body.classList.contains('hd')) {
            document.querySelector('.nav-window').style = 'animation: navout .3s;';
            setTimeout(() => {
                document.body.classList.remove('hd')
            }, 200)
        } else {
            document.body.classList.add('hd')
            document.querySelector('.nav-window').style = 'animation: navin .3s;';
        }
    })
} catch(e) {};
