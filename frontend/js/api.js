const API_BASE = 'http://localhost:3000/api';

async function tratarResposta(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const mensagemErro =
      (isJson && data?.mensagem) ||
      (typeof data === 'string' && data) ||
      `Erro HTTP ${response.status}`;

    throw new Error(mensagemErro);
  }

  return data;
}

export async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  return tratarResposta(response);
}

export async function apiPost(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return tratarResposta(response);
}

export async function apiPut(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return tratarResposta(response);
}

export async function apiDelete(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE'
  });

  return tratarResposta(response);
}