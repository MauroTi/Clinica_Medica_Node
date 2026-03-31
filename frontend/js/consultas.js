import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

let mostrarAlertaGlobal = null;
let atualizarDependenciasConsultas = null;

const estadoMedico = {
  editandoId: null,
  medicos: [],
};

function getElementos() {
  return {
    form: document.getElementById("form-medico"),
    inputId: document.getElementById("medico-id"),
    inputNome: document.getElementById("medico-nome"),
    inputEspecialidade: document.getElementById("medico-especialidade"),
    inputCrm: document.getElementById("medico-crm"),
    inputTelefone: document.getElementById("medico-telefone"),
    tituloForm: document.getElementById("medico-form-titulo"),
    btnSubmit: document.getElementById("medico-submit-btn"),
    btnCancelar: document.getElementById("medico-cancelar-btn"),
    lista: document.getElementById("lista-medicos"),
    btnRecarregar: document.getElementById("btn-recarregar-medicos"),
  };
}

function alertar(tipo, mensagem) {
  if (typeof mostrarAlertaGlobal === "function") {
    mostrarAlertaGlobal(tipo, mensagem);
  } else {
    alert(mensagem);
  }
}

function resetarFormularioMedico() {
  const el = getElementos();

  estadoMedico.editandoId = null;
  el.form.reset();
  el.inputId.value = "";
  el.tituloForm.textContent = "Cadastrar médico";
  el.btnSubmit.textContent = "Salvar médico";
  el.btnCancelar.classList.add("hidden");
}

function preencherFormularioMedico(medico) {
  const el = getElementos();

  estadoMedico.editandoId = medico.id;
  el.inputId.value = medico.id;
  el.inputNome.value = medico.nome || "";
  el.inputEspecialidade.value = medico.especialidade || "";
  el.inputCrm.value = medico.crm || "";
  el.inputTelefone.value = medico.telefone || "";

  el.tituloForm.textContent = "Editando médico";
  el.btnSubmit.textContent = "Atualizar médico";
  el.btnCancelar.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderizarMedicos() {
  const el = getElementos();

  if (!estadoMedico.medicos.length) {
    el.lista.innerHTML = `<div class="empty-state">Nenhum médico cadastrado.</div>`;
    return;
  }

  el.lista.innerHTML = estadoMedico.medicos
    .map(
      (medico) => `
        <div class="item-card">
          <h4>${medico.nome}</h4>
          <p><strong>ID:</strong> ${medico.id}</p>
          <p><strong>Especialidade:</strong> ${medico.especialidade}</p>
          <p><strong>CRM:</strong> ${medico.crm}</p>
          <p><strong>Telefone:</strong> ${medico.telefone}</p>
          <div class="item-actions">
            <button class="btn warning btn-editar-medico" data-id="${medico.id}">Editar</button>
            <button class="btn danger btn-excluir-medico" data-id="${medico.id}">Excluir</button>
          </div>
        </div>
      `,
    )
    .join("");

  adicionarEventosListaMedicos();
}

function adicionarEventosListaMedicos() {
  document.querySelectorAll(".btn-editar-medico").forEach((botao) => {
    botao.addEventListener("click", () => {
      const id = Number(botao.dataset.id);
      const medico = estadoMedico.medicos.find((item) => item.id === id);

      if (!medico) {
        alertar("error", "Médico não encontrado para edição.");
        return;
      }

      preencherFormularioMedico(medico);
    });
  });

  document.querySelectorAll(".btn-excluir-medico").forEach((botao) => {
    botao.addEventListener("click", async () => {
      const id = Number(botao.dataset.id);

      const confirmou = confirm("Tem certeza que deseja excluir este médico?");
      if (!confirmou) return;

      try {
        await apiDelete(`/medicos/${id}`);
        alertar("success", "Médico excluído com sucesso.");
        await carregarMedicos();

        if (typeof atualizarDependenciasConsultas === "function") {
          await atualizarDependenciasConsultas();
        }

        if (estadoMedico.editandoId === id) {
          resetarFormularioMedico();
        }
      } catch (error) {
        alertar("error", error.message || "Erro ao excluir médico.");
      }
    });
  });
}

export async function carregarMedicos() {
  try {
    estadoMedico.medicos = await apiGet("/medicos");
    renderizarMedicos();
  } catch (error) {
    alertar("error", error.message || "Erro ao carregar médicos.");
  }
}

async function salvarMedico(event) {
  event.preventDefault();

  const el = getElementos();

  const payload = {
    nome: el.inputNome.value.trim(),
    especialidade: el.inputEspecialidade.value.trim(),
    crm: el.inputCrm.value.trim(),
    telefone: el.inputTelefone.value.trim(),
  };

  try {
    if (estadoMedico.editandoId) {
      await apiPut(`/medicos/${estadoMedico.editandoId}`, payload);
      alertar("success", "Médico atualizado com sucesso.");
    } else {
      await apiPost("/medicos", payload);
      alertar("success", "Médico cadastrado com sucesso.");
    }

    resetarFormularioMedico();
    await carregarMedicos();

    if (typeof atualizarDependenciasConsultas === "function") {
      await atualizarDependenciasConsultas();
    }
  } catch (error) {
    alertar("error", error.message || "Erro ao salvar médico.");
  }
}

export function configurarMedicos(opcoes = {}) {
  mostrarAlertaGlobal = opcoes.mostrarAlertaGlobal || null;
  atualizarDependenciasConsultas =
    opcoes.atualizarDependenciasConsultas || null;

  const el = getElementos();

  el.form.addEventListener("submit", salvarMedico);
  el.btnCancelar.addEventListener("click", resetarFormularioMedico);
  el.btnRecarregar.addEventListener("click", carregarMedicos);

  resetarFormularioMedico();
}
