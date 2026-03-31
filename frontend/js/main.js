import { inicializarPacientes } from "./pacientes.js";
import { inicializarMedicos } from "./medicos.js";
import { inicializarConsultas } from "./consultas.js";

function inicializarAbas() {
  const botoesAbas = document.querySelectorAll(".aba-btn");
  const conteudos = document.querySelectorAll(".aba-conteudo");

  botoesAbas.forEach((botao) => {
    botao.addEventListener("click", () => {
      const abaAlvo = botao.dataset.aba;

      botoesAbas.forEach((b) => b.classList.remove("ativa"));
      conteudos.forEach((c) => c.classList.remove("ativa"));

      botao.classList.add("ativa");

      const conteudoAlvo = document.getElementById(`aba-${abaAlvo}`);
      if (conteudoAlvo) {
        conteudoAlvo.classList.add("ativa");
      }
    });
  });
}

function inicializarApp() {
  inicializarAbas();
  inicializarPacientes();
  inicializarMedicos();
  inicializarConsultas();
}

document.addEventListener("DOMContentLoaded", inicializarApp);
