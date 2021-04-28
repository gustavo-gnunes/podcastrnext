// este arquivo ele fica por volta de todas as paginas da aplicação e é chamado todas vez que a pagina carrega
// qdo usar um componete em todas as paginas da aplicação, o componente deve ser colocado aqui. Ex: o Header "cabeçalho"

import { Header } from '../components/Header'
import styles from '../styles/app.module.scss'
import { Player } from '../components/Player'

import '../styles/global.scss'
import { PlayerContextProvider } from '../contexts/PlayerContext'


function MyApp({ Component, pageProps }) {
  return (
    // todos os componetes que vão ter acesso a função PlayerContextProvider no arquivo PlayerContext.tsx, deve ficar dentro dele
    // tudo que está dentro do PlayerContextProvider, tem acesso ao arquivo PlayerContext.tsx. Usa informação de um página em outra 
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider> 
  )
}

export default MyApp
