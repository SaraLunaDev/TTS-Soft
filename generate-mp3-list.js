const fs = require('fs');
const path = require('path');

// Rutas importantes
const mp3Folder = path.join(__dirname, 'mp3'); // Carpeta donde están los MP3
const outputFile = path.join(__dirname, 'mp3-list.json'); // Archivo de salida

// Leer archivos MP3 y generar el archivo JSON
fs.readdir(mp3Folder, (err, files) => {
    if (err) {
        console.error('Error leyendo la carpeta MP3:', err);
        return;
    }

    // Filtrar solo los archivos .mp3
    const mp3Files = files.filter(file => file.endsWith('.mp3'));

    // Guardar la lista de MP3 en el archivo JSON
    fs.writeFileSync(outputFile, JSON.stringify(mp3Files, null, 2));
    console.log(`Archivo ${outputFile} generado con éxito con ${mp3Files.length} archivos MP3.`);
});
