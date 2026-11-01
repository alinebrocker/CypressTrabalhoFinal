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
        automationExercisePage.logoutAfterAccountCreated();

        automationExercisePage.openLoginPage();
        automationExercisePage.assertLoginPage();
        automationExercisePage.login(user.email, user.password);
        automationExercisePage.assertLoggedInAs(user.name);
        automationExercisePage.deleteAccount();
    });

    it('Test Case 3: Não fazer login com usuário não cadastrado (Teste Negativo)', () => {
        const user = createUser();

        automationExercisePage.openLoginPage();
        automationExercisePage.assertLoginPage();
        automationExercisePage.login(user.email, 'senha-incorreta');
        automationExercisePage.assertInvalidLogin();
    });

    it('Test Case 4: Fazer logout do usuário', () => {
        const user = createUser();

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.logoutAfterAccountCreated();

        automationExercisePage.openLoginPage();
        automationExercisePage.assertLoginPage();
        automationExercisePage.login(user.email, user.password);
        automationExercisePage.assertLoggedInAs(user.name);
        automationExercisePage.logout();
        automationExercisePage.assertLoginPage();
    });

    it('Test Case 5: Cadastrar usuário com email já existente (Teste Negativo)', () => {
        const user = createUser();

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.logoutAfterAccountCreated();

        automationExercisePage.openLoginPage();
        automationExercisePage.startSignup('Outro Usuario', user.email);
        automationExercisePage.assertDuplicateEmail();
    });

    it('Test Case 8: Verificar ALL PRODUCTS e página de detalhe de produto', () => {
        automationExercisePage.openProductsPage();
        automationExercisePage.openFirstProduct();
        automationExercisePage.assertFirstProductDetails();
    });

    it('Test Case 9: Buscar Produto', () => {
        const productName = 'Top';

        automationExercisePage.openProductsPage();
        automationExercisePage.searchProducts(productName);
        automationExercisePage.assertSearchedProductsVisible();
    });

    it('Test Case 10: Verificar inscrição na Página Home', () => {
        const user = createUser();

        automationExercisePage.openHomePage();
        automationExercisePage.scrollToFooter();
        automationExercisePage.assertSubscriptionHeadingVisible();
        automationExercisePage.subscribeFromHomePage(user.email);
        automationExercisePage.assertSubscriptionSuccess();
    });

    it('Test Case 15: Fazer pedido: Cadastrar usuário antes de finalizar a compra', () => {
        const user = createUser();
        const productNames = ['Blue Top', 'Men Tshirt'];
        const payment = {
            name: user.name,
            number: '1234567890123456',
            cvc: '123',
            expiryMonth: '12',
            expiryYear: '2030',
        };

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.assertLoggedInAs(user.name);
        automationExercisePage.clearCart();
        automationExercisePage.addProductsToCart();
        automationExercisePage.openCartPage();
        automationExercisePage.assertCartContainsProducts(productNames);
        automationExercisePage.proceedToCheckout();
        automationExercisePage.assertCheckoutDetails(user, productNames);
        automationExercisePage.placeOrder('Pedido de teste automatizado.');
        automationExercisePage.payAndConfirmOrder(payment);
        automationExercisePage.assertOrderPlaced();
        automationExercisePage.deleteAccount();
        automationExercisePage.continueAfterAccountAction();
    });

    it('Test Case 16: Fazer pedido: Faça Login antes de finalizar a compra', () => {
        const user = createUser();
        const productNames = ['Blue Top', 'Men Tshirt'];
        const payment = {
            name: user.name,
            number: '1234567890123456',
            cvc: '123',
            expiryMonth: '12',
            expiryYear: '2030',
        };

        automationExercisePage.createAccount(user);
        automationExercisePage.continueAfterAccountAction();
        automationExercisePage.logoutAfterAccountCreated();

        automationExercisePage.openLoginPage();
        automationExercisePage.assertLoginPage();
        automationExercisePage.login(user.email, user.password);
        automationExercisePage.assertLoggedInAs(user.name);
        automationExercisePage.clearCart();
        automationExercisePage.addProductsToCart();
        automationExercisePage.openCartPage();
        automationExercisePage.assertCartContainsProducts(productNames);
        automationExercisePage.proceedToCheckout();
        automationExercisePage.assertCheckoutDetails(user, productNames);
        automationExercisePage.placeOrder('Pedido de teste automatizado.');
        automationExercisePage.payAndConfirmOrder(payment);
        automationExercisePage.assertOrderPlaced();
        automationExercisePage.deleteAccount();
        automationExercisePage.continueAfterAccountAction();
    });
});