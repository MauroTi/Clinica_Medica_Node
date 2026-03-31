const API_BASE = "http://localhost:3000/api";
const ITENS_POR_PAGINA = 10;

const estado = {
  pacientes: [],
  medicos: [],
  consultas: [],
  edicao: {
    pacienteId: null,
    medicoId: null,
    consultaId: null,
  },
  filtros: {
    pacientes: {
      busca: localStorage.getItem("filtro_paciente_busca") || "",
      ordenacao:
        localStorage.getItem("filtro_paciente_ordenacao") || "nome-asc",
    },
    medicos: {
      busca: localStorage.getItem("filtro_medico_busca") || "",
      ordenacao: localStorage.getItem("filtro_medico_ordenacao") || "nome-asc",
    },
    consultas: {
      busca: localStorage.getItem("filtro_consulta_busca") || "",
      ordenacao:
        localStorage.getItem("filtro_consulta_ordenacao") || "data-asc",
    },
  },
  paginacao: {
    pacientes: 1,
    medicos: 1,
    consultas: 1,
  },
  graficoPizza: null,
};

// =========================
// ELEMENTOS
// =========================
const tabs = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const totalPacientes = document.getElementById("totalPacientes");
const totalMedicos = document.getElementById("totalMedicos");
const totalConsultas = document.getElementById("totalConsultas");
const graficoPizzaCanvas = document.getElementById("graficoPizza");

const formPaciente = document.getElementById("formPaciente");
const nomePaciente = document.getElementById("nomePaciente");
const idadePaciente = document.getElementById("idadePaciente");
const telefonePaciente = document.getElementById("telefonePaciente");
const cpfPaciente = document.getElementById("cpfPaciente");
const emailPaciente = document.getElementById("emailPaciente");
const btnSalvarPaciente = document.getElementById("btnSalvarPaciente");
const btnCancelarEdicaoPaciente = document.getElementById(
  "btnCancelarEdicaoPaciente",
);
const modoPaciente = document.getElementById("modoPaciente");
const listaPacientes = document.getElementById("listaPacientes");
const buscaPaciente = document.getElementById("buscaPaciente");
const ordenacaoPaciente = document.getElementById("ordenacaoPaciente");
const limparFiltroPaciente = document.getElementById("limparFiltroPaciente");
const paginaInfoPacientes = document.getElementById("paginaInfoPacientes");
const btnAnteriorPacientes = document.getElementById("btnAnteriorPacientes");
const btnProximaPacientes = document.getElementById("btnProximaPacientes");

const formMedico = document.getElementById("formMedico");
const nomeMedico = document.getElementById("nomeMedico");
const especialidadeMedico = document.getElementById("especialidadeMedico");
const crmMedico = document.getElementById("crmMedico");
const telefoneMedico = document.getElementById("telefoneMedico");
const emailMedico = document.getElementById("emailMedico");
const btnSalvarMedico = document.getElementById("btnSalvarMedico");
const btnCancelarEdicaoMedico = document.getElementById(
  "btnCancelarEdicaoMedico",
);
const modoMedico = document.getElementById("modoMedico");
const listaMedicos = document.getElementById("listaMedicos");
const buscaMedico = document.getElementById("buscaMedico");
const ordenacaoMedico = document.getElementById("ordenacaoMedico");
const limparFiltroMedico = document.getElementById("limparFiltroMedico");
const paginaInfoMedicos = document.getElementById("paginaInfoMedicos");
const btnAnteriorMedicos = document.getElementById("btnAnteriorMedicos");
const btnProximaMedicos = document.getElementById("btnProximaMedicos");

const formConsulta = document.getElementById("formConsulta");
const pacienteConsulta = document.getElementById("pacienteConsulta");
const medicoConsulta = document.getElementById("medicoConsulta");
const dataConsulta = document.getElementById("dataConsulta");
const descricaoConsulta = document.getElementById("descricaoConsulta");
const statusConsulta = document.getElementById("statusConsulta");
const btnSalvarConsulta = document.getElementById("btnSalvarConsulta");
const btnCancelarEdicaoConsulta = document.getElementById(
  "btnCancelarEdicaoConsulta",
);
const modoConsulta = document.getElementById("modoConsulta");
const listaConsultas = document.getElementById("listaConsultas");
const buscaConsulta = document.getElementById("buscaConsulta");
const ordenacaoConsulta = document.getElementById("ordenacaoConsulta");
const limparFiltroConsulta = document.getElementById("limparFiltroConsulta");
const paginaInfoConsultas = document.getElementById("paginaInfoConsultas");
const btnAnteriorConsultas = document.getElementById("btnAnteriorConsultas");
const btnProximaConsultas = document.getElementById("btnProximaConsultas");

const toastContainer = document.getElementById("toastContainer");

