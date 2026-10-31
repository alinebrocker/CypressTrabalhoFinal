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

Executar o teste XPath no terminal:

```bash
npm test
```

O comando executa somente `automation-exe-xpath.cy.js`.
Após a execução, o relatório HTML em `cypress/reports/index.html` inclui a gravação em vídeo. O arquivo de vídeo também fica em `cypress/reports/videos/`.

Para executar os cenários de cadastro e login sem XPath:

```bash
npx cypress run --spec "cypress/e2e/1-getting-started/automation-exercise.cy.js"
```

O arquivo `automation-exe-xpath.cy.js` contém cenários de cadastro e login usando seletores XPath com `cypress-xpath`.

## GitHub Actions

O workflow do GitHub Actions executa somente `automation-exe-xpath.cy.js` em pushes para `main`. Também pode ser iniciado manualmente pela aba **Actions** do repositório.
O artefato disponível para download na execução do workflow contém o relatório HTML e a gravação em vídeo. O artefato é mantido por 30 dias.

## Cenários de automação

Os testes em `cypress/e2e/1-getting-started/` cobrem:

- Cadastro de usuário e exclusão da conta;
- Login com usuário cadastrado;
- Tentativa de login com usuário não cadastrado;
- Logout;
- Tentativa de cadastro com email já existente.

Os dados de usuário são gerados dinamicamente para evitar reutilizar o mesmo email nos cenários de cadastro.