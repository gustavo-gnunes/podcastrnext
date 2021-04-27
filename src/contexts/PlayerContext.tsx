// contexto serve para pegar informação de alguma pagina e usar em outra
// serve para qdo clicar em algo ou fazer alguma ação, compartilhar essa informação de uma página para outras

import { createContext } from 'react'

// informações para o player. O que vai ser mostrado dentro do componente
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

// o que vai ser gravado dentro do contexto
type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number // qual o indice do episodio que está tocando
  isPlaying: boolean; // serve pra ver se está tocando o audio, se estiver tocando vai ter que mudar o botão de plau para pause
  play: (episode: Episode) => void; // deve ter isso, pq lá no arquivo _app.tsx, eu passo uma função, para pegar em outro arquivo
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
}

// createContext(''): se fosse passado uma string vazia '' lá no _app.tsx, aqui deve colocar o valor de uma string, se lá for passado um objeto, aqui deve passar um objeto vazio
// createContext({} as PlayerContextData): fala que o valor é um objeto como PlayerContextData, que vai ter um array e um mumber e tudo que estiver dentro PlayerContextData
export const PlayerContext = createContext({} as PlayerContextData)