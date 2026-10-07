// Dados simulados. Só é usado quando EXPO_PUBLIC_USAR_MOCK=true.
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export const modelosMock = [
  { id: 'model-a', name: 'Modelo A', description: 'Modelo demonstrativo A', groupName: 'Grupo 1', algorithm: 'Linear Regression', version: '1.0', active: true },
  { id: 'model-b', name: 'Modelo B', description: 'Modelo demonstrativo B', groupName: 'Grupo 2', algorithm: 'Random Forest', version: '1.0', active: true },
  { id: 'model-c', name: 'Modelo C', description: 'Modelo demonstrativo C', groupName: 'Grupo 3', algorithm: 'Gradient Boosting', version: '1.0', active: true },
  { id: 'model-d', name: 'Modelo D', description: 'Modelo demonstrativo D', groupName: 'Grupo 4', algorithm: 'Time Series', version: '1.0', active: true },
];

export const locaisMock = [
  { probeId: 900001, countryCode: 'BR', asnV4: 28573, asnV6: null, location: { latitude: -23.55, longitude: -46.63 } },
  { probeId: 900002, countryCode: 'BR', asnV4: 28573, asnV6: null, location: { latitude: -22.91, longitude: -43.20 } },
];

export async function previsaoMock(dataHoraISO) {
  await espera(600);
  const h = new Date(dataHoraISO).getHours();
  const qualidade = h >= 23 ? 'Instável' : h >= 12 ? 'Moderada' : 'Boa';
  const [latencia, perda] = { Boa: [18.4, 0.4], Moderada: [49.1, 2.1], 'Instável': [128.7, 6.8] }[qualidade];
  return { modeloUsado: 'Modelo C', qualidade, latencia, perdaPacotes: perda, distanciaProbe: 46.3 };
}

export async function atividadeMock({ modelId, dateTime, activity }) {
  const p = await previsaoMock(dateTime);
  const quality = p.qualidade === 'Boa' ? 'GOOD' : p.qualidade === 'Moderada' ? 'MODERATE' : 'UNSTABLE';
  return {
    model: { id: modelId, name: modelosMock.find((m) => m.id === modelId)?.name || modelId, version: '1.0' },
    activity,
    suitable: quality === 'GOOD' || (quality === 'MODERATE' && ['AUDIO_CALL', 'STREAMING', 'FILE_UPLOAD', 'WEB_BROWSING', 'MESSAGING'].includes(activity)),
    forecast: { quality, predictedAvgRttMs: p.latencia, predictedPacketLossPct: p.perdaPacotes },
    recommendation: { code: 'REDUCE_NETWORK_USAGE', message: quality === 'GOOD' ? 'A conexão deve funcionar bem neste período.' : 'A conexão pode apresentar alguma instabilidade neste período.' },
  };
}
