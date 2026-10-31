/// <reference types="cypress" />

const automationExercisePage = require('../../support/pages/automation-exercise.page');
const { createUser } = require('../../support/factories/user.factory');

describe('Automation Exercise', () => {
    it('Test Case 1: Cadastrar e excluir a conta do usuário', () => {
        const user = createUser();

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.assertLoggedInAs(user.name);
        automationExercisePage.deleteAccount();
        automationExercisePage.continueAfterAccountAction();
    });

    it('Test Case 2: Fazer login com o usuário cadastrado e excluir a conta', () => {
        const user = createUser();

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.logout();

        automationExercisePage.openLoginPage();
        automationExercisePage.login(user.email, user.password);
        automationExercisePage.assertLoggedInAs(user.name);
        automationExercisePage.deleteAccount();
    });

    it('Test Case 3: Não fazer login com usuário não cadastrado (Teste Negativo)', () => {
        const user = createUser();

        automationExercisePage.openLoginPage();
        automationExercisePage.login(user.email, 'senha-incorreta');
        automationExercisePage.assertInvalidLogin();
    });

    it('Test Case 4: Fazer logout do usuário', () => {
        const user = createUser();

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.assertLoggedInAs(user.name);
        automationExercisePage.logout();
        automationExercisePage.assertLoginPage();
    });

    it('Test Case 5: Cadastrar usuário com email já existente (Teste Negativo)', () => {
        const user = createUser();

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.logout();

        automationExercisePage.openLoginPage();
        automationExercisePage.startSignup('Outro Usuario', user.email);
        automationExercisePage.assertDuplicateEmail();
    });
});