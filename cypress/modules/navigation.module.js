const selectors = {
    homeLink: '//a[normalize-space(.)="Home"]',
    loginLink: '//a[@href="/login" and normalize-space(.)="Signup / Login"]',
};

function find(selector) {
    return cy.xpath(selector);
}

function openHomePage() {
    cy.visit('/');
    find(selectors.homeLink).should('be.visible');
}

module.exports = {
    openHomePage,
    openLoginPage() {
        openHomePage();
        find(selectors.loginLink).click();
    },
};
