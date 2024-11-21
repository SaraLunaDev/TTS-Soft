const buttonContainer = document.getElementById('buttonContainer');

// Obtener la lista de archivos MP3 desde el archivo JSON
fetch('./mp3-list.json')
    .then(response => response.json())
    .then(mp3Files => {
        mp3Files.forEach(file => {
            const button = document.createElement('button');
            const fileName = file.replace('.mp3', '');
            button.textContent = fileName;

            // Configurar botón para reproducir el audio
            button.addEventListener('click', () => {
                const audio = new Audio(`./mp3/${file}`);
                audio.play();
            });

            buttonContainer.appendChild(button);
        });
    })
    .catch(error => console.error('Error al cargar los archivos:', error));
