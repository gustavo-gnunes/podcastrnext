import { GetStaticProps } from 'next'
import { useContext } from 'react'
import Image from 'next/image' // importa um componente de dentro do next chamado Image. Usa ele no lugar da tag <img>
import Link from 'next/link' // serve para não precisar carregar todas as paginas do zero
import { format, parseISO } from 'date-fns' // foi instalado no terminal este pacote, serve para converter data
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api'
import { convertDurationToTimesString } from '../utils/convertDurationToTimeString'
import { PlayerContext } from '../contexts/PlayerContext'

import styles from './home.module.scss'



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
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}


// props é a segunda forma, a primeira deve deixar vazio
//export default function Home(props: HomeProps) {
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  // serve para pegar informações que foi passada no arquivo _app.tsx
  const {play} = useContext(PlayerContext)

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
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançametos {play}</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              // Key: propriedade padrão do react, deve colocar, senão dá erro
              // deve ser colocada no primeiro elemento que vem dentro do map, tem que colocar uma propriedade unica, como o id, que nunca se repete
              // tem que usar isso, pq se eu tenho 1200 li, e quero excluir o li 900, a key vai até essa determinada li 
              <li key={episode.id}>
                {/* Para funcionar o Image, deve criar um arquivo next.config.js e passar algumas configurações */}
                {/* Image: usa qdo tem imagem pesada, qdo a imagem de fora do sistema Ex: ela não fica na pasta public. Como não sabe como vai vim está imagem, pode ser que ela vem em uma resolução muito pesada */}
                {/* ao em vez de tratar a imagem no back-end, para diminuir a resolução, esse componente Image do next já faz isso */}
                {/* width e heigth: não são o tamanho que eu quero mostrar a imagem e sim a tamanho que vai ser carregado a imagem. Ex: carregar a imagem em 192px
                 deve colocar o tamanho do width e heigth 3 vezes mais da tamanho que defino arquivo css Ex: no css o width e heigth são 64px, aqui eu deixo eles com 192px */}
                {/* objectFit="cover": melhora a visualização da imagem */}
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  objectFit="cover"
                />

                {/* detalhes dos episodios */}
                <div className={styles.episodeDetails}>
                  {/** Link: deve colocar por volta de todas as tag <a>, que é onde direciona para outra pagina
                   * se não colocar esse Link, toda vez que for para outra pagina, vai carregar todo o projeto navamente, tudo que já foi carregado
                   * com o Link, ele carrega somente o que não foi carregado ainda. Melhora a performace, deixando a navegação das paginas mais rádipo
                   * ao em vez do href ficar na tag <a>, ele deve ficar na tag Link
                   */}
                  {/** /episodes: é a pagida que está dentro de pages-> episodes-> [slung].tsx 
                    * com isso ele redireciona para outra pagina que está na pasta pages-> episodes, passando pela url o nome do id */}
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  
                  <p>{episode.members}</p> {/* membros dos episodios, quem participou da gravação */}
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                
                {/* qdo clicar neste botão ele pega qual é o episodio que está sendo tocado e joga o titulo na pagina player, que está na pasta componente-> Player-> index.tsx */}
                {/* onClick={() => play(episode)}: serve para chamar a função play que está dentro do arquivo _app.tsx */}
                <button type="button" onClick={() => play(episode)}>
                  {/* não usa o Image, pq essa imagem está dentro do meu projeto e ela é leve */}
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                // Key: propriedade padrão do react, deve colocar, senão dá erro
                // deve ser colocada no primeiro elemento que vem dentro do map, tem que colocar uma propriedade unica, como o id, que nunca se repete
                // tem que usar isso, pq se eu tenho 1200 li, e quero excluir o li 900, a key vai até essa determinada li 
                <tr key={episode.id}>
                  <td style={{ width: '72px' }}>
                    <Image 
                      width={120} 
                      height={120} 
                      src={episode.thumbnail} 
                      alt={episode.title} 
                      objectFit="cover" 
                    />
                  </td>
                  <td>
                    {/** Link: deve colocar por volta de todas as tag <a>, que é onde direciona para outra pagina
                     * se não colocar esse Link, toda vez que for para outra pagina, vai carregar todo o projeto navamente, tudo que já foi carregado
                     * com o Link, ele carrega somente o que não foi carregado ainda. Melhora a performace, deixando a navegação das paginas mais rádipo
                     * ao em vez do href ficar na tag <a>, ele deve ficar na tag Link
                     */}
                    {/** /episodes: é a pagida que está dentro de pages-> episodes-> [slung].tsx 
                      * com isso ele redireciona para outra pagina que está na pasta pages-> episodes, passando pela url o nome do id */}
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
    // 8h é igual a 28.800 segundos. segundos * minutos * horas
    // qtdeMinuto = 8 * 60: qtde de horas em minutos. 
    // qdtSegundos = qtdeMinuto * 60: qdte de minutos em segundos
    revalidate: 60 * 60 * 8, // a cada 8h vai ser chamada está pagina novamente // revalidate: de qtos em qtos segundos eu quero gerar uma nova versão desta pagina
  }
}
