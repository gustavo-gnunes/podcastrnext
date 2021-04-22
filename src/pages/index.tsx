import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns' // foi instalado no terminal este pacote, serve para converter data
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimesString } from '../utils/convertDurationToTimeString'

//import styles from './home.module.scss'

// existem 3 formas para conectar uma api dentro do next
// 1 funciona em qq projeto react SPA
// 2 funciona só no next SSR
// 3 funciona só no next SSG

//import { useEffect } from "react" // primeira forma

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

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}


// props é a segunda forma, a primeira deve deixar vazio
//export default function Home(props: HomeProps) {
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  /**
  // primeira forma
  // requisição modelo SPA: roda no js do browser, se desabilitar o js, o projeto não roda
  // useEffect: a função é disparada toda vez que acontecer algo
  // []: por causa do array vazio, ela é disparada uma unica vez
  useEffect(() => {
    fetch('http://localhost:3333/episodes') // url a qual quer acessar
    .then(response => response.json()) // converte a resposta em JSON
    .then(data => console.log(data)) // para ver os dados que vão ser exibidos
  }, [])
  */

  return (
    <div /*className={styles.homepage}*/>
      <section /*className={styles.latestEpisodes}*/>
        <h2>Últimos lançametos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              // Key: propriedade padrão do react, deve colocar, senão dá erro
              // deve ser colocada no primeiro elemento que vem dentro do map, tem que colocar uma propriedade unica, como o id, que nunca se repete
              // tem que usar isso, pq se eu tenho 1200 li, e quero excluir o li 900, a key vai até essa determinada li 
              <li key={episode.id}>
                <a href="">{episode.title}</a>
              </li>
            )
          })}
        </ul>
      </section>

      <section /*className={styles.allEpisodes}*/>
        
      </section>
    </div>
    
  )
}

/**
// segunda forma. Toda vez que alguem entrar o site, carrega a pagina
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes') // url a qual quer acessar
  const data = await response.json() // converte a resposta em JSON

  return {
    props: {
      episodes: data,
    }
  }
}
*/

// terceira forma. Não é carregada a pagina toda vez que alguém acessa, e sim, de uma determinado tempo a um determinado tempo
// Ex: a pagina é carregada uma vez por dia, pois só sofre alteração uma vez por dia
// Ex: ou a pagina é carregada de 5 em 5 minutos, pois recebe alteração sempre, como uma pagina do globo.com
export  const getStaticProps: GetStaticProps = async () => {
  // _limit=12: vai aparecer na tela somente 12episodios e conforme o usuário for fazendo o scroll da pagina, vai carregando mais episodios
  // _sort=published_at: os episodios fica ordenados pelo campo published_at "data" 
  // api.get: pq está buscando uma informação dentro da pasta /services/api.ts
  /** dentro do arquivo /services/api.ts retorna esse link http://localhost:3333/ que junta com o episodes, ficando: http://localhost:3333/episodes 
    isso seria uma simulação para buscar dados de um BD
    params: seria os campos que vai ser usado no front-end de uma determinada tabela do BD */
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  }) // url a qual quer acessar, está url está sendo buscada na api.get, dentro da pasta /services/api.ts
 
  // formatar os dados que estão vindo da api BD. Ex: Isso serve pra qdo no BD a data está formatada de um jeito e vc quer usar de outro jeito
  // data: onde estão todos os dados do array da api. Ex: pode buscar todos os dados de uma tabela do BD
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }), // formatar data, no formato brasileiro 3 Apr 21
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimesString(Number(episode.file.duration)), // chama uma função para converter hora, minuto e segundos
      description: episode.description,
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2) // pega os dois primeiros episodios
  const allEpisodes = episodes.slice(2, episodes.length) // pega os demais episodios

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, // a cada 8h vai ser chamada está pagina novamente // revalidate: de qtos em qtos segundos eu quero gerar uma nova versão desta pagina
  }
}
