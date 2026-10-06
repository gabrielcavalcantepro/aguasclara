# spec.md · Site Parque Aquático Águas Clara Resort

## Como ler este spec

Este documento define **o que é inegociável** e **onde queremos chegar**. O *como* fica com você.

- **Inegociável** (seções 2, 3 e 6 a 10): copy, marca, assets, conversão, regras técnicas, SEO e entrega. Siga à risca.
- **Direção criativa** (seções 4 e 5): o clima, os requisitos mínimos de cada seção e ideias de referência. As ideias são **ponto de partida, não checklist**: use, combine, troque ou supere. Se tiver uma solução melhor, use a sua.

---

## 1. Objetivo e atitude

Site one-page para **gerar contatos via WhatsApp para a venda do Acesso VIP Vitalício**, usando a nova **Piscina de Ondas** como gancho principal.

**Público:** famílias do Vale do Jauru e do oeste do Mato Grosso. A maioria vai acessar pelo celular, vindo do Instagram. O design é **mobile-first**.

**Atitude:** **este NÃO é um site institucional.** Precisa ter cara de parque aquático: molhado, ensolarado, alegre, em movimento. Quem rolar a página tem que sentir vontade de pular na água. Pense em parque temático e campanha de verão, não em página corporativa com seções empilhadas em fundos chapados.

Três palavras para guiar cada decisão: **água, sol, diversão em família.**

**Fonte dos textos:** `copy.md`. Todo texto visível vem de lá, sem alterações.

---

## 2. Arquivos recebidos e estrutura

### 2.1 O que o cliente enviou

Os arquivos foram enviados **soltos na raiz do projeto**, sem pasta. São só estes:

1. **Logo em PNG**
2. **PDF da logo com diferentes fundos** (manual de cores). Ele tem 5 páginas:
   - pág. 1: logo colorida sobre fundo branco
   - pág. 2: logo colorida com texto branco sobre fundo azul-marinho
   - pág. 3: logo toda branca sobre fundo verde
   - pág. 4: logo toda branca sobre fundo amarelo
   - pág. 5: paleta de cores
3. **Mascote** (tubarão)

Não há fotos do parque. Veja a seção 2.4.

### 2.2 Estrutura do projeto

A entrega final é um **site estático** (HTML, CSS e JS) que abre e funciona servido de qualquer hospedagem simples. Organize os arquivos como achar melhor (módulos JS, pasta `vendor/`, parciais etc.). Só duas regras de estrutura são fixas:

```
assets/img/
├── logo/           ← só .webp
├── mascote/        ← só .webp
├── fotos/          ← só .webp (placeholders por enquanto)
├── favicon/        ← exceção de formato, ver 2.5
└── og-image.jpg    ← exceção de formato, ver 2.5
js/config.js        ← WhatsApp e dados editáveis (ver 7.1)
```

Se usar uma ferramenta de build (ex.: Vite), entregue também a pasta final já gerada e um `README.md` curto com os comandos para rodar e gerar o build.

### 2.3 Preparação dos assets (faça antes de escrever código)

1. **Liste e abra** os arquivos da raiz para identificar a logo PNG, o PDF e o mascote.
2. **Logos:** gere estas versões, todas com **fundo transparente**:
   - `logo-colorida.webp`: a partir do PNG enviado (ou da pág. 1 do PDF). Para fundos claros.
   - `logo-branca.webp`: a partir da pág. 2 do PDF (símbolo colorido + texto branco). Para os fundos azuis do site (header, hero, rodapé, cartão VIP).
   - `logo-simbolo.webp`: recorte só do sol, onda e palmeiras da logo colorida (vai virar o favicon).
   - **Como extrair do PDF (sugestão):** tente `pdftocairo -svg` na página, remova o retângulo de fundo e rasterize o SVG em alta resolução com fundo transparente. Se não der, renderize a página com `pdftoppm -r 600` e remova a cor sólida de fundo, tratando a suavização das bordas para não ficar halo. Recorte as margens vazias.
   - **Abra cada logo gerada e confira visualmente** sobre um fundo de contraste. Não pode haver halo, sobra de fundo ou corte.
