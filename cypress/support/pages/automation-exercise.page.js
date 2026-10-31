const selectors = {
    homeLink: '//a[normalize-space(.)="Home"]',
    loginLink: '//a[contains(@href, "login")]',
    signupName: '//*[@data-qa="signup-name"]',
    signupEmail: '//*[@data-qa="signup-email"]',
    signupButton: '//*[@data-qa="signup-button"]',
    titleMr: '//input[@name="title" and @value="Mr"]',
    password: '//*[@data-qa="password"]',
    firstName: '//*[@data-qa="first_name"]',
    lastName: '//*[@data-qa="last_name"]',
    address: '//*[@data-qa="address"]',
    state: '//*[@data-qa="state"]',
    city: '//*[@data-qa="city"]',
    zipcode: '//*[@data-qa="zipcode"]',
    mobileNumber: '//*[@data-qa="mobile_number"]',
    createAccountButton: '//*[@data-qa="create-account"]',
    accountCreatedMessage: '//*[@data-qa="account-created"]',
    continueButton: '//*[@data-qa="continue-button"]',
    logoutLink: '//a[@href="/logout"]',
    loginEmail: '//*[@data-qa="login-email"]',
    loginPassword: '//*[@data-qa="login-password"]',
    loginButton: '//*[@data-qa="login-button"]',
    deleteAccountLink: '//a[@href="/delete_account"]',
    accountDeletedMessage: '//*[@data-qa="account-deleted"]',
    loginHeading: '//h2',
};

function find(selector) {
    return cy.xpath(selector);
}

function openLoginPage() {
    cy.visit('/');
    find(selectors.homeLink).should('be.visible');
    find(selectors.loginLink).click();
}

function startSignup(name, email) {
    find(selectors.signupName).type(name);
    find(selectors.signupEmail).type(email);
    find(selectors.signupButton).click();
}

function completeSignupForm(user) {
    find(selectors.titleMr).check();
    find(selectors.password).type(user.password);
    find(selectors.firstName).type(user.name);
    find(selectors.lastName).type('Sobrenome Teste');
    find(selectors.address).type('Endereço Teste');
    find(selectors.state).type('Estado Teste');
    find(selectors.city).type('Cidade Teste');
    find(selectors.zipcode).type('12345');
    find(selectors.mobileNumber).type('1234567890');
    find(selectors.createAccountButton).click();
}

module.exports = {
    openLoginPage,
    startSignup,
    completeSignupForm,
    createAccount(user) {
        openLoginPage();
        startSignup(user.name, user.email);
        completeSignupForm(user);
        find(selectors.accountCreatedMessage)
            .should('be.visible')
            .and('contain.text', 'Account Created!');
    },
    continueAfterAccountAction() {
        find(selectors.continueButton).click();
    },
    assertLoggedInAs(name) {
        cy.contains('a', 'Logged in as')
            .should('be.visible')
            .and('contain.text', name);
    },
    deleteAccount() {
        find(selectors.deleteAccountLink).click();
        find(selectors.accountDeletedMessage)
            .should('be.visible')
            .and('contain.text', 'Account Deleted!');
    },
    login(email, password) {
        find(selectors.loginEmail).type(email);
        find(selectors.loginPassword).type(password);
        find(selectors.loginButton).click();
    },
    assertInvalidLogin() {
        cy.contains('p', 'Your email or password is incorrect!')
            .should('be.visible');
    },
    logout() {
        find(selectors.logoutLink).click();
    },
    assertLoginPage() {
        find(selectors.loginHeading)
            .should('contain.text', 'Login to your account')
            .should('be.visible');
    },
    assertLoginLinkVisible() {
        find(selectors.loginLink).should('be.visible');
    },
    assertDuplicateEmail() {
        cy.contains('p', 'Email Address already exist!')
            .should('be.visible');
    },
};
