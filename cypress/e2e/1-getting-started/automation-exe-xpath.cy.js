/// <reference types="cypress" />

describe('Automation Exercise', () => {
    function gerarDadosUsuario() {
        const randomSuffix = `${Date.now()}${Math.floor(Math.random() * 100)}`;

        return {
            nome: `Usuario Teste ${randomSuffix}`,
            email: `usuario${randomSuffix}@teste.com`
        };
    }

    const senha = '123456';

    function criarConta(usuario) {
        cy.visit('https://www.automationexercise.com');
        cy.xpath('//a[contains(@href, "login")]').click();
        cy.xpath('//*[@data-qa="signup-name"]').type(usuario.nome);
        cy.xpath('//*[@data-qa="signup-email"]').type(usuario.email);
        cy.xpath('//*[@data-qa="signup-button"]').click();

        cy.xpath('//input[@name="title" and @value="Mr"]').check();
        cy.xpath('//*[@data-qa="password"]').type(senha);
        cy.xpath('//*[@data-qa="first_name"]').type(usuario.nome);
        cy.xpath('//*[@data-qa="last_name"]').type('Sobrenome Teste');
        cy.xpath('//*[@data-qa="address"]').type('Endereço Teste');
        cy.xpath('//*[@data-qa="state"]').type('Estado Teste');
        cy.xpath('//*[@data-qa="city"]').type('Cidade Teste');
        cy.xpath('//*[@data-qa="zipcode"]').type('12345');
        cy.xpath('//*[@data-qa="mobile_number"]').type('1234567890');
        cy.xpath('//*[@data-qa="create-account"]').click();
        cy.xpath('//*[@data-qa="account-created"]')
            .should('be.visible')
            .and('contain.text', 'Account Created!');
    }

    it('Test Case 1: Cadastrar e excluir a conta do usuário', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.xpath('//*[@data-qa="continue-button"]').click();
        cy.xpath('//a[contains(normalize-space(.), "Logged in as")]').should('be.visible')
            .and('contain.text', usuario.nome);

        cy.xpath('//a[@href="/delete_account"]').click();
        cy.xpath('//*[@data-qa="account-deleted"]')
            .should('be.visible')
            .and('contain.text', 'Account Deleted!');
        cy.xpath('//*[@data-qa="continue-button"]').click();
    });
    
    it('Test Case 2: Fazer login com o usuário cadastrado e excluir a conta', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.xpath('//*[@data-qa="continue-button"]').click();
        cy.xpath('//a[@href="/logout"]').click();

        cy.visit('https://www.automationexercise.com');
        cy.xpath('//a[contains(@href, "login")]').click();
        cy.xpath('//*[@data-qa="login-email"]').type(usuario.email);
        cy.xpath('//*[@data-qa="login-password"]').type(senha);
        cy.xpath('//*[@data-qa="login-button"]').click();

        cy.xpath('//a[contains(normalize-space(.), "Logged in as")]').should('be.visible');
        cy.xpath('//a[contains(normalize-space(.), "Logged in as")]')
            .should('contain.text', usuario.nome);

        cy.xpath('//a[@href="/delete_account"]').click();
        cy.xpath('//*[@data-qa="account-deleted"]')
            .should('be.visible')
            .and('contain.text', 'Account Deleted!');
    });

    it('Test Case 3: Não fazer login com usuário não cadastrado (Teste Negativo)', () => {
        const usuarioNaoCadastrado = gerarDadosUsuario();

        cy.visit('https://www.automationexercise.com');
        cy.xpath('//a[contains(@href, "login")]').click();
        cy.xpath('//*[@data-qa="login-email"]').type(usuarioNaoCadastrado.email);
        cy.xpath('//*[@data-qa="login-password"]').type('senha-incorreta');
        cy.xpath('//*[@data-qa="login-button"]').click();

        cy.xpath('//p[normalize-space(.)="Your email or password is incorrect!"]')
            .should('be.visible');
    });

    it('Test Case 4: Fazer logout do usuário', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.xpath('//*[@data-qa="continue-button"]').click();
        cy.xpath('//a[contains(normalize-space(.), "Logged in as")]').should('be.visible');

        cy.xpath('//a[@href="/logout"]').click();
        cy.xpath('//h2[normalize-space(.)="Login to your account"]').should('be.visible');
    });

    it('Test Case 5: Cadastrar usuário com email já existente (Teste Negativo)', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.xpath('//*[@data-qa="continue-button"]').click();
        cy.xpath('//a[@href="/logout"]').click();

        cy.visit('https://www.automationexercise.com');
        cy.xpath('//a[contains(@href, "login")]').click();
        cy.xpath('//*[@data-qa="signup-name"]').type('Outro Usuario');
        cy.xpath('//*[@data-qa="signup-email"]').type(usuario.email);
        cy.xpath('//*[@data-qa="signup-button"]').click();

        cy.xpath('//p[normalize-space(.)="Email Address already exist!"]')
            .should('be.visible');
    });
});