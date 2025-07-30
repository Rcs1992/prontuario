function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch((error) => {
      document.getElementById('loginError').innerText = "Erro ao logar: " + error.message;
    });
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Proteção da área privada
firebase.auth().onAuthStateChanged((user) => {
  const isHomePage = window.location.pathname.includes("home.html");
  if (isHomePage && !user) {
    // Usuário não logado tentou acessar home
    window.location.href = "index.html";
  }
});
