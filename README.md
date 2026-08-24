## Bibliotecas

Visibilidade (imagem, PDF por página, marcos do texto) usa [`react-intersection-observer`](https://github.com/thebuilder/react-intersection-observer) — um hook fino em cima do `IntersectionObserver` nativo. Cada verificação combina isso com um tempo mínimo de permanência visível antes de marcar como visto, pra rolagens rápidas não contarem como leitura.

Vídeo **não** usa essa lib — assistir até o fim é uma questão de tempo reproduzido (`currentTime`/`duration`), não de visibilidade na tela, então o `<video>` nativo (eventos `timeupdate`/`seeking`/`ended`) já resolve sem intermediário. Não existe biblioteca pronta pra travar o avanço da barra ("assistir até o fim") — essa parte é sempre código de aplicação, em qualquer player.

PDF é renderizado com [`react-pdf`](https://github.com/wojtekmaj/react-pdf) (`pdf.js`).
