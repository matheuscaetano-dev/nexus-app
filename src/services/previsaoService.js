import { USAR_MOCK } from '../config';
import { ErroApi, get, post } from './api';
import { atividadeMock, locaisMock, modelosMock, previsaoMock } from './mock';
import { normalizarQualidade } from '../domain/qualidade';

const invalidar = (mensagem) => { throw new ErroApi(mensagem, 'resposta'); };

function validarLista(resposta, chave, nome) {
  if (!resposta || !Array.isArray(resposta[chave])) invalidar(`A API retornou uma lista de ${nome} inválida.`);
  return resposta[chave];
}

function mapearPrevisao(resposta, dataHora) {
  const prediction = resposta?.prediction;
  const quality = resposta?.assessment?.quality ?? prediction?.quality;
  const latenciaMs = prediction?.predictedAvgRttMs;
  const perdaPercentual = prediction?.predictedPacketLossPct;
  if (typeof latenciaMs !== 'number' || !Number.isFinite(latenciaMs) || typeof perdaPercentual !== 'number' || !Number.isFinite(perdaPercentual)) {
    invalidar('A resposta da API não contém RTT e perda de pacotes válidos.');
  }
  let nivel;
  try { nivel = normalizarQualidade(quality); } catch { invalidar('A API retornou uma qualidade que o app não reconhece.'); }
  const previsao = resposta.prediction || {};
  const probe = resposta.matchedProbe || {};
  const modelo = resposta.model || {};
  return {
    dataHora: previsao.predictionFor ? new Date(previsao.predictionFor) : dataHora,
    modelo: modelo.name || modelo.id || null,
    modeloId: modelo.id || null,
    probeId: probe.probeId ?? resposta.probeId ?? null,
    nivel,
    latenciaMs,
    perdaPercentual,
    distanciaProbeKm: probe.distanceKm ?? null,
    confianca: previsao.modelConfidence ?? null,
    recomendacao: resposta.recommendation?.message || null,
  };
}

export async function listarModelos() {
  if (USAR_MOCK) return modelosMock;
  return validarLista(await get('/api/v1/models'), 'items', 'modelos');
}

export async function listarLocais() {
  if (USAR_MOCK) return locaisMock;
  return validarLista(await get('/api/v1/locations'), 'items', 'localidades');
}

export async function obterPrevisao(dataHora, local, modelo) {
  if (!local?.location || !modelo?.id) throw new ErroApi('Escolha um modelo e uma localização aproximada antes de consultar.', 'configuracao');
  if (USAR_MOCK) {
    const bruto = await previsaoMock(dataHora.toISOString());
    return mapearPrevisao({
      model: { id: modelo.id, name: modelo.name, version: modelo.version },
      requestedLocation: local.location,
      matchedProbe: { probeId: local.probeId, distanceKm: 2.7 },
      prediction: { predictionFor: dataHora.toISOString(), predictedAvgRttMs: bruto.latencia, predictedPacketLossPct: bruto.perdaPacotes },
      assessment: { quality: bruto.qualidade === 'Boa' ? 'GOOD' : bruto.qualidade === 'Moderada' ? 'MODERATE' : 'UNSTABLE', qualityScore: 68 },
    }, dataHora);
  }
  const bruto = await get('/api/v1/forecasts/nearby', {
    lat: local.location.latitude,
    lon: local.location.longitude,
    model_id: modelo.id,
  });
  return mapearPrevisao(bruto, dataHora);
}

export function obterProximasHoras(base, deslocamentosEmHoras, local, modelo) {
  return Promise.all(deslocamentosEmHoras.map((h) => obterPrevisao(new Date(base.getTime() + h * 3600000), local, modelo)));
}

export async function obterLinhaDoTempo(local, modelo, inicio, fim, limite = 24) {
  if (USAR_MOCK) return obterProximasHoras(inicio, Array.from({ length: Math.min(limite, 24) }, (_, i) => i), local, modelo);
  const atual = await obterPrevisao(inicio, local, modelo);
  const resposta = await get(`/api/v1/forecasts/probes/${atual.probeId}/timeline`, {
    model_id: modelo.id,
    from: inicio.toISOString(),
    to: fim.toISOString(),
    limit: limite,
  });
  if (!Array.isArray(resposta?.items)) invalidar('A API retornou uma linha do tempo inválida.');
  return resposta.items.map((item) => mapearPrevisao({
    model: resposta.model,
    probeId: resposta.probeId,
    prediction: { predictionFor: item.predictionFor, predictedAvgRttMs: item.predictedAvgRttMs, predictedPacketLossPct: item.predictedPacketLossPct },
    assessment: { quality: item.quality, qualityScore: item.qualityScore },
  }, new Date(item.predictionFor)));
}

export async function verificarAtividade({ local, modelo, dataHora, atividade }) {
  if (!local?.location || !modelo?.id) throw new ErroApi('Escolha um modelo e uma localização aproximada antes de planejar.', 'configuracao');
  const corpo = {
    modelId: modelo.id,
    latitude: local.location.latitude,
    longitude: local.location.longitude,
    dateTime: dataHora.toISOString(),
    activity: atividade,
  };
  const resposta = USAR_MOCK ? await atividadeMock(corpo) : await post('/api/v1/activity/check', corpo);
  const forecast = resposta?.forecast;
  if (typeof resposta?.suitable !== 'boolean' || !forecast) invalidar('A API retornou uma avaliação de atividade inválida.');
  return {
    ...resposta,
    previsao: mapearPrevisao({
      model: resposta.model,
      prediction: { predictedAvgRttMs: forecast.predictedAvgRttMs, predictedPacketLossPct: forecast.predictedPacketLossPct },
      assessment: { quality: forecast.quality },
      recommendation: resposta.recommendation,
    }, dataHora),
  };
}
