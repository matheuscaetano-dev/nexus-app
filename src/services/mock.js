// Dados simulados. Só é usado quando EXPO_PUBLIC_USAR_MOCK=true.
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export async function previsaoMock(dataHoraISO) {
  await espera(600);
  const h = new Date(dataHoraISO).getHours();
  const qualidade = h >= 23 ? 'Instável' : h >= 12 ? 'Moderada' : 'Boa';
  const [latencia, perda] = { Boa: [18.4, 0.4], Moderada: [49.1, 2.1], 'Instável': [128.7, 6.8] }[qualidade];
  return { modeloUsado: 'Modelo C', qualidade, latencia, perdaPacotes: perda, distanciaProbe: 46.3 };
}
