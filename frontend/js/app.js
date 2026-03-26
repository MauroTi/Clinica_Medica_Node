const API_BASE = 'http://localhost:3000/api';

const el = {
  // Dashboard
  totalPacientes: document.getElementById('totalPacientes'),
  totalMedicos: document.getElementById('totalMedicos'),
  totalConsultas: document.getElementById('totalConsultas'),

  // Tabs
  tabButtons: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),

  // Pacientes
  formPaciente: document.getElementById('formPaciente'),
  pacienteId: document.getElementById('pacienteId'),
  pacienteNome: document.getElementById('pacienteNome'),
  pacienteIdade: document.getElementById('pacienteIdade'),
  pacienteTelefone: document.getElementById('pacienteTelefone'),
  listaPacientes: document.getElementById('listaPacientes'),
  modoPaciente: document.getElementById('modoPaciente'),
  btnSalvarPaciente: document.getElementById('btnSalvarPaciente'),
  btnCancelarPaciente: document.getElementById('btnCancelarPaciente'),

  // Médicos
  formMedico: document.getElementById('formMedico'),
  medicoId: document.getElementById('medicoId'),
  medicoNome: document.getElementById('medicoNome'),
  medicoEspecialidade: document.getElementById('medicoEspecialidade'),
  listaMedicos: document.getElementById('listaMedicos'),
  modoMedico: document.getElementById('modoMedico'),
  btnSalvarMedico: document.getElementById('btnSalvarMedico'),
  btnCancelarMedico: document.getElementById('btnCancelarMedico'),

  // Consultas
  formConsulta: document.getElementById('formConsulta'),
  consultaId: document.getElementById('consultaId'),
  consultaPaciente: document.getElementById('consultaPaciente'),
  consultaMedico: document.getElementById('consultaMedico'),
  consultaData: document.getElementById('consultaData'),
  consultaDescricao: document.getElementById('consultaDescricao'),
  listaConsultas: document.getElementById('listaConsultas'),
  modoConsulta: document.getElementById('modoConsulta'),
  btnSalvarConsulta: document.getElementById('btnSalvarConsulta'),
  btnCancelarConsulta: document.getElementById('btnCancelarConsulta'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

let estado = {
  pacientes: [],
  medicos: [],
  consultas: []
};

// ====================
// UTILITÁRIOS API
// ====================

async function tratarResposta(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.erro || 'Erro na requisição');
  }

  return data;
}

async function apiGet(url) {
  const response = await fetch(url);
  return tratarResposta(response);
}

async function apiPost(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return tratarResposta(response);
}

async function apiPut(url, body) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return tratarResposta(response);
}

async function apiDelete(url) {
  const response = await fetch(url, {
    method: 'DELETE'
  });

  return tratarResposta(response);
}

// ====================
// MENSAGENS
// ====================

function mostrarMensagem(texto, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.textContent = texto;

  el.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ====================
// TABS
// ====================

function alternarAbas() {
  el.tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;

      el.tabButtons.forEach((btn) => btn.classList.remove('active'));
      el.tabContents.forEach((content) => content.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');
    });
  });
}

// ====================
// FORMATOS
// ====================

function formatarDataParaBanco(data) {
  return data;
}

function formatarDataParaInput(data) {
  if (!data) return '';
  return String(data).slice(0, 10);
}

// ====================
// DASHBOARD
// ====================

function atualizarDashboard() {
  el.totalPacientes.textContent = estado.pacientes.length;
  el.totalMedicos.textContent = estado.medicos.length;
  el.totalConsultas.textContent = estado.consultas.length;
}

// ====================
// PACIENTES
// ====================

async function carregarPacientes() {
  estado.pacientes = await apiGet(`${API_BASE}/pacientes`);
  renderPacientes();
  preencherSelectPacientes();
  atualizarDashboard();
}

