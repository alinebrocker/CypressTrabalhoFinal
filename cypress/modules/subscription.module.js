const selectors = {
    footer: '#footer',
    subscriptionHeading: '//*[self::footer or @id="footer"]//h2[translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="subscription"]',
    subscriptionEmail: '//*[@id="susbscribe_email"]',
    subscribeButton: '//*[@id="subscribe"]',
    subscriptionSuccessMessage: '//*[@id="success-subscribe"]//div[contains(@class, "alert-success")]',
};

function find(selector) {
    return cy.xpath(selector);
}

module.exports = {
    scrollToFooter() {
        cy.get(selectors.footer).scrollIntoView();
    },
    assertHeadingVisible() {
        find(selectors.subscriptionHeading).should('be.visible');
    },
    subscribe(email) {
        find(selectors.subscriptionEmail).type(email);
        find(selectors.subscribeButton).click();
    },
    assertSuccess() {
        find(selectors.subscriptionSuccessMessage)
            .should('be.visible')
            .and('contain.text', 'You have been successfully subscribed!');
    },
};
