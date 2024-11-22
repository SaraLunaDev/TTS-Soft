const fs = require('fs');
const path = require('path');

const staticFolder = path.join(__dirname, 'static');
const soundsFolder = path.join(staticFolder, 'sounds');
const voicesFolder = path.join(staticFolder, 'voices');

const soundsOutput = path.join(staticFolder, 'sounds-list.json');
const voicesOutput = path.join(staticFolder, 'voices-list.json');

function processFiles(folder, output, type) {
    fs.readdir(folder, (err, files) => {
        if (err) {
            console.error(`Error leyendo la carpeta de ${type}:`, err);
            return;
        }

        const processedFiles = files
            .filter(file => file.endsWith('.mp3'))
            .map(file => {
                const [id, ...nameParts] = file.replace('.mp3', '').split('_');
                if (!id || isNaN(id)) {
                    console.warn(`El archivo '${file}' no sigue el formato <ID>_<NOMBRE>.mp3 y será ignorado.`);
                    return null;
                }
                return {
                    id: parseInt(id, 10),
                    name: nameParts.join('_'),
                    file: file
                };
            })
            .filter(item => item !== null);

        fs.writeFileSync(output, JSON.stringify(processedFiles, null, 2));
        console.log(`Archivo ${output} generado con éxito con ${processedFiles.length} archivos.`);
    });
}

// Procesar sonidos
processFiles(soundsFolder, soundsOutput, 'sonidos');

// Procesar voces
processFiles(voicesFolder, voicesOutput, 'voces');
