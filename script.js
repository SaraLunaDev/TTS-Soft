const voiceContainer = document.getElementById('voiceContainer');
const soundContainer = document.getElementById('soundContainer');
let currentAudio = null;

const voicesDirectory = './static/voices/';
const soundsDirectory = './static/sounds/';

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('theme');

const textEditor = document.getElementById('textEditor');
let voices = [];
let sounds = [];

const progressBar = document.getElementById('progressBar');

const copyButton = document.getElementById('copyButton');

// Lista de API keys
const apiKeys = [
    "sk_c573750d244134bbd9d75e2dd6e7ada6b37292b4a515dab5",
    "sk_340708e3827dea1f0cd680f9e11573817dd8bcd52f7fa124"
];

async function updateCreditsDisplay() {
    const percentage = await fetchCombinedApiCredits(apiKeys);
    const creditsPercentageElement = document.getElementById("creditsPercentage");

    if (percentage !== null) {
        creditsPercentageElement.textContent = `${percentage}`;
        updateCreditsColor(percentage); // Actualiza el color según el porcentaje
    } else {
        creditsPercentageElement.textContent = "Error al cargar";
    }
}

// Cambiar el color según el porcentaje
function updateCreditsColor(percentage) {
    const creditsPercentageElement = document.getElementById("creditsPercentage");
    creditsPercentageElement.classList.remove("low", "medium");

    if (percentage < 25) {
        creditsPercentageElement.classList.add("low");
    } else if (percentage < 50) {
        creditsPercentageElement.classList.add("medium");
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", updateCreditsDisplay);


// Función para copiar el texto del editor al portapapeles
copyButton.addEventListener('click', () => {
    const text = textEditor.innerText; // Obtener el texto del editor

    navigator.clipboard.writeText(text).then(() => {
        // Mostrar una notificación de éxito
        const notification = document.createElement('div');
        notification.textContent = 'Texto copiado al portapapeles';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#444';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);

        // Eliminar la notificación después de 2 segundos
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar el texto:', err);
    });
});

// Configuración: Límite de caracteres
let characterLimit = 500; // Puedes modificar este valor

// Función para actualizar la barra de progreso
function updateProgressBar() {
    const textLength = textEditor.innerText.length; // Obtener longitud del texto actual
    const progressPercentage = Math.min((textLength / characterLimit) * 100, 100); // Calcular porcentaje
    progressBar.style.width = `${progressPercentage}%`;
}

// Función actualizada para cargar datos desde JSON
Promise.all([
    fetch('./static/voices-list.json').then(res => res.json()),
    fetch('./static/sounds-list.json').then(res => res.json())
]).then(([voiceData, soundData]) => {
    voices = voiceData.map(v => ({ id: v.id.toString(), name: v.name }));
    sounds = soundData.map(s => ({ id: s.id.toString(), name: s.name }));
}).catch(error => console.error('Error cargando datos:', error));

// Función para verificar si una voz o sonido es válido
function isVoiceValid(identifier) {
    return voices.some(v => v.id === identifier || v.name === identifier);
}

function isSoundValid(identifier) {
    return sounds.some(s => s.id === identifier || s.name === identifier);
}

// Detectar cambios en el contenido editable
textEditor.addEventListener('input', () => {
    let text = textEditor.innerText;

    // Limitar caracteres al pegar o escribir
    if (text.length > characterLimit) {
        text = text.substring(0, characterLimit); // Truncar al límite permitido
        textEditor.innerText = text; // Reemplazar con texto truncado
        placeCaretAtPosition(textEditor, characterLimit); // Mover el cursor al final
    }

    updateProgressBar(); // Actualizar la barra de progreso

    const cursorPosition = saveCursorPosition(textEditor); // Guardar la posición del cursor

    const formattedText = text.replace(
        /\(([^():]+):\)|\(([^():]+)\)/g,
        (match, rosaMatch, azulMatch) => {
            const rosaValid = rosaMatch && isVoiceValid(rosaMatch);
            const azulValid = azulMatch && isSoundValid(azulMatch);

            if (rosaValid) {
                return `<span class="rosa">(${rosaMatch}:)</span>`;
            } else if (azulValid) {
                return `<span class="azul">(${azulMatch})</span>`;
            } else {
                return match; // No válido, no se colorea
            }
        }
    );

    updateEditorWithStyledText(formattedText, cursorPosition); // Actualizar contenido con estilos
});

// Función para guardar la posición del cursor
function saveCursorPosition(element) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

// Función para restaurar la posición del cursor
function placeCaretAtPosition(element, position) {
    const range = document.createRange();
    const selection = window.getSelection();

    let currentNode = element;
    let charCount = 0;

    while (currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            const nextCharCount = charCount + currentNode.length;
            if (position <= nextCharCount) {
                range.setStart(currentNode, position - charCount);
                range.collapse(true);
                break;
            }
            charCount = nextCharCount;
        }
        currentNode = getNextNode(currentNode, element);
    }

    selection.removeAllRanges();
    selection.addRange(range);
}

function getNextNode(node, container) {
    if (node.firstChild) return node.firstChild;
    while (node) {
        if (node.nextSibling) return node.nextSibling;
        node = node.parentNode;
        if (node === container) break;
    }
    return null;
}

// Actualizar el contenido del div con estilos aplicados
function updateEditorWithStyledText(htmlContent, cursorPosition) {
    textEditor.innerHTML = htmlContent; // Reemplazar contenido
    placeCaretAtPosition(textEditor, cursorPosition); // Restaurar posición del cursor
}

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

async function fetchCombinedApiCredits(apiKeys) {
    const url = "https://api.elevenlabs.io/v1/user/subscription";
    let totalUsed = 0;
    let totalLimit = 0;

    for (const apiKey of apiKeys) {
        const headers = { "xi-api-key": apiKey };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`Error al obtener los créditos para la API key: ${apiKey}`);
            }
            const data = await response.json();
            totalUsed += data.character_count || 0;
            totalLimit += data.character_limit || 0;
        } catch (error) {
            console.error(`Error con la API key ${apiKey}:`, error);
            continue; // Continúa con la siguiente clave en caso de error
        }
    }

    if (totalLimit > 0) {
        const availablePercentage = 100 - (totalUsed / totalLimit) * 100;
        return availablePercentage.toFixed(2); // Redondeado a dos decimales
    }

    return null; // Devuelve null si no hay datos válidos
}

