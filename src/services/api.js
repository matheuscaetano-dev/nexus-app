import { API_URL, TIMEOUT_MS } from '../config';

export class ErroApi extends Error {
  constructor(mensagem, tipo, status) {
    super(mensagem);
    this.tipo = tipo;
    this.status = status;
  }
}

async function requisitar(metodo, caminho, parametros = {}, corpo) {
  if (!API_URL) {
    throw new ErroApi('Configure EXPO_PUBLIC_API_URL para usar a API', 'configuracao');
  }

  const base = API_URL.replace(/\/+$/, '');
  let url;
  try {
    const destino = new URL(`${base}${caminho}`);
    const desenvolvimento = typeof __DEV__ !== 'undefined' && __DEV__;
    if (!['http:', 'https:'].includes(destino.protocol)) {
      throw new Error('Protocolo inválido');
    }
    if (!desenvolvimento && destino.protocol !== 'https:') {
      throw new ErroApi('A API deve usar HTTPS fora do modo de desenvolvimento', 'configuracao');
    }
    const entradas = Object.entries(parametros).filter(([, valor]) => valor != null);
    const query = new URLSearchParams(entradas.map(([chave, valor]) => [chave, String(valor)])).toString();
    url = `${destino.toString()}${query ? `?${query}` : ''}`;
  } catch (erro) {
    if (erro instanceof ErroApi) throw erro;
    throw new ErroApi('EXPO_PUBLIC_API_URL não contém uma URL válida', 'configuracao');
  }

  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TIMEOUT_MS);
  try {
    const resposta = await fetch(url, {
      method: metodo,
      signal: controle.signal,
      headers: { Accept: 'application/json', ...(corpo ? { 'Content-Type': 'application/json' } : {}) },
      ...(corpo ? { body: JSON.stringify(corpo) } : {}),
    });
    if (!resposta.ok) throw new ErroApi(`Servidor respondeu ${resposta.status}`, 'servidor', resposta.status);
    try {
      return await resposta.json();
    } catch {
      throw new ErroApi('A API retornou uma resposta que não é JSON válido', 'resposta');
    }
  } catch (e) {
    if (e instanceof ErroApi) throw e;
    if (e.name === 'AbortError') throw new ErroApi('Tempo esgotado ao consultar a API', 'timeout');
    throw new ErroApi('Não foi possível conectar à API', 'rede');
  } finally {
    clearTimeout(timer);
  }
}

export const get = (caminho, parametros = {}) => requisitar('GET', caminho, parametros);
export const post = (caminho, corpo) => requisitar('POST', caminho, {}, corpo);
