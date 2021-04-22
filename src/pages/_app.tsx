// este arquivo ele fica por volta de todas as paginas da aplicação e é chamado todas vez que a pagina carrega
// qdo usar um componete em todas as paginas da aplicação, o componente deve ser colocado aqui. Ex: o Header "cabeçalho"

import { Header } from '../components/Header'

import '../styles/global.scss'

import styles from '../styles/app.module.scss'
import { Player } from '../components/Player'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  )
}

export default MyApp
