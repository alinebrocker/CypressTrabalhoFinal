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
        cy.get('a[href*="login"]').click();
        cy.get('[data-qa="signup-name"]').type(usuario.nome);
        cy.get('[data-qa="signup-email"]').type(usuario.email);
        cy.get('[data-qa="signup-button"]').click();

        cy.get(':nth-child(3) > .top > [data-qa="title"] > span > [name="title"]').check('Mr');
        cy.get('[data-qa="password"]').type(senha);
        cy.get('[data-qa="first_name"]').type(usuario.nome);
        cy.get('[data-qa="last_name"]').type('Sobrenome Teste');
        cy.get('[data-qa="address"]').type('Endereço Teste');
        cy.get('[data-qa="state"]').type('Estado Teste');
        cy.get('[data-qa="city"]').type('Cidade Teste');
        cy.get('[data-qa="zipcode"]').type('12345');
        cy.get('[data-qa="mobile_number"]').type('1234567890');
        cy.get('[data-qa="create-account"]').click();
        cy.get('[data-qa="account-created"]')
            .should('be.visible')
            .and('contain.text', 'Account Created!');
    }

    it('Test Case 1: Cadastrar e excluir a conta do usuário', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.get('[data-qa="continue-button"]').click();
        cy.contains('Logged in as').should('be.visible')
            .and('contain.text', usuario.nome);

        cy.get('a[href="/delete_account"]').click();
        cy.get('[data-qa="account-deleted"]')
            .should('be.visible')
            .and('contain.text', 'Account Deleted!');
        cy.get('[data-qa="continue-button"]').click();
        cy.get('a[href="/login"]').should('be.visible');
    });

    it('Test Case 2: Fazer login com o usuário cadastrado e excluir a conta', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.get('[data-qa="continue-button"]').click();
        cy.get('a[href="/logout"]').click();

        cy.visit('https://www.automationexercise.com');
        cy.get('a[href*="login"]').click();
        cy.get('[data-qa="login-email"]').type(usuario.email);
        cy.get('[data-qa="login-password"]').type(senha);
        cy.get('[data-qa="login-button"]').click();

        cy.contains('Logged in as').should('be.visible');
        cy.contains('Logged in as').should('contain.text', usuario.nome);

        cy.get('a[href="/delete_account"]').click();
        cy.get('[data-qa="account-deleted"]')
            .should('be.visible')
            .and('contain.text', 'Account Deleted!');
    });

    it('Test Case 3: Não fazer login com usuário não cadastrado (Teste Negativo)', () => {
        const usuarioNaoCadastrado = gerarDadosUsuario();

        cy.visit('https://www.automationexercise.com');
        cy.get('a[href*="login"]').click();
        cy.get('[data-qa="login-email"]').type(usuarioNaoCadastrado.email);
        cy.get('[data-qa="login-password"]').type('senha-incorreta');
        cy.get('[data-qa="login-button"]').click();

        cy.contains('p', 'Your email or password is incorrect!')
            .should('be.visible');
    });

    it('Test Case 4: Fazer logout do usuário', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.get('[data-qa="continue-button"]').click();
        cy.contains('Logged in as').should('be.visible');

        cy.get('a[href="/logout"]').click();
        cy.contains('Login to your account').should('be.visible');
    });

    it('Test Case 5: Cadastrar usuário com email já existente (Teste Negativo)', () => {
        const usuario = gerarDadosUsuario();

        criarConta(usuario);
        cy.get('[data-qa="continue-button"]').click();
        cy.get('a[href="/logout"]').click();

        cy.visit('https://www.automationexercise.com');
        cy.get('a[href*="login"]').click();
        cy.get('[data-qa="signup-name"]').type('Outro Usuario');
        cy.get('[data-qa="signup-email"]').type(usuario.email);
        cy.get('[data-qa="signup-button"]').click();

        cy.contains('p', 'Email Address already exist!')
            .should('be.visible');
    });
});