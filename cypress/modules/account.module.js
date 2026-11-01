const navigation = require('./navigation.module');

const selectors = {
    signupName: '//*[@data-qa="signup-name"]',
    signupEmail: '//*[@data-qa="signup-email"]',
    signupButton: '//*[@data-qa="signup-button"]',
    accountName: '//*[@data-qa="name"]',
    accountEmail: '//*[@data-qa="email"]',
    titleMr: '//input[@name="title" and @value="Mr"]',
    password: '//*[@data-qa="password"]',
    birthDay: '//*[@id="days"]',
    birthMonth: '//*[@id="months"]',
    birthYear: '//*[@id="years"]',
    newsletter: '//*[@id="newsletter"]',
    specialOffers: '//*[@id="optin"]',
    firstName: '//*[@data-qa="first_name"]',
    lastName: '//*[@data-qa="last_name"]',
    company: '//*[@data-qa="company"]',
    address: '//*[@data-qa="address"]',
    address2: '//*[@data-qa="address2"]',
    country: '//*[@data-qa="country"]',
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
    loginHeading: '//h2[normalize-space(.)="Login to your account"]',
    signupHeading: 'h2',
    loggedInLink: 'a',
    invalidLoginMessage: 'p',
    duplicateEmailMessage: 'p',
};

function find(selector) {
    return cy.xpath(selector);
}

function startSignup(name, email) {
    cy.contains(selectors.signupHeading, 'New User Signup!').should('be.visible');
    find(selectors.signupName).type(name);
    find(selectors.signupEmail).type(email);
    find(selectors.signupButton).click();
}

function completeSignupForm(user) {
    cy.contains('Enter Account Information').should('be.visible');
    find(selectors.accountName).should('have.value', user.name);
    find(selectors.accountEmail).should('have.value', user.email);
    find(selectors.titleMr).check();
    find(selectors.password).type(user.password);
    find(selectors.birthDay).select(user.dateOfBirth.day);
    find(selectors.birthMonth).select(user.dateOfBirth.month);
    find(selectors.birthYear).select(user.dateOfBirth.year);
    find(selectors.newsletter).check().should('be.checked');
    find(selectors.specialOffers).check().should('be.checked');
    find(selectors.firstName).type(user.firstName);
    find(selectors.lastName).type(user.lastName);
    find(selectors.company).type(user.company);
    find(selectors.address).type(user.address);
    find(selectors.address2).type(user.address2);
    find(selectors.country).select(user.country);
    find(selectors.state).type(user.state);
    find(selectors.city).type(user.city);
    find(selectors.zipcode).type(user.zipcode);
    find(selectors.mobileNumber).type(user.mobileNumber);

    find(selectors.firstName).should('have.value', user.firstName);
    find(selectors.lastName).should('have.value', user.lastName);
    find(selectors.company).should('have.value', user.company);
    find(selectors.address).should('have.value', user.address);
    find(selectors.address2).should('have.value', user.address2);
    find(selectors.country).should('have.value', user.country);
    find(selectors.state).should('have.value', user.state);
    find(selectors.city).should('have.value', user.city);
    find(selectors.zipcode).should('have.value', user.zipcode);
    find(selectors.mobileNumber).should('have.value', user.mobileNumber);
    find(selectors.createAccountButton).click();
}

module.exports = {
    startSignup,
    completeSignupForm,
    createAccount(user) {
        navigation.openLoginPage();
        startSignup(user.name, user.email);
        completeSignupForm(user);
        find(selectors.accountCreatedMessage)
            .should('be.visible')
            .and('contain.text', 'Account Created!');
    },
    createAccountViaApi(user) {
        cy.request({
            method: 'POST',
            url: '/api/createAccount',
            form: true,
            body: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: 'Mr',
                birth_date: user.dateOfBirth.day,
                birth_month: user.dateOfBirth.month,
                birth_year: user.dateOfBirth.year,
                firstname: user.firstName,
                lastname: user.lastName,
                company: user.company,
                address1: user.address,
                address2: user.address2,
                country: user.country,
                zipcode: user.zipcode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobileNumber,
            },
        }).then((response) => {
            const result = typeof response.body === 'string'
                ? JSON.parse(response.body)
                : response.body;
            expect(response.status).to.eq(200);
            expect(result).to.be.an('object');
            expect(result.responseCode).to.eq(201);
            expect(result.message).to.eq('User created!');
        });
    },
    continueAfterAccountAction() {
        find(selectors.continueButton).click();
    },
    assertLoggedInAs(name) {
        cy.contains(selectors.loggedInLink, 'Logged in as')
            .should('be.visible')
            .and('contain.text', name);
    },
    deleteAccount() {
        find(selectors.deleteAccountLink).click();
        find(selectors.accountDeletedMessage)
            .should('be.visible')
            .and('contain.text', 'Account Deleted!');
    },
    deleteAccountViaApi(user) {
        cy.request({
            method: 'DELETE',
            url: '/api/deleteAccount',
            form: true,
            body: {
                email: user.email,
                password: user.password,
            },
            failOnStatusCode: false,
        }).then((response) => {
            const result = typeof response.body === 'string'
                ? JSON.parse(response.body)
                : response.body;
            expect([200, 404]).to.include(response.status);
            expect(result).to.be.an('object');
            expect([200, 404]).to.include(result.responseCode);

            if (result.responseCode === 404) {
                expect(result.message).to.eq('Account not found!');
                return;
            }

            expect(result.message).to.eq('Account deleted!');
        });
    },
    login(email, password) {
        find(selectors.loginEmail).type(email);
        find(selectors.loginPassword).type(password);
        find(selectors.loginButton).click();
    },
    assertInvalidLogin() {
        cy.contains(selectors.invalidLoginMessage, 'Your email or password is incorrect!')
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
    assertDuplicateEmail() {
        cy.contains(selectors.duplicateEmailMessage, 'Email Address already exist!')
            .should('be.visible');
    },
};
