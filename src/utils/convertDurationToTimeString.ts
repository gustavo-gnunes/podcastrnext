// Converte um números em segundos para horas
export function convertDurationToTimesString(duration: number) {
  const hours = Math.floor(duration / 3600) // pega as horas
  const minutes = Math.floor((duration % 3600) / 60) // %: pega o resto da divisão / 60 para pegar qtde em minutos
  const seconds = duration % 60; // pega os segundos

  // serve para formatar a hora. Ex: se retornar 1h, isso coloca 01h, sem a hora, minuto e segundos vai ter dois digitos
  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':') // para acrescentar os : Ex: 01:00:00

  return timeString
}