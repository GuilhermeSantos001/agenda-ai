# Agenda Ai (Projeto de Teste)

Esse projeto está usando Docker então o teste é bem simples.

> Você pode baixar o [arquivo](/docs/Insomnia_2023-07-07.json) do Insomnia para testar as rotas. Veja como [importar](/docs/pages/import-insomnia.md) seu arquivo no insomnia.

### Primeiros passos

Crie o arquivo .env usando o comando em seu terminal:

```bash
make env
```

Você pode subir somente os bancos de dados e testar o aplicativo de forma separada. use o comando:

```bash
make database
```

Para instalar as dependências do aplicativo use o seguinte comando:

```bash
yarn
```
Para subir o aplicativo use o seguinte comando:

> Lembre-se você deve está executando o **MongoDB**, **Redis** e **RabbitMQ**. Use o comando **make database** para executa-los.

```bash
yarn start:dev
```

Você pode executar diretamente usando o comando:

```bash
make up
```

### Agora vamos [testar as rotas](/docs/pages/testing-routes.md) do aplicativo.