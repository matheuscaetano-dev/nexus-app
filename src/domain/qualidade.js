// Níveis (RQ01), atividades (RQ03) e períodos (RQ04). Textos em linguagem simples.
export const NIVEIS = {
  boa: {
    id: 'boa', rotulo: 'Boa', simbolo: '✓', pontos: 3,
    resumo: 'A conexão deve funcionar bem neste período.',
    significado: 'Dá para fazer quase tudo, inclusive chamadas de vídeo e jogos online.',
  },
  regular: {
    id: 'regular', rotulo: 'Regular', simbolo: '!', pontos: 2,
    resumo: 'A conexão pode apresentar alguma instabilidade neste período.',
    significado: 'Funciona para o dia a dia, mas atividades mais pesadas podem oscilar.',
  },
  instavel: {
    id: 'instavel', rotulo: 'Instável', simbolo: '✕', pontos: 1,
    resumo: 'A conexão deve falhar com frequência neste período.',
    significado: 'Só atividades leves tendem a funcionar. Se puder, escolha outro horário.',
  },
};

// Aceita os textos que o modelo/API possa devolver ("Moderada", "GOOD", etc.).
export function normalizarQualidade(valor) {
  const t = String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  if (['boa', 'bom', 'good', 'excelente'].includes(t)) return NIVEIS.boa;
  if (['instavel', 'ruim', 'unstable', 'poor', 'bad'].includes(t)) return NIVEIS.instavel;
  if (['regular', 'moderada', 'moderate', 'fair'].includes(t)) return NIVEIS.regular;
  throw new Error(`Qualidade de conexão não reconhecida: ${valor}`);
}

// exigencia: pontos mínimos de qualidade (1 a 3) para a atividade funcionar bem.
export const ATIVIDADES = [
  { id: 'video', nome: 'Chamada de vídeo', exigencia: 3 },
  { id: 'jogos', nome: 'Jogos online', exigencia: 3 },
  { id: 'audio', nome: 'Chamada de áudio', exigencia: 2 },
  { id: 'streaming', nome: 'Assistir filmes e séries', exigencia: 2 },
  { id: 'arquivos', nome: 'Enviar arquivos grandes', exigencia: 2 },
  { id: 'web', nome: 'Navegar na internet', exigencia: 1 },
  { id: 'mensagens', nome: 'Enviar mensagens', exigencia: 1 },
];

export const ADEQUACOES = {
  adequada: { id: 'adequada', rotulo: 'Adequada', simbolo: '✓', cor: 'boa' },
  ressalvas: { id: 'ressalvas', rotulo: 'Com ressalvas', simbolo: '!', cor: 'regular' },
  nao_recomendada: { id: 'nao_recomendada', rotulo: 'Não recomendada', simbolo: '✕', cor: 'instavel' },
};

export function avaliarAtividade(nivel, atividade) {
  const folga = nivel.pontos - atividade.exigencia;
  const adequacao = folga >= 0 ? ADEQUACOES.adequada : folga === -1 ? ADEQUACOES.ressalvas : ADEQUACOES.nao_recomendada;
  const frases = {
    adequada: `${atividade.nome} deve funcionar bem neste período.`,
    ressalvas: `${atividade.nome} pode ter oscilações. Tenha uma alternativa pronta.`,
    nao_recomendada: `${atividade.nome} provavelmente terá falhas. Se puder, escolha outro horário.`,
  };
  return { adequacao, frase: frases[adequacao.id] };
}

export const PERIODOS = [
  { id: 'madrugada', nome: 'Madrugada', faixa: '0h às 6h', horaRef: 3, fim: 6 },
  { id: 'manha', nome: 'Manhã', faixa: '6h às 12h', horaRef: 9, fim: 12 },
  { id: 'tarde', nome: 'Tarde', faixa: '12h às 18h', horaRef: 15, fim: 18 },
  { id: 'noite', nome: 'Noite', faixa: '18h às 24h', horaRef: 20, fim: 24 },
];
