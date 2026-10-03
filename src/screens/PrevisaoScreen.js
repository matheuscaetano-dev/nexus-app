import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Tela from '../components/Tela';
import Titulo from '../components/Titulo';
import Cartao from '../components/Cartao';
import BadgeNivel from '../components/BadgeNivel';
import BotaoPrincipal from '../components/BotaoPrincipal';
import LinhaDetalhe from '../components/LinhaDetalhe';
import AvisoInfo from '../components/AvisoInfo';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import useAsync from '../hooks/useAsync';
import { obterPrevisao, obterProximasHoras } from '../services/previsaoService';
import { TERMOS } from '../domain/glossario';
import { inicioDaHora, formatarDiaHora, formatarMs, formatarPercentual } from '../utils/Formatadores';
import { cores, fonte } from '../theme';

const PROXIMAS = [3, 6, 9, 12];

export default function PrevisaoScreen({ navigation }) {
  const base = useMemo(() => inicioDaHora(new Date()), []);
  const atual = useAsync(() => obterPrevisao(base), [base.getTime()]);
  const proximas = useAsync(() => obterProximasHoras(base, PROXIMAS), [base.getTime()]);

  return (
    <Tela>
      <Titulo titulo="Previsão da conexão" subtitulo="Veja como a internet deve estar e planeje suas atividades." />

      {atual.carregando ? <EstadoCarregando /> : atual.erro ? (
        <EstadoErro erro={atual.erro} onTentarNovamente={atual.recarregar} />
      ) : (
        <>
          <Cartao titulo="Agora">
            <Text style={estilos.legenda}>Qualidade prevista da conexão</Text>
            <BadgeNivel corId={atual.dados.nivel.id} rotulo={atual.dados.nivel.rotulo} simbolo={atual.dados.nivel.simbolo} grande />
            <Text style={estilos.corpo}>{atual.dados.nivel.resumo}</Text>
            <Text style={estilos.corpo}>{atual.dados.nivel.significado}</Text>
          </Cartao>

          <BotaoPrincipal titulo="Planejar uma atividade" onPress={() => navigation.navigate('Planejar')}
            dica="Abre a tela para escolher atividade, dia e período" />

          <Cartao titulo="Detalhes da previsão">
            <LinhaDetalhe rotulo={TERMOS.latencia.nome} valor={formatarMs(atual.dados.latenciaMs)} explicacao={TERMOS.latencia.explicacao} />
            <LinhaDetalhe rotulo={TERMOS.perda.nome} valor={formatarPercentual(atual.dados.perdaPercentual)} explicacao={TERMOS.perda.explicacao} />
          </Cartao>
        </>
      )}

      <Cartao titulo="Próximas horas">
        {proximas.carregando ? <EstadoCarregando mensagem="Carregando próximas horas…" /> : proximas.erro ? (
          <EstadoErro erro={proximas.erro} onTentarNovamente={proximas.recarregar} />
        ) : (
          proximas.dados.map((p) => (
            <View key={p.dataHora.getTime()} style={estilos.linhaHora} accessible
              accessibilityLabel={`${formatarDiaHora(p.dataHora)}: qualidade ${p.nivel.rotulo}`}>
              <Text style={estilos.hora}>{formatarDiaHora(p.dataHora)}</Text>
              <BadgeNivel corId={p.nivel.id} rotulo={p.nivel.rotulo} simbolo={p.nivel.simbolo} />
            </View>
          ))
        )}
      </Cartao>

      <AvisoInfo>A previsão é uma estimativa baseada no histórico da rede. Não substitui um teste de velocidade.</AvisoInfo>
      <BotaoPrincipal titulo="Entenda esta previsão" variante="secundario" onPress={() => navigation.navigate('Entenda')} />
    </Tela>
  );
}


const estilos = StyleSheet.create({
  legenda: { fontSize: fonte.pequeno, color: cores.textoSecundario },
  corpo: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 22 },
  linhaHora: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', minHeight: 48 },
  hora: { fontSize: fonte.corpo, color: cores.texto, flexShrink: 1 },
});
