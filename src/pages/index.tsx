// existem 3 formas para conectar uma api dentro do next
// 1 funciona em qq projeto react SPA
// 2 funciona só no next SSR
// 3 funciona só no next SSG

//import { useEffect } from "react" // primeira forma

// props é a segunda forma, a primeira deve deixar vazio
export default function Home(props) {
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
    <div>
      <h1>Index</h1>
      {/* segunda forma e terceira forma */}
      <p>{JSON.stringify(props.episodes)}</p>
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
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes') // url a qual quer acessar
  const data = await response.json() // converte a resposta em JSON

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, // a cada 8h vai ser chamada está pagina novamente // revalidate: de qtos em qtos segundos eu quero gerar uma nova versão desta pagina
  }
}