// =========================
// UTILITÁRIOS
// =========================
function mostrarToast(mensagem, tipo = "success") {
  if (!toastContainer) {
    console.warn("toastContainer não encontrado:", mensagem);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensagem;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function salvarFiltro(chave, valor) {
  localStorage.setItem(chave, valor);
}

function formatarData(dataISO) {
  if (!dataISO) return "-";

  const data = new Date(dataISO);

  if (isNaN(data.getTime())) {
    return dataISO;
  }

  return data.toLocaleDateString("pt-BR");
}

function obterNomePaciente(item) {
  if (item.paciente_nome) return item.paciente_nome;
  if (item.nome_paciente) return item.nome_paciente;

  const paciente = estado.pacientes.find((p) => p.id == item.paciente_id);
  return paciente ? paciente.nome : "Paciente não encontrado";
}

function obterNomeMedico(item) {
  if (item.medico_nome) return item.medico_nome;
  if (item.nome_medico) return item.nome_medico;

  const medico = estado.medicos.find((m) => m.id == item.medico_id);
  return medico ? medico.nome : "Médico não encontrado";
}

function obterEspecialidadeConsulta(item) {
  if (item.especialidade) return item.especialidade;
  if (item.medico_especialidade) return item.medico_especialidade;

  const medico = estado.medicos.find((m) => m.id == item.medico_id);
  return medico?.especialidade || "-";
}

function formatarStatus(status) {
  const mapa = {
    agendada: "Agendada",
    pendente: "Pendente",
    confirmada: "Confirmada",
    realizada: "Realizada",
    concluida: "Concluída",
    cancelada: "Cancelada",
    faltou: "Faltou",
  };

  const chave = String(status || "agendada").toLowerCase();
  return mapa[chave] || chave.charAt(0).toUpperCase() + chave.slice(1);
}

function atualizarControlesPaginacao(tipo, totalItens) {
  const totalPaginas = Math.max(1, Math.ceil(totalItens / ITENS_POR_PAGINA));

  if (estado.paginacao[tipo] > totalPaginas) {
    estado.paginacao[tipo] = totalPaginas;
  }

  if (estado.paginacao[tipo] < 1) {
    estado.paginacao[tipo] = 1;
  }

  const paginaAtual = estado.paginacao[tipo];

  if (tipo === "pacientes") {
    if (paginaInfoPacientes)
      paginaInfoPacientes.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    if (btnAnteriorPacientes) btnAnteriorPacientes.disabled = paginaAtual <= 1;
    if (btnProximaPacientes)
      btnProximaPacientes.disabled = paginaAtual >= totalPaginas;
  }

  if (tipo === "medicos") {
    if (paginaInfoMedicos)
      paginaInfoMedicos.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    if (btnAnteriorMedicos) btnAnteriorMedicos.disabled = paginaAtual <= 1;
    if (btnProximaMedicos)
      btnProximaMedicos.disabled = paginaAtual >= totalPaginas;
  }

  if (tipo === "consultas") {
    if (paginaInfoConsultas)
      paginaInfoConsultas.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    if (btnAnteriorConsultas) btnAnteriorConsultas.disabled = paginaAtual <= 1;
    if (btnProximaConsultas)
      btnProximaConsultas.disabled = paginaAtual >= totalPaginas;
  }
}

function obterPagina(lista, tipo) {
  const paginaAtual = estado.paginacao[tipo];
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;

  atualizarControlesPaginacao(tipo, lista.length);

  return lista.slice(inicio, fim);
}

function irParaPaginaAnterior(tipo) {
  if (estado.paginacao[tipo] > 1) {
    estado.paginacao[tipo]--;
    rerenderPorTipo(tipo);
  }
}

function irParaProximaPagina(tipo, totalItens) {
  const totalPaginas = Math.max(1, Math.ceil(totalItens / ITENS_POR_PAGINA));

  if (estado.paginacao[tipo] < totalPaginas) {
    estado.paginacao[tipo]++;
    rerenderPorTipo(tipo);
  }
}

function resetarPagina(tipo) {
  estado.paginacao[tipo] = 1;
}

function rerenderPorTipo(tipo) {
  if (tipo === "pacientes") renderizarPacientes();
  if (tipo === "medicos") renderizarMedicos();
  if (tipo === "consultas") renderizarConsultas();
}

// =========================
// TABS + PERSISTÊNCIA
// =========================
function ativarTab(tabName) {
  tabs.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === `tab-${tabName}`);
  });

  localStorage.setItem("aba_ativa_clinica", tabName);
}

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    ativarTab(btn.dataset.tab);
  });
});

function restaurarTabAtiva() {
  const abaSalva = localStorage.getItem("aba_ativa_clinica") || "pacientes";
  ativarTab(abaSalva);
}

