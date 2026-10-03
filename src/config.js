// Configuração central. Tudo que muda entre mock e API real fica aqui.
export const APP_NOME = 'Nexus';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').trim();
export const USAR_MOCK = process.env.EXPO_PUBLIC_USAR_MOCK !== 'false';
export const TIMEOUT_MS = 10000;
