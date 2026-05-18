# Imersão Matte — Site do Evento

Landing page do evento de 11/06 em Uberlândia.

## Deploy na Vercel

1. Crie uma conta em https://vercel.com (pode logar com GitHub, Google ou email).
2. Clique em **"Add New..." → "Project"**.
3. Escolha **"Deploy without Git"** → arraste a pasta inteira deste projeto.
   - Ou: extraia o zip, e arraste a pasta descompactada.
4. Em "Framework Preset" deixe **"Other"** (é um site estático puro).
5. Clique em **Deploy**. Em ~30 segundos sai a URL: `imersao-matte.vercel.app` (ou nome similar).

## Conectar domínio próprio

1. Dentro do projeto na Vercel → aba **Settings → Domains**.
2. Adicione `imersao.matte.com.br` (ou o domínio que vocês quiserem).
3. A Vercel mostra os registros DNS para configurar no provedor do seu domínio (Registro.br, Cloudflare, etc).
4. Após propagar (5min–24h), o HTTPS é automático.

## Estrutura

- `index.html` — entrada
- `app.jsx`, `components.jsx`, `tweaks-panel.jsx` — código React (compilado no navegador via Babel)
- `assets/` — fotos (Pedro, evento anterior)

## Editar conteúdo

Os textos editáveis (preço, vagas, bio, horário, local, NPS) estão no topo de `app.jsx`, dentro de `TWEAK_DEFAULTS`. Pode editar direto lá e fazer redeploy (drag-and-drop de novo, ou conectar via GitHub para deploy automático).

## Observação técnica

O site usa Babel no navegador para compilar o JSX. Funciona, mas a primeira carga tem ~1s de delay. Se for ganhar muito tráfego, vale pré-compilar (posso fazer isso depois se precisar).
