import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { listarLocais, listarModelos } from '../services/previsaoService';

const ConexaoContext = createContext(null);

export function ConexaoProvider({ children }) {
  const [modelos, setModelos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [modelo, setModelo] = useState(null);
  const [local, setLocal] = useState(null);
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(true);
  const [erroCatalogo, setErroCatalogo] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    setCarregandoCatalogo(true);
    setErroCatalogo(null);
    Promise.all([listarModelos(), listarLocais()])
      .then(([listaModelos, listaLocais]) => {
        if (!ativo) return;
        setModelos(listaModelos);
        setLocais(listaLocais);
        setModelo((atual) => listaModelos.find((item) => item.id === atual?.id) || null);
        setLocal((atual) => listaLocais.find((item) => item.probeId === atual?.probeId) || null);
      })
      .catch((erro) => ativo && setErroCatalogo(erro))
      .finally(() => ativo && setCarregandoCatalogo(false));
    return () => { ativo = false; };
  }, [tentativa]);

  const valor = useMemo(() => ({
    modelos, locais, modelo, local, setModelo, setLocal,
    carregandoCatalogo, erroCatalogo,
    recarregarCatalogo: () => setTentativa((n) => n + 1),
  }), [modelos, locais, modelo, local, carregandoCatalogo, erroCatalogo]);

  return <ConexaoContext.Provider value={valor}>{children}</ConexaoContext.Provider>;
}

export function useConexao() {
  const contexto = useContext(ConexaoContext);
  if (!contexto) throw new Error('useConexao deve ser usado dentro de ConexaoProvider.');
  return contexto;
}
