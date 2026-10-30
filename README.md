# CypressAutomationExercise

Projeto de testes automatizados E2E com Cypress para o site [Automation Exercise](https://www.automationexercise.com).

## Requisitos

- Node.js e npm

## Instalação

Na raiz do projeto, instale as dependências:

```bash
npm install
```

## Executar os testes

Abrir o Cypress Test Runner:

```bash
npx cypress open
```

Executar os testes no terminal:

```bash
npx cypress run
```

Para executar somente os cenários de cadastro e login:

```bash
npx cypress run --spec "cypress/e2e/1-getting-started/automation-exercise.cy.js"
```

O arquivo `automation-exe-xpath.cy.js` contém os mesmos tipos de cenários usando seletores XPath com `cypress-xpath`.

## Cenários de automação

Os testes em `cypress/e2e/1-getting-started/` cobrem:

- Cadastro de usuário e exclusão da conta;
- Login com usuário cadastrado;
- Tentativa de login com usuário não cadastrado;
- Logout;
- Tentativa de cadastro com email já existente.

Os dados de usuário são gerados dinamicamente para evitar reutilizar o mesmo email nos cenários de cadastro.