function renderPacientes() {
  el.listaPacientes.innerHTML = '';

  if (estado.pacientes.length === 0) {
    el.listaPacientes.innerHTML = `
      <tr>
        <td colspan="5">Nenhum paciente cadastrado.</td>
      </tr>
    `;
    return;
  }

  estado.pacientes.forEach((paciente) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${paciente.id}</td>
      <td>${paciente.nome}</td>
      <td>${paciente.idade}</td>
      <td>${paciente.telefone}</td>
      <td>
        <button class="btn btn-edit" data-action="editar-paciente" data-id="${paciente.id}">Editar</button>
        <button class="btn btn-delete" data-action="excluir-paciente" data-id="${paciente.id}">Excluir</button>
      </td>
    `;

    el.listaPacientes.appendChild(tr);
  });
}

function preencherSelectPacientes() {
  el.consultaPaciente.innerHTML = '<option value="">Selecione um paciente</option>';

  estado.pacientes.forEach((paciente) => {
    const option = document.createElement('option');
    option.value = paciente.id;
    option.textContent = `${paciente.id} - ${paciente.nome}`;
    el.consultaPaciente.appendChild(option);
  });
}

function entrarModoEdicaoPaciente(paciente) {
  el.pacienteId.value = paciente.id;
  el.pacienteNome.value = paciente.nome;
  el.pacienteIdade.value = paciente.idade;
  el.pacienteTelefone.value = paciente.telefone;

  el.modoPaciente.textContent = `Modo: Edição (ID ${paciente.id})`;
  el.btnSalvarPaciente.textContent = 'Atualizar Paciente';
  el.btnCancelarPaciente.classList.remove('hidden');

  document.getElementById('tab-pacientes').scrollIntoView({ behavior: 'smooth' });
}

function sairModoEdicaoPaciente() {
  el.pacienteId.value = '';
  el.formPaciente.reset();

  el.modoPaciente.textContent = 'Modo: Cadastro';
  el.btnSalvarPaciente.textContent = 'Salvar Paciente';
  el.btnCancelarPaciente.classList.add('hidden');
}

async function salvarPaciente(event) {
  event.preventDefault();

  const payload = {
    nome: el.pacienteNome.value.trim(),
    idade: Number(el.pacienteIdade.value),
    telefone: el.pacienteTelefone.value.trim()
  };

  try {
    if (el.pacienteId.value) {
      await apiPut(`${API_BASE}/pacientes/${el.pacienteId.value}`, payload);
      mostrarMensagem('Paciente atualizado com sucesso!');
    } else {
      await apiPost(`${API_BASE}/pacientes`, payload);
      mostrarMensagem('Paciente cadastrado com sucesso!');
    }

    sairModoEdicaoPaciente();
    await carregarPacientes();
    await carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

async function excluirPaciente(id) {
  const confirmar = confirm('Tem certeza que deseja excluir este paciente?');

  if (!confirmar) return;

  try {
    await apiDelete(`${API_BASE}/pacientes/${id}`);
    mostrarMensagem('Paciente excluído com sucesso!');
    await carregarPacientes();
    await carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

// ====================
// MÉDICOS
// ====================

async function carregarMedicos() {
  estado.medicos = await apiGet(`${API_BASE}/medicos`);
  renderMedicos();
  preencherSelectMedicos();
  atualizarDashboard();
}

function renderMedicos() {
  el.listaMedicos.innerHTML = '';

  if (estado.medicos.length === 0) {
    el.listaMedicos.innerHTML = `
      <tr>
        <td colspan="4">Nenhum médico cadastrado.</td>
      </tr>
    `;
    return;
  }

  estado.medicos.forEach((medico) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${medico.id}</td>
      <td>${medico.nome}</td>
      <td>${medico.especialidade}</td>
      <td>
        <button class="btn btn-edit" data-action="editar-medico" data-id="${medico.id}">Editar</button>
        <button class="btn btn-delete" data-action="excluir-medico" data-id="${medico.id}">Excluir</button>
      </td>
    `;

    el.listaMedicos.appendChild(tr);
  });
}

