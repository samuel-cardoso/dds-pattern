## Padrão DDS — Declaração de Ciência

Protótipo de um padrão para garantir, de verdade, que o usuário consumiu um conteúdo antes de liberar uma confirmação ("declaro que li e estou ciente"). O objetivo é ir além de um simples checkbox: cada tipo de conteúdo só é marcado como "visualizado" quando existe evidência real de consumo.

Regras por tipo de conteúdo:

- **Imagem** — precisa ficar visível na tela por um tempo mínimo contínuo.
- **Vídeo** — precisa ser assistido até o fim (ou até um % mínimo). Não dá pra arrastar a barra pra frente sem assistir: tentar pular volta pro ponto realmente assistido. A posição é salva, então dar refresh na página retoma de onde parou.
- **PDF** — cada página precisa passar um tempo mínimo visível individualmente. Rolar rápido até o final sem passar pelo meio do documento não conta.
- **Texto** — o progresso é medido em marcos (25/50/75/100% do conteúdo), cada um exigindo que aquele trecho tenha ficado visível por um instante. Rolar rápido demais não conta.

Um botão de confirmação central só é liberado quando todos os itens de uma tela estiverem marcados como vistos.

### Bibliotecas

Visibilidade (imagem, PDF por página, marcos do texto) usa [`react-intersection-observer`](https://github.com/thebuilder/react-intersection-observer) — um hook fino em cima do `IntersectionObserver` nativo. Cada verificação combina isso com um tempo mínimo de permanência visível antes de marcar como visto, pra rolagens rápidas não contarem como leitura.

Vídeo **não** usa essa lib — assistir até o fim é uma questão de tempo reproduzido (`currentTime`/`duration`), não de visibilidade na tela, então o `<video>` nativo (eventos `timeupdate`/`seeking`/`ended`) já resolve sem intermediário. Não existe biblioteca pronta pra travar o avanço da barra ("assistir até o fim") — essa parte é sempre código de aplicação, em qualquer player.

PDF é renderizado com [`react-pdf`](https://github.com/wojtekmaj/react-pdf) (`pdf.js`).

### Rotas de demonstração

- `/dds/image` — imagem
- `/dds/video` — vídeo
- `/dds/pdf` — PDF
- `/dds/text` — texto
- `/dds/all` — os quatro tipos combinados, com um único botão de confirmação

### Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

O vídeo de demonstração é servido por um mini-servidor separado, simulando hospedagem externa (CDN):

```bash
npm run mock:video-cdn
```
