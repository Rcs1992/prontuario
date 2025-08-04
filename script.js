// Importações no topo
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// LOGIN
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch((error) => {
      document.getElementById('loginError').innerText = "Erro ao logar: " + error.message;
    });
}

// LOGOUT
function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

// FORMULÁRIO – Coleta de dados
function coletarDadosFormulario() {
  return {
    leito: document.getElementById("leito")?.value || "",
    estadoGeral: Array.from(document.querySelectorAll(".estadoGeral:checked")).map(el => el.value),
    nivelConsciencia: document.getElementById("nivelConsciencia")?.value || "",
    sedado: document.getElementById("sedado")?.checked || false,
    rass: document.getElementById("rass")?.value || "",
    drogasVasoativas: Array.from(document.querySelectorAll(".droga:checked")).map(el => ({
      nome: el.value,
      dose: document.querySelector(`#${el.value}_dose`)?.value || ""
    })),
    respiracao: document.getElementById("respiracao")?.value || "",
    modoVentilatorio: document.getElementById("modoVentilatorio")?.value || "",
    peep: document.getElementById("peep")?.value || "",
    pip: document.getElementById("pip")?.value || "",
    pressaoSuporte: document.getElementById("pressaoSuporte")?.value || "",
    fr: document.getElementById("fr")?.value || "",
    fiO2: document.getElementById("fio2")?.value || "",
    mecVent: document.getElementById("mecVent")?.value || "",
    condutas: Array.from(document.getElementById("condutas")?.selectedOptions || []).map(opt => opt.value),
    obsFinais: document.getElementById("obsFinais")?.value || "",
    dataHora: new Date().toISOString()
  };
}

// SALVAR NO FIRESTORE
async function salvarNoFirestore(dados) {
  try {
    await addDoc(collection(db, "avaliacoes"), {
      ...dados,
      criadoEm: Timestamp.now()
    });
    alert("✅ Avaliação salva com sucesso!");
  } catch (erro) {
    console.error("Erro ao salvar:", erro);
    alert("❌ Erro ao salvar avaliação: " + erro.message);
  }
}

// PROTEÇÃO DA HOME
onAuthStateChanged(auth, (user) => {
  const isHomePage = window.location.pathname.includes("home.html");
  if (isHomePage && !user) {
    window.location.href = "index.html";
  }
});

// Exportar funções para o HTML usar
window.login = login;
window.logout = logout;
window.salvarNoFirestore = salvarNoFirestore;
window.coletarDadosFormulario = coletarDadosFormulario;