3. **Mascote:** `mascote/tubarao.webp`, com largura máxima de 900 px. Também gere `mascote/tubarao-pequeno.webp` com 160 px, para o botão flutuante. Ele precisa ter **fundo transparente**. Se o arquivo enviado não tiver, não recorte às cegas: avise no resumo final.
4. **Conversão para WebP:** **todas as imagens usadas no site são `.webp`** (qualidade de 80 a 85, com canal alfa preservado quando houver transparência). Use a ferramenta que preferir (Pillow, sharp, cwebp etc.).
5. **Limpeza:** depois de gerar e conferir todos os `.webp`, **exclua os arquivos originais** (o PNG da logo, o PDF e o arquivo original do mascote) e qualquer arquivo intermediário (PNGs temporários, SVGs de extração, renders). Na entrega, não pode sobrar nenhuma imagem que não seja usada no site.

### 2.4 Fotos: placeholders por enquanto

Ainda não há fotos do parque. Gere **imagens provisórias em `.webp`** já com os nomes finais. Assim, quando as fotos reais chegarem, basta substituir o arquivo com o mesmo nome, sem tocar no código.

| Arquivo | Proporção | Uso |
|---|---|---|
| `fotos/piscina-ondas.webp` | 16:9 (1600×900) | fundo da seção Piscina de Ondas + card principal de Atrações |
| `fotos/prainha.webp` | 4:5 (1200×1500) | seção O Parque + card de Atrações |
| `fotos/toboaguas.webp` | 4:3 (1200×900) | card de Atrações |
| `fotos/area-infantil.webp` | 4:3 (1200×900) | card de Atrações |
| `fotos/quiosques.webp` | 4:3 (1200×900) | card de Atrações |

**Visual dos placeholders:** sugestão: gradiente vertical de `--azul-ciano` para `--azul-onda`, com 2 ou 3 faixas de onda em tons da paleta na parte de baixo e um sol amarelo-sol discreto. Cada um com uma composição levemente diferente (posição do sol e altura das ondas), para não parecerem idênticos. **Sem nenhum texto dentro da imagem** (nada de "foto em breve").

No HTML, os `alt` já devem descrever a foto real esperada (ex.: "Piscina de Ondas do Águas Clara Resort com famílias se divertindo").

### 2.5 Exceções de formato (justificadas)

- **Favicon:** `favicon/favicon-32.png` e `favicon/apple-touch-icon.png` (180 px), a partir de `logo-simbolo`, porque o iOS não aceita WebP no apple-touch-icon.
- **Imagem de compartilhamento:** `og-image.jpg` (1200×630, fundo azul-noite com a logo branca centralizada e uma onda na base), porque WhatsApp e Facebook não exibem WebP de forma confiável na prévia de links.

Esses são os **únicos** arquivos de imagem que não são `.webp`.

---

## 3. Marca (inegociável)

### 3.1 Cores

Paleta oficial do manual de marca. Use estes hex como base de todo o sistema de cores.

```css
:root {
  /* Oficiais */
  --azul-marinho: #1B4083;
  --azul-ciano:   #2EBEEF;
  --amarelo-sol:  #FDC307;
  --verde-palma:  #17795A;

  /* Derivadas sugeridas (ajuste ou crie outras dentro da mesma família) */
  --azul-noite:   #16285F;
  --azul-onda:    #2F6FC4;
  --agua-clara:   #BFEFFF;
  --ceu-claro:    #EAF8FE;
  --areia:        #FFF1C7;
  --branco:       #FFFFFF;
}
```

- Você pode criar tons derivados (mais claros, mais escuros, gradientes), sempre **a partir dessas quatro cores**. Não introduza novas famílias de cor (rosa, roxo, laranja etc.).
- Não use preto nem cinza neutro. O "escuro" do site é azul.
- O **amarelo-sol** é a cor de ação dos botões principais, com texto azul-marinho.
- O **verde** aparece em detalhes de natureza (palmeiras, folhas), nunca como cor dominante.
- Contraste mínimo AA em todo texto.

