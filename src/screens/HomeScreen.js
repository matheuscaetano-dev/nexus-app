import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Selecionar outro horário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32, // Espaço entre o logo e o título
  },
  appName: {
    fontSize: 22,
    fontWeight: '900', // Fonte bem grossa pra destacar
    color: '#0056D2', // Azul do botão, mantendo um bom contraste
    letterSpacing: 3, // Espaçamento entre as letras pra dar estilo de logo
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
  button: {
    backgroundColor: '#0056D2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});