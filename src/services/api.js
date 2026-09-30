export const buscarPrevisaoPorHorario = async (horario) => {
  try {
    /* 
      Quando a API real estiver pronta, você vai descomentar este bloco:
      const response = await fetch(`http://SEU_IP_LOCAL:8080/api/previsao?horario=${horario}`);
      const data = await response.json();
      return data;
    */

    // MOCK: Simulando a resposta da API baseada nos protótipos do projeto
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          modeloUsado: 'Modelo C',
          qualidade: 'Moderada',
          latencia: 49.1,
          perdaPacotes: 2.1,
          distanciaProbe: 46.3,
          mensagem: 'A conexão pode apresentar alguma instabilidade neste período.',
          dicaAtividade: 'Para uma chamada de vídeo, considere ter uma alternativa disponível.'
        });
      }, 1000); // Finge que a internet demorou 1 segundo para responder
    });

  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
    return null;
  }
};