### 3.2 Tipografia

A marca usa Loos Normal (texto), Alphaget (pincel) e Baskerville Italic (editorial), que são pagas. Sugestão de equivalentes do Google Fonts:

| Papel | Sugestão | Uso |
|---|---|---|
| Texto e títulos | **Figtree** (400–900) | todo o site |
| Pincel (acento) | **Kaushan Script** | "Piscina de Ondas", "Onde o Lazer encontra a Natureza.", balões do mascote |
| Editorial | **Libre Baskerville** itálico | título da seção O Parque |

Você pode trocar por outras se encontrar opções mais fiéis ao espírito da marca: sem-serifa geométrica e encorpada + script de pincel com energia. O título "Piscina de Ondas" em fonte pincel é a assinatura tipográfica da campanha e deve aparecer com muito destaque.

### 3.3 Logo

- Use `logo-branca.webp` sobre fundos azuis e escuros e `logo-colorida.webp` sobre fundos claros.
- Não distorça, recolora nem aplique efeitos que alterem a logo. Animar a entrada dela é permitido.

### 3.4 Mascote (tubarão)

- É o personagem do site: **use e abuse dele** como guia da experiência (no hero, interagindo com o scroll, no CTA final e no botão flutuante de WhatsApp, pelo menos).
- Existe **uma única imagem**. Pode mover, escalar, flutuar, balançar, entrar e sair de cena, e girar levemente (até cerca de 15°). Não pode distorcer, recolorir, cortar partes do corpo nem espelhar (a camiseta tem a logo).
- Ele **não tem nome**: não invente um.
- Os balões de fala usam só os textos do `copy.md` ("Bora pegar onda?" e "Fala com a gente!").
- `alt="Mascote tubarão do Águas Clara Resort fazendo joinha"` (ou `alt=""` nas repetições decorativas).

---

## 4. Direção criativa

### 4.1 Princípios

1. **Movimento como linguagem.** A água nunca está parada. Ondas que se movem, elementos que boiam, entradas com energia, scroll que conta uma história. As animações são parte central da experiência, não um enfeite.
2. **Nada de linhas retas entre seções.** Toda transição é orgânica: ondas, respingos, curvas, camadas que se sobrepõem, seções que "mergulham" umas nas outras.
3. **Fundos variados e com vida.** Cada seção tem uma atmosfera própria, e nenhuma é só uma cor chapada. Alguns caminhos possíveis:
   - azul profundo de fim de tarde com brilho de sol;
   - água de piscina em ciano com reflexos de luz (cáusticas) se movendo;
   - areia clara e sol forte, quente e ensolarado;
   - céu claro com nuvens leves;
   - texturas sutis de ícones de linha da marca (boia, onda, sol, palmeira), como nas peças impressas.
4. **Profundidade e camadas.** Elementos na frente e atrás do conteúdo (palmeiras, boias, bolhas, gotas, ondas) criam parallax e sensação de 3D.
5. **Alegria com acabamento.** É divertido, mas não amador: tipografia bem resolvida, espaçamento generoso e animações suaves a 60 fps. O padrão é de site premiado, não de template.
6. **O celular é o palco principal.** A experiência mais impressionante tem que acontecer no celular, não só no desktop.

### 4.2 Banco de ideias (opcional)

Use como inspiração, não como lista obrigatória:

- **Hero:** o mascote surfando ou surgindo de uma onda; o sol nascendo atrás do título; o título entrando letra por letra como respingo; ondas em camadas com parallax no mouse ou giroscópio.
- **Piscina de Ondas:** seção fixada (*pinned*) em que, conforme o scroll, as ondas crescem e "invadem" a tela, com o título em pincel sendo desenhado e os benefícios surfando para dentro.
- **Transições:** a tela "enche de água" entre seções; morph de ondas SVG; respingos que revelam a próxima seção.
- **Partículas:** bolhas subindo, gotas, reflexos de luz na água (canvas ou WebGL leve, com fallback).
- **Atrações:** galeria com scroll horizontal no desktop (pin + scrub), boias girando como marcadores, cards que "boiam".
- **Cartão VIP:** cartão de sócio com brilho holográfico, inclinação 3D que segue o mouse ou o giroscópio, ou que vira ao entrar na tela.
- **Microinterações:** botões com efeito de respingo ou ondulação no clique; cursor que deixa ondinhas no desktop; boia que gira no hover.
- **Mascote guia:** ele acompanha o scroll aparecendo em pontos diferentes (espiando de uma borda, pulando de uma seção para outra) até chegar ao CTA final.

