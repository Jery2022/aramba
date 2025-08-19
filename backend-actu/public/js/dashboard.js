document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});

// Chargement des statistiques
async function chargerStatistiques() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/statistiques', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const stats = await res.json();

  document.getElementById('stat-actualites').textContent = stats.totalActualites;
  document.getElementById('stat-validation').textContent = `${stats.tauxValidation}%`;
  document.getElementById('stat-commentaires').textContent = stats.commentairesEnAttente;
  document.getElementById('stat-utilisateurs').textContent = stats.utilisateursActifs;
}

chargerStatistiques();


// Exemple de graphique
const ctx = document.getElementById('statsChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [{
      label: 'Actualités publiées',
      data: [12, 19, 3, 5, 8],
      backgroundColor: 'rgba(13, 110, 253, 0.7)'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
});


// Exemple de tableau d'utilisateurs
const usersTable = document.getElementById('usersTable');
const usersData = [
  { name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'Employé', status: 'Actif' },
  { name: 'Marie Curie', email: 'marie.curie@example.com', role: 'RH', status: 'Inactif' },
  { name: 'Pierre Martin', email: 'pierre.martin@example.com', role: 'Admin', status: 'Actif' }
];

usersData.forEach(user => {
    const row = usersTable.insertRow();
    row.insertCell(0).textContent = user.name;
    row.insertCell(1).textContent = user.email;
    row.insertCell(2).textContent = user.role;
    row.insertCell(3).textContent = user.status;
    const actionsCell = row.insertCell(4);
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Modifier';
    editBtn.className = 'btn btn-primary btn-sm';
    editBtn.addEventListener('click', () => {
        // Logique de modification de l'utilisateur
        alert(`Modifier l'utilisateur : ${user.name}`);
    });
    actionsCell.appendChild(editBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.addEventListener('click', () => {
        // Logique de suppression de l'utilisateur
        alert(`Supprimer l'utilisateur : ${user.name}`);
    });
    actionsCell.appendChild(deleteBtn);
});
      
// Exemple de tableau d'actualités
const newsTable = document.getElementById('newsTable');
const newsData = [
  { title: 'Nouvelle politique de télétravail', author: 'RH', date: '2023-10-01', status: 'Validée' },
  { title: 'Mise à jour de la charte informatique', author: 'IT', date: '2023-10-02', status: 'En attente' },
  { title: 'Formation sur la sécurité des données', author: 'RH', date: '2023-10-03', status: 'Validée' }
];
newsData.forEach(news => {
  const row = newsTable.insertRow();
  row.insertCell(0).textContent = news.title;
  row.insertCell(1).textContent = news.author;
  row.insertCell(2).textContent = news.date;
  row.insertCell(3).textContent = news.status;
});