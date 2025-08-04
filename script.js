// Login
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

// Logout
function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

// Proteção da área privada
onAuthStateChanged(auth, (user) => {
  const isHomePage = window.location.pathname.includes("home.html");
  if (isHomePage && !user) {
    window.location.href = "index.html";
  }
});

// Coletar dados do formulário
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

// Salvar no Firestore
async function salvarNoFirestore() {
  const dados = coletarDadosFormulario();
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

// Torna funções globais para uso no HTML
window.login = login;
window.logout = logout;
window.salvarNoFirestore = salvarNoFirestore;
