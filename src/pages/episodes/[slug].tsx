// este arquivo pode ser qq nome, mas deve estar dentro de []
// este arquivo serve para aparecer na barra url o nome do episodio que vai ser clicado na pagina home

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import next, { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image' // importa um componente de dentro do next chamado Image. Usa ele no lugar da tag <img>
import Link from 'next/link'
import { usePlayer } from '../../contexts/PlayerContext'

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
  const { play } = usePlayer()

  return (
    <div className={styles.episode}>
      {/* nome que vai aparecer na aba do navegador */}
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

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
        <button type="button" onClick={() => play(episode)}>
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

// este método é orbigado a usar em toda rota que está utilizando o metodo getStaticProps e tem paramentros dinamicos, que é o arquivo que tem colchetes "[sling].tsx"
export const getStaticPaths: GetStaticPaths = async () => {
  // .get-> para buscar episodios
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2, // somente 2 episodios
      _sort: 'published_at', // os episodios fica ordenados pelo campo published_at "data" 
      _order: 'desc'
    }
  })

  // gera as paginas de forma staticas, que neste caso são duas
  // essa 2 episodios que foram geradas de forma staticas, qdo o usuário clicar para ir na paginas, elas vão ser carregadas muito rápidas
  // já as outros episodios vão demorar um pouco para ser carregadas na pagina
  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    // paths: forma staticas. Pode colocar todos episodios do BD aqui, ou aquelas que serão mais acessadas
    // Obs: não é aconselhado carregar todos episodios na página se tiver muita coisa. Ex: se gerar 15mil episodios de páginas staticas a build vai demorar muito prara carregar
    paths,

    // blocking: só vai mostrar a página que foi clicada para o usuário, qdo os dados já tiverem sido carregados, aí vai para a outra pagina. Conforme o usuário for acessando as paginas elas vão sendo geradas de forma staticas, sendo incrementadas no paths 
    // true: ele mostra a tela depois carrega, se os dados não estiver no paths ele busca pra ve se tem algo. Ele muda a página para depois carregar, as vezes a página pode ficar em branco até carregar e mostrar o conteúdo
    // false: só carrega o que está no paths, se não estiver nada ou não estiver aquela página, ele dá erro 404
    // Obs: o blocking é a melhor opção
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