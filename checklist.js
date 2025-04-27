const checklistsData = {
    checklist1: [
        { titulo: "Chave fixa 8/9 x 4un", imagem: "galery/check1_001.jpeg" },
        { titulo: "Chave Allen com cabo 5/32", imagem: "galery/check1_002.jpeg" },
        { titulo: "Chave canhão 7mm", imagem: "galery/check1_003.jpeg" },
        { titulo: "Chave canhão 3mm", imagem: "galery/check1_004.jpeg" },
        { titulo: "Chave canhão 5 mm", imagem: "galery/check1_005.jpeg" },
        { titulo: "Chave phillips x 2un", imagem: "galery/check1_006.jpeg" },
        { titulo: "Alicate universal", imagem: "galery/check1_007.jpeg" },
        { titulo: "Alicate de bico", imagem: "galery/check1_008.jpeg" },
        { titulo: "Alicate de corte", imagem: "galery/check1_009.jpeg" },
        { titulo: "Martelo de borracha", imagem: "galery/check1_010.jpeg" },
        { titulo: "Estilete", imagem: "galery/check1_011.jpeg" },
        { titulo: "Alicate desencapador de fios", imagem: "galery/check1_012.jpeg" },
        { titulo: "Kit Gedore", imagem: "galery/check1_013.jpeg" },
    ],
    checklist2: [
        { titulo: "Item X", imagem: "imgX.jpg" },
        { titulo: "Item Y", imagem: "imgY.jpg" }
    ]
};

const CheckListNames = [
    {id: "checklist1", name: "🧰 Ferramentas COA"},
]


const params = new URLSearchParams(window.location.search);
const checklistId = params.get('id');
const checklistItems = checklistsData[checklistId] || [];

let currentItemIndex = 0;
let results = {};

document.getElementById('username').textContent = localStorage.getItem('username');

function loadChecklist() {
    let container = document.getElementById('checklistContainer');
    container.innerHTML = '';

    // Adiciona a classe "active-item" ao container
    container.classList.add('active-item');

    if (currentItemIndex < checklistItems.length) {
        let item = checklistItems[currentItemIndex];
        container.innerHTML = `
            <h2>${item.titulo}</h2>
            <img src="${item.imagem}" alt="${item.titulo}" class="img_check">
            <button onclick="evaluateItem(true)">Conforme</button>
            <button onclick="evaluateItem(false)">Não Conforme</button>
            <textarea id="observation" placeholder="Observação (opcional)"></textarea>
            <button onclick="previousItem()">Voltar</button>
        `;
    } else {
        generateSummary();
    }
}

function updateProgressBar() {
    let progressPercent = (currentItemIndex / checklistItems.length) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
}



function evaluateItem(status) {
    const observationText = document.getElementById('observation').value.trim();
    results[currentItemIndex] = {
        titulo: checklistItems[currentItemIndex].titulo,
        conforme: status,
        observacao: observationText
    };
    currentItemIndex++;
    loadChecklist();
    updateProgressBar();
    
}

function previousItem() {
    if (currentItemIndex > 0) {
        currentItemIndex--;
        loadChecklist();
        updateProgressBar();
    }
}

document.getElementById('copySummary').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('summary').value);
});

document.getElementById('restart').addEventListener('click', () => {
    location.href = "index.html";
});

document.getElementById('clearHistory').addEventListener('click', () => {
    localStorage.clear();
    location.href = "index.html";
});

window.onload = loadChecklist;


function generateSummary() {
    let now = new Date();

    // Formatar data e hora
    let dia = String(now.getDate()).padStart(2, '0');
    let mes = String(now.getMonth() + 1).padStart(2, '0'); 
    let ano = now.getFullYear();
    let horas = String(now.getHours()).padStart(2, '0');
    let minutos = String(now.getMinutes()).padStart(2, '0');

    let dataHoraFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;

    // Pegando o nome correto da checklist
    //let checklistNome = checklistId in checklistsData ? checklistId : "Checklist Desconhecida";
    let checklistNome = CheckListNames.find(c => c.id === checklistId)?.name || "Checklist Desconhecida";

    let summary = `*Resumo CheckList*\n`;
    summary += `${checklistNome}\n`;
    summary += `Data: ${dataHoraFormatada}\n`;
    summary += `Avaliado por: ${localStorage.getItem('username')}\n\n`;

    let allConforme = true;
    for (let i in results) {
        if (!results[i].conforme) {
            summary += `❌ ${results[i].titulo} não conforme\n`;
            if (results[i].observacao) {
                summary += `⚠️ Observação: ${results[i].observacao}\n`;
            }
            allConforme = false;
        }
    }

    if (allConforme) {
        summary += "✅ Todos os itens estão conforme.";
    }

    document.getElementById('summary').value = summary;

    // Salvar no histórico
    let savedChecklists = JSON.parse(localStorage.getItem('savedChecklists')) || [];
    savedChecklists.unshift(summary);
    if (savedChecklists.length > 10) {
        savedChecklists.pop();
    }

    localStorage.setItem('savedChecklists', JSON.stringify(savedChecklists));
}