const API_BASE = "http://localhost:3000/api";

const CORES = ["#2563eb", "#16a34a", "#f59e0b"];

const elementos = {
  totalPacientes: document.getElementById("dashTotalPacientes"),
  totalMedicos: document.getElementById("dashTotalMedicos"),
  totalConsultas: document.getElementById("dashTotalConsultas"),
  mediaConsultas: document.getElementById("dashMediaConsultas"),
  canvas: document.getElementById("graficoPizza"),
  legenda: document.getElementById("legendaGrafico"),
  tooltip: document.getElementById("tooltipGrafico"),
};

const estado = {
  fatias: [],
  totais: {
    pacientes: 0,
    medicos: 0,
    consultas: 0,
  },
};

async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.mensagem || data?.erro || "Erro ao buscar dados");
  }

  return data;
}

function atualizarCards() {
  const { pacientes, medicos, consultas } = estado.totais;
  elementos.totalPacientes.textContent = pacientes;
  elementos.totalMedicos.textContent = medicos;
  elementos.totalConsultas.textContent = consultas;

  const media = pacientes > 0 ? (consultas / pacientes).toFixed(2) : "0.00";
  elementos.mediaConsultas.textContent = media;
}

function montarFatias() {
  const dados = [
    { label: "Pacientes", valor: estado.totais.pacientes, cor: CORES[0] },
    { label: "Médicos", valor: estado.totais.medicos, cor: CORES[1] },
    { label: "Consultas", valor: estado.totais.consultas, cor: CORES[2] },
  ];

  const total = dados.reduce((acc, item) => acc + item.valor, 0);
  let anguloAtual = -Math.PI / 2;

  estado.fatias = dados.map((item) => {
    const percentual = total > 0 ? (item.valor / total) * 100 : 0;
    const angulo = total > 0 ? (item.valor / total) * Math.PI * 2 : 0;

    const fatia = {
      ...item,
      percentual,
      inicio: anguloAtual,
      fim: anguloAtual + angulo,
    };

    anguloAtual += angulo;
    return fatia;
  });
}

function renderizarLegenda() {
  elementos.legenda.innerHTML = "";

  estado.fatias.forEach((fatia) => {
    const li = document.createElement("li");
    li.className = "legenda-item";
    li.innerHTML = `
      <span class="legenda-cor" style="background:${fatia.cor}"></span>
      <div class="legenda-texto">
        <span>${fatia.label}</span>
        <span class="legenda-valor">${fatia.valor} (${fatia.percentual.toFixed(1)}%)</span>
      </div>
    `;
    elementos.legenda.appendChild(li);
  });
}

function desenharGrafico(indiceHover = -1) {
  const ctx = elementos.canvas.getContext("2d");
  const largura = elementos.canvas.width;
  const altura = elementos.canvas.height;
  const cx = largura / 2;
  const cy = altura / 2;
  const raio = 130;

  ctx.clearRect(0, 0, largura, altura);

  if (!estado.fatias.some((f) => f.valor > 0)) {
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.fillStyle = "#e5e7eb";
    ctx.fill();

    ctx.fillStyle = "#475569";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Sem dados", cx, cy + 6);
    return;
  }

  estado.fatias.forEach((fatia, index) => {
    const hover = index === indiceHover;
    const raioAtual = hover ? raio + 10 : raio;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, raioAtual, fatia.inicio, fatia.fim);
    ctx.closePath();
    ctx.fillStyle = fatia.cor;
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 58, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Total", cx, cy - 6);
  ctx.font = "bold 22px Arial";
  ctx.fillText(
    String(estado.fatias.reduce((acc, item) => acc + item.valor, 0)),
    cx,
    cy + 22,
  );
}

function obterFatiaPorPosicao(event) {
  const rect = elementos.canvas.getBoundingClientRect();
  const escalaX = elementos.canvas.width / rect.width;
  const escalaY = elementos.canvas.height / rect.height;
  const x = (event.clientX - rect.left) * escalaX;
  const y = (event.clientY - rect.top) * escalaY;

  const cx = elementos.canvas.width / 2;
  const cy = elementos.canvas.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const distancia = Math.sqrt(dx * dx + dy * dy);

  if (distancia < 58 || distancia > 145) {
    return { indice: -1, fatia: null };
  }

  let angulo = Math.atan2(dy, dx);
  if (angulo < -Math.PI / 2) {
    angulo += Math.PI * 2;
  }

  const indice = estado.fatias.findIndex(
    (fatia) => angulo >= fatia.inicio && angulo <= fatia.fim,
  );

  return {
    indice,
    fatia: indice >= 0 ? estado.fatias[indice] : null,
  };
}

function esconderTooltip() {
  elementos.tooltip.classList.add("hidden");
}

function mostrarTooltip(event, fatia) {
  elementos.tooltip.innerHTML = `
    <strong>${fatia.label}</strong><br>
    Quantidade: ${fatia.valor}<br>
    Percentual: ${fatia.percentual.toFixed(1)}%
  `;

  const rect = elementos.canvas.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  elementos.tooltip.style.left = `${offsetX + 18}px`;
  elementos.tooltip.style.top = `${offsetY + 18}px`;
  elementos.tooltip.classList.remove("hidden");
}

function configurarEventosGrafico() {
  elementos.canvas.addEventListener("mousemove", (event) => {
    const { indice, fatia } = obterFatiaPorPosicao(event);

    if (!fatia) {
      desenharGrafico();
      esconderTooltip();
      return;
    }

    desenharGrafico(indice);
    mostrarTooltip(event, fatia);
  });

  elementos.canvas.addEventListener("mouseleave", () => {
    desenharGrafico();
    esconderTooltip();
  });
}

async function inicializarDashboard() {
  try {
    const [pacientes, medicos, consultas] = await Promise.all([
      apiGet("/pacientes"),
      apiGet("/medicos"),
      apiGet("/consultas"),
    ]);

    estado.totais.pacientes = pacientes.length;
    estado.totais.medicos = medicos.length;
    estado.totais.consultas = consultas.length;

    atualizarCards();
    montarFatias();
    renderizarLegenda();
    desenharGrafico();
    configurarEventosGrafico();
  } catch (error) {
    console.error(error);
    alert(`Erro ao carregar dashboard: ${error.message}`);
  }
}

inicializarDashboard();
