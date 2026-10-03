import { useEffect, useState, useCallback } from 'react';

// Executa uma busca e expõe { dados, carregando, erro, recarregar }.
export default function useAsync(buscar, dependencias) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: null });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    setEstado((e) => ({ ...e, carregando: true, erro: null }));
    buscar()
      .then((dados) => ativo && setEstado({ dados, carregando: false, erro: null }))
      .catch((erro) => ativo && setEstado({ dados: null, carregando: false, erro }));
    return () => { ativo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, tentativa]);

  const recarregar = useCallback(() => setTentativa((t) => t + 1), []);
  return { ...estado, recarregar };
}
