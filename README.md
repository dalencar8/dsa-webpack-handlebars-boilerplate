# dsa-webpack-handlebars-boilerplate

Boilerplate Webpack com Handlebars, inspirado no [template Webpack de projeto da Athlon](https://github.com/WeAreAthlon/frontend-webpack-boilerplate).

## Índice

- [Diretórios da pasta `src`](#diretórios-da-pasta-src)
- [Comandos da CLI](#comandos-da-cli)
- [Globals.js](#globalsjs)

---

## Diretórios da pasta `src`

### 📁 `bypass`

Diretório para qualquer arquivo que será copiado direto para a pasta `dist`, sem qualquer alteração.

### 📁 `fonts`

Diretório para armazenar arquivo de fontes usada no projeto.

### 📁 `images`

Diretório de imagens usadas no projeto.

- Arquivos fora de pastas devem ser arquivos usados através do CSS.
- 📁 `assets`: arquivos desta pasta devem ser imagens em tags HTML.

### 📁 `js`

Diretório de arquivos javascript usados no projeto.

- Arquivos fora de pastas são os arquivos usados nos htmls finais, sendo que o nome dele deve ser igual ao do html para ser inserido lá. Por exemplo: `index.js` será usado somente em `index.html`.
- O arquivo `common.js` é o único que é usado em todos os htmls.
- Se existem páginas em subpastas dentro da pasta `pages`, estas páginas usarão arquivos `[nome da subpasta]-dir.js`. Por exemplo: `works-dir.js` será usando somente nos `works/*.html`.
- 📁 `includes`: deixe aqui javascripts de bibliotecas de terceiros, que não devem ser editados.

NOTA: Importe os arquivos SCSS que quiser dentro dos JS (menos os da pasta `includes`) para que estes sejam usados somente nos HTMLs em que estes JS são chamados.

### 📁 `pages`

Diretório de arquivos Handlebar que são páginas. Mantém subpastas quando os htmls são construídos no diretório `dist`.

### 📁 `partials`

Diretório de arquivos Handlebar que são Partials, templates que podem ser reaproveitados por páginas e outros templates.

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

## Globals.js

Use o arquivo `globals.js` para poder compartilhar variáveis entre os arquivos HTML, JS e SCSS.

### Exemplo

```javascript
module.exports = {
  titulo: "Olá mundo!",
  corprincipal: "#10b981",
};
```

Então, em HTMLs, use varáveis `<%= %>`:

```html
<h1><%= titulo %></h1>
```

Em Javascripts (no caso em `src/js/common.js`), será retornado um objeto:

```javascript
import globals from "../../globals.js";

document.write(globals.titulo);
document.write(globals.corprincipal);
```

Em SCSS, com o auxílio do `jsToScss.js`, use as variáveis SCSS:

```scss
h1 {
  color: $corprincipal;
}
```
