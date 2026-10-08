import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { PressableAcessivel as Pressable, ScrollViewAcessivel as ScrollView, TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarcaNexus from '../components/MarcaNexus';
import { cores, espaco, fonte, raio } from '../theme';

function IlustracaoPrivacidade() {
  return (
    <View style={estilos.ilustracao} accessible accessibilityRole="image"
      accessibilityLabel="Ilustração de uma antena de rede com o selo Privado">
      <View style={estilos.orbita} />
      <View style={estilos.pontoAmarelo} />
      <View style={estilos.pontoVerde} />
      <View style={estilos.seloPrivado}>
        <Text style={estilos.escudo} importantForAccessibility="no">✓</Text>
        <Text style={estilos.textoPrivado}>Sem IP</Text>
      </View>
      <View style={estilos.iconeExterior}>
        <View style={estilos.iconeInterior}>
          <View style={estilos.antena}>
            <View style={estilos.pontaAntena} />
            <View style={estilos.mastro} />
            <View style={estilos.pernaEsquerda} />
            <View style={estilos.pernaDireita} />
            <View style={estilos.sinalEsquerdo} />
            <View style={estilos.sinalDireito} />
          </View>
        </View>
      </View>
    </View>
  );
}

function IconePessoa() {
  return (
    <View style={estilos.iconePessoa} importantForAccessibility="no">
      <View style={estilos.cabecaPessoa} />
      <View style={estilos.corpoPessoa} />
    </View>
  );
}

function IconeCadeado() {
  return (
    <View style={estilos.iconeCadeado} importantForAccessibility="no">
      <View style={estilos.arcoCadeado} />
      <View style={estilos.corpoCadeado}>
        <View style={estilos.pontoCadeado} />
      </View>
    </View>
  );
}

function IconeSemIp() {
  return (
    <View style={estilos.iconeSemIp} importantForAccessibility="no">
      <View style={estilos.circuloSemIp}>
        <Text style={estilos.xSemIp}>×</Text>
      </View>
    </View>
  );
}

const beneficios = [
  { id: 'cadastro', texto: 'Sem cadastro', Icone: IconePessoa },
  { id: 'dados', texto: 'Sem dados pessoais', Icone: IconeCadeado },
  { id: 'ip', texto: 'Sem busca por IP', Icone: IconeSemIp },
];

export default function BoasVindasScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const compacto = width < 360;

  return (
    <SafeAreaView style={estilos.safe}>
      <View style={estilos.container}>
        <ScrollView style={estilos.scroll} contentContainerStyle={[estilos.conteudo, compacto && estilos.conteudoCompacto]}
          bounces={false} showsVerticalScrollIndicator={false}>
          <View style={estilos.marcaTopo}>
            <MarcaNexus />
          </View>
          <IlustracaoPrivacidade />

          <View style={estilos.introducao}>
            <Text style={estilos.chamada}>PREVISÃO DE CONEXÃO</Text>
            <Text accessibilityRole="header" style={[estilos.titulo, compacto && estilos.tituloCompacto]}>
              Veja uma estimativa para sua região
            </Text>
            <Text style={estilos.descricao}>
              Escolha um modelo e uma probe pública como referência. A API usa previsões já calculadas; o resultado é regional e não mede a conexão do seu aparelho.
            </Text>
          </View>

          <View style={estilos.beneficios}>
            {beneficios.map(({ id, texto, Icone }) => (
              <View key={id} style={[estilos.cartaoBeneficio, compacto && estilos.cartaoBeneficioCompacto]} accessible accessibilityRole="text"
                accessibilityLabel={texto}>
                <Icone />
                <Text style={[estilos.textoBeneficio, compacto && estilos.textoBeneficioCompacto]}>{texto}</Text>
              </View>
            ))}
          </View>

          <View style={estilos.rodapeConteudo}>
            <Pressable
              onPress={() => navigation.replace('EscolherModelo')}
              accessibilityRole="button"
              accessibilityLabel="Começar a configurar o aplicativo"
              style={({ pressed }) => [estilos.botao, pressed && estilos.botaoPressionado]}
            >
              <Text style={estilos.seta}>→</Text>
              <Text style={estilos.textoBotao}>Começar configuração</Text>
            </Pressable>

            <Text style={estilos.nota}>
              <Text style={estilos.iconeAcessibilidade}>◉</Text>
              {'  '}Tecnologia inclusiva • ODS 9 e 10
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EAF1F0' },
  container: {
    flex: 1,
    backgroundColor: '#EAF1F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  scroll: { flex: 1, width: '100%' },
  conteudo: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    gap: 14,
    backgroundColor: '#F3F7F5',
    borderRadius: 32,
  },
  conteudoCompacto: { paddingHorizontal: 18, gap: 12 },
  marcaTopo: { width: '100%', alignItems: 'center', marginBottom: -4 },
  ilustracao: {
    width: '100%',
    height: 190,
    borderRadius: 26,
    backgroundColor: '#EAF6F3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  orbita: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#C5D9D7',
    borderStyle: 'dashed',
  },
  pontoAmarelo: {
    position: 'absolute',
    width: 16,
    height: 16,
    left: '12%',
    top: '22%',
    borderRadius: 8,
    backgroundColor: '#F5B84E',
  },
  pontoVerde: {
    position: 'absolute',
    width: 14,
    height: 14,
    right: '18%',
    bottom: '22%',
    borderRadius: 7,
    backgroundColor: '#0E5B63',
  },
  seloPrivado: {
    position: 'absolute',
    right: 18,
    top: 18,
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  escudo: { fontSize: 15, color: '#0D6D77' },
  textoPrivado: { fontSize: 12, fontWeight: '700', color: '#1D2D2C' },
  iconeExterior: {
    width: 108,
    height: 108,
    borderRadius: 24,
    backgroundColor: '#0D6D77',
    transform: [{ rotate: '-4deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeInterior: {
    width: 82,
    height: 82,
    borderRadius: 20,
    backgroundColor: '#F5B84E',
    transform: [{ rotate: '4deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  antena: { width: 48, height: 48, alignItems: 'center', justifyContent: 'flex-end' },
  pontaAntena: {
    position: 'absolute',
    top: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0D5A5F',
  },
  mastro: {
    position: 'absolute',
    top: 14,
    width: 2.5,
    height: 26,
    backgroundColor: '#0D5A5F',
  },
  pernaEsquerda: {
    position: 'absolute',
    top: 28,
    left: 15,
    width: 2.5,
    height: 15,
    backgroundColor: '#0D5A5F',
    transform: [{ rotate: '22deg' }],
  },
  pernaDireita: {
    position: 'absolute',
    top: 28,
    right: 15,
    width: 2.5,
    height: 15,
    backgroundColor: '#0D5A5F',
    transform: [{ rotate: '-22deg' }],
  },
  sinalEsquerdo: {
    position: 'absolute',
    left: 4,
    top: 12,
    width: 14,
    height: 20,
    borderLeftWidth: 1.5,
    borderColor: '#0D5A5F',
    borderRadius: 20,
  },
  sinalDireito: {
    position: 'absolute',
    right: 4,
    top: 12,
    width: 14,
    height: 20,
    borderRightWidth: 1.5,
    borderColor: '#0D5A5F',
    borderRadius: 20,
  },
  introducao: { width: '100%', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  chamada: { fontSize: 13, fontWeight: '800', color: '#0A6C73', letterSpacing: 0.8 },
  titulo: {
    maxWidth: 330,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
    color: '#123B3A',
  },
  tituloCompacto: {
    fontSize: 29,
    lineHeight: 34,
  },
  descricao: {
    maxWidth: 350,
    marginTop: 2,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#42524C',
  },
  beneficios: { width: '100%', flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  cartaoBeneficio: {
    flex: 1,
    minHeight: 104,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cartaoBeneficioCompacto: {
    paddingHorizontal: 6,
  },
  textoBeneficio: {
    width: '100%',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    textAlign: 'center',
    color: '#17363A',
  },
  textoBeneficioCompacto: {
    fontSize: 12,
  },
  iconePessoa: { width: 28, height: 30, alignItems: 'center', justifyContent: 'flex-end' },
  cabecaPessoa: { position: 'absolute', top: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#0A6C73' },
  corpoPessoa: { width: 22, height: 14, borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: '#0A6C73' },
  iconeCadeado: { width: 28, height: 30, alignItems: 'center', justifyContent: 'flex-end' },
  arcoCadeado: { position: 'absolute', top: 1, width: 13, height: 12, borderWidth: 1.3, borderBottomWidth: 0, borderColor: '#0A6C73', borderTopLeftRadius: 7, borderTopRightRadius: 7 },
  corpoCadeado: { width: 18, height: 14, borderWidth: 1.3, borderColor: '#0A6C73', borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  pontoCadeado: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#0A6C73' },
  iconeSemIp: { width: 28, height: 30, alignItems: 'center', justifyContent: 'center' },
  circuloSemIp: { width: 18, height: 18, borderWidth: 2, borderColor: '#0A6C73', borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  xSemIp: { marginTop: -2, fontSize: 13, lineHeight: 14, fontWeight: '700', color: '#0A6C73' },
  rodapeConteudo: { width: '100%', gap: 12, alignItems: 'center' },
  botao: {
    width: '92%',
    maxWidth: 320,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
    backgroundColor: '#0C636B',
  },
  botaoPressionado: { opacity: 0.88 },
  seta: { fontSize: 24, lineHeight: 24, color: '#FFFFFF' },
  textoBotao: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  nota: { marginTop: 1, fontSize: 12, color: '#4F5D58', textAlign: 'center' },
  iconeAcessibilidade: { color: '#0A6C73' },
});