### 4.3 Stack de animação

Liberdade total. Recomendações:

- **GSAP + ScrollTrigger** para animações ligadas ao scroll. Todos os plugins do GSAP (SplitText, MorphSVG, DrawSVG etc.) são gratuitos hoje.
- **Lenis** para scroll suave, se fizer sentido.
- **Canvas, WebGL leve ou bibliotecas como OGL/Three.js** para água, cáusticas ou partículas, desde que com fallback e sem pesar no celular.
- CSS moderno (scroll-driven animations, `@property`, container queries) onde resolver melhor que JS.

Bibliotecas podem vir de CDN confiável (jsDelivr, cdnjs, unpkg) com versão fixa, ou ficar locais em `vendor/`.

---

## 5. Estrutura da página

A ordem das seções e o conteúdo de cada uma estão no `copy.md`. Abaixo estão o **objetivo** e os **requisitos mínimos** de cada uma. Layout, composição e animação são decisões suas.

### 5.0 Header flutuante (requisito)
- **Não** é a barra clássica fixa que ocupa toda a largura. É um **cabeçalho flutuante**: uma cápsula (pílula) solta do topo, com margem em volta, cantos arredondados, efeito de vidro (blur + transparência) e sombra azul suave.
- Contém a logo, as âncoras do menu (desktop) e o botão "Quero ser Sócio VIP".
- **Comportamento sugerido:** esconde ao rolar para baixo e reaparece ao rolar para cima; muda de tamanho ou de estilo depois do hero; destaca a seção ativa com um indicador animado.
- **Mobile:** cápsula compacta com a logo e o botão de menu. O menu abre com uma transição marcante (ex.: a cápsula se expande e vira um painel, ou uma onda cobre a tela), com as âncoras grandes e o CTA.
- O menu é acessível: `aria-expanded`, foco preso enquanto aberto, fecha com `Esc` e trava o scroll do fundo.

### 5.1 Hero (`#inicio`)
- **Objetivo:** impacto imediato e desejo. Em 3 segundos, a pessoa entende que é um parque aquático com uma Piscina de Ondas inédita.
- **Mínimo:** pílula, H1, subtítulo, os 2 botões, o mascote com o balão "Bora pegar onda?" e uma animação de entrada marcante.
- A logo grande no hero é opcional, porque ela já está no header.

### 5.2 Piscina de Ondas (`#piscina-de-ondas`)
- **Objetivo:** ser **o grande momento do site**. É a seção mais trabalhada e mais animada.
- **Mínimo:** pílula "Nova atração", título em fonte pincel em tamanho gigante, subtítulo, texto, os 4 benefícios com ícones e a faixa de inauguração.
- A foto `fotos/piscina-ondas.webp` pode ser usada como fundo ou elemento, mas a seção tem que funcionar bem com o placeholder.

### 5.3 O Parque (`#o-parque`)
- **Objetivo:** credibilidade com emoção. Mostrar que o parque é tradicional na região e que está numa nova fase.
- **Mínimo:** título editorial, texto, frase em pincel e os 5 pilares com ícones de linha.

### 5.4 Atrações (`#atracoes`)
- **Objetivo:** dar vontade de ir. A Piscina de Ondas tem mais destaque que as outras e leva a pílula "Nova atração".
- **Mínimo:** as 5 atrações com imagem, nome e texto. Evite a grade de 5 cards idênticos.
- No celular, a navegação tem que ser fácil com o polegar (ex.: scroll horizontal com snap).

