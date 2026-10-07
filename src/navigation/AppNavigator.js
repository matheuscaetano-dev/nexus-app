import React from 'react';
import { StyleSheet } from 'react-native';
import { TextoAcessivel as Text, ViewAcessivel as View } from '../context/AcessibilidadeContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PrevisaoScreen from '../screens/PrevisaoScreen';
import PlanejarScreen from '../screens/PlanejarScreen';
import EntendaScreen from '../screens/EntendaScreen';
import ResultadoScreen from '../screens/ResultadoScreen';
import BoasVindasScreen from '../screens/BoasVindasScreen';
import EscolherModeloScreen from '../screens/EscolherModeloScreen';
import LocalizacaoScreen from '../screens/LocalizacaoScreen';
import TimelineScreen from '../screens/TimelineScreen';
import EstadosConexaoScreen from '../screens/EstadosConexaoScreen';
import { cores } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function IconeAba({ tipo, focused, color }) {
  return (
    <View style={[estilos.iconeAbas, focused && estilos.iconeAbasAtivo]} importantForAccessibility="no-hide-descendants">
      {tipo === 'inicio' && <View style={estilos.iconeCasa}>
        <View style={[estilos.telhadinho, estilos.telhadinhoEsquerdo, { backgroundColor: color }]} />
        <View style={[estilos.telhadinho, estilos.telhadinhoDireito, { backgroundColor: color }]} />
        <View style={[estilos.corpoCasa, { borderColor: color }]}><View style={[estilos.portaCasa, { borderColor: color }]} /></View>
      </View>}
      {tipo === 'previsoes' && <View style={[estilos.iconeCalendario, { borderColor: color }]}>
        <View style={[estilos.linhaCalendario, { backgroundColor: color }]} />
        <View style={estilos.diasCalendario}>{[0, 1, 2, 3].map((dia) => <View key={dia} style={[estilos.diaCalendario, { backgroundColor: color }]} />)}</View>
      </View>}
      {tipo === 'planejar' && <View style={[estilos.iconeRelogio, { borderColor: color }]}>
        <View style={[estilos.ponteiroHora, { backgroundColor: color }]} />
        <View style={[estilos.ponteiroMinuto, { backgroundColor: color }]} />
      </View>}
      {tipo === 'entenda' && <View style={[estilos.iconeInfo, { borderColor: color }]}>
        <Text style={[estilos.letraInfo, { color }]}>i</Text>
      </View>}
    </View>
  );
}

const icone = (tipo) => (props) => <IconeAba tipo={tipo} {...props} />;

function Abas() {
  const { altoContraste, toquesGrandes } = useAcessibilidade();
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: altoContraste ? '#FFFFFF' : cores.primaria,
      tabBarInactiveTintColor: altoContraste ? '#D0D0D0' : cores.textoSecundario,
      tabBarLabelStyle: estilos.rotuloAba,
      tabBarItemStyle: estilos.itemAba,
      tabBarStyle: [estilos.barraAbas, { backgroundColor: altoContraste ? '#000000' : cores.superficie, borderTopColor: altoContraste ? '#777777' : cores.divisor, minHeight: toquesGrandes ? 76 : 68 }],
    }}>
      <Tab.Screen name="Inicio" component={PrevisaoScreen} options={{ title: 'Início', tabBarLabel: ({ color }) => <Text style={[estilos.rotuloAba, { color }]}>Início</Text>, tabBarIcon: icone('inicio') }} />
      <Tab.Screen name="Previsoes" component={TimelineScreen} options={{ title: 'Previsões', tabBarLabel: ({ color }) => <Text style={[estilos.rotuloAba, { color }]}>Previsões</Text>, tabBarIcon: icone('previsoes') }} />
      <Tab.Screen name="Planejar" component={PlanejarScreen} options={{ title: 'Planejar', tabBarLabel: ({ color }) => <Text style={[estilos.rotuloAba, { color }]}>Planejar</Text>, tabBarIcon: icone('planejar') }} />
      <Tab.Screen name="Entenda" component={EntendaScreen} options={{ title: 'Entenda', tabBarLabel: ({ color }) => <Text style={[estilos.rotuloAba, { color }]}>Entenda</Text>, tabBarIcon: icone('entenda') }} />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  barraAbas: {
    paddingTop: 5,
    paddingBottom: 4,
    backgroundColor: cores.superficie,
    borderTopWidth: 1,
    borderColor: cores.divisor,
    elevation: 0,
  },
  itemAba: { paddingVertical: 2 },
  rotuloAba: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  iconeAbas: { width: 42, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  iconeAbasAtivo: { backgroundColor: '#EAF6F3' },
  iconeCasa: { width: 22, height: 22, alignItems: 'center', justifyContent: 'flex-end' },
  telhadinho: { position: 'absolute', top: 5, width: 12, height: 2, borderRadius: 1 },
  telhadinhoEsquerdo: { left: 1, transform: [{ rotate: '-42deg' }] },
  telhadinhoDireito: { right: 1, transform: [{ rotate: '42deg' }] },
  corpoCasa: { width: 16, height: 12, borderWidth: 2, borderTopWidth: 0, borderRadius: 2, alignItems: 'center', justifyContent: 'flex-end' },
  portaCasa: { width: 4, height: 6, borderWidth: 1.5, borderBottomWidth: 0, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  iconeCalendario: { width: 19, height: 19, borderWidth: 2, borderRadius: 4, overflow: 'hidden', alignItems: 'center' },
  linhaCalendario: { width: '100%', height: 2, marginTop: 5 },
  diasCalendario: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 3, padding: 3 },
  diaCalendario: { width: 3, height: 3, borderRadius: 1 },
  iconeRelogio: { width: 19, height: 19, borderWidth: 2, borderRadius: 10 },
  ponteiroHora: { position: 'absolute', width: 2, height: 6, top: 3, left: 7, borderRadius: 1 },
  ponteiroMinuto: { position: 'absolute', width: 5, height: 2, top: 8, left: 8, borderRadius: 1 },
  iconeInfo: { width: 19, height: 19, borderWidth: 2, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  letraInfo: { fontSize: 13, lineHeight: 16, fontWeight: '800' },
});

export default function AppNavigator() {
  const { altoContraste } = useAcessibilidade();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BoasVindas" screenOptions={{
        headerStyle: { backgroundColor: altoContraste ? '#000000' : cores.superficie },
        headerTintColor: altoContraste ? '#FFFFFF' : cores.primaria,
        headerTitleStyle: { fontWeight: '700', color: altoContraste ? '#FFFFFF' : cores.texto },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: altoContraste ? '#000000' : cores.fundo },
      }}>
        <Stack.Screen name="BoasVindas" component={BoasVindasScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} options={{ title: 'Resultado', headerBackTitle: 'Voltar' }} />
        <Stack.Screen name="EscolherModelo" component={EscolherModeloScreen} options={{ title: 'Escolher modelo' }} />
        <Stack.Screen name="Localizacao" component={LocalizacaoScreen} options={{ title: 'Sua localização' }} />
        <Stack.Screen name="Timeline" component={TimelineScreen} options={{ title: 'Previsões' }} />
        <Stack.Screen name="EstadosConexao" component={EstadosConexaoScreen} options={{ title: 'Estados de conexão' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
