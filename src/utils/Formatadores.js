const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const dois = (n) => String(n).padStart(2, '0');

export const inicioDaHora = (d = new Date()) => {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  return x;
};

export const formatarHora = (d) => `${dois(d.getHours())}:${dois(d.getMinutes())}`;

export function formatarDia(d, hoje = new Date()) {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const b = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const diff = Math.round((a - b) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  return `${DIAS[d.getDay()]}, ${dois(d.getDate())}/${dois(d.getMonth() + 1)}`;
}

export const formatarDiaHora = (d, hoje) => `${formatarDia(d, hoje)}, ${formatarHora(d)}`;
export const formatarNumero = (n, casas = 1) => Number(n).toFixed(casas).replace('.', ',');
export const formatarMs = (n) => `${formatarNumero(n)} ms`;
export const formatarPercentual = (n) => `${formatarNumero(n)}%`;

// Data/hora de referência para (dia + período). Hoje: nunca antes da hora atual.
export function dataDoPeriodo(diaOffset, periodo, agora = new Date()) {
  const d = new Date(agora);
  d.setDate(d.getDate() + diaOffset);
  const hora = diaOffset === 0 ? Math.max(periodo.horaRef, agora.getHours()) : periodo.horaRef;
  d.setHours(hora, 0, 0, 0);
  return d;
}

export const periodoJaPassou = (diaOffset, periodo, agora = new Date()) =>
  diaOffset === 0 && agora.getHours() >= periodo.fim;
