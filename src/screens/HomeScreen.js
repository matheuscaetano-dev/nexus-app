import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ==================================================
// SIMULAÇÃO DE API (Mock)
// ==================================================
const simularBuscaDeDados = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        horario: '20:00',
        qualidade: 'Moderada',
        mensagem: 'A conexão pode apresentar alguma instabilidade neste período.',
        latencia: '49,1 ms',
        perda: '2,1%',
      });
    }, 1200); // Finge um carregamento de 1.2 segundos
  });
};

// ==================================================
// TELA 1: HOME (Previsão de Conexão)
// ==================================================
function HomeScreen({ navigation }) {
  const [previsao, setPrevisao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Busca os dados assim que a tela abre
  useEffect(() => {
    simularBuscaDeDados().then((dados) => {
      setPrevisao(dados);
      setCarregando(false);
    });
  }, []);

  if (carregando) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#0056D2" />
        <Text style={styles.loadingText}>Analisando histórico da rede...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.appName} accessibilityRole="header">NEXUS</Text>
      </View>

      <Text style={styles.title}>Previsão de Conexão</Text>
      <Text style={styles.subtitle}>
        Planeje suas atividades consultando a qualidade da internet para as próximas horas.
      </Text>

      <View style={styles.card} accessible={true} accessibilityLabel={`Previsão para hoje às ${previsao.horario}. Qualidade: ${previsao.qualidade}. ${previsao.mensagem}`}>
        <Text style={styles.cardTitle}>Hoje, {previsao.horario}</Text>
        <Text style={styles.statusText}>Conexão Esperada: {previsao.qualidade}</Text>
        <Text style={styles.suggestionText}>{previsao.mensagem}</Text>
      </View>

      <TouchableOpacity 
        style={styles.buttonPrimary} 
        onPress={() => navigation.navigate('Atividades')}
        accessibilityRole="button"
        accessibilityLabel="Planejar uma atividade específica"
      >
        <Text style={styles.buttonText}>Planejar uma atividade</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.buttonSecondary} 
        onPress={() => navigation.navigate('Detalhes')}
        accessibilityRole="button"
        accessibilityLabel="Entenda os termos técnicos desta previsão"
      >
        <Text style={styles.buttonTextSecondary}>Entenda esta previsão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ==================================================
// TELA 2: DETALHES (Glossário e Dados Técnicos)
// ==================================================
function DetalhesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Sobre esta previsão</Text>
      <Text style={styles.subtitle}>O que os dados significam de forma simples:</Text>
      
      <View style={styles.card} accessible={true}>
        <Text style={styles.statusText}>Latência prevista: 49,1 ms</Text>
        <Text style={styles.suggestionText}>
          O tempo necessário para os dados percorrerem a rede. Valores altos podem deixar chamadas lentas.
        </Text>
      </View>

      <View style={styles.card} accessible={true}>
        <Text style={styles.statusText}>Perda prevista: 2,1%</Text>
        <Text style={styles.suggestionText}>
          Proporção estimada de pacotes de dados que não chegam ao destino, causando cortes em vídeos e áudios.
        </Text>
      </View>
    </ScrollView>
  );
}

// ==================================================
// TELA 3: ATIVIDADES (Impacto Interativo)
// ==================================================
function AtividadesScreen() {
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  const selecionarAtividade = (atividade) => {
    setAtividadeSelecionada(atividade);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>O que você pretende fazer?</Text>
      <Text style={styles.subtitle}>Selecione uma atividade para ver se a conexão atual suporta.</Text>
      
      {/* Opção 1 */}
      <TouchableOpacity 
        style={[
          styles.activityCard, 
          atividadeSelecionada === 'video' && styles.activityCardSelected
        ]}
        onPress={() => selecionarAtividade('video')}
        accessibilityRole="button"
      >
        <Text style={styles.statusText}>🎥 Chamada de vídeo</Text>
        {atividadeSelecionada === 'video' && (
          <Text style={styles.warningText}>⚠️ Pode apresentar oscilações. Tenha uma alternativa pronta.</Text>
        )}
      </TouchableOpacity>

      {/* Opção 2 */}
      <TouchableOpacity 
        style={[
          styles.activityCard, 
          atividadeSelecionada === 'web' && styles.activityCardSelected
        ]}
        onPress={() => selecionarAtividade('web')}
        accessibilityRole="button"
      >
        <Text style={styles.statusText}>🌐 Navegar na web e E-mails</Text>
        {atividadeSelecionada === 'web' && (
          <Text style={styles.successText}>✅ Ideal. A conexão atual suporta carregamento leve sem problemas.</Text>
        )}
      </TouchableOpacity>

      {/* Opção 3 */}
      <TouchableOpacity 
        style={[
          styles.activityCard, 
          atividadeSelecionada === 'streaming' && styles.activityCardSelected
        ]}
        onPress={() => selecionarAtividade('streaming')}
        accessibilityRole="button"
      >
        <Text style={styles.statusText}>🎬 Assistir Streaming (Filmes)</Text>
        {atividadeSelecionada === 'streaming' && (
          <Text style={styles.warningText}>⚠️ Possível, mas a qualidade do vídeo pode cair automaticamente.</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// ==================================================
// CONFIGURAÇÃO DE ROTAS E ESTILOS
// ==================================================
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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes Técnicos' }} />
        <Stack.Screen name="Atividades" component={AtividadesScreen} options={{ title: 'Testar Atividades' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#0056D2',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityCardSelected: {
    borderColor: '#0056D2',
    backgroundColor: '#F0F6FF',
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
  warningText: {
    fontSize: 16,
    color: '#B35900',
    marginTop: 8,
    fontWeight: '500',
  },
  successText: {
    fontSize: 16,
    color: '#006622',
    marginTop: 8,
    fontWeight: '500',
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