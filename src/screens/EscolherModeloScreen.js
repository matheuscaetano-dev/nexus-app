import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { EstadoCarregando, EstadoErro } from '../components/Estados';
import { useConexao } from '../context/ConexaoContext';
import { cores, espaco, raio } from '../theme';

function CartaoModelo({ item, selecionado, onPress }) {
  const metadados = [
    item.groupName && `Grupo: ${item.groupName}`,
    item.algorithm && `Algoritmo: ${item.algorithm}`,
  ].filter(Boolean);
  const descricaoAcessivel = [item.name, item.description, ...metadados, `Versão ${item.version || 'não informada'}`].filter(Boolean).join('. ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={descricaoAcessivel}
      accessibilityState={{ checked: selecionado }}
      style={[estilos.cartaoModelo, selecionado && estilos.cartaoModeloSelecionado]}
    >
      <View style={estilos.topoCartaoModelo}>
        <View style={[estilos.radio, selecionado && estilos.radioSelecionado]}>
          {selecionado && <View style={estilos.radioInterno} />}
        </View>
        <Text style={[estilos.nomeModelo, selecionado && estilos.nomeModeloSelecionado]}>{item.name}</Text>
        <Text style={estilos.versaoModelo}>v{item.version || '—'}</Text>
      </View>
      <Text style={estilos.descricaoModelo}>{item.description || 'A API não forneceu uma descrição para este modelo.'}</Text>
      {metadados.length > 0 && (
        <View style={estilos.metadadosModelo}>
          {metadados.map((metadado) => <Text key={metadado} style={estilos.metadadoModelo}>{metadado}</Text>)}
        </View>
      )}
    </Pressable>
  );
}

export default function EscolherModeloScreen({ navigation }) {
  const { modelos, modelo, setModelo, carregandoCatalogo, erroCatalogo, recarregarCatalogo } = useConexao();
  const [selecionado, setSelecionado] = useState(modelo?.id || null);

  useEffect(() => {
    if (!selecionado && modelos.length) setSelecionado(modelos[0].id);
  }, [selecionado, modelos]);

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.overline}>CONFIGURAÇÃO INICIAL - ETAPA 1 DE 2</Text>
      <Text capitalizar style={estilos.tituloGigante}>Escolher modelo de previsão</Text>

      <View style={estilos.boxInfo}>
        <Text capitalizar style={estilos.boxTitulo}>⚙️ Sobre os modelos</Text>
        <Text style={estilos.boxTexto}>A API fornece previsões previamente calculadas. O algoritmo é apenas metadado; a classificação de qualidade usa a mesma regra para todos. Não há um modelo declarado como superior.</Text>
      </View>

      <View style={estilos.linhaModelos}>
        <Text capitalizar style={estilos.tituloSecao}>Modelos disponíveis</Text>
        <Text style={estilos.subtituloSecao}>{modelos.length === 1 ? '1 modelo ativo' : `${modelos.length} modelos ativos`}</Text>
      </View>

      {carregandoCatalogo ? <EstadoCarregando mensagem="Buscando modelos e localidades…" /> : erroCatalogo ? <EstadoErro erro={erroCatalogo} onTentarNovamente={recarregarCatalogo} /> : modelos.map((item) => (
        <CartaoModelo
          key={item.id}
          item={item}
          selecionado={selecionado === item.id}
          onPress={() => setSelecionado(item.id)}
        />
      ))}

      <Text style={estilos.notaRodape}>O identificador escolhido será enviado nas consultas de previsão. A API não define um modelo padrão.</Text>

      <BotaoPrincipal titulo="Continuar →" desabilitado={!modelos.find((item) => item.id === selecionado) || carregandoCatalogo} onPress={() => {
        const escolhido = modelos.find((item) => item.id === selecionado);
        if (!escolhido) return;
        setModelo(escolhido);
        navigation.navigate('Localizacao');
      }} estiloContexto={{marginTop: espaco.lg}} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.xl, paddingTop: espaco.xl + espaco.sm, paddingBottom: espaco.xxl * 2 },
  overline: { fontSize: 11, fontWeight: '800', color: cores.primaria, letterSpacing: 0.5, marginBottom: 4 },
  tituloGigante: { fontSize: 32, fontWeight: '800', color: cores.texto, lineHeight: 36, marginBottom: espaco.lg },
  boxInfo: { backgroundColor: cores.fundoSecundario, padding: espaco.lg, borderRadius: raio.lg, marginBottom: espaco.xl },
  boxTitulo: { fontSize: 14, fontWeight: '800', color: cores.texto, marginBottom: 4 },
  boxTexto: { fontSize: 13, color: cores.textoSecundario, lineHeight: 18 },
  linhaModelos: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: espaco.md },
  tituloSecao: { fontSize: 18, fontWeight: '800', color: cores.texto },
  subtituloSecao: { fontSize: 12, fontWeight: '700', color: cores.primaria },
  cartaoModelo: { backgroundColor: cores.superficie, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.divisor, padding: espaco.md, marginBottom: espaco.sm, gap: espaco.sm },
  cartaoModeloSelecionado: { borderWidth: 2, borderColor: cores.primaria, backgroundColor: cores.sucessoFundo },
  topoCartaoModelo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  radioSelecionado: { borderColor: cores.primaria },
  radioInterno: { width: 10, height: 10, borderRadius: 5, backgroundColor: cores.primaria },
  nomeModelo: { flex: 1, fontSize: 16, fontWeight: '800', color: cores.texto },
  nomeModeloSelecionado: { color: cores.primaria },
  versaoModelo: { fontSize: 12, fontWeight: '700', color: cores.primaria, backgroundColor: '#D8EDE9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  descricaoModelo: { fontSize: 13, color: cores.textoSecundario, lineHeight: 18, marginLeft: 30 },
  metadadosModelo: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.xs, marginLeft: 30 },
  metadadoModelo: { fontSize: 11, fontWeight: '700', color: cores.primariaEscura, backgroundColor: cores.fundoSecundario, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  notaRodape: { fontSize: 12, color: cores.textoSecundario, textAlign: 'center', marginTop: espaco.lg }
});
