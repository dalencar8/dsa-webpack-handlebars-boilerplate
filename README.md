# dsa-webpack-handlebars-boilerplate

Boilerplate Webpack com Handlebars

## Índice

- [Diretórios da pasta `src`](#diretórios-da-pasta-src)
- [Comandos da CLI](#comandos-da-cli)

---

## Diretórios da pasta `src`

### 📁 `bypass`

Diretório para qualquer arquivo que será copiado direto para a pasta `dist`, sem qualquer alteração.

### 📁 `fonts`

Diretório para armazenar arquivo de fontes usada no projeto.

### 📁 `images`

Diretório de imagens usadas no projeto.

- Arquivos fora de pastas devem ser arquivos usados por todo o projeto várias vezes, como favicon, logo, etc.
- 📁 `content`: arquivos desta pasta devem ser imagens de conteúdos específicos.

### 📁 `js`

Diretório de arquivos javascript usados no projeto.

- Arquivos fora de pastas são os arquivos usados nos htmls finais, sendo que o nome dele deve ser igual ao do html para ser inserido lá. Por exemplo: `index.js` será usado somente em `index.html`.
- O arquivo `common.js` é o único que é usado em todos os htmls.
- 📁 `includes`: deixe aqui javascripts de bibliotecas de terceiros, que não devem ser editados.

### 📁 `partials`

Diretório de arquivos Handlebar que são Partials, templates que podem ser reaproveitados por outros templates.

Mais informações [aqui](https://handlebarsjs.com/guide/partials.html).

### 📁 `scss`

Diretório de arquivos SASS usados no projeto.

- O arquivo `app.scss` é o responsável por unir todos os SASS.
- O arquivo `styles.scss` é o arquivo de estilos base do projeto.
- 📁 `base`: arquivos que variáveis, font-face, mixins, versão de impressão e resets ficam aqui.
- 📁 `dirty`: quando nada está ao seu lado, use hacks!
- 📁 `vendor`: deixe aqui arquivos SASS de bibliotecas de terceiros, que não devem ser editados.

## Comandos da CLI

### 👉 `npm run build`

- Use para construir o código de produção para dentro da pasta `dist`.
- Roda uma vez e relata de volta o que foi gerado.

### 👉 `npm run watch`

- Use para compilar e rodar o webpack em modo de desenvolvimento.
- Observa qualquer mudança feita e gera os arquivos na pasta `dist` quando necessário.

### 👉 `npm run bundle`

- Instala qualquer dependência necessária e roda `npm run watch`.

### 👉 `npm run dev`

- Use para rodar um servidor local na porta 8000, compilar e rodar o webpack em modo de desenvolvimento.
- Observa qualquer mudança feita e gera os arquivos na pasta `dist` quando necessário.

### 👉 `npm run production`

- Igual ao `npm run build`.

### 👉 `npm run lint:sass`

- Use para rodar ferramenta para analisar os arquivos SASS.

### 👉 `npm run lint:js`

- Use para rodar ferramenta para analisar os arquivos JS.

### 👉 `npm run stats`

- Use para gerar arquivo `dist/stats.json` com informações do projeto.
