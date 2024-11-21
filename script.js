const buttonContainer = document.getElementById('buttonContainer');

// Obtener la lista de archivos MP3 desde el servidor
fetch('/api/mp3-files')
    .then(response => response.json())
    .then(mp3Files => {
        mp3Files.forEach(file => {
            // Crear un botón para cada archivo
            const button = document.createElement('button');
            const fileName = file.replace('.mp3', ''); // Quitar la extensión para mostrar solo el nombre
            button.textContent = fileName;

            // Configurar botón para reproducir el audio
            button.addEventListener('click', () => {
                const audio = new Audio(`/mp3/${file}`); // Ruta completa del archivo
                audio.play(); // Reproducir el archivo
            });

            buttonContainer.appendChild(button); // Añadir el botón al contenedor
        });
    })
    .catch(error => console.error('Error al cargar los archivos:', error));
