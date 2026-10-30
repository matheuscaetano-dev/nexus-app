import React from 'react';
import { StyleSheet } from 'react-native';
import { TextoAcessivel as Text } from '../context/AcessibilidadeContext';
import Icone from '../components/Icone';
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
  const nomes = { inicio: 'home-outline', previsoes: 'calendar-outline', planejar: 'time-outline', entenda: 'information-circle-outline' };
  return <Icone name={nomes[tipo]} size={24} color={color} />;
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
        <Stack.Screen name="Localizacao" component={LocalizacaoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Timeline" component={TimelineScreen} options={{ title: 'Previsões' }} />
        <Stack.Screen name="EstadosConexao" component={EstadosConexaoScreen} options={{ title: 'Estados de conexão' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
