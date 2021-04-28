import { useRef, useEffect } from 'react';
import Image from 'next/image' // importa um componente de dentro do next chamado Image. Usa ele no lugar da tag <img>
import Slider from 'rc-slider' // yarn add rc-slider

import 'rc-slider/assets/index.css' // importar a estilização padrão de dentro do pacote. Importar o css

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss'


export function Player() {
  // deve ser null, pq a tag audio vai estar desabilitada, ela só é habilitada qdo for tocar algum video
  // todos elementos Html estão disponivel
  // <>: qual tipo de elemento vai ser salvo. HTMLAudioElement: pq vai ser armazenado um elemnto de audio
  // useRef: é como se fosse o document.getElementId(), só que o document usa no javascript e no react usa o useRef
  const audioRef = useRef<HTMLAudioElement>(null); 

  // serve para pegar informações que foi passada no arquivo _app.tsx
  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop
  } = usePlayer()

  // tem que disparar essa função, toda vez que o isPlayin estiver seu valor alterado
  // current: é o valor da referencia
  useEffect(() => {
    // caso não tenha nenhum valor dentro de audioRef, é pq não está tocando nada
    if(!audioRef.current){
      return; // não retorna nada
    }

    // se isPlaying estiver com valor true
    if(isPlaying) {
      audioRef.current.play(); // executa a função play. Está função vem do useRef no react
    } else { // se isPlaying estiver com valor false
      audioRef.current.pause(); // executa a função pause. Está função vem do useRef no react
    }
  }, [isPlaying])

  // para saber qual episodio está tocando
  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header> 

      {/* ?-> if     :-> else  . Se tem episodio, senão */}
      { episode ? (
        <div className={styles.currentEpisode}>
          {/* explicação do Image está no arquivo pages-> index.tsx  */}
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div> 
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div> 
      )}

      {/* caso não tenha um episodio passa a class empty, se tiver fica vazia */}
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
          {/* Slider: faz a bolinha que mostra o tempo do vídeo
           trackStyle: muda de cor a barra, conforme o video vai sendo assistido. A barra que foi assitido
           railStyle: a cor da barra que o vídeo não foi assistido ainda. A barra que falta assistir
           handleStyle: configuração da bolinha*/}
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ backgroundColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {/* para mostrar o audio se tiver episodios */}
        {/* só executa depois dos dois && caso for verdade. É um if sem o else */}
        {/* <audio></audio>: tag html 
         autoplay: assim que carregar o episodio, o audio já toca */}
        {/* a tag audio é do html, para conseguir acessar o elemento desta tag no react eu uso o useRef, igual qdo vai acessar no javascript, que usa o document.getElementId()  */}
        {/* ref={audioRef}: passa no ref a variavel que foi declarado lá em cima no useRef */}
        {/* onPlay: evento que é disparado qdo clicar no play do teclado, disparando a função setPlayingState como true */}
        {/* onPause: evento que é disparado qdo clicar no pause do teclado, disparando a função setPlayingState como false */}
        { episode && (
          <audio 
            src={episode.url} 
            ref={audioRef} 
            autoPlay 
            onPlay={() => setPlayingState(true)} 
            onPause={() => setPlayingState(false)} 
            loop={isLooping} // para deixar o episodio em looping "qdo acabar, inicia novamente"
          />
        )}

        <div className={styles.buttons}>
          {/* disabled={!episode}: desabilitar o botão, caso não tenha episodio tocando */}
          {/* || !hasPrevious: ou desabilita se não tem episódio anterior */}
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}> 
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          {/** esse botão vai ser um pouco maior que os outros, por isso colocou um class nele */}
          {/* togglePlay: é uma função no arquivo _app.tsx */}
          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode}
            onClick={togglePlay}
          > 
            {/* se o video estiver tocando, mostra o botão pause, elese mostra o play */}
            { isPlaying 
              ? <img src="/pause.svg" alt="Tocar"/>
              : <img src="/play.svg" alt="Tocar"/>}
          </button>
          {/* disabled={!episode}: desabilitar o botão, caso não tenha episodio tocando */}
          {/* || !hasPrevious: ou desabilita se não tem próximo episódio */}
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          {/* onClick={toggleLoop}: qdo clicar no botão, vai entrar ou sair do loop */}
          {/* {isLooping ? styles.isActive : '': se estiver em looping passa a class isActive no css, senão, não passa nada */}
          <button 
            type="button" 
            disabled={!episode} 
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>   
    </div>
  );
}