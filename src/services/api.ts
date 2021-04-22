import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333/' // endereço que vai ser repetido em todas chamadas api que eu fizer. Chamo isso no arquivo index.tsx na pasta pages
})