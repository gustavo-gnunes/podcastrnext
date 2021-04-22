// este arquivo ele fica por volta de todas as paginas da aplicação, mas é chamado uma única vez
// por isso deve colocar as font do sistema aqui, se colocar no __app.tsx, toda vez que mudar de página, ele tem que carregar a fonte novamente

import Document, { Html, Head, Main, NextScript } from 'next/document'

// deve fazer desse jeito, pq a documentação do next pede pra fazer assim
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head> {/** onde vai ficar as importações, como das fontes */}
          <link rel="preconnect" href="https://fonts.gstatic.com" /> {/** deve colocar a / no final por causa do react */}
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main /> {/** onde vai ficar a aplicação */}
          <NextScript /> {/** são os scripts que o next precisa, para a aplicação funcionar */}
        </body>
      </Html>
    )
  }
}