// Contenedores
const voiceContainer = document.getElementById('voiceContainer');
const soundContainer = document.getElementById('soundContainer');

// Carpetas y archivos
const voicesDirectory = './static/voices/';
const soundsDirectory = './static/sounds/';

// Función para cargar archivos y crear botones dinámicamente
function loadButtons(container, directory, fileList) {
    fileList.forEach(file => {
        const button = document.createElement('button');
        const fileName = file.replace('.mp3', '');
        button.textContent = fileName;

        button.addEventListener('click', () => {
            const audio = new Audio(`${directory}${file}`);
            audio.play();
        });

        container.appendChild(button);
    });
}

// Cargar botones de voces
fetch('./static/voices-list.json')
    .then(response => response.json())
    .then(voiceFiles => {
        loadButtons(voiceContainer, voicesDirectory, voiceFiles);
    })
    .catch(error => console.error('Error al cargar las voces:', error));

// Cargar botones de sonidos
fetch('./static/sounds-list.json')
    .then(response => response.json())
    .then(soundFiles => {
        loadButtons(soundContainer, soundsDirectory, soundFiles);
    })
    .catch(error => console.error('Error al cargar los sonidos:', error));
