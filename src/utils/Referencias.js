export const distanciaEmKm = (origem, destino) => {
  const radianos = (graus) => (graus * Math.PI) / 180;
  const diferencaLatitude = radianos(destino.latitude - origem.latitude);
  const diferencaLongitude = radianos(destino.longitude - origem.longitude);
  const a = Math.sin(diferencaLatitude / 2) ** 2
    + Math.cos(radianos(origem.latitude))
      * Math.cos(radianos(destino.latitude))
      * Math.sin(diferencaLongitude / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const cidadesReferenciaBR = [
  { nome: 'São Paulo', uf: 'SP', latitude: -23.5505, longitude: -46.6333 },
  { nome: 'Rio de Janeiro', uf: 'RJ', latitude: -22.9068, longitude: -43.1729 },
  { nome: 'Belo Horizonte', uf: 'MG', latitude: -19.9167, longitude: -43.9345 },
  { nome: 'Brasília', uf: 'DF', latitude: -15.7975, longitude: -47.8919 },
  { nome: 'Salvador', uf: 'BA', latitude: -12.9714, longitude: -38.5014 },
  { nome: 'Recife', uf: 'PE', latitude: -8.0476, longitude: -34.8770 },
  { nome: 'Fortaleza', uf: 'CE', latitude: -3.7172, longitude: -38.5434 },
  { nome: 'Curitiba', uf: 'PR', latitude: -25.4284, longitude: -49.2733 },
  { nome: 'Porto Alegre', uf: 'RS', latitude: -30.0346, longitude: -51.2177 },
  { nome: 'Manaus', uf: 'AM', latitude: -3.1190, longitude: -60.0217 },
];

export const obterCidadeReferencia = (probe) => {
  if (probe?.countryCode !== 'BR'
    || !Number.isFinite(probe?.location?.latitude)
    || !Number.isFinite(probe?.location?.longitude)) return null;

  const maisProxima = cidadesReferenciaBR
    .map((cidade) => ({ cidade, distancia: distanciaEmKm(probe.location, cidade) }))
    .sort((a, b) => a.distancia - b.distancia)[0];

  return maisProxima?.distancia <= 50 ? maisProxima.cidade : null;
};

export const obterNomeLocalReferencia = (probe) => {
  const cidade = obterCidadeReferencia(probe);
  if (cidade) return `${cidade.nome} (${cidade.uf})`;
  if (probe?.countryCode === 'BR') return 'Brasil';
  return probe?.countryCode || 'Local não informado';
};
