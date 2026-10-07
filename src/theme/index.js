export const cores = {
  fundo: '#EAF1F0',
  superficie: '#FFFFFF',
  fundoSecundario: '#F3F7F5',
  texto: '#123B3A',
  textoSecundario: '#42524C',
  primaria: '#0C636B',
  primariaEscura: '#0A6C73',
  sobrePrimaria: '#FFFFFF',
  borda: '#C5D9D7',
  divisor: '#DCE4DF',
  aviso: '#F5B84E',
  avisoFundo: '#FEF0D4',
  avisoTexto: '#966300',
  sucessoFundo: '#EAF6F3',
  sucessoTexto: '#0E5B63',
  erroFundo: '#FDE4E1',
  erroTexto: '#9F1D14'
};

export const niveisCor = {
  boa: { fundo: cores.sucessoFundo, texto: cores.sucessoTexto },
  regular: { fundo: cores.avisoFundo, texto: cores.avisoTexto },
  instavel: { fundo: cores.erroFundo, texto: cores.erroTexto },
};

export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const raio = { sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const AREA_MINIMA = 48;
export const fonte = { corpo: 16, pequeno: 14, titulo: 26, subtitulo: 18 };
