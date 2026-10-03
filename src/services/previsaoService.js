import { USAR_MOCK } from '../config';
import { ErroApi, get } from './api';
import { previsaoMock } from './mock';
import { normalizarQualidade } from '../domain/qualidade';

const respostaInvalida = (mensagem) => {
  throw new ErroApi(mensagem, 'resposta');
};

// ÚNICO lugar que conhece o formato da API. Se o contrato mudar, ajuste só aqui.
// Contrato esperado (confirme com o grupo de Estrutura de Dados):
//   GET {API_URL}/api/previsao?horario=<ISO 8601>
//   -> { modeloUsado, qualidade, latencia (ms), perdaPacotes (%), distanciaProbe (km) }
function paraModeloDoApp(bruto, dataHora) {
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) {
    respostaInvalida('A API retornou uma previsão em formato inválido.');
  }
  if (typeof bruto.qualidade !== 'string' || !bruto.qualidade.trim()) {
    respostaInvalida('A resposta da API não contém uma qualidade de conexão válida.');
  }

  const latenciaMs = bruto.latencia ?? bruto.latenciaMs;
  const perdaPercentual = bruto.perdaPacotes ?? bruto.perda;
  const distancia = bruto.distanciaProbe;
  if (typeof latenciaMs !== 'number' || !Number.isFinite(latenciaMs) || latenciaMs < 0) {
    respostaInvalida('A resposta da API contém uma latência inválida.');
  }
  if (typeof perdaPercentual !== 'number' || !Number.isFinite(perdaPercentual) || perdaPercentual < 0 || perdaPercentual > 100) {
    respostaInvalida('A resposta da API contém um percentual de perda inválido.');
  }
  if (distancia != null && (typeof distancia !== 'number' || !Number.isFinite(distancia) || distancia < 0)) {
    respostaInvalida('A resposta da API contém uma distância inválida.');
  }

  let nivel;
  try {
    nivel = normalizarQualidade(bruto.qualidade);
  } catch {
    respostaInvalida('A resposta da API contém uma qualidade não reconhecida.');
  }

  return {
    dataHora,
    modelo: bruto.modeloUsado ?? bruto.modelo ?? null,
    nivel,
    latenciaMs,
    perdaPercentual,
    distanciaProbeKm: distancia ?? null,
  };
}

export async function obterPrevisao(dataHora) {
  const iso = dataHora.toISOString();
  const bruto = USAR_MOCK ? await previsaoMock(iso) : await get('/api/previsao', { horario: iso });
  return paraModeloDoApp(bruto, dataHora);
}

export function obterProximasHoras(base, deslocamentosEmHoras) {
  return Promise.all(deslocamentosEmHoras.map((h) => obterPrevisao(new Date(base.getTime() + h * 3600000))));
}
