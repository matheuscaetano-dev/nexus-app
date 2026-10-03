import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Tela from '../components/Tela';
import Titulo from '../components/Titulo';
import Cartao from '../components/Cartao';
import BadgeNivel from '../components/BadgeNivel';
import { NIVEIS } from '../domain/qualidade';
import { TERMOS } from '../domain/glossario';
import { cores, fonte } from '../theme';

export default function EntendaScreen() {
  return (
    <Tela>
      <Titulo titulo="Entenda a previsão" subtitulo="Como ler os resultados, sem termos difíceis." />

      <Cartao titulo="O que esta previsão representa">
        <Text style={estilos.corpo}>
          A previsão usa o histórico de medições de um ponto de referência na sua região. Ela não mede o seu aparelho e não usa a sua localização exata.
        </Text>
      </Cartao>

      <Cartao titulo="Níveis de qualidade">
        {Object.values(NIVEIS).map((n) => (
          <Text key={n.id} accessible style={estilos.corpo} accessibilityLabel={`${n.rotulo}. ${n.significado}`}>
            {n.rotulo}: {n.significado}
          </Text>
        ))}
      </Cartao>

      <Cartao titulo="Termos que aparecem no app">
        {[TERMOS.latencia, TERMOS.perda].map((t) => (
          <Text key={t.nome} accessible style={estilos.corpo}>
            {t.nome} ({t.tecnico}): {t.explicacao}
          </Text>
        ))}
      </Cartao>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  corpo: { fontSize: fonte.corpo, color: cores.texto, lineHeight: 22 },
});
