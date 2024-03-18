let fields = [
    null, // 0
    null, // 1
    null, // 2
    null, // 3
    null, // 4
    null, // 5
    null, // 6
    null, // 7
    null  // 8
];

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontale Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikale Reihen
    [0, 4, 8], [2, 4, 6] // diagonale Reihen
];

let currentPlayer = 'circle'; // Start mit 'circle'


function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content');

    // Generate table HTML
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    // Set table HTML to contentDiv
    contentDiv.innerHTML = tableHtml;
}

function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    render();
}

function handleClick(cell, index) {
    if (fields[index] === null) { // Überprüft, ob das Feld, auf das geklickt wurde, leer ist. Wenn das Feld leer ist, wird der folgende Code ausgeführt.
        fields[index] = currentPlayer; // Weist dem Feld im Array fields den Wert des aktuellen Spielers (currentPlayer) zu. Dadurch wird festgelegt, welches Symbol (Kreis oder Kreuz) in diesem Feld platziert wird.
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG(); // Ändert den HTML-Inhalt der Zelle (cell), auf die geklickt wurde, abhängig vom aktuellen Spieler (currentPlayer). Wenn der aktuelle Spieler "circle" ist, wird generateCircleSVG() aufgerufen. Ansonsten wird generateCrossSVG() aufgerufen.
        cell.onclick = null; // Entfernt das onclick-Ereignis von der Zelle, auf die geklickt wurde. Dadurch wird verhindert, dass der Benutzer erneut auf dieselbe Zelle klicken kann.
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle'; // Wenn currentPlayer === 'circle', wirs currentPlayer zu 'cross' geändert, ansonsten zu 'circle'. Ändert den aktuellen Spieler (currentPlayer) abwechselnd zwischen "circle" und "cross". 

        if (isGameFinished()) { // Überprüft, ob das Spiel beendet ist, nachdem ein Zug gemacht wurde. Wenn das Spiel beendet ist, wird der Code innerhalb dieser Bedingung ausgeführt.
            const winCombination = getWinningCombination(); // Ruft die Funktion getWinningCombination() auf, um die Gewinnkombination zu erhalten. Diese Gewinnkombination besteht aus den Indexen der Felder, die zum Sieg geführt haben.
            drawWinningLine(winCombination); // Ruft die Funktion drawWinningLine() auf, um die Linie zu zeichnen, die die Gewinnkombination darstellt. Die Linie wird gezeichnet, wenn es eine Gewinnkombination gibt und das Spiel beendet ist.
        }
    }
}

function isGameFinished() { // Diese Funktion überprüft, ob das Spiel beendet ist, indem sie zwei Bedingungen überprüft: entweder ob alle Felder belegt sind oder ob eine Gewinnkombination vorhanden ist.
    return fields.every((field) => field !== null) || getWinningCombination() !== null; // besteht aus zwei Teilen, die durch ODER ( || ) verknüpft sind.
} 
// 1. Die Methode every() wird auf dem Array fields angewendet, um zu prüfen, ob für jedes Element im Array die Bedingung field !== null erfüllt ist. (Überprüft, ob alle Felder im Array fields NICHT null sind.) Wenn diese Bedingung wahr ist, sind alle Felder belegt und das Spiel ist beendet.
// 2. getWinningCombination() !== null: Überprüft, ob eine Gewinnkombination vorhanden ist, indem die Funktion getWinningCombination() aufgerufen wird. Wenn eine Gewinnkombination gefunden wird (d. h. wenn die Funktion getWinningCombination() nicht null zurückgibt), ist das Spiel ebenfalls beendet.
// Das logische ODER (||) stellt sicher, dass die Funktion isGameFinished() true zurückgibt, wenn mindestens eine dieser Bedingungen erfüllt ist.


function getWinningCombination() {
    for (let i = 0; i < winningCombinations.length; i++) { // Schleife, die jedes Element in winningCombinations durchläuft
        const [a, b, c] = winningCombinations[i]; // z.B. [0, 1, 2]. Hier werden die Werte der aktuellen Gewinnkombination aus winningCombinations in die Variablen a, b und c destrukturiert. Diese Variablen repräsentieren die Indizes der Felder im Tic Tac Toe-Feld, die in dieser Gewinnkombination liegen. 
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) { // Werte der Felder an den Indizes a, b und c: Hier wird überprüft, ob alle Felder in der aktuellen Gewinnkombination den gleichen Wert haben und NICHT(!) null sind. Wenn dies der Fall ist, bedeutet das, dass ein Spieler diese Kombination gewonnen hat.
            return winningCombinations[i]; // Wenn eine Gewinnkombination gefunden wird, wird diese zurückgegeben
        }
    }
    return null; // Wenn keine Gewinnkombination gefunden wird, wird null zurückgegeben
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;
  
    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
  
    const contentRect = document.getElementById('content').getBoundingClientRect();
  
    const lineLength = Math.sqrt(
      Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
  
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
  }

function generateCircleSVG() {
    const color = '#00B0EF';
    const lineWidth = 10; // Linienstärke des Kreises
    const diameter = 90; // Durchmesser des Kreises
    const width = diameter + lineWidth; // Breite des SVG-Elements
    const height = diameter + lineWidth; // Höhe des SVG-Elements

    // SVG-Element erstellen
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                    <circle cx="${width / 2}" cy="${height / 2}" r="${diameter / 2}" fill="none" stroke="${color}" stroke-width="${lineWidth}" stroke-dasharray="440">
                        <animate attributeName="stroke-dashoffset" from="440" to="0" dur="0.5s" fill="freeze" />
                    </circle>
                </svg>`;

    return svg;
}

function generateCrossSVG() {
    const color = '#FFC000';
    const width = 90;
    const height = 90;
    const lineWidth = 10;

    // SVG-Element erstellen
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                    <line x1="${lineWidth / 2}" y1="${lineWidth / 2}" x2="${width - lineWidth / 2}" y2="${height - lineWidth / 2}" stroke="${color}" stroke-width="${lineWidth}" stroke-dasharray="0 220">
                        <animate attributeName="stroke-dasharray" from="0 220" to="220 0" dur="0.5s" fill="freeze" />
                    </line>
                    <line x1="${width - lineWidth / 2}" y1="${lineWidth / 2}" x2="${lineWidth / 2}" y2="${height - lineWidth / 2}" stroke="${color}" stroke-width="${lineWidth}" stroke-dasharray="0 220">
                        <animate attributeName="stroke-dasharray" from="0 220" to="220 0" dur="0.5s" fill="freeze" />
                    </line>
                </svg>`;

    return svg;
}