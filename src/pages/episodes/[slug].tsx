// este arquivo pode ser qq nome, mas deve estar dentro de []
// este arquivo serve para aparecer na barra url o nome do episodio que vai ser clicado na pagina home

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image' // importa um componente de dentro do next chamado Image. Usa ele no lugar da tag <img>
import Link from 'next/link'

import { api } from '../../services/api'
import { convertDurationToTimesString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        {/* voltar para pagina home. Colocar a tag Link, para qdo voltar pra pagima home, não carregar tudo da pagina novamente */}
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        
        <Image 
          width={700} 
          height={160} 
          src={episode.thumbnail} 
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div 
        className={styles.description} 
        // colocar alogo na tela em html
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

// criar pagina SSG, para não precisar carregar a pagina toda vez que alguém acessa
// explicação está na pasta pages-> index.tsx
export const getStaticProps: GetStaticProps = async (ctx) => {
  // ctx: deve pasar por parametro, para pegar o parametro da url "params"
  // slug: é o nome do arquivo
  // params: informação do que vem na url. Ex: consegue pegar o id que foi passado na url, lá no arquivo pages-> index.tsx, na tag Link
  const { slug } = ctx.params

  //episodes: seria esse caminho http://localhost:3333/episodes/id do episodio
  // ele pega o objeto do episodio com todos os campos
  // como se fosse buscar no BD um episodio de uma determinada tabela, trazendo toods os campos referente a aquele episodio 
  const { data } = await api.get(`/episodes/${slug}`)

  // formatar os dados do episodio
  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }), // formatar data, no formato brasileiro 3 Apr 21
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimesString(Number(data.file.duration)), // chama uma função para converter hora, minuto e segundos
    description: data.description,
    url: data.file.url
  }

  // carrega os dados do episodios
  return {
    // props: retorna os dados do episodio
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24h é igual a 86.400 segundos. segundos * minutos * horas
  }
}