function preencherSelectMedicos() {
  el.consultaMedico.innerHTML = '<option value="">Selecione um médico</option>';

  estado.medicos.forEach((medico) => {
    const option = document.createElement('option');
    option.value = medico.id;
    option.textContent = `${medico.id} - ${medico.nome}`;
    el.consultaMedico.appendChild(option);
  });
}

function entrarModoEdicaoMedico(medico) {
  el.medicoId.value = medico.id;
  el.medicoNome.value = medico.nome;
  el.medicoEspecialidade.value = medico.especialidade;

  el.modoMedico.textContent = `Modo: Edição (ID ${medico.id})`;
  el.btnSalvarMedico.textContent = 'Atualizar Médico';
  el.btnCancelarMedico.classList.remove('hidden');

  document.getElementById('tab-medicos').scrollIntoView({ behavior: 'smooth' });
}

function sairModoEdicaoMedico() {
  el.medicoId.value = '';
  el.formMedico.reset();

  el.modoMedico.textContent = 'Modo: Cadastro';
  el.btnSalvarMedico.textContent = 'Salvar Médico';
  el.btnCancelarMedico.classList.add('hidden');
}

async function salvarMedico(event) {
  event.preventDefault();

  const payload = {
    nome: el.medicoNome.value.trim(),
    especialidade: el.medicoEspecialidade.value.trim()
  };

  try {
    if (el.medicoId.value) {
      await apiPut(`${API_BASE}/medicos/${el.medicoId.value}`, payload);
      mostrarMensagem('Médico atualizado com sucesso!');
    } else {
      await apiPost(`${API_BASE}/medicos`, payload);
      mostrarMensagem('Médico cadastrado com sucesso!');
    }

    sairModoEdicaoMedico();
    await carregarMedicos();
    await carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

async function excluirMedico(id) {
  const confirmar = confirm('Tem certeza que deseja excluir este médico?');

  if (!confirmar) return;

  try {
    await apiDelete(`${API_BASE}/medicos/${id}`);
    mostrarMensagem('Médico excluído com sucesso!');
    await carregarMedicos();
    await carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

// ====================
// CONSULTAS
// ====================

async function carregarConsultas() {
  estado.consultas = await apiGet(`${API_BASE}/consultas`);
  renderConsultas();
  atualizarDashboard();
}

function renderConsultas() {
  el.listaConsultas.innerHTML = '';

  if (estado.consultas.length === 0) {
    el.listaConsultas.innerHTML = `
      <tr>
        <td colspan="6">Nenhuma consulta cadastrada.</td>
      </tr>
    `;
    return;
  }

  estado.consultas.forEach((consulta) => {
    const tr = document.createElement('tr');

    const pacienteTexto = consulta.paciente_nome || consulta.paciente_id;
    const medicoTexto = consulta.medico_nome || consulta.medico_id;

    tr.innerHTML = `
      <td>${consulta.id}</td>
      <td>${pacienteTexto}</td>
      <td>${medicoTexto}</td>
      <td>${formatarDataParaInput(consulta.data_consulta)}</td>
      <td>${consulta.descricao ?? ''}</td>
      <td>
        <button class="btn btn-edit" data-action="editar-consulta" data-id="${consulta.id}">Editar</button>
        <button class="btn btn-delete" data-action="excluir-consulta" data-id="${consulta.id}">Excluir</button>
      </td>
    `;

    el.listaConsultas.appendChild(tr);
  });
}

function entrarModoEdicaoConsulta(consulta) {
  el.consultaId.value = consulta.id;
  el.consultaPaciente.value = consulta.paciente_id;
  el.consultaMedico.value = consulta.medico_id;
  el.consultaData.value = formatarDataParaInput(consulta.data_consulta);
  el.consultaDescricao.value = consulta.descricao ?? '';

  el.modoConsulta.textContent = `Modo: Edição (ID ${consulta.id})`;
  el.btnSalvarConsulta.textContent = 'Atualizar Consulta';
  el.btnCancelarConsulta.classList.remove('hidden');

  document.getElementById('tab-consultas').scrollIntoView({ behavior: 'smooth' });
}

function sairModoEdicaoConsulta() {
  el.consultaId.value = '';
  el.formConsulta.reset();

  el.modoConsulta.textContent = 'Modo: Cadastro';
  el.btnSalvarConsulta.textContent = 'Salvar Consulta';
  el.btnCancelarConsulta.classList.add('hidden');
}

async function salvarConsulta(event) {
  event.preventDefault();

  const payload = {
    paciente_id: Number(el.consultaPaciente.value),
    medico_id: Number(el.consultaMedico.value),
    data_consulta: formatarDataParaBanco(el.consultaData.value),
    descricao: el.consultaDescricao.value.trim()
  };

  try {
    if (el.consultaId.value) {
      await apiPut(`${API_BASE}/consultas/${el.consultaId.value}`, payload);
      mostrarMensagem('Consulta atualizada com sucesso!');
    } else {
      await apiPost(`${API_BASE}/consultas`, payload);
      mostrarMensagem('Consulta cadastrada com sucesso!');
    }

    sairModoEdicaoConsulta();
    await carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

async function excluirConsulta(id) {
  const confirmar = confirm('Tem certeza que deseja excluir esta consulta?');

  if (!confirmar) return;

  try {
    await apiDelete(`${API_BASE}/consultas/${id}`);
    mostrarMensagem('Consulta excluída com sucesso!');
    await carregarConsultas();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

// ====================
// EVENTOS DAS TABELAS
// ====================

function registrarEventosTabelas() {
  el.listaPacientes.addEventListener('click', async (event) => {
    const botao = event.target.closest('button');
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const action = botao.dataset.action;

    if (action === 'editar-paciente') {
      const paciente = estado.pacientes.find((item) => item.id === id);
      if (paciente) entrarModoEdicaoPaciente(paciente);
    }

    if (action === 'excluir-paciente') {
      await excluirPaciente(id);
    }
  });

  el.listaMedicos.addEventListener('click', async (event) => {
    const botao = event.target.closest('button');
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const action = botao.dataset.action;

    if (action === 'editar-medico') {
      const medico = estado.medicos.find((item) => item.id === id);
      if (medico) entrarModoEdicaoMedico(medico);
    }

    if (action === 'excluir-medico') {
      await excluirMedico(id);
    }
  });

  el.listaConsultas.addEventListener('click', async (event) => {
    const botao = event.target.closest('button');
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const action = botao.dataset.action;

    if (action === 'editar-consulta') {
      const consulta = estado.consultas.find((item) => item.id === id);
      if (consulta) entrarModoEdicaoConsulta(consulta);
    }

    if (action === 'excluir-consulta') {
      await excluirConsulta(id);
    }
  });
}

// ====================
// REGISTRO DE EVENTOS
// ====================

function registrarEventos() {
  el.formPaciente.addEventListener('submit', salvarPaciente);
  el.formMedico.addEventListener('submit', salvarMedico);
  el.formConsulta.addEventListener('submit', salvarConsulta);

  el.btnCancelarPaciente.addEventListener('click', sairModoEdicaoPaciente);
  el.btnCancelarMedico.addEventListener('click', sairModoEdicaoMedico);
  el.btnCancelarConsulta.addEventListener('click', sairModoEdicaoConsulta);

  registrarEventosTabelas();
}

// ====================
// INIT
// ====================

async function init() {
  try {
    alternarAbas();
    registrarEventos();

    await carregarPacientes();
    await carregarMedicos();
    await carregarConsultas();
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao inicializar o sistema', 'error');
  }
}

init();