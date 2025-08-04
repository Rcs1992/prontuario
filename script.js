// script.js
import app from './firebase-config.js';
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

// Proteção da rota
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// Envio do formulário
const form = document.getElementById("formAvaliacao");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Coleta dos dados
  const comorbidadesMarcadas = [...document.querySelectorAll('input[name="comorbidades"]:checked')].map(cb => cb.value);

  const dados = {
    nome: document.getElementById("nome").value,
    prontuario: document.getElementById("prontuario").value,
    idade: document.getElementById("idade").value,
    dataInternacao: document.getElementById("dataInternacao").value,
    diagnostico: document.getElementById("diagnostico").value,
    comorbidades: comorbidadesMarcadas,
    timestamp: new Date()
  };

  try {
    await addDoc(collection(db, "avaliacoes"), dados);
    alert("Avaliação salva com sucesso!");
    form.reset();
  } catch (err) {
    alert("Erro ao salvar: " + err.message);
  }
});
