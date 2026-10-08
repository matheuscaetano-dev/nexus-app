import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import Cartao from '../components/Cartao';
import BadgeNivel from '../components/BadgeNivel';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import useAsync from '../hooks/useAsync';
import { obterPrevisao, obterProximasHoras } from '../services/previsaoService';
import { formatarMs, formatarPercentual, inicioDaHora } from '../utils/Formatadores';
import { useConexao } from '../context/ConexaoContext';
import MarcaNexus from '../components/MarcaNexus';
import { cores, espaco, raio } from '../theme';

export default function PrevisaoScreen({ navigation }) {
  const { modelo, local } = useConexao();
  const base = useMemo(() => inicioDaHora(new Date()), []);
  const atual = useAsync(() => modelo && local ? obterPrevisao(base, local, modelo) : Promise.resolve(null), [base.getTime(), modelo?.id, local?.probeId]);
  const proximas = useAsync(() => modelo && local ? obterProximasHoras(base, [0, 1, 2, 3, 4], local, modelo) : Promise.resolve([]), [base.getTime(), modelo?.id, local?.probeId]);

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalho}>
        <MarcaNexus />
        <Text style={estilos.overline}>PREVISÃO PARA SUA REGIÃO</Text>
        <Text capitalizar style={estilos.tituloGigante}>Olá! Como está a conexão?</Text>
      </View>

      <View style={estilos.linhaModelo}>
        <View>
          <Text style={estilos.labelModelo}>MODELO SELECIONADO</Text>
          <Text style={estilos.valorModelo}>{modelo?.name || 'Nenhum modelo escolhido'} <Text style={estilos.versaoModelo}>{modelo?.version ? `v${modelo.version}` : ''}</Text></Text>
        </View>
        <Pressable onPress={() => navigation.navigate('EscolherModelo')} style={estilos.botaoTrocar}>
          <Text style={estilos.textoBotaoTrocar}>Trocar</Text>
        </Pressable>
      </View>

      {!modelo || !local ? <Cartao>
        <Text style={estilos.tituloSecao}>Configure seu modelo e uma referência regional para consultar as previsões.</Text>
        <Pressable onPress={() => navigation.navigate('EscolherModelo')}><Text style={estilos.linkVerTudo}>Escolher modelo</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Localizacao')}><Text style={estilos.linkVerTudo}>Escolher referência</Text></Pressable>
      </Cartao> : atual.carregando ? <EstadoCarregando /> : atual.erro ? <EstadoErro erro={atual.erro} onTentarNovamente={atual.recarregar} /> : (
        <Cartao variante="destaque">
          <Text style={estilos.horarioDestaque}>Estimativa para agora</Text>
          <View style={estilos.linhaTituloDestaque}>
            <Text style={estilos.tituloDestaque}>{atual.dados.nivel.resumo}</Text>
            <BadgeNivel corId={atual.dados.nivel.id} rotulo={atual.dados.nivel.rotulo} simbolo={atual.dados.nivel.simbolo} iconeEsquerda />
          </View>
          <Text style={estilos.textoDestaque}>{atual.dados.nivel.significado}</Text>
          <View style={estilos.dicaCaixa}>
            <Text style={estilos.dicaTexto}>RTT estimado: {formatarMs(atual.dados.latenciaMs)} • Perda estimada: {formatarPercentual(atual.dados.perdaPercentual)}</Text>
          </View>
        </Cartao>
      )}

      <View style={estilos.secaoProximasHoras}>
        <View style={estilos.linhaHeaderSecao}>
          <Text capitalizar style={estilos.tituloSecao}>Próximas horas</Text>
          <Pressable onPress={() => navigation.navigate('Timeline')}><Text style={estilos.linkVerTudo}>Ver previsão</Text></Pressable>
        </View>
        {!modelo || !local ? null : proximas.carregando ? <EstadoCarregando mensagem="Carregando próximas horas…" /> : proximas.erro ? <EstadoErro erro={proximas.erro} onTentarNovamente={proximas.recarregar} /> : (
          <View style={estilos.graficoContainer}>
            <View style={estilos.barrasFake}>
              {proximas.dados.map((p, i) => {
                const cor = p.nivel.id === 'boa' ? cores.sucessoTexto : p.nivel.id === 'regular' ? cores.avisoTexto : cores.erroTexto;
                const altura = 38 + (p.nivel.pontos * 24);
                return <View key={p.dataHora.getTime()} style={estilos.barraItem} accessible accessibilityLabel={`${p.dataHora.getHours()} horas: ${p.nivel.rotulo}`}>
                  <View style={[estilos.barra, { height: altura, backgroundColor: cor }]} />
                  <Text style={estilos.barraHora}>{i === 0 ? 'Agora' : `${p.dataHora.getHours()}h`}</Text>
                </View>;
              })}
            </View>
            <Text style={estilos.legendaGrafico}>Estimativas por horário, sempre identificadas com texto e cor.</Text>
          </View>
        )}
      </View>

      <Pressable onPress={() => navigation.navigate('Localizacao')} style={estilos.avisoLocalizacao}>
        <Text style={estilos.iconeAviso}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={estilos.tituloAvisoLocalizacao}>Referência atual: probe {local?.probeId ?? 'não selecionada'}</Text>
          <Text style={estilos.textoAvisoLocalizacao}>Usamos uma localização pública aproximada para buscar a previsão mais próxima. Toque para trocar.</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingTop: espaco.xl + espaco.sm, paddingBottom: espaco.xxl * 2 },
  cabecalho: { marginBottom: espaco.lg, gap: espaco.sm },
  overline: { fontSize: 12, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, maxWidth: 300 },
  linhaModelo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espaco.md },
  labelModelo: { fontSize: 11, fontWeight: '800', color: cores.textoSecundario, letterSpacing: 0.5 },
  valorModelo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  versaoModelo: { fontWeight: '400', color: cores.textoSecundario },
  botaoTrocar: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: cores.fundoSecundario },
  textoBotaoTrocar: { color: cores.primaria, fontWeight: '700', fontSize: 14 },
  horarioDestaque: { color: '#88BDB7', fontSize: 13, fontWeight: '700' },
  linhaTituloDestaque: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: -4 },
  tituloDestaque: { fontSize: 24, fontWeight: '800', color: cores.sobrePrimaria, flex: 1, marginRight: 10, lineHeight: 28 },
  textoDestaque: { color: cores.sobrePrimaria, fontSize: 15, lineHeight: 22, marginTop: espaco.sm },
  dicaCaixa: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: raio.md, marginTop: espaco.sm },
  dicaTexto: { color: cores.sobrePrimaria, fontSize: 13, lineHeight: 18 },
  secaoProximasHoras: { marginTop: espaco.xl },
  linhaHeaderSecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espaco.md },
  tituloSecao: { fontSize: 18, fontWeight: '800', color: cores.texto },
  linkVerTudo: { color: cores.primaria, fontWeight: '700', fontSize: 14 },
  graficoContainer: { backgroundColor: cores.superficie, padding: espaco.lg, borderRadius: raio.xl, borderWidth: 1, borderColor: cores.divisor },
  barrasFake: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, borderBottomWidth: 1, borderBottomColor: cores.divisor, paddingBottom: 8 },
  barraItem: { alignItems: 'center', flex: 1, minWidth: 42 },
  barra: { width: 24, borderRadius: 4, marginBottom: 8 },
  barraHora: { fontSize: 12, color: cores.textoSecundario, fontWeight: '600' },
  legendaGrafico: { fontSize: 12, color: cores.textoSecundario, textAlign: 'center', marginTop: 12, lineHeight: 18 },
  avisoLocalizacao: { flexDirection: 'row', gap: 12, backgroundColor: cores.fundoSecundario, padding: espaco.lg, borderRadius: raio.xl, marginTop: espaco.xl },
  iconeAviso: { fontSize: 20 },
  tituloAvisoLocalizacao: { fontSize: 14, fontWeight: '700', color: cores.texto, marginBottom: 2 },
  textoAvisoLocalizacao: { fontSize: 13, color: cores.textoSecundario, lineHeight: 18 },
});