// =========================
// API
// =========================
async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let erro = "Erro na requisição";

    try {
      const data = await response.json();
      erro = data.erro || data.mensagem || data.message || erro;
    } catch {
      // ignora parse
    }

    throw new Error(erro);
  }

  if (response.status === 204) return null;

  return response.json();
}

// =========================
// PACIENTES
// =========================
async function carregarPacientes() {
  estado.pacientes = await apiFetch(`${API_BASE}/pacientes`);
  atualizarDashboard();
  preencherSelectPacientes();
  renderizarPacientes();
}

function preencherSelectPacientes() {
  if (!pacienteConsulta) return;

  const valorAtual = pacienteConsulta.value;

  pacienteConsulta.innerHTML = '<option value="">Selecione o paciente</option>';

  estado.pacientes.forEach((paciente) => {
    const option = document.createElement("option");
    option.value = paciente.id;
    option.textContent = paciente.nome;
    pacienteConsulta.appendChild(option);
  });

  if ([...pacienteConsulta.options].some((opt) => opt.value === valorAtual)) {
    pacienteConsulta.value = valorAtual;
  }
}

function obterPacientesFiltrados() {
  let lista = [...estado.pacientes];
  const busca = estado.filtros.pacientes.busca.toLowerCase().trim();
  const ordenacao = estado.filtros.pacientes.ordenacao;

  if (busca) {
    const buscaNumerica = busca.replace(/\D/g, "");

    lista = lista.filter((p) => {
      const nome = (p.nome || "").toLowerCase().trim();
      const telefoneTexto = String(p.telefone || "")
        .toLowerCase()
        .trim();
      const telefoneNumerico = telefoneTexto.replace(/\D/g, "");

      const nomeComeca = nome.startsWith(busca);
      const telefoneComecaTexto = telefoneTexto.startsWith(busca);
      const telefoneComecaNumero = buscaNumerica
        ? telefoneNumerico.startsWith(buscaNumerica)
        : false;

      return nomeComeca || telefoneComecaTexto || telefoneComecaNumero;
    });
  }

  switch (ordenacao) {
    case "nome-asc":
      lista.sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
      break;
    case "nome-desc":
      lista.sort((a, b) => (b.nome || "").localeCompare(a.nome || ""));
      break;
    case "idade-asc":
      lista.sort((a, b) => Number(a.idade) - Number(b.idade));
      break;
    case "idade-desc":
      lista.sort((a, b) => Number(b.idade) - Number(a.idade));
      break;
  }

  return lista;
}

