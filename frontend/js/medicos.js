import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

let mostrarAlertaGlobal = null;
let atualizarDependenciasConsultas = null;

const estadoPaciente = {
  editandoId: null,
  pacientes: []
};

function getElementos() {
  return {
    form: document.getElementById('form-paciente'),
    inputId: document.getElementById('paciente-id'),
    inputNome: document.getElementById('paciente-nome'),
    inputEmail: document.getElementById('paciente-email'),
    inputTelefone: document.getElementById('paciente-telefone'),
    inputDataNascimento: document.getElementById('paciente-data-nascimento'),
    tituloForm: document.getElementById('paciente-form-titulo'),
    btnSubmit: document.getElementById('paciente-submit-btn'),
    btnCancelar: document.getElementById('paciente-cancelar-btn'),
    lista: document.getElementById('lista-pacientes'),
    btnRecarregar: document.getElementById('btn-recarregar-pacientes')
  };
}

function alertar(tipo, mensagem) {
  if (typeof mostrarAlertaGlobal === 'function') {
    mostrarAlertaGlobal(tipo, mensagem);
  } else {
    alert(mensagem);
  }
}

function resetarFormularioPaciente() {
  const el = getElementos();

  estadoPaciente.editandoId = null;
  el.form.reset();
  el.inputId.value = '';
  el.tituloForm.textContent = 'Cadastrar paciente';
  el.btnSubmit.textContent = 'Salvar paciente';
  el.btnCancelar.classList.add('hidden');
}

function preencherFormularioPaciente(paciente) {
  const el = getElementos();

  estadoPaciente.editandoId = paciente.id;
  el.inputId.value = paciente.id;
  el.inputNome.value = paciente.nome || '';
  el.inputEmail.value = paciente.email || '';
  el.inputTelefone.value = paciente.telefone || '';
  el.inputDataNascimento.value = (paciente.data_nascimento || '').slice(0, 10);

  el.tituloForm.textContent = 'Editando paciente';
  el.btnSubmit.textContent = 'Atualizar paciente';
  el.btnCancelar.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarPacientes() {
  const el = getElementos();

  if (!estadoPaciente.pacientes.length) {
    el.lista.innerHTML = `<div class="empty-state">Nenhum paciente cadastrado.</div>`;
    return;
  }

  el.lista.innerHTML = estadoPaciente.pacientes
    .map(
      (paciente) => `
        <div class="item-card">
          <h4>${paciente.nome}</h4>
          <p><strong>ID:</strong> ${paciente.id}</p>
          <p><strong>E-mail:</strong> ${paciente.email}</p>
          <p><strong>Telefone:</strong> ${paciente.telefone}</p>
          <p><strong>Nascimento:</strong> ${(paciente.data_nascimento || '').slice(0, 10)}</p>
          <div class="item-actions">
            <button class="btn warning btn-editar-paciente" data-id="${paciente.id}">Editar</button>
            <button class="btn danger btn-excluir-paciente" data-id="${paciente.id}">Excluir</button>
          </div>
        </div>
      `
    )
    .join('');

  adicionarEventosListaPacientes();
}

function adicionarEventosListaPacientes() {
  document.querySelectorAll('.btn-editar-paciente').forEach((botao) => {
    botao.addEventListener('click', () => {
      const id = Number(botao.dataset.id);
      const paciente = estadoPaciente.pacientes.find((item) => item.id === id);

      if (!paciente) {
        alertar('error', 'Paciente não encontrado para edição.');
        return;
      }

      preencherFormularioPaciente(paciente);
    });
  });

  document.querySelectorAll('.btn-excluir-paciente').forEach((botao) => {
    botao.addEventListener('click', async () => {
      const id = Number(botao.dataset.id);

      const confirmou = confirm('Tem certeza que deseja excluir este paciente?');
      if (!confirmou) return;

      try {
        await apiDelete(`/pacientes/${id}`);
        alertar('success', 'Paciente excluído com sucesso.');
        await carregarPacientes();

        if (typeof atualizarDependenciasConsultas === 'function') {
          await atualizarDependenciasConsultas();
        }

        if (estadoPaciente.editandoId === id) {
          resetarFormularioPaciente();
        }
      } catch (error) {
        alertar('error', error.message || 'Erro ao excluir paciente.');
      }
    });
  });
}

export async function carregarPacientes() {
  try {
    estadoPaciente.pacientes = await apiGet('/pacientes');
    renderizarPacientes();
  } catch (error) {
    alertar('error', error.message || 'Erro ao carregar pacientes.');
  }
}

async function salvarPaciente(event) {
  event.preventDefault();

  const el = getElementos();

  const payload = {
    nome: el.inputNome.value.trim(),
    email: el.inputEmail.value.trim(),
    telefone: el.inputTelefone.value.trim(),
    data_nascimento: el.inputDataNascimento.value
  };

  try {
    if (estadoPaciente.editandoId) {
      await apiPut(`/pacientes/${estadoPaciente.editandoId}`, payload);
      alertar('success', 'Paciente atualizado com sucesso.');
    } else {
      await apiPost('/pacientes', payload);
      alertar('success', 'Paciente cadastrado com sucesso.');
    }

    resetarFormularioPaciente();
    await carregarPacientes();

    if (typeof atualizarDependenciasConsultas === 'function') {
      await atualizarDependenciasConsultas();
    }
  } catch (error) {
    alertar('error', error.message || 'Erro ao salvar paciente.');
  }
}

export function configurarPacientes(opcoes = {}) {
  mostrarAlertaGlobal = opcoes.mostrarAlertaGlobal || null;
  atualizarDependenciasConsultas = opcoes.atualizarDependenciasConsultas || null;

  const el = getElementos();

  el.form.addEventListener('submit', salvarPaciente);
  el.btnCancelar.addEventListener('click', resetarFormularioPaciente);
  el.btnRecarregar.addEventListener('click', carregarPacientes);

  resetarFormularioPaciente();
}