This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

#### Tailwind (assuma já configurado). Se não estiver:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
///npx tailwindcss -i ./src/styles.css -o ./public/styles.css --watch

#### Axios para API

npm install axios

#### Swiper para o carrossel

npm install swiper

#### (opcional) framer-motion para animações

## npm install framer-motion

**\* Integração com o WP: criar um endpoint REST (ou usar WP REST API / custom endpoint) que retorne um JSON com **[{id,title,thumb,url}, ...]\*\*. Substituir endpoint acima.

\*\*\* project/
├─ src/<br>
│ ├─ app/<br>
│ │ ├─ layout.jsx<br>
│ │ ├─ page.jsx<br>
│ │ └─ globals.css<br>
│ ├─ components/<br>
│ │ ├─ Banner.jsx<br>
│ │ ├─CardsSection.jsx<br>
│ │ ├─ComentariosGerais.jsx<br>
│ │ ├─ExplicacaoSection.jsx<br>
│ │ ├─MoninhaSection.jsx<br>
│ │ ├─ PublicacoesCarousel.jsx<br>
│ │ └─RealizacaoApoio.jsx<br>
│ └─ public/<br>
│ ├─ images/...<br>
│ └─ favicon.ico<br>
├─ tailwind.config.js<br>
├─ postcss.config.js<br>
└─ package.json<br>

---

**\*Estilo tailwind**

**_Explicação do estilo:_**

> rounded-tl-3xl → canto superior esquerdo arredondado (como na imagem).

> shadow-md → cria a sombra leve ao redor.

> flex items-start gap-4 → alinha o ícone à esquerda e o texto à direita.

> Ícone → usei FileSearch do lucide-react, similar ao ícone de documento com lupa.

> max-w-md → limita a largura do card, deixando o layout equilibrado.

| Etapa            |  Ação   |---------------- |
| 🗂️ Estrutura     | Criar pastas conforme os paths       
desejados (`/app/.../page.jsx`) |
| 🔗 Menu          | Usar `<Link href="/rota">` no Header                           |
| 🧭 Layout global | `layout.jsx` com `<Header />` e `<Footer />`                   |
| ⚙️ Imports       | Configurar `@/` no `jsconfig.json`                             |
| 🌐 Teste         | Rodar `npm run dev` e navegar pelas rotas                      |

Instalação do Prisma Client
`npm install @prisma/client`

