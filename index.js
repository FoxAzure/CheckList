
const checklists = [
    { titulo: "Ferramentas", id: "checklist1" },
];

document.getElementById('saveName').addEventListener('click', () => {
    const username = document.getElementById('name').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('username').textContent = username;
        loadChecklists();
    } else {
        alert("Por favor, informe seu nome.");
    }
});

function loadChecklists() {
    const listContainer = document.getElementById('checklistList');
    listContainer.innerHTML = '';

    checklists.forEach(checklist => {
        const btn = document.createElement('button');
        btn.innerHTML = checklist.titulo; // Agora inclui o ícone!
        btn.onclick = () => {
            location.href = `checklist.html?id=${checklist.id}`;
        };
        listContainer.appendChild(btn);
    });
}

window.onload = () => {
    const savedName = localStorage.getItem('username');
    if (savedName) {
        document.getElementById('username').textContent = savedName;
        loadChecklists();
    }
};