// Contenedores
const voiceContainer = document.getElementById('voiceContainer');
const soundContainer = document.getElementById('soundContainer');

// Carpetas y archivos
const voicesDirectory = './static/voices/';
const soundsDirectory = './static/sounds/';

// Referencias al botón y al icono
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Restaurar el tema guardado o establecer el predeterminado
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeIcon.src = './static/resources/sun.png'; // Cambia al sol
    themeIcon.alt = 'Modo Oscuro';
} else {
    // Si no hay tema guardado o el tema es "dark", activa el modo oscuro
    document.body.classList.add('dark-mode');
    themeIcon.src = './static/resources/moon.png'; // Cambia a la luna
    themeIcon.alt = 'Modo Claro';
    localStorage.setItem('theme', 'dark'); // Guarda el tema oscuro como predeterminado
}

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

// Alternar entre modos y cambiar el icono
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.src = './static/resources/moon.png'; // Cambia a la luna
        themeIcon.alt = 'Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.src = './static/resources/sun.png'; // Cambia al sol
        themeIcon.alt = 'Modo Oscuro';
        localStorage.setItem('theme', 'light');
    }
});