function renderizarPacientes() {
  if (!listaPacientes) return;

  const pacientesFiltrados = obterPacientesFiltrados();
  const pacientesPagina = obterPagina(pacientesFiltrados, "pacientes");

  listaPacientes.innerHTML = "";

  if (!pacientesFiltrados.length) {
    listaPacientes.innerHTML = `
      <tr>
        <td colspan="6" class="vazio">Nenhum paciente encontrado.</td>
      </tr>
    `;
    atualizarControlesPaginacao("pacientes", 0);
    return;
  }

  pacientesPagina.forEach((paciente) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${paciente.nome || "-"}</td>
      <td>${paciente.idade ?? "-"}</td>
      <td>${paciente.cpf || "-"}</td>
      <td>${paciente.telefone || "-"}</td>
      <td>${paciente.email || "-"}</td>
      <td>
        <div class="acoes">
          <button class="btn-editar" data-id="${paciente.id}" data-tipo="paciente">Editar</button>
          <button class="btn-excluir" data-id="${paciente.id}" data-tipo="paciente">Excluir</button>
        </div>
      </td>
    `;
    listaPacientes.appendChild(tr);
  });
}

function entrarModoEdicaoPaciente(paciente) {
  if (
    !nomePaciente ||
    !idadePaciente ||
    !telefonePaciente ||
    !cpfPaciente ||
    !emailPaciente ||
    !btnSalvarPaciente ||
    !btnCancelarEdicaoPaciente ||
    !modoPaciente
  )
    return;

  estado.edicao.pacienteId = paciente.id;
  nomePaciente.value = paciente.nome || "";
  idadePaciente.value = paciente.idade ?? "";
  telefonePaciente.value = paciente.telefone || "";
  cpfPaciente.value = paciente.cpf || "";
  emailPaciente.value = paciente.email || "";

  btnSalvarPaciente.textContent = "Atualizar paciente";
  btnCancelarEdicaoPaciente.classList.remove("hidden");
  modoPaciente.textContent = "Modo: Edição";

  ativarTab("pacientes");
}

function sairModoEdicaoPaciente() {
  if (
    !formPaciente ||
    !btnSalvarPaciente ||
    !btnCancelarEdicaoPaciente ||
    !modoPaciente
  )
    return;

  estado.edicao.pacienteId = null;
  formPaciente.reset();
  btnSalvarPaciente.textContent = "Salvar paciente";
  btnCancelarEdicaoPaciente.classList.add("hidden");
  modoPaciente.textContent = "Modo: Cadastro";

  if (cpfPaciente) cpfPaciente.value = "";
  if (emailPaciente) emailPaciente.value = "";
}

async function salvarPaciente(event) {
  event.preventDefault();

  const payload = {
    nome: nomePaciente.value.trim(),
    idade: Number(idadePaciente.value),
    telefone: telefonePaciente.value.trim(),
    cpf: cpfPaciente ? cpfPaciente.value.trim() : null,
    email: emailPaciente ? emailPaciente.value.trim() : null,
  };

  try {
    if (estado.edicao.pacienteId) {
      await apiFetch(`${API_BASE}/pacientes/${estado.edicao.pacienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      mostrarToast("Paciente atualizado com sucesso!");
    } else {
      await apiFetch(`${API_BASE}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      mostrarToast("Paciente cadastrado com sucesso!");
    }

    sairModoEdicaoPaciente();
    await carregarPacientes();
    await carregarConsultas();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

async function excluirPaciente(id) {
  const paciente = estado.pacientes.find((p) => p.id == id);
  const nome = paciente?.nome || "este paciente";

  const confirmar = confirm(`Deseja realmente excluir ${nome}?`);
  if (!confirmar) return;

  try {
    await apiFetch(`${API_BASE}/pacientes/${id}`, {
      method: "DELETE",
    });

    if (estado.edicao.pacienteId == id) {
      sairModoEdicaoPaciente();
    }

    mostrarToast("Paciente excluído com sucesso!", "warning");
    await carregarPacientes();
    await carregarConsultas();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

// =========================
// MÉDICOS
// =========================
async function carregarMedicos() {
  estado.medicos = await apiFetch(`${API_BASE}/medicos`);
  atualizarDashboard();
  preencherSelectMedicos();
  renderizarMedicos();
}

function preencherSelectMedicos() {
  if (!medicoConsulta) return;

  const valorAtual = medicoConsulta.value;

  medicoConsulta.innerHTML = '<option value="">Selecione o médico</option>';

  estado.medicos.forEach((medico) => {
    const option = document.createElement("option");
    option.value = medico.id;
    option.textContent = medico.nome;
    medicoConsulta.appendChild(option);
  });

  if ([...medicoConsulta.options].some((opt) => opt.value === valorAtual)) {
    medicoConsulta.value = valorAtual;
  }
}

function obterMedicosFiltrados() {
  let lista = [...estado.medicos];
  const busca = estado.filtros.medicos.busca.toLowerCase().trim();
  const ordenacao = estado.filtros.medicos.ordenacao;

  if (busca) {
    lista = lista.filter((m) => {
      const nome = (m.nome || "").toLowerCase().trim();
      const especialidade = (m.especialidade || "").toLowerCase().trim();

      return nome.startsWith(busca) || especialidade.startsWith(busca);
    });
  }

  switch (ordenacao) {
    case "nome-asc":
      lista.sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
      break;
    case "nome-desc":
      lista.sort((a, b) => (b.nome || "").localeCompare(a.nome || ""));
      break;
    case "esp-asc":
      lista.sort((a, b) =>
        (a.especialidade || "").localeCompare(b.especialidade || ""),
      );
      break;
    case "esp-desc":
      lista.sort((a, b) =>
        (b.especialidade || "").localeCompare(a.especialidade || ""),
      );
      break;
  }

  return lista;
}

function renderizarMedicos() {
  if (!listaMedicos) return;

  const medicosFiltrados = obterMedicosFiltrados();
  const medicosPagina = obterPagina(medicosFiltrados, "medicos");

  listaMedicos.innerHTML = "";

  if (!medicosFiltrados.length) {
    listaMedicos.innerHTML = `
      <tr>
        <td colspan="6" class="vazio">Nenhum médico encontrado.</td>
      </tr>
    `;
    atualizarControlesPaginacao("medicos", 0);
    return;
  }

  medicosPagina.forEach((medico) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${medico.nome || "-"}</td>
      <td>${medico.especialidade || "-"}</td>
      <td>${medico.crm || "-"}</td>
      <td>${medico.telefone || "-"}</td>
      <td>${medico.email || "-"}</td>
      <td>
        <div class="acoes">
          <button class="btn-editar" data-id="${medico.id}" data-tipo="medico">Editar</button>
          <button class="btn-excluir" data-id="${medico.id}" data-tipo="medico">Excluir</button>
        </div>
      </td>
    `;
    listaMedicos.appendChild(tr);
  });
}

function entrarModoEdicaoMedico(medico) {
  if (
    !nomeMedico ||
    !especialidadeMedico ||
    !crmMedico ||
    !telefoneMedico ||
    !emailMedico ||
    !btnSalvarMedico ||
    !btnCancelarEdicaoMedico ||
    !modoMedico
  )
    return;

  estado.edicao.medicoId = medico.id;
  nomeMedico.value = medico.nome || "";
  especialidadeMedico.value = medico.especialidade || "";
  crmMedico.value = medico.crm || "";
  telefoneMedico.value = medico.telefone || "";
  emailMedico.value = medico.email || "";

  btnSalvarMedico.textContent = "Atualizar médico";
  btnCancelarEdicaoMedico.classList.remove("hidden");
  modoMedico.textContent = "Modo: Edição";

  ativarTab("medicos");
}

function sairModoEdicaoMedico() {
  if (
    !formMedico ||
    !btnSalvarMedico ||
    !btnCancelarEdicaoMedico ||
    !modoMedico
  )
    return;

  estado.edicao.medicoId = null;
  formMedico.reset();
  btnSalvarMedico.textContent = "Salvar médico";
  btnCancelarEdicaoMedico.classList.add("hidden");
  modoMedico.textContent = "Modo: Cadastro";

  if (crmMedico) crmMedico.value = "";
  if (telefoneMedico) telefoneMedico.value = "";
  if (emailMedico) emailMedico.value = "";
}

async function salvarMedico(event) {
  event.preventDefault();

  const payload = {
    nome: nomeMedico.value.trim(),
    especialidade: especialidadeMedico.value.trim(),
    crm: crmMedico ? crmMedico.value.trim() : null,
    telefone: telefoneMedico ? telefoneMedico.value.trim() : null,
    email: emailMedico ? emailMedico.value.trim() : null,
  };

  try {
    if (estado.edicao.medicoId) {
      await apiFetch(`${API_BASE}/medicos/${estado.edicao.medicoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      mostrarToast("Médico atualizado com sucesso!");
    } else {
      await apiFetch(`${API_BASE}/medicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      mostrarToast("Médico cadastrado com sucesso!");
    }

    sairModoEdicaoMedico();
    await carregarMedicos();
    await carregarConsultas();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

async function excluirMedico(id) {
  const medico = estado.medicos.find((m) => m.id == id);
  const nome = medico?.nome || "este médico";

  const confirmar = confirm(`Deseja realmente excluir ${nome}?`);
  if (!confirmar) return;

  try {
    await apiFetch(`${API_BASE}/medicos/${id}`, {
      method: "DELETE",
    });

    if (estado.edicao.medicoId == id) {
      sairModoEdicaoMedico();
    }

    mostrarToast("Médico excluído com sucesso!", "warning");
    await carregarMedicos();
    await carregarConsultas();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

// =========================
// CONSULTAS
// =========================
async function carregarConsultas() {
  estado.consultas = await apiFetch(`${API_BASE}/consultas`);
  atualizarDashboard();
  renderizarConsultas();
}

function obterConsultasFiltradas() {
  let lista = [...estado.consultas];
  const busca = estado.filtros.consultas.busca.toLowerCase().trim();
  const ordenacao = estado.filtros.consultas.ordenacao;

  if (busca) {
    lista = lista.filter((c) => {
      const nomePaciente = obterNomePaciente(c).toLowerCase().trim();
      const nomeMedico = obterNomeMedico(c).toLowerCase().trim();
      const descricao = (c.descricao || "").toLowerCase().trim();
      const especialidade = (obterEspecialidadeConsulta(c) || "")
        .toLowerCase()
        .trim();
      const status = String(c.status || "agendada")
        .toLowerCase()
        .trim();

      return (
        nomePaciente.startsWith(busca) ||
        nomeMedico.startsWith(busca) ||
        descricao.startsWith(busca) ||
        especialidade.startsWith(busca) ||
        status.startsWith(busca)
      );
    });
  }

  switch (ordenacao) {
    case "data-asc":
      lista.sort(
        (a, b) => new Date(a.data_consulta) - new Date(b.data_consulta),
      );
      break;
    case "data-desc":
      lista.sort(
        (a, b) => new Date(b.data_consulta) - new Date(a.data_consulta),
      );
      break;
    case "paciente-asc":
      lista.sort((a, b) =>
        obterNomePaciente(a).localeCompare(obterNomePaciente(b)),
      );
      break;
    case "medico-asc":
      lista.sort((a, b) =>
        obterNomeMedico(a).localeCompare(obterNomeMedico(b)),
      );
      break;
  }

  return lista;
}

function renderizarConsultas() {
  if (!listaConsultas) return;

  const consultasFiltradas = obterConsultasFiltradas();
  const consultasPagina = obterPagina(consultasFiltradas, "consultas");

  listaConsultas.innerHTML = "";

  if (!consultasFiltradas.length) {
    listaConsultas.innerHTML = `
      <tr>
        <td colspan="7" class="vazio">Nenhuma consulta encontrada.</td>
      </tr>
    `;
    atualizarControlesPaginacao("consultas", 0);
    return;
  }

  consultasPagina.forEach((consulta) => {
    const statusBadge = String(consulta.status || "agendada").toLowerCase();
    const statusClass = `badge-${statusBadge}`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${obterNomePaciente(consulta)}</td>
      <td>${obterNomeMedico(consulta)}</td>
      <td>${formatarData(consulta.data_consulta)}</td>
      <td>${obterEspecialidadeConsulta(consulta)}</td>
      <td>${consulta.descricao || "-"}</td>
      <td><span class="badge ${statusClass}">${formatarStatus(statusBadge)}</span></td>
      <td>
        <div class="acoes">
          <button class="btn-editar" data-id="${consulta.id}" data-tipo="consulta">Editar</button>
          <button class="btn-excluir" data-id="${consulta.id}" data-tipo="consulta">Excluir</button>
        </div>
      </td>
    `;
    listaConsultas.appendChild(tr);
  });
}

function entrarModoEdicaoConsulta(consulta) {
  if (
    !pacienteConsulta ||
    !medicoConsulta ||
    !dataConsulta ||
    !descricaoConsulta ||
    !btnSalvarConsulta ||
    !btnCancelarEdicaoConsulta ||
    !modoConsulta
  )
    return;

  estado.edicao.consultaId = consulta.id;

  pacienteConsulta.value = String(consulta.paciente_id);
  medicoConsulta.value = String(consulta.medico_id);

  const dataAjustada = consulta.data_consulta
    ? new Date(consulta.data_consulta).toISOString().split("T")[0]
    : "";

  dataConsulta.value = dataAjustada;
  descricaoConsulta.value = consulta.descricao || "";
  if (statusConsulta) statusConsulta.value = consulta.status || "agendada";

  btnSalvarConsulta.textContent = "Atualizar consulta";
  btnCancelarEdicaoConsulta.classList.remove("hidden");
  modoConsulta.textContent = "Modo: Edição";

  ativarTab("consultas");
}

function sairModoEdicaoConsulta() {
  if (
    !formConsulta ||
    !btnSalvarConsulta ||
    !btnCancelarEdicaoConsulta ||
    !modoConsulta
  )
    return;

  estado.edicao.consultaId = null;
  formConsulta.reset();
  btnSalvarConsulta.textContent = "Salvar consulta";
  btnCancelarEdicaoConsulta.classList.add("hidden");
  modoConsulta.textContent = "Modo: Cadastro";

  if (statusConsulta) {
    statusConsulta.value = "agendada";
  }
}

async function salvarConsulta(event) {
  event.preventDefault();

  const payload = {
    paciente_id: Number(pacienteConsulta.value),
    medico_id: Number(medicoConsulta.value),
    data_consulta: dataConsulta.value,
    descricao: descricaoConsulta.value.trim(),
    status: statusConsulta ? statusConsulta.value : "agendada",
  };

  try {
    if (estado.edicao.consultaId) {
      await apiFetch(`${API_BASE}/consultas/${estado.edicao.consultaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      mostrarToast("Consulta atualizada com sucesso!");
    } else {
      await apiFetch(`${API_BASE}/consultas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      mostrarToast("Consulta cadastrada com sucesso!");
    }

    sairModoEdicaoConsulta();
    await carregarConsultas();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

async function excluirConsulta(id) {
  const consulta = estado.consultas.find((c) => c.id == id);
  const nomePaciente = consulta ? obterNomePaciente(consulta) : "esta consulta";

  const confirmar = confirm(
    `Deseja realmente excluir a consulta de ${nomePaciente}?`,
  );
  if (!confirmar) return;

  try {
    await apiFetch(`${API_BASE}/consultas/${id}`, {
      method: "DELETE",
    });

    if (estado.edicao.consultaId == id) {
      sairModoEdicaoConsulta();
    }

    mostrarToast("Consulta excluída com sucesso!", "warning");
    await carregarConsultas();
  } catch (error) {
    mostrarToast(error.message, "error");
  }
}

// =========================
// DASHBOARD + GRÁFICO PIZZA
// =========================
function atualizarDashboard() {
  if (totalPacientes) totalPacientes.textContent = estado.pacientes.length;
  if (totalMedicos) totalMedicos.textContent = estado.medicos.length;
  if (totalConsultas) totalConsultas.textContent = estado.consultas.length;

  desenharGraficoPizza();
}

function desenharGraficoPizza() {
  if (!graficoPizzaCanvas) return;

  const ctx = graficoPizzaCanvas.getContext("2d");
  const largura = graficoPizzaCanvas.width;
  const altura = graficoPizzaCanvas.height;
  const centroX = largura / 2;
  const centroY = altura / 2;
  const raio = Math.min(largura, altura) / 2 - 12;

  ctx.clearRect(0, 0, largura, altura);

  const dados = [
    { label: "Pacientes", valor: estado.pacientes.length, cor: "#2563eb" },
    { label: "Médicos", valor: estado.medicos.length, cor: "#10b981" },
    { label: "Consultas", valor: estado.consultas.length, cor: "#f59e0b" },
  ];

  const total = dados.reduce((acc, item) => acc + item.valor, 0);

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio, 0, Math.PI * 2);
    ctx.fillStyle = "#e5e7eb";
    ctx.fill();

    ctx.fillStyle = "#6b7280";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Sem dados", centroX, centroY + 5);
    return;
  }

  let anguloInicial = -Math.PI / 2;

  dados.forEach((item) => {
    const anguloFinal = anguloInicial + (item.valor / total) * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.arc(centroX, centroY, raio, anguloInicial, anguloFinal);
    ctx.closePath();
    ctx.fillStyle = item.cor;
    ctx.fill();

    anguloInicial = anguloFinal;
  });

  ctx.beginPath();
  ctx.arc(centroX, centroY, raio * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(String(total), centroX, centroY + 5);
}

// =========================
// EVENTOS DE AÇÕES NAS TABELAS
// =========================
document.addEventListener("click", async (event) => {
  const botao = event.target.closest("button[data-id][data-tipo]");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const tipo = botao.dataset.tipo;
  const acao = botao.classList.contains("btn-editar") ? "editar" : "excluir";

  if (tipo === "paciente") {
    if (acao === "editar") {
      const paciente = estado.pacientes.find((p) => p.id == id);
      if (paciente) entrarModoEdicaoPaciente(paciente);
    } else {
      await excluirPaciente(id);
    }
  }

  if (tipo === "medico") {
    if (acao === "editar") {
      const medico = estado.medicos.find((m) => m.id == id);
      if (medico) entrarModoEdicaoMedico(medico);
    } else {
      await excluirMedico(id);
    }
  }

  if (tipo === "consulta") {
    if (acao === "editar") {
      const consulta = estado.consultas.find((c) => c.id == id);
      if (consulta) entrarModoEdicaoConsulta(consulta);
    } else {
      await excluirConsulta(id);
    }
  }
});

// =========================
// EVENTOS FORMULÁRIOS
// =========================
if (formPaciente) formPaciente.addEventListener("submit", salvarPaciente);
if (btnCancelarEdicaoPaciente)
  btnCancelarEdicaoPaciente.addEventListener("click", sairModoEdicaoPaciente);

if (formMedico) formMedico.addEventListener("submit", salvarMedico);
if (btnCancelarEdicaoMedico)
  btnCancelarEdicaoMedico.addEventListener("click", sairModoEdicaoMedico);

if (formConsulta) formConsulta.addEventListener("submit", salvarConsulta);
if (btnCancelarEdicaoConsulta)
  btnCancelarEdicaoConsulta.addEventListener("click", sairModoEdicaoConsulta);

// =========================
// PAGINAÇÃO
// =========================
if (btnAnteriorPacientes) {
  btnAnteriorPacientes.addEventListener("click", () =>
    irParaPaginaAnterior("pacientes"),
  );
}

if (btnProximaPacientes) {
  btnProximaPacientes.addEventListener("click", () => {
    const total = obterPacientesFiltrados().length;
    irParaProximaPagina("pacientes", total);
  });
}

if (btnAnteriorMedicos) {
  btnAnteriorMedicos.addEventListener("click", () =>
    irParaPaginaAnterior("medicos"),
  );
}

if (btnProximaMedicos) {
  btnProximaMedicos.addEventListener("click", () => {
    const total = obterMedicosFiltrados().length;
    irParaProximaPagina("medicos", total);
  });
}

if (btnAnteriorConsultas) {
  btnAnteriorConsultas.addEventListener("click", () =>
    irParaPaginaAnterior("consultas"),
  );
}

if (btnProximaConsultas) {
  btnProximaConsultas.addEventListener("click", () => {
    const total = obterConsultasFiltradas().length;
    irParaProximaPagina("consultas", total);
  });
}

// =========================
// FILTROS PACIENTES
// =========================
if (buscaPaciente) buscaPaciente.value = estado.filtros.pacientes.busca;
if (ordenacaoPaciente)
  ordenacaoPaciente.value = estado.filtros.pacientes.ordenacao;

if (buscaPaciente) {
  buscaPaciente.addEventListener("input", () => {
    estado.filtros.pacientes.busca = buscaPaciente.value;
    salvarFiltro("filtro_paciente_busca", buscaPaciente.value);
    resetarPagina("pacientes");
    renderizarPacientes();
  });
}

if (ordenacaoPaciente) {
  ordenacaoPaciente.addEventListener("change", () => {
    estado.filtros.pacientes.ordenacao = ordenacaoPaciente.value;
    salvarFiltro("filtro_paciente_ordenacao", ordenacaoPaciente.value);
    resetarPagina("pacientes");
    renderizarPacientes();
  });
}

if (limparFiltroPaciente) {
  limparFiltroPaciente.addEventListener("click", () => {
    estado.filtros.pacientes.busca = "";
    estado.filtros.pacientes.ordenacao = "nome-asc";
    if (buscaPaciente) buscaPaciente.value = "";
    if (ordenacaoPaciente) ordenacaoPaciente.value = "nome-asc";
    salvarFiltro("filtro_paciente_busca", "");
    salvarFiltro("filtro_paciente_ordenacao", "nome-asc");
    resetarPagina("pacientes");
    renderizarPacientes();
    mostrarToast("Filtros de pacientes limpos!", "warning");
  });
}

// =========================
// FILTROS MÉDICOS
// =========================
if (buscaMedico) buscaMedico.value = estado.filtros.medicos.busca;
if (ordenacaoMedico) ordenacaoMedico.value = estado.filtros.medicos.ordenacao;

if (buscaMedico) {
  buscaMedico.addEventListener("input", () => {
    estado.filtros.medicos.busca = buscaMedico.value;
    salvarFiltro("filtro_medico_busca", buscaMedico.value);
    resetarPagina("medicos");
    renderizarMedicos();
  });
}

if (ordenacaoMedico) {
  ordenacaoMedico.addEventListener("change", () => {
    estado.filtros.medicos.ordenacao = ordenacaoMedico.value;
    salvarFiltro("filtro_medico_ordenacao", ordenacaoMedico.value);
    resetarPagina("medicos");
    renderizarMedicos();
  });
}

if (limparFiltroMedico) {
  limparFiltroMedico.addEventListener("click", () => {
    estado.filtros.medicos.busca = "";
    estado.filtros.medicos.ordenacao = "nome-asc";
    if (buscaMedico) buscaMedico.value = "";
    if (ordenacaoMedico) ordenacaoMedico.value = "nome-asc";
    salvarFiltro("filtro_medico_busca", "");
    salvarFiltro("filtro_medico_ordenacao", "nome-asc");
    resetarPagina("medicos");
    renderizarMedicos();
    mostrarToast("Filtros de médicos limpos!", "warning");
  });
}

// =========================
// FILTROS CONSULTAS
// =========================
if (buscaConsulta) buscaConsulta.value = estado.filtros.consultas.busca;
if (ordenacaoConsulta)
  ordenacaoConsulta.value = estado.filtros.consultas.ordenacao;

if (buscaConsulta) {
  buscaConsulta.addEventListener("input", () => {
    estado.filtros.consultas.busca = buscaConsulta.value;
    salvarFiltro("filtro_consulta_busca", buscaConsulta.value);
    resetarPagina("consultas");
    renderizarConsultas();
  });
}

if (ordenacaoConsulta) {
  ordenacaoConsulta.addEventListener("change", () => {
    estado.filtros.consultas.ordenacao = ordenacaoConsulta.value;
    salvarFiltro("filtro_consulta_ordenacao", ordenacaoConsulta.value);
    resetarPagina("consultas");
    renderizarConsultas();
  });
}

if (limparFiltroConsulta) {
  limparFiltroConsulta.addEventListener("click", () => {
    estado.filtros.consultas.busca = "";
    estado.filtros.consultas.ordenacao = "data-asc";
    if (buscaConsulta) buscaConsulta.value = "";
    if (ordenacaoConsulta) ordenacaoConsulta.value = "data-asc";
    salvarFiltro("filtro_consulta_busca", "");
    salvarFiltro("filtro_consulta_ordenacao", "data-asc");
    resetarPagina("consultas");
    renderizarConsultas();
    mostrarToast("Filtros de consultas limpos!", "warning");
  });
}

// =========================
// INICIALIZAÇÃO
// =========================
async function inicializar() {
  try {
    restaurarTabAtiva();

    await carregarPacientes();
    await carregarMedicos();
    await carregarConsultas();

    mostrarToast("Sistema carregado com sucesso!");
  } catch (error) {
    console.error(error);
    mostrarToast(`Erro ao inicializar: ${error.message}`, "error");
  }
}

inicializar();
