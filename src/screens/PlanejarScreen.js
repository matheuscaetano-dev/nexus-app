import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import Cartao from '../components/Cartao';
import BadgeNivel from '../components/BadgeNivel';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import useAsync from '../hooks/useAsync';
import { ATIVIDADES, avaliarAtividade } from '../domain/qualidade';
import { obterPrevisao, verificarAtividade } from '../services/previsaoService';
import { formatarMs, formatarPercentual } from '../utils/Formatadores';
import { useConexao } from '../context/ConexaoContext';
import { cores, espaco, raio } from '../theme';

const capitalizarPalavras = (texto) => texto
  .split(' ')
  .map((palavra) => ['de', 'e', 'na'].includes(palavra.toLocaleLowerCase('pt-BR'))
    ? palavra.toLocaleLowerCase('pt-BR')
    : palavra.charAt(0).toLocaleUpperCase('pt-BR') + palavra.slice(1))
  .join(' ');

export default function PlanejarScreen({ navigation }) {
  const { modelo, local } = useConexao();
  const [atividadeId, setAtividadeId] = useState('video');
  const horario = useMemo(() => new Date(), []);
  const atividade = ATIVIDADES.find((item) => item.id === atividadeId);
  const tiposApi = { video: 'VIDEO_CALL', audio: 'AUDIO_CALL', streaming: 'STREAMING', arquivos: 'FILE_UPLOAD', web: 'WEB_BROWSING', mensagens: 'MESSAGING' };
  const atividadeApi = tiposApi[atividadeId];
  const resultado = useAsync(() => {
    if (!modelo || !local || !atividade) return Promise.resolve(null);
    if (atividadeApi) return verificarAtividade({ local, modelo, dataHora: horario, atividade: atividadeApi });

    return obterPrevisao(horario, local, modelo).then((dadosPrevisao) => {
      const avaliacaoLocal = avaliarAtividade(dadosPrevisao.nivel, atividade);
      return {
        previsao: dadosPrevisao,
        adequacao: avaliacaoLocal.adequacao,
        suitable: avaliacaoLocal.adequacao.id !== 'nao_recomendada',
        recommendation: { message: avaliacaoLocal.frase },
      };
    });
  }, [horario.getTime(), modelo?.id, local?.probeId, atividadeId]);
  const previsao = { ...resultado, dados: resultado.dados?.previsao || null };
  const avaliacao = resultado.dados ? {
    adequacao: resultado.dados.adequacao || (resultado.dados.suitable
      ? { rotulo: 'Adequada', cor: 'boa', simbolo: '✓' }
      : { rotulo: 'Não Recomendada', cor: 'instavel', simbolo: '✕' }),
    frase: resultado.dados.recommendation?.message || 'Confira a qualidade prevista antes de iniciar.',
  } : null;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.overline}>PLANEJAMENTO POR ATIVIDADE</Text>
        <Text style={estilos.tituloGigante}>Planejamento por Atividade</Text>
      </View>

      <Text style={estilos.descritivo}>{modelo?.name || 'Escolha um modelo'} • Escolha sua Atividade</Text>
      <Text style={estilos.textoCorpo}>Veja se a previsão estimada é adequada para o que você pretende fazer.</Text>

      <View style={estilos.infoGrid}>
        <View style={estilos.infoBox}>
          <Text style={estilos.infoLabel}>DATA</Text>
          <Text style={estilos.infoValor}>{horario.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</Text>
        </View>
        <View style={estilos.infoBox}>
          <Text style={estilos.infoLabel}>HORÁRIO</Text>
          <Text style={estilos.infoValor}>{horario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>

      <Text style={estilos.tituloSecao}>ATIVIDADE</Text>
      <View style={estilos.chipsContainer}>
        {ATIVIDADES.map((item) => <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: atividadeId === item.id }} onPress={() => setAtividadeId(item.id)} style={[estilos.chip, atividadeId === item.id && estilos.chipAtivo]}>
          <Text style={atividadeId === item.id ? estilos.chipTextoAtivo : estilos.chipTexto}>{capitalizarPalavras(item.nome)}</Text>
        </Pressable>)}
      </View>

      {!modelo || !local ? <Cartao>
        <Text style={estilos.textoCorpo}>Escolha primeiro um modelo e uma referência aproximada para consultar a API.</Text>
        <BotaoPrincipal titulo="Configurar previsão" onPress={() => navigation.navigate('EscolherModelo')} />
      </Cartao> : previsao.carregando ? <EstadoCarregando /> : previsao.erro ? <EstadoErro erro={previsao.erro} onTentarNovamente={previsao.recarregar} /> : !previsao.dados || !avaliacao ? <Cartao>
        <Text style={estilos.textoCorpo}>Ainda não há uma previsão disponível para esta atividade.</Text>
      </Cartao> : (
      <Cartao variante="destaque" style={{ backgroundColor: '#0E5B63', borderColor: '#0E5B63', marginTop: espaco.xl }}>
        <Text style={estilos.horarioDestaque}>{atividade?.nome.toUpperCase()} • PREVISÃO ATUAL</Text>
        <View style={estilos.linhaTituloDestaque}>
          <Text numberOfLines={1} style={estilos.tituloDestaque}>{avaliacao.adequacao.rotulo}</Text>
          <BadgeNivel corId={avaliacao.adequacao.cor} rotulo={previsao.dados.nivel.rotulo} simbolo={previsao.dados.nivel.simbolo} iconeEsquerda />
        </View>
        <Text style={estilos.textoDestaque}>{avaliacao.frase}</Text>
        
        <View style={estilos.statsContainer}>
            <View><Text style={estilos.statLabel}>QUALIDADE</Text><Text style={estilos.statValue}>{previsao.dados.nivel.rotulo}</Text></View>
            <View><Text style={estilos.statLabel}>RTT</Text><Text style={estilos.statValue}>{formatarMs(previsao.dados.latenciaMs)}</Text></View>
            <View><Text style={estilos.statLabel}>PERDA</Text><Text style={estilos.statValue}>{formatarPercentual(previsao.dados.perdaPercentual)}</Text></View>
        </View>

        <View style={estilos.dicaCaixa}>
          <Text style={estilos.dicaTextoTopo}>RECOMENDAÇÃO</Text>
          <Text style={estilos.dicaTexto}>{avaliacao.frase}</Text>
        </View>
      </Cartao>
      )}
      <BotaoPrincipal titulo="Ver Detalhes →" desabilitado={!previsao.dados} onPress={() => navigation.navigate('Resultado', { previsao: previsao.dados, atividade: atividade?.nome })} estiloContexto={{marginTop: espaco.xl}} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingTop: espaco.xl + espaco.sm, paddingBottom: espaco.xxl * 2 },
  cabecalho: { marginBottom: espaco.sm },
  overline: { fontSize: 12, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, maxWidth: 300, marginBottom: espaco.sm },
  descritivo: { fontSize: 16, fontWeight: '800', color: cores.texto, marginBottom: 4 },
  textoCorpo: { fontSize: 14, color: cores.textoSecundario, lineHeight: 22, marginBottom: espaco.xl },
  infoGrid: { flexDirection: 'row', gap: espaco.md, marginBottom: espaco.xl },
  infoBox: { flex: 1, backgroundColor: cores.superficie, padding: espaco.md, borderRadius: raio.md, borderWidth: 1, borderColor: cores.divisor },
  infoLabel: { fontSize: 11, fontWeight: '800', color: cores.textoSecundario, letterSpacing: 0.5 },
  infoValor: { fontSize: 16, fontWeight: '800', color: cores.texto },
  tituloSecao: { fontSize: 12, fontWeight: '800', color: cores.textoSecundario, letterSpacing: 0.5, marginBottom: espaco.md },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: espaco.sm },
  chip: { width: '48%', minHeight: 68, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.superficie, paddingVertical: 12, paddingHorizontal: 10, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.divisor },
  chipAtivo: { backgroundColor: '#EAF6F3', borderColor: cores.primaria },
  chipTexto: { fontSize: 14, lineHeight: 18, fontWeight: '700', color: cores.textoSecundario, textAlign: 'center' },
  chipTextoAtivo: { fontSize: 14, lineHeight: 18, fontWeight: '800', color: cores.primariaEscura, textAlign: 'center' },
  horarioDestaque: { color: '#88BDB7', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  linhaTituloDestaque: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -4, gap: espaco.sm },
  tituloDestaque: { fontSize: 24, fontWeight: '800', color: cores.sobrePrimaria, flex: 1, marginRight: 4, lineHeight: 30, flexShrink: 1, minWidth: 0 },
  textoDestaque: { color: cores.sobrePrimaria, fontSize: 14, lineHeight: 22, marginTop: espaco.sm },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: espaco.md, paddingBottom: espaco.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' },
  statLabel: { fontSize: 11, fontWeight: '800', color: '#88BDB7', letterSpacing: 0.5 },
  statValue: { fontSize: 16, fontWeight: '800', color: cores.sobrePrimaria },
  dicaCaixa: { marginTop: espaco.sm },
  dicaTextoTopo: { fontSize: 11, fontWeight: '800', color: '#F5B84E', letterSpacing: 0.5, marginBottom: 4 },
  dicaTexto: { color: cores.sobrePrimaria, fontSize: 13, lineHeight: 18 },
});
