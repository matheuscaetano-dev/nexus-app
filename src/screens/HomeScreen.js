import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --------------------------------------------------
// TELA 1: HOME (Previsão de Conexão)
// --------------------------------------------------
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>NEXUS</Text>
      </View>

      <Text style={styles.title}>Previsão de Conexão</Text>
      
      <Text style={styles.subtitle}>
        Planeje suas atividades consultando a qualidade da internet para as próximas horas.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hoje, 20:00</Text>
        <Text style={styles.statusText}>Conexão Esperada: Regular</Text>
        <Text style={styles.suggestionText}>
          Pode apresentar instabilidade. Considere ter uma alternativa para videochamadas.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.buttonPrimary} 
        onPress={() => navigation.navigate('Atividades')}
      >
        <Text style={styles.buttonText}>Planejar uma atividade</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.buttonSecondary} 
        onPress={() => navigation.navigate('Detalhes')}
      >
        <Text style={styles.buttonTextSecondary}>Entenda esta previsão</Text>
      </TouchableOpacity>
    </View>
  );
}

// --------------------------------------------------
// TELA 2: DETALHES (Glossário e Dados Técnicos)
// --------------------------------------------------
function DetalhesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre esta previsão</Text>
      <Text style={styles.subtitle}>O que os dados significam de forma simples:</Text>
      
      <View style={styles.card}>
        <Text style={styles.statusText}>Latência prevista: 49,1 ms</Text>
        <Text style={styles.suggestionText}>
          O tempo necessário para os dados percorrerem a rede. Valores altos podem deixar chamadas lentas.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.statusText}>Perda prevista: 2,1%</Text>
        <Text style={styles.suggestionText}>
          Proporção estimada de pacotes de dados que não chegam ao destino, causando cortes em vídeos e áudios.
        </Text>
      </View>
    </View>
  );
}

// --------------------------------------------------
// TELA 3: ATIVIDADES (Impacto da Conexão)
// --------------------------------------------------
function AtividadesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>O que você pretende fazer?</Text>
      <Text style={styles.subtitle}>Saiba como a conexão atual afeta seu uso.</Text>
      
      <View style={styles.activityCard}>
        <Text style={styles.statusText}>🎥 Chamada de vídeo</Text>
        <Text style={styles.suggestionText}>Pode apresentar dificuldades e oscilações neste período.</Text>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.statusText}>🌐 Navegar na web</Text>
        <Text style={styles.suggestionText}>Ideal. A conexão atual suporta carregamento de páginas sem problemas.</Text>
      </View>
    </View>
  );
}

// --------------------------------------------------
// CONFIGURAÇÃO DE ROTAS
// --------------------------------------------------
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#0056D2',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Início' }} 
        />
        <Stack.Screen 
          name="Detalhes" 
          component={DetalhesScreen} 
          options={{ title: 'Detalhes Técnicos' }} 
        />
        <Stack.Screen 
          name="Atividades" 
          component={AtividadesScreen} 
          options={{ title: 'Testar Atividades' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --------------------------------------------------
// ESTILOS GERAIS Acessíveis (Contraste > 4.5:1)
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0056D2',
    letterSpacing: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4D4D4D',
    marginBottom: 32,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 6,
    borderLeftColor: '#F5A623',
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#0056D2',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  buttonPrimary: {
    backgroundColor: '#0056D2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0056D2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#0056D2',
    fontSize: 18,
    fontWeight: 'bold',
  },
});