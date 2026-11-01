# CypressAutomationExercise

Projeto de testes automatizados E2E com Cypress para o site [Automation Exercise](https://www.automationexercise.com).

## Requisitos

- Node.js e npm

## Instalação

Na raiz do projeto, instale as dependências:

```bash
npm ci
```

## Executar os testes

Abrir o Cypress Test Runner:

```bash
npx cypress open
```

Executar os testes no terminal:

```bash
npm test
```

O comando executa todos os arquivos de teste (`*.cy.js`) encontrados pelo Cypress em `cypress/e2e/`.
Após a execução, o relatório HTML em `cypress/reports/index.html` inclui a gravação em vídeo. O arquivo de vídeo também fica em `cypress/reports/videos/`.
No modo de execução (`cypress run`), cada teste pode ser repetido até duas vezes se falhar. No Test Runner interativo, retries não estão habilitados.

Para executar os testes e abrir o relatório HTML automaticamente ao final:

```bash
npm run test:open-report
```

O arquivo `automation-web.cy.js` contém os cenários E2E atuais. As ações estão separadas por responsabilidade em `cypress/modules/`: navegação, conta, produtos, carrinho/checkout e inscrição. A factory em `cypress/support/factories/` gera dados exclusivos para os testes. Dados estáticos usados nos cenários, como a busca de produtos, ficam em `cypress/fixtures/`.

## GitHub Actions

O workflow do GitHub Actions executa todos os arquivos de teste encontrados pelo Cypress em pushes e pull requests direcionados a `main`. Também pode ser iniciado manualmente pela aba **Actions** do repositório.
O artefato disponível para download na execução do workflow contém o relatório HTML e a gravação em vídeo. O artefato é mantido por 30 dias.

## Cenários de automação

Os testes em `cypress/e2e/1-getting-started/` cobrem:

- Cadastro de usuário e exclusão da conta;
- Login com usuário cadastrado;
- Tentativa de login com usuário não cadastrado;
- Logout;
- Tentativa de cadastro com email já existente;
- Listagem de produtos e detalhes do primeiro produto;
- Busca de produtos e validação dos resultados;
- Inscrição na página inicial;
- Finalização de pedido com cadastro prévio do usuário;
- Finalização de pedido após login com usuário cadastrado.

Os dados de usuário são gerados dinamicamente para evitar reutilizar o mesmo email nos cenários de cadastro.
As contas temporárias são removidas por uma chamada de limpeza à API após cada teste, inclusive quando o teste falha.
Nos cenários em que o cadastro é apenas preparação, a conta é criada pela API para reduzir o tempo; os testes de cadastro continuam exercitando o formulário pela interface.