# Parque Aquático Águas Clara Resort · site one-page

Site estático (HTML + CSS + JS), sem etapa de build. Funciona em qualquer hospedagem simples: basta publicar a pasta inteira.

## Rodar localmente

Qualquer servidor estático serve, por exemplo:

```bash
npx serve .            # ou: python -m http.server 8080
```

Abrir o `index.html` direto pelo arquivo também funciona, mas o mapa do Google precisa de `http(s)`.

## Estrutura

```
index.html            página única
css/style.css         estilos (mobile-first)
js/config.js          ← WhatsApp, mensagem e Instagram (edite aqui)
js/main.js            interações e animações
vendor/               GSAP 3.13 (+ ScrollTrigger, SplitText) e Lenis 1.3.11, versões fixas
assets/img/
  logo/               logo-colorida, logo-branca, logo-simbolo (.webp)
  mascote/            tubarao.webp
  fotos/              fotos do site (.webp), ver abaixo
  fotos/extras/       fotos recebidas que não estão em uso no site
  favicon/            favicon-32.png, apple-touch-icon.png
  og-image.jpg        prévia de compartilhamento (1200×630)
```

## Trocar dados

- **WhatsApp:** edite `whatsappLink` em `js/config.js`. Todos os botões usam esse link. Ao trocar, atualize também os `href` de fallback no HTML (para quem está sem JS): busque `api.whatsapp.com` no `index.html`.
- **Horário de funcionamento (fictício):** procure o comentário `<!-- FICTÍCIO -->` no `index.html`.

## Trocar as fotos

Substitua os arquivos em `assets/img/fotos/` mantendo o **mesmo nome**. Cada foto tem duas versões, a grande e a de 800 px de largura (usada no celular):

| Arquivo | Proporção | Versão menor |
|---|---|---|
| `hero.webp` (fundo do hero) | 3:2 (1536×1024) | `hero-800.webp` (800×533) |
| `piscina-ondas.webp` | 16:9 (1600×900) | `piscina-ondas-800.webp` (800×450) |
| `prainha.webp` | 4:5 (1200×1500) | `prainha-800.webp` (800×1000) |
| `toboaguas.webp` | 4:3 (1200×900) | `toboaguas-800.webp` (800×600) |
| `area-infantil.webp` | 4:3 (1200×900) | `area-infantil-800.webp` (800×600) |
| `quiosques.webp` | 4:3 (1200×900) | `quiosques-800.webp` (800×600) |

Exporte em WebP com qualidade entre 80 e 85.

## Acessibilidade e movimento

- Com `prefers-reduced-motion: reduce`, não há parallax, pin, scroll suave, partículas nem loops: o conteúdo aparece direto no estado final.
- Sem JavaScript, todo o conteúdo continua visível e os links funcionam.
