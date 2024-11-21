const voiceContainer = document.getElementById('voiceContainer');
const soundContainer = document.getElementById('soundContainer');
let currentAudio = null;

const voicesDirectory = './static/voices/';
const soundsDirectory = './static/sounds/';

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeIcon.src = './static/resources/sun.png';
    themeIcon.alt = 'Modo Oscuro';
} else {
    document.body.classList.add('dark-mode');
    themeIcon.src = './static/resources/moon.png';
    themeIcon.alt = 'Modo Claro';
    localStorage.setItem('theme', 'dark');
}

function loadButtons(container, directory, fileList, type) {
    fileList.forEach(file => {
        const button = document.createElement('button');
        const fileName = file.replace('.mp3', '');
        
        // Asigna la clase `button-30`
        button.className = 'button-30';
        button.role = 'button'; // Añade el atributo role
        button.textContent = fileName; // Texto del botón

        button.addEventListener('click', () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            const audio = new Audio(`${directory}${file}`);
            audio.play();
            currentAudio = audio;

            const clipboardText = type === 'voice' ? `(${fileName}:)` : `(${fileName})`;

            navigator.clipboard.writeText(clipboardText).then(() => {
                const notification = document.createElement('div');
                notification.textContent = `Texto copiado ${clipboardText}`;
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.right = '20px';
                notification.style.padding = '10px';
                notification.style.backgroundColor = '#444';
                notification.style.color = '#fff';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '1000';
                document.body.appendChild(notification);

                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar al portapapeles:', err);
            });

            audio.addEventListener('ended', () => {
                currentAudio = null;
            });
        });

        container.appendChild(button);
    });
}

fetch('./static/voices-list.json')
    .then(response => response.json())
    .then(voiceFiles => {
        loadButtons(voiceContainer, voicesDirectory, voiceFiles, 'voice');
    })
    .catch(error => console.error('Error al cargar las voces:', error));

fetch('./static/sounds-list.json')
    .then(response => response.json())
    .then(soundFiles => {
        loadButtons(soundContainer, soundsDirectory, soundFiles, 'sound');
    })
    .catch(error => console.error('Error al cargar los sonidos:', error));

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.src = './static/resources/moon.png';
        themeIcon.alt = 'Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.src = './static/resources/sun.png';
        themeIcon.alt = 'Modo Oscuro';
        localStorage.setItem('theme', 'light');
    }
});
