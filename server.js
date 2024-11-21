const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos estáticos de la carpeta "public"
app.use(express.static('public'));

// Servir la carpeta mp3 como estática
app.use('/mp3', express.static(path.join(__dirname, 'mp3')));

// Endpoint para obtener los archivos MP3
app.get('/api/mp3-files', (req, res) => {
    const mp3Folder = path.join(__dirname, 'mp3');
    
    // Leer archivos de la carpeta
    fs.readdir(mp3Folder, (err, files) => {
        if (err) {
            console.error('Error leyendo la carpeta:', err);
            res.status(500).send('Error al leer los archivos');
            return;
        }

        // Filtrar solo archivos .mp3
        const mp3Files = files.filter(file => file.endsWith('.mp3'));
        res.json(mp3Files);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
