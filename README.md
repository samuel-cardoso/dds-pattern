## Padrão DDS — Declaração de Ciência

Protótipo de um padrão para garantir, de verdade, que o usuário consumiu um conteúdo antes de liberar uma confirmação ("declaro que li e estou ciente"). O objetivo é ir além de um simples checkbox: cada tipo de conteúdo só é marcado como "visualizado" quando existe evidência real de consumo.

Regras por tipo de conteúdo:

- **Imagem** — precisa ficar visível na tela por um tempo mínimo contínuo.
- **Vídeo** — precisa ser assistido até o fim (ou até um % mínimo). Não dá pra arrastar a barra pra frente sem assistir: tentar pular volta pro ponto realmente assistido.
- **PDF** — cada página precisa passar um tempo mínimo visível individualmente. Rolar rápido até o final sem passar pelo meio do documento não conta.
- **Texto** — precisa ser rolado até o final do conteúdo.

Um botão de confirmação central só é liberado quando todos os itens de uma tela estiverem marcados como vistos.

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
