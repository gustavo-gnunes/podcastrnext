import format from 'date-fns/format' // para ter o date-fns: deve instalar no terminal yarn add date-fns
import ptBR from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

export function Header() {
  // formartar data estilo Brasil
  // 'EEEEEE, d MMMM': tipo da formatação da data. Ex: Ter, 20 Abril
  // locale: para colocar no idioma correto
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  return (
    // no react não usa class e sim className, nas propriedades. O class é uma propriedade reservado no js
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr"/>
      <p>O melhor para você ouvir, sempre</p>
      <span>{currentDate}</span>
    </header>
  );
}