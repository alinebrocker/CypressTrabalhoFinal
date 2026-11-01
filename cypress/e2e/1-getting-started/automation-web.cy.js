/// <reference types="cypress" />

const navigation = require('../../modules/navigation.module');
const account = require('../../modules/account.module');
const products = require('../../modules/products.module');
const cartCheckout = require('../../modules/cart-checkout.module');
const subscription = require('../../modules/subscription.module');
const { createUser } = require('../../support/factories/user.factory');

describe('Automation Exercise', () => {
    let userToCleanup;

    beforeEach(() => {
        userToCleanup = null;
    });

    afterEach(() => {
        if (userToCleanup) {
            account.deleteAccountViaApi(userToCleanup);
        }
    });

    function createTestAccount(user) {
        userToCleanup = user;
        account.createAccount(user);
    }

    function createTestAccountViaApi(user) {
        userToCleanup = user;
        account.createAccountViaApi(user);
    }

    it('Test Case 1: Cadastrar e excluir a conta do usuário', () => {
        const user = createUser();

        createTestAccount(user);
        account.continueAfterAccountAction();
        account.assertLoggedInAs(user.name);
        account.deleteAccount();
        account.continueAfterAccountAction();
    });

    it('Test Case 2: Fazer login com o usuário cadastrado e excluir a conta', () => {
        const user = createUser();

        createTestAccountViaApi(user);
        navigation.openLoginPage();
        account.assertLoginPage();
        account.login(user.email, user.password);
        account.assertLoggedInAs(user.name);
        account.deleteAccount();
    });

    it('Test Case 3: Não fazer login com usuário não cadastrado (Teste Negativo)', () => {
        const user = createUser();

        navigation.openLoginPage();
        account.assertLoginPage();
        account.login(user.email, 'senha-incorreta');
        account.assertInvalidLogin();
    });

    it('Test Case 4: Fazer logout do usuário', () => {
        const user = createUser();

        createTestAccountViaApi(user);
        navigation.openLoginPage();
        account.assertLoginPage();
        account.login(user.email, user.password);
        account.assertLoggedInAs(user.name);
        account.logout();
        account.assertLoginPage();
    });

    it('Test Case 5: Cadastrar usuário com email já existente (Teste Negativo)', () => {
        const user = createUser();

        createTestAccountViaApi(user);
        navigation.openLoginPage();
        account.startSignup('Outro Usuario', user.email);
        account.assertDuplicateEmail();
    });

    it('Test Case 8: Verificar ALL PRODUCTS e página de detalhe de produto', () => {
        products.openProductsPage();
        products.openFirstProduct().then((listingProduct) => {
            products.assertFirstProductDetails(listingProduct);
        });
    });

    it('Test Case 9: Buscar Produto', () => {
        cy.fixture('product-search').then(({ query }) => {
            products.openProductsPage();
            products.searchProducts(query);
            products.assertSearchedProductsVisible(query);
        });
    });

    it('Test Case 10: Verificar inscrição na Página Home', () => {
        const user = createUser();

        navigation.openHomePage();
        subscription.scrollToFooter();
        subscription.assertHeadingVisible();
        subscription.subscribe(user.email);
        subscription.assertSuccess();
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

        createTestAccount(user);
        account.continueAfterAccountAction();
        account.assertLoggedInAs(user.name);
        products.addProductsToCart();
        cartCheckout.openCartPage();
        cartCheckout.assertCartContainsProducts(productNames);
        cartCheckout.proceedToCheckout();
        cartCheckout.assertCheckoutDetails(user, productNames);
        cartCheckout.placeOrder('Pedido de teste automatizado.');
        cartCheckout.payAndConfirmOrder(payment);
        cartCheckout.assertOrderPlaced();
        account.deleteAccount();
        account.continueAfterAccountAction();
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

        createTestAccountViaApi(user);
        navigation.openLoginPage();
        account.assertLoginPage();
        account.login(user.email, user.password);
        account.assertLoggedInAs(user.name);
        products.addProductsToCart();
        cartCheckout.openCartPage();
        cartCheckout.assertCartContainsProducts(productNames);
        cartCheckout.proceedToCheckout();
        cartCheckout.assertCheckoutDetails(user, productNames);
        cartCheckout.placeOrder('Pedido de teste automatizado.');
        cartCheckout.payAndConfirmOrder(payment);
        cartCheckout.assertOrderPlaced();
        account.deleteAccount();
        account.continueAfterAccountAction();
    });
});