document.getElementById('username').textContent = localStorage.getItem('username');

function loadHistory() {
    let historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    let savedHistory = JSON.parse(localStorage.getItem('savedChecklists')) || [];

    savedHistory.forEach((summary, index) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            <textarea readonly>${summary}</textarea>
            <button onclick="copyText(${index})">📋 Copiar</button>
        `;
        historyList.appendChild(listItem);
    });

    if (savedHistory.length > 0) {
        let clearButton = document.createElement('button');
        clearButton.textContent = "🗑️ Limpar Histórico";
        clearButton.onclick = clearHistory;
        historyList.appendChild(clearButton);
    }
}

function copyText(index) {
    let savedHistory = JSON.parse(localStorage.getItem('savedChecklists')) || [];
    navigator.clipboard.writeText(savedHistory[index])
        .then(() => alert("✅ Texto copiado com sucesso!"))
        .catch(err => console.error("Erro ao copiar:", err));
}

function clearHistory() {
    localStorage.removeItem('savedChecklists');
    loadHistory();
}

window.onload = loadHistory;