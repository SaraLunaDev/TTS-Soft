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

function loadButtons(container, directory, itemList, type) {
    // Ordenar los elementos por ID
    const sortedList = itemList.sort((a, b) => a.id - b.id);

    sortedList.forEach(item => {
        const button = document.createElement('button');
        button.className = 'button-30';
        button.role = 'button';

        // Contenedor para el ID
        const numberSpan = document.createElement('span');
        numberSpan.className = `button-id ${type}-id`; // Clase dinámica según el tipo
        numberSpan.textContent = item.id;

        // Contenedor para el nombre
        const nameSpan = document.createElement('span');
        nameSpan.className = 'button-text';
        nameSpan.textContent = item.name;

        // Añade el ID y el texto al botón
        button.appendChild(numberSpan);
        button.appendChild(nameSpan);

        button.addEventListener('click', () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            const audio = new Audio(`${directory}${item.file}`);
            audio.play();
            currentAudio = audio;

            const clipboardText = type === 'voice' ? `(${item.id}:)` : `(${item.id})`;

            navigator.clipboard.writeText(clipboardText).then(() => {
                const notification = document.createElement('div');
                notification.textContent = `Texto copiado: ${clipboardText}`;
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


// Cargar y generar botones para voces
fetch('./static/voices-list.json')
    .then(response => response.json())
    .then(voiceFiles => {
        loadButtons(voiceContainer, voicesDirectory, voiceFiles, 'voice');
    })
    .catch(error => console.error('Error al cargar las voces:', error));

// Cargar y generar botones para sonidos
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
