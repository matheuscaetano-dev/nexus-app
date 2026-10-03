import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import Tela from '../components/Tela';
import Cartao from '../components/Cartao';
import BadgeNivel from '../components/BadgeNivel';
import BotaoPrincipal from '../components/BotaoPrincipal';
import LinhaDetalhe from '../components/LinhaDetalhe';
import AvisoInfo from '../components/AvisoInfo';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import useAsync from '../hooks/useAsync';
import { obterPrevisao } from '../services/previsaoService';
import { ATIVIDADES, PERIODOS, avaliarAtividade } from '../domain/qualidade';
import { TERMOS } from '../domain/glossario';
import { dataDoPeriodo, formatarDia, formatarMs, formatarPercentual } from '../utils/Formatadores';
import { cores, fonte } from '../theme';

export default function ResultadoScreen({ route, navigation }) {
  const { atividadeId, diaOffset, periodoId } = route.params;
  const agora = useMemo(() => new Date(), []);
  const atividade = ATIVIDADES.find((a) => a.id === atividadeId);
  const periodo = PERIODOS.find((p) => p.id === periodoId);
  const dataHora = useMemo(() => dataDoPeriodo(diaOffset, periodo, agora), [diaOffset, periodoId]);
  const quando = `${formatarDia(dataHora, agora)}, ${periodo.nome.toLowerCase()}`;

  const { dados, carregando, erro, recarregar } = useAsync(() => obterPrevisao(dataHora), [dataHora.getTime()]);

  // Avisa leitores de tela quando o resultado chega (RNF08).
  useEffect(() => {
    if (!dados) return;
    const { adequacao } = avaliarAtividade(dados.nivel, atividade);
    AccessibilityInfo.announceForAccessibility(
      `Resultado: ${atividade.nome}, ${quando}. ${adequacao.rotulo}. Qualidade prevista ${dados.nivel.rotulo}.`
    );
  }, [dados]);

  if (carregando) return <Tela edges={[]}><EstadoCarregando mensagem="Buscando a previsão…" /></Tela>;
  if (erro) return <Tela edges={[]}><EstadoErro erro={erro} onTentarNovamente={recarregar} /></Tela>;

  const principal = avaliarAtividade(dados.nivel, atividade);

  return (
    <Tela edges={[]}>
      <Cartao titulo={`${atividade.nome} · ${quando}`}>
        <BadgeNivel corId={principal.adequacao.cor} rotulo={principal.adequacao.rotulo} simbolo={principal.adequacao.simbolo} grande />
        <Text style={estilos.corpo}>{principal.frase}</Text>
        <Text style={estilos.legenda}>Qualidade prevista da conexão</Text>
        <BadgeNivel corId={dados.nivel.id} rotulo={dados.nivel.rotulo} simbolo={dados.nivel.simbolo} />
      </Cartao>

      <Cartao titulo="Outras atividades neste período">
        {ATIVIDADES.filter((a) => a.id !== atividade.id).map((a) => {
          const r = avaliarAtividade(dados.nivel, a);
          return (
            <View key={a.id} style={estilos.linha} accessible accessibilityLabel={`${a.nome}: ${r.adequacao.rotulo}`}>
              <Text style={estilos.nome}>{a.nome}</Text>
              <BadgeNivel corId={r.adequacao.cor} rotulo={r.adequacao.rotulo} simbolo={r.adequacao.simbolo} />
            </View>
          );
        })}
      </Cartao>

      <Cartao titulo="Detalhes da previsão">
        <LinhaDetalhe rotulo={TERMOS.latencia.nome} valor={formatarMs(dados.latenciaMs)} explicacao={TERMOS.latencia.explicacao} />
        <LinhaDetalhe rotulo={TERMOS.perda.nome} valor={formatarPercentual(dados.perdaPercentual)} explicacao={TERMOS.perda.explicacao} />
      </Cartao>

      <AvisoInfo>A previsão é uma estimativa baseada no histórico da rede e pode variar.</AvisoInfo>
      <BotaoPrincipal titulo="Planejar outra atividade" variante="secundario" onPress={() => navigation.goBack()} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  corpo: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 22 },
  legenda: { fontSize: fonte.pequeno, color: cores.textoSecundario },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', minHeight: 48 },
  nome: { fontSize: fonte.corpo, color: cores.texto, flexShrink: 1 },
});