### 5.5 Acesso VIP (`#acesso-vip`)
- **Objetivo:** **conversão.** É a seção mais importante para o negócio.
- **Mínimo:** um **cartão de destaque** com todo o conteúdo da seção 5 do `copy.md` (selo, título, texto, 3 destaques, texto de apoio, botão e microtexto), visualmente tratado como um **cartão de sócio VIP** (premium, dourado/amarelo-sol). Em seguida, os 3 passos do "Como funciona".
- O botão precisa ser o elemento de maior contraste da tela. Garanta legibilidade total, inclusive durante as animações.

### 5.6 Localização (`#localizacao`)
- **Mínimo:** título, endereço, funcionamento, botão "Como chegar" e mapa.
- Mapa: `<iframe>` com `loading="lazy"`, `title="Mapa do Águas Clara Resort"` e `src="https://www.google.com/maps?q=Rod.+MT+248,+KM+16,+Indiava%C3%AD+-+MT&output=embed"`.
- "Como chegar": `https://www.google.com/maps/dir/?api=1&destination=Rod.+MT+248,+KM+16,+Indiava%C3%AD+-+MT`, em nova aba.
- Pode ser uma seção mais calma, mas sem perder o clima do parque.

### 5.7 Dúvidas (`#duvidas`)
- **Mínimo:** acordeão acessível com as 5 perguntas. Base sugerida: `<details>`/`<summary>`, que funciona sem JS. A abertura e o fechamento podem ser animados.

### 5.8 CTA final
- **Objetivo:** último empurrão. O mascote é o protagonista aqui, fazendo joinha, de preferência com uma entrada animada.
- **Mínimo:** título, texto e botão.

### 5.9 Rodapé
- **Mínimo:** logo, assinatura, endereço, Instagram, WhatsApp e copyright. Pode ter a última onda do site.

---

## 6. Botão flutuante de WhatsApp (requisito)

