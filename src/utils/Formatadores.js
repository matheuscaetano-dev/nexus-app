export const formatarHoraAtual = () => {
  const data = new Date();
  return `${data.getHours()}:${data.getMinutes()}`;
};