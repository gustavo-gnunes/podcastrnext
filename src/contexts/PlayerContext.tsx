// contexto serve para pegar informação de alguma pagina e usar em outra
// serve para qdo clicar em algo ou fazer alguma ação, compartilhar essa informação de uma página para outras

import { isSameISOWeek } from 'date-fns/esm'
import { createContext, useState, ReactNode, useContext } from 'react'

// informações para o player. O que vai ser mostrado dentro do componente
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

// o que vai ser gravado dentro do contexto
// toda função que retornar no PlayerContext.Provider value=, deve estar declarada aqui tbm
type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number // qual o indice do episodio que está tocando
  isPlaying: boolean; // serve pra ver se está tocando o audio, se estiver tocando vai ter que mudar o botão de play para pause
  play: (episode: Episode) => void; // deve ter isso, pq é passado no PlayerContext.Provider , eu passo uma função, para pegar em outro arquivo
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void; // (): pq a função não recebe parâmetro
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isLooping: boolean;
  toggleLoop: () => void;
}

// createContext(''): se fosse passado uma string vazia '' lá no _app.tsx, aqui deve colocar o valor de uma string, se lá for passado um objeto, aqui deve passar um objeto vazio
// createContext({} as PlayerContextData): fala que o valor é um objeto como PlayerContextData, que vai ter um array e um mumber e tudo que estiver dentro PlayerContextData
export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  // children: vai receber qq coisa que pode ser colocado dentro do arquivo _app.tsx, dentro da tag PlayerContextProvider
  // qdo o children pode receber qq coisa é só importar de dentro do react o ReactNode
  // ReactNode: qq coisa que o reract aceitarias como conteúdo do jsx
  children: ReactNode;
}

// children está dentro das props
// childen: serve para passar um conteúdo para dentro de um componete
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  // para alterar o valor de uma lista de episodios
  const [episodeList, setEpisodioList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false) // começa com false, pq qdo não tiver nenhum video selecionado, aparece o botão play
  const [isLooping, setIsLooping] = useState(false)

  // recebe um unico episodio
  // episode que está sendo tocado no momento
  // está função vai ser usada lá na page-> index.tsx
  function play(episode: Episode) {
    setEpisodioList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true) // alterar para true, para dizer que foi dado o play do video
  }

  // recebe uma lista de episodio, e o indice, para qdo acabar de tocar um, tocar o proximo
  function playList(list: Episode[], index: number) {
    setEpisodioList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true) // serve para qdo o usuário pausa um episodio e clica em outro, por isso deve estar true
  }

  // se estiver tocando vai pausar e se estiver pausado vai tocar o video. Troca o botão de play e pause
  function togglePlay() {
    setIsPlaying(!isPlaying); // se estiver true, vai alterar para false e se estiver false vai alterar para true
  }

  // para controlar se o episodio está em looping ou não
  function toggleLoop() {
    setIsLooping(!isLooping); // se estiver true, vai alterar para false e se estiver false vai alterar para true
  }

  // está função serve para qdo o usuário aperta o botão de play e pause do teclado. 
  // Na pasta Player-> index.tsx é disparado uma função onPlay ou onPause para está função
  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length

  // pular para a próximo episódio, qdo clicar no botão próximo
  function playNext() {
    // se for menor é pq ainda tem lista de episódio
    if(hasNext) {
      // pega o index do episósio que está tocando atualmente e add mais um "pulando para o próximo"
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  // volta para o episódio anterior
  function playPrevious() {
    // se estiver da posição 1 pra frente
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }
 
  return (
     // todos os componetes que vão ter acesso ao PlayerContext, deve ficar dentro dele
     // tudo que está dentro do PlayerContext, tem acesso as funções que estão no value
     // esses value: tudo que vai ser acessado em outra página, usa o useState pq essas variáveis vão ser alteradas
    <PlayerContext.Provider value={{ 
      episodeList, 
      currentEpisodeIndex, 
      play,
      playList,
      isPlaying, 
      togglePlay, 
      setPlayingState,
      playNext,
      playPrevious,
      hasNext,
      hasPrevious,
      isLooping,
      toggleLoop,
    }}
    >
    {/* // serve para passar todo o conteúdo que está dentro do arquivo _app.tsx, por volta do PlayerContextProvider, para aqui dentro */}
    {/* tudo que está dentro de PlayerContextProvider "no arquivo _app.tsx", vem pra cá, por causa desse children */}
    {children}
    </PlayerContext.Provider>
  )
}

/** faz a importação do useContext e do PlayerContext dentro do usePlayer, com isSameISOWeek, qdo for usar
 em outro arquivo é só importar o usePlayer, em vez de importar o useContext e o PlayerContext */
export const usePlayer = () => {
  return useContext(PlayerContext);
}