import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Tela from '../components/Tela';
import Titulo from '../components/Titulo';
import BotaoPrincipal from '../components/BotaoPrincipal';
import OpcaoSelecionavel from '../components/OpcaoSelecionavel';
import { ATIVIDADES, PERIODOS } from '../domain/qualidade';
import { formatarDia, periodoJaPassou } from '../utils/Formatadores';
import { cores, fonte } from '../theme';

export default function PlanejarScreen({ navigation }) {
  const agora = useMemo(() => new Date(), []);
  const [atividadeId, setAtividadeId] = useState(null);
  const [diaOffset, setDiaOffset] = useState(0);
  const [periodoId, setPeriodoId] = useState(null);

  const dias = [0, 1, 2].map((o) => {
    const d = new Date(agora); d.setDate(d.getDate() + o);
    return { offset: o, rotulo: formatarDia(d, agora) };
  });

  const escolherDia = (o) => {
    setDiaOffset(o);
    const p = PERIODOS.find((x) => x.id === periodoId);
    if (p && periodoJaPassou(o, p, agora)) setPeriodoId(null);
  };

  const pronto = atividadeId && periodoId;

  return (
    <Tela>
      <Titulo titulo="Planejar uma atividade" subtitulo="Escolha o que vai fazer e quando. Mostramos se a conexão deve dar conta." />

      <View accessibilityRole="radiogroup" style={estilos.grupo}>
        <Text accessibilityRole="header" style={estilos.secao}>1. O que você pretende fazer?</Text>
        {ATIVIDADES.map((a) => (
          <OpcaoSelecionavel key={a.id} rotulo={a.nome} selecionado={atividadeId === a.id} onPress={() => setAtividadeId(a.id)} />
        ))}
      </View>

      <View accessibilityRole="radiogroup" style={estilos.grupo}>
        <Text accessibilityRole="header" style={estilos.secao}>2. Em que dia?</Text>
        {dias.map((d) => (
          <OpcaoSelecionavel key={d.offset} rotulo={d.rotulo} selecionado={diaOffset === d.offset} onPress={() => escolherDia(d.offset)} />
        ))}
      </View>

      <View accessibilityRole="radiogroup" style={estilos.grupo}>
        <Text accessibilityRole="header" style={estilos.secao}>3. Em que período?</Text>
        {PERIODOS.map((p) => {
          const passou = periodoJaPassou(diaOffset, p, agora);
          return (
            <OpcaoSelecionavel key={p.id} rotulo={p.nome} detalhe={passou ? `${p.faixa} (já passou)` : p.faixa}
              selecionado={periodoId === p.id} desabilitado={passou} onPress={() => setPeriodoId(p.id)} />
          );
        })}
      </View>

      {!pronto ? <Text style={estilos.ajuda} accessibilityLiveRegion="polite">Escolha uma atividade e um período para continuar.</Text> : null}
      <BotaoPrincipal titulo="Ver previsão" desabilitado={!pronto}
        onPress={() => navigation.navigate('Resultado', { atividadeId, diaOffset, periodoId })} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  grupo: { gap: 8 },
  secao: { fontSize: fonte.subtitulo, fontWeight: '700', color: cores.texto, marginTop: 8 },
  ajuda: { fontSize: fonte.pequeno, color: cores.textoSecundario },
});
