// este arquivo ele fica por volta de todas as paginas da aplicação e é chamado todas vez que a pagina carrega
// qdo usar um componete em todas as paginas da aplicação, o componente deve ser colocado aqui. Ex: o Header "cabeçalho"
import { useState } from 'react'

import { Header } from '../components/Header'
import styles from '../styles/app.module.scss'
import { Player } from '../components/Player'
import { PlayerContext } from '../contexts/PlayerContext'

import '../styles/global.scss'


function MyApp({ Component, pageProps }) {
  // para alterar o valor de uma lista de episodios
  const [episodeList, setEpisodioList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false) // começa com false, pq qdo não tiver nenhum video selecionado, aparece o botão play

  // episode que está sendo tocado no momento
  // está função vai ser usada lá na page-> index.tsx
  function play(episode) {
    setEpisodioList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true) // alterar para true, para dizer que foi dado o play do video
  }

  // se estiver tocando vai pausar e se estiver pausado vai tocar o video. Troca o botão de play e pause
  function togglePlay() {
    setIsPlaying(!isPlaying); // se estiver true, vai alterar para false e se estiver false vai alterar para true
  }

  // está função serve para qdo o usuário aperta o botão de play e pause do teclado. 
  // Na pasta Player-> index.tsx é disparado uma função onPlay ou onPause para está função
  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    // todos os componetes que vão ter acesso ao PlayerContext, deve ficar dentro dele
    // tudo que está dentro do PlayerContext, tem acesso a variável Gustavo
    // esses value: está dentro do arquivo PlayerContext.tsx, usa o useState pq essas variáveis vão ser alteradas
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState}}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
