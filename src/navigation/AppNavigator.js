import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PrevisaoScreen from '../screens/PrevisaoScreen';
import PlanejarScreen from '../screens/PlanejarScreen';
import EntendaScreen from '../screens/EntendaScreen';
import ResultadoScreen from '../screens/ResultadoScreen';
import { cores } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icone = (simbolo) => () => <Text importantForAccessibility="no" style={{ fontSize: 20 }}>{simbolo}</Text>;

function Abas() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        tabBarStyle: { minHeight: 64, paddingTop: 6, paddingBottom: 8 },
      }}
    >
      <Tab.Screen name="Previsao" component={PrevisaoScreen} options={{ title: 'Previsão', tabBarIcon: icone('📶') }} />
      <Tab.Screen name="Planejar" component={PlanejarScreen} options={{ title: 'Planejar', tabBarIcon: icone('🗓️') }} />
      <Tab.Screen name="Entenda" component={EntendaScreen} options={{ title: 'Entenda', tabBarIcon: icone('💡') }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: cores.superficie },
          headerTintColor: cores.primaria,
          headerTitleStyle: { fontWeight: '700', color: cores.texto },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} options={{ title: 'Resultado', headerBackTitle: 'Voltar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