- Fica fixo no canto inferior direito, respeitando `env(safe-area-inset-bottom)`, com o ícone do WhatsApp sobre fundo verde WhatsApp (#25D366).
- O mascote (`tubarao-pequeno.webp`) aparece junto, espiando ou interagindo com o botão.
- O balão "Fala com a gente!" aparece **uma vez por sessão**, alguns segundos após o carregamento, e some sozinho ou no clique (use `sessionStorage` dentro de try/catch).
- Fica oculto enquanto o menu mobile estiver aberto e não pode cobrir os botões de CTA no celular.
- Tem `aria-label` com o rótulo acessível do `copy.md`.

---

## 7. Regras técnicas (inegociável)

### 7.1 WhatsApp centralizado
```js
// js/config.js: edite aqui os dados do parque
window.AGUAS_CLARA = {
  whatsapp: '5565999999999', // [PENDENTE] número fictício: trocar pelo real (só dígitos, com DDI e DDD)
  whatsappMensagem: 'Olá! Vim pelo site e quero saber mais sobre o Acesso VIP Vitalício do Águas Clara Resort.',
  instagram: 'https://www.instagram.com/aguasclara_resorts/'
};
```
- Todo link de WhatsApp do site usa esses dados: `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, com `target="_blank" rel="noopener"`.
- No HTML, deixe um `href` de fallback já montado, para os links funcionarem sem JS.

### 7.2 Animações responsáveis
- **`prefers-reduced-motion: reduce`:** desliga parallax, pin, scroll suave, partículas e loops. O conteúdo aparece direto, já no estado final.
- **Conteúdo nunca escondido sem JS:** nada pode depender de JS para ficar visível. Use uma classe como `.js` no `<html>` para ativar os estados iniciais das animações.
- Anime só `transform` e `opacity` (e filtros leves). Evite animar propriedades de layout.
- **60 fps no celular intermediário.** Efeitos pesados (WebGL, muitas partículas) só são iniciados quando a seção está visível, pausam fora da tela e têm versão simplificada ou desligada no celular, se necessário.
- Recalcule o ScrollTrigger (ou equivalente) depois que as fontes e imagens carregarem e no resize, para não quebrar o layout.
- Nenhuma animação pode atrapalhar a leitura dos textos ou o clique nos botões.

### 7.3 Responsividade
- Mobile-first. Teste em 360, 390, 768, 1024, 1280 e 1440 px.
- Sem scroll horizontal indesejado em nenhuma largura (o scroll horizontal intencional da galeria é exceção).
- Áreas de toque com no mínimo 44×44 px. Use `svh`/`dvh` para alturas de tela.

### 7.4 Acessibilidade
- HTML semântico, com um único H1 (o do hero), `lang="pt-BR"` e link "Pular para o conteúdo".
- Foco visível em todos os elementos interativos (ex.: `outline` ciano de 3 px).
- `alt` descritivo nas imagens de conteúdo. Decorativas com `alt=""` ou `aria-hidden="true"`.
- Contraste AA em todo texto, inclusive sobre fotos e fundos animados.

### 7.5 Performance
- Imagens `.webp` com `width`/`height` definidos, `loading="lazy"` abaixo da dobra e `srcset` nas fotos grandes.
- Fontes com `preconnect` e `display=swap`, carregando só os pesos usados.
- Bibliotecas carregadas com `defer`, só o necessário.
- **Metas no Lighthouse mobile:** Performance ≥ 80, Acessibilidade ≥ 95, Boas Práticas ≥ 95 e SEO ≥ 95.

---

## 8. SEO e metadados

- `<title>`, meta description e Open Graph conforme o `copy.md`. `og:image` = `assets/img/og-image.jpg` (ver 2.5) e `og:locale` = `pt_BR`.
- Favicon a partir de `logo-simbolo` (ver 2.5).
- `<meta name="theme-color" content="#16285F">`.
- JSON-LD:
```json
{
  "@context": "https://schema.org",
  "@type": "WaterPark",
  "name": "Parque Aquático Águas Clara Resort",
  "description": "O primeiro parque aquático da Região do Jauru com Piscina de Ondas.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rod. MT 248, KM 16, Zona Rural",
    "addressLocality": "Indiavaí",
    "addressRegion": "MT",
    "addressCountry": "BR"
  },
  "sameAs": ["https://www.instagram.com/aguasclara_resorts/"]
}
```
Não inclua telefone nem horários enquanto forem fictícios ou pendentes.

---

## 9. Limites (o que NÃO fazer)

- Não alterar, resumir nem "melhorar" a copy. Não acrescentar textos visíveis que não estejam no `copy.md`.
- Não escrever "Águas Claras". O nome é sempre **Águas Clara**.
- Não inventar depoimentos, preços, números de visitantes, prêmios ou horários.
- Não dar nome ao mascote nem distorcê-lo.
- Não fazer divisões retas entre seções nem fundos chapados e sem vida.
- Não usar o header clássico de largura total.
- Não deixar no projeto imagens que não são usadas no site, nem imagens fora do `.webp` (exceto as da seção 2.5).

---

## 10. Entrega e checklist final

1. **Revise visualmente** o site em 390 px e 1440 px, com screenshots ou gravações (Playwright, se disponível), incluindo os estados intermediários das animações de scroll. Corrija o que estiver quebrado, travando ou ilegível.
2. **Teste** com `prefers-reduced-motion` ativado e com JS desativado: o conteúdo precisa estar todo acessível.
3. **Confira:**
   - nenhum texto fora do `copy.md`;
   - todos os links de WhatsApp usam `config.js`;
   - todas as imagens são `.webp` (exceto as da 2.5), sem arquivos originais ou intermediários sobrando;
   - não há erros no console;
   - o foco é visível em todos os elementos interativos.
4. **Entregue um resumo** com:
   - a stack escolhida e por quê;
   - as principais ideias de animação e interação implementadas;
   - de qual arquivo enviado saiu cada asset, e a confirmação de que a limpeza foi feita;
   - a lista de placeholders de foto e as proporções esperadas para as fotos reais;
   - os pontos `[FICTÍCIO]` e `[PENDENTE]` que continuam no site;
   - o que o cliente precisa enviar para a versão final (WhatsApp, fotos reais, data, horários).
