import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import BadgeNivel from '../components/BadgeNivel';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import useAsync from '../hooks/useAsync';
import { obterLinhaDoTempo } from '../services/previsaoService';
import { formatarMs, formatarPercentual } from '../utils/Formatadores';
import { useConexao } from '../context/ConexaoContext';
import { cores, espaco, raio } from '../theme';

export default function TimelineScreen() {
  const { modelo, local } = useConexao();
  const [diaOffset, setDiaOffset] = useState(0);
  const [periodo, setPeriodo] = useState('manha');
  const hoje = useMemo(() => new Date(), []);
  const inicio = useMemo(() => {
    const data = new Date(hoje);
    data.setDate(data.getDate() + diaOffset);
    data.setHours(0, 0, 0, 0);
    return data;
  }, [hoje, diaOffset]);
  const fim = useMemo(() => new Date(inicio.getTime() + 24 * 60 * 60 * 1000 - 1), [inicio]);
  const consulta = useAsync(() => modelo && local ? obterLinhaDoTempo(local, modelo, inicio, fim, 24) : Promise.resolve([]), [modelo?.id, local?.probeId, inicio.getTime(), fim.getTime()]);
  const dias = [0, 1, 2, 3].map((offset) => {
    const dia = new Date(hoje);
    dia.setDate(dia.getDate() + offset);
    return { offset, numero: dia.toLocaleDateString('pt-BR', { day: '2-digit' }), semana: offset === 0 ? 'Hoje' : dia.toLocaleDateString('pt-BR', { weekday: 'short' }) };
  });
  const faixaPeriodo = { manha: [6, 12], tarde: [12, 18], noite: [18, 24] }[periodo];
  const itens = (consulta.dados || []).filter((item) => item.dataHora.getHours() >= faixaPeriodo[0] && item.dataHora.getHours() < faixaPeriodo[1]);

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.overline}>CONSULTAR PREVISÃO</Text>
      <Text capitalizar style={estilos.tituloGigante}>Timeline da conexão</Text>

      <View style={estilos.linhaResumo}>
        <View>
          <Text style={estilos.labelModelo}>CONSULTA ATUAL</Text>
          <Text style={estilos.valorModelo}>{inicio.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })} • {periodo}</Text>
        </View>
        <Text style={estilos.versaoBadge}>{modelo?.name || 'Escolha um modelo'}</Text>
      </View>
      <Text style={estilos.textoDescritivo}>Previsões do modelo para a probe de referência selecionada. Os horários são exibidos no fuso local do aparelho.</Text>

      <View style={estilos.secaoFiltros}>
        <View style={estilos.linhaTopoFiltro}>
          <Text capitalizar style={estilos.tituloFiltro}>Data</Text>
          <Text style={estilos.subtituloFiltro}>{inicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</Text>
        </View>
        <View style={estilos.gridDias}>
          {dias.map((dia) => (
            <Pressable key={dia.offset} accessibilityRole="button" accessibilityState={{ selected: diaOffset === dia.offset }} onPress={() => setDiaOffset(dia.offset)} style={[estilos.diaBox, diaOffset === dia.offset && estilos.diaBoxAtivo]}>
              <Text style={[estilos.diaSemana, diaOffset === dia.offset && estilos.textoAtivo]}>{dia.semana}</Text>
              <Text style={[estilos.diaNumero, diaOffset === dia.offset && estilos.textoAtivo]}>{dia.numero}</Text>
            </Pressable>
          ))}
        </View>

        <Text capitalizar style={estilos.tituloFiltroMargin}>Período do dia</Text>
        <View style={estilos.gridPeriodo}>
          {[['manha', '☀️ Manhã'], ['tarde', '🌤️ Tarde'], ['noite', '🌙 Noite']].map(([id, rotulo]) => <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: periodo === id }} onPress={() => setPeriodo(id)} style={[estilos.periodoBox, periodo === id && estilos.periodoBoxAtivo]}><Text style={periodo === id ? estilos.periodoTextoAtivo : estilos.periodoTexto}>{rotulo}</Text></Pressable>)}
        </View>
        <Text style={estilos.textoDescritivo}>Exibindo previsões de {faixaPeriodo[0]}h a {faixaPeriodo[1]}h.</Text>
      </View>

      <View style={estilos.resultadoTimeline}>
        <Text style={estilos.labelModelo}>{inicio.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' }).toUpperCase()} • {periodo.toUpperCase()}</Text>
        <View style={estilos.linhaTimelineTitulo}>
          <Text capitalizar style={estilos.tituloResultado}>Previsões</Text>
          {itens[0] && <BadgeNivel corId={itens[0].nivel.id} rotulo={itens[0].nivel.rotulo} simbolo={itens[0].nivel.simbolo} iconeEsquerda />}
        </View>
        {consulta.carregando ? <EstadoCarregando mensagem="Buscando linha do tempo…" /> : consulta.erro ? <EstadoErro erro={consulta.erro} onTentarNovamente={consulta.recarregar} /> : itens.length ? itens.map((item) => <View key={item.dataHora.toISOString()} style={estilos.itemTimeline}>
          <Text style={estilos.horaTimeline}>{item.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
          <BadgeNivel corId={item.nivel.id} rotulo={item.nivel.rotulo} simbolo={item.nivel.simbolo} />
          <Text style={estilos.metricasTimeline}>{formatarMs(item.latenciaMs)} • {formatarPercentual(item.perdaPercentual)}</Text>
        </View>) : <Text style={estilos.textoTimeline}>Não há previsões para este período.</Text>}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingTop: espaco.xl + espaco.sm, paddingBottom: espaco.xxl * 2 },
  overline: { fontSize: 12, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, marginBottom: espaco.md },
  linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  labelModelo: { fontSize: 11, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 2 },
  valorModelo: { fontSize: 18, fontWeight: '800', color: cores.texto },
  versaoBadge: { fontSize: 11, fontWeight: '800', color: cores.primaria, backgroundColor: '#D8EDE9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  textoDescritivo: { fontSize: 14, color: cores.textoSecundario, lineHeight: 20, marginBottom: espaco.xl },
  secaoFiltros: { backgroundColor: cores.superficie, padding: espaco.lg, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.divisor, marginBottom: espaco.xl },
  linhaTopoFiltro: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espaco.md },
  tituloFiltro: { fontSize: 16, fontWeight: '800', color: cores.texto },
  subtituloFiltro: { fontSize: 12, fontWeight: '700', color: cores.textoSecundario },
  gridDias: { flexDirection: 'row', gap: 8, marginBottom: espaco.xl },
  diaBox: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: raio.md, borderWidth: 1, borderColor: cores.divisor },
  diaBoxAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  diaSemana: { fontSize: 12, fontWeight: '700', color: cores.textoSecundario, marginBottom: 4 },
  diaNumero: { fontSize: 20, fontWeight: '800', color: cores.texto },
  textoAtivo: { color: cores.sobrePrimaria },
  tituloFiltroMargin: { fontSize: 16, fontWeight: '800', color: cores.texto, marginBottom: espaco.md },
  gridPeriodo: { flexDirection: 'row', gap: 8, marginBottom: espaco.md },
  periodoBox: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: cores.divisor },
  periodoBoxAtivo: { backgroundColor: '#EAF6F3', borderColor: cores.primaria },
  periodoTexto: { fontSize: 13, fontWeight: '700', color: cores.textoSecundario },
  periodoTextoAtivo: { fontSize: 13, fontWeight: '700', color: cores.primariaEscura },
  dropdownHorario: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: raio.md, borderWidth: 1, borderColor: cores.divisor },
  dropdownTexto: { fontSize: 14, fontWeight: '700', color: cores.texto },
  dropdownSeta: { color: cores.textoSecundario },
  resultadoTimeline: { backgroundColor: cores.superficie, padding: espaco.lg, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.divisor },
  linhaTimelineTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  tituloResultado: { fontSize: 20, fontWeight: '800', color: cores.texto },
  textoTimeline: { fontSize: 14, color: cores.textoSecundario, lineHeight: 20, marginTop: espaco.sm }
  ,itemTimeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espaco.sm, minHeight: 48, borderTopWidth: 1, borderTopColor: cores.divisor, paddingVertical: espaco.sm }
  ,horaTimeline: { fontSize: 14, fontWeight: '800', color: cores.texto, width: 54 }
  ,metricasTimeline: { flexShrink: 0, fontSize: 12, color: cores.textoSecundario }
});
