## Lumi API

> Uma API para gerenciamento e visualização de faturas elétricas.

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão 18 ou superior do \`NodeJS\`.
- Você instalou a versão 2.39 ou superior do \`Git\`.
- Você tem uma máquina \`Windows / Linux / Mac\`.

## 🚀 Instalando

Para instalar o projeto, siga estes passos:

Linux, macOS e Windows:

## 1. Clone o projeto do GitHub:

```
git clone https://github.com/eduoop/lumi-api.git
```

## 2. Entre na pasta do projeto:

```
cd lumi-api
```

## 3. Instale as dependências usando o npm:

```
npm i
```

## 4. Configure o Prisma:

```
npx prisma generate
```

## 5. Crie um \`.env\` na raiz do projeto e adicione as seguintes variáveis:

```
DATABASE_URL="sua_url_do_banco_de_dados"
PORT=3000
```

## 6. Rode o Docker Compose para configurar os serviços:

```
docker-compose up -d
```

## 7. Execute as migrações do Prisma:

```
npx prisma migrate dev --name "add_initial_tables"
```

## ☕ Usando

Para rodar o projeto, use o comando:

```
npm run dev
```

A API estará disponível em \`http://localhost:3000\`.

## 🧪 Testando

Para rodar os testes, use o comando:

```
npm run test
```

## Tecnologias Utilizadas

- **Express** (v4.19.2)
- **Prisma** (v5.14.0)
- **TypeScript** (v5)
- **Jest** (v29.7.0)

## 📜 Scripts Disponíveis

- dev: Inicia o servidor em modo de desenvolvimento.
- build: Compila o projeto para produção.
- start: Inicia o servidor a partir dos arquivos compilados.
- prepare: Configura o Husky para hooks de git.
- test: Executa os testes utilizando Jest.

## 🤝 Criador

Feito por:

<table>
  <tr>
    <td align="center">
      <a href="#" title="defina o titulo do link">
        <img src="https://avatars.githubusercontent.com/u/85969484?s=400&u=b0e89e575a7cb91fc9f8a69e126a9d7587aa9478&v=4" width="100px;" alt="Foto do Eduardo Meneses no GitHub"/><br>
        <sub>
          <b>Eduardo Meneses</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## 📝 Licença

Esse projeto está sob licença. Veja o arquivo [LICENÇA](LICENSE.md) para mais detalhes."