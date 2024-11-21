const fs = require('fs');
const path = require('path');

const mp3Folder = path.join(__dirname, 'mp3');
const outputFile = path.join(__dirname, 'public', 'mp3-list.json');

fs.readdir(mp3Folder, (err, files) => {
    if (err) {
        console.error('Error leyendo la carpeta:', err);
        return;
    }

    const mp3Files = files.filter(file => file.endsWith('.mp3'));
    fs.writeFileSync(outputFile, JSON.stringify(mp3Files, null, 2));
    console.log('Archivo mp3-list.json generado con éxito');
});
