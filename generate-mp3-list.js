const fs = require('fs');
const path = require('path');

// Rutas importantes
const staticFolder = path.join(__dirname, 'static');
const soundsFolder = path.join(staticFolder, 'sounds');
const voicesFolder = path.join(staticFolder, 'voices');

const soundsOutput = path.join(staticFolder, 'sounds-list.json');
const voicesOutput = path.join(staticFolder, 'voices-list.json');

// Generar lista de sonidos
fs.readdir(soundsFolder, (err, files) => {
    if (err) {
        console.error('Error leyendo la carpeta de sonidos:', err);
        return;
    }

    const soundFiles = files.filter(file => file.endsWith('.mp3'));
    fs.writeFileSync(soundsOutput, JSON.stringify(soundFiles, null, 2));
    console.log(`Archivo ${soundsOutput} generado con éxito con ${soundFiles.length} archivos.`);
});

// Generar lista de voces
fs.readdir(voicesFolder, (err, files) => {
    if (err) {
        console.error('Error leyendo la carpeta de voces:', err);
        return;
    }

    const voiceFiles = files.filter(file => file.endsWith('.mp3'));
    fs.writeFileSync(voicesOutput, JSON.stringify(voiceFiles, null, 2));
    console.log(`Archivo ${voicesOutput} generado con éxito con ${voiceFiles.length} archivos.`);
});
