const selectors = {
    cartLink: '//header[@id="header"]//a[@href="/view_cart"]',
    cartInfo: '#cart_info',
    cartProductRows: '#cart_info tbody tr[id^="product-"]',
    proceedToCheckoutButton: '//a[contains(@class, "check_out") and contains(normalize-space(.), "Proceed To Checkout")]',
    checkoutInfo: '[data-qa="checkout-info"]',
    deliveryAddress: '//*[@id="address_delivery"]',
    billingAddress: '//*[@id="address_invoice"]',
    reviewOrderHeading: '//h2[normalize-space(.)="Review Your Order"]',
    orderComment: '//textarea[@name="message"]',
    placeOrderButton: '//a[@href="/payment" and contains(normalize-space(.), "Place Order")]',
    cardName: '//*[@data-qa="name-on-card"]',
    cardNumber: '//*[@data-qa="card-number"]',
    cardCvc: '//*[@data-qa="cvc"]',
    cardExpiryMonth: '//*[@data-qa="expiry-month"]',
    cardExpiryYear: '//*[@data-qa="expiry-year"]',
    payButton: '//*[@data-qa="pay-button"]',
    orderPlacedHeading: '//*[@data-qa="order-placed"]',
    paymentHeading: 'h2',
};

function find(selector) {
    return cy.xpath(selector);
}

module.exports = {
    openCartPage() {
        find(selectors.cartLink).click();
        cy.location('pathname').should('eq', '/view_cart');
        cy.get(selectors.cartInfo).should('be.visible');
    },
    assertCartContainsProducts(productNames) {
        cy.get(selectors.cartProductRows)
            .should('have.length', productNames.length);
        productNames.forEach((productName) => {
            cy.get(selectors.cartInfo).should('contain.text', productName);
        });
    },
    proceedToCheckout() {
        find(selectors.proceedToCheckoutButton).click();
        cy.location('pathname').should('eq', '/checkout');
        cy.get(selectors.checkoutInfo).should('be.visible');
    },
    assertCheckoutDetails(user, productNames) {
        find(selectors.deliveryAddress)
            .should('be.visible')
            .and('contain.text', user.firstName)
            .and('contain.text', user.lastName)
            .and('contain.text', user.address)
            .and('contain.text', user.address2)
            .and('contain.text', user.city)
            .and('contain.text', user.state)
            .and('contain.text', user.zipcode)
            .and('contain.text', user.country)
            .and('contain.text', user.mobileNumber);
        find(selectors.billingAddress)
            .should('be.visible')
            .and('contain.text', user.firstName)
            .and('contain.text', user.lastName);
        find(selectors.reviewOrderHeading).should('be.visible');
        cy.get(selectors.cartProductRows)
            .should('have.length', productNames.length);
        productNames.forEach((productName) => {
            cy.get(selectors.cartInfo).should('contain.text', productName);
        });
    },
    placeOrder(comment) {
        find(selectors.orderComment).type(comment);
        find(selectors.placeOrderButton).click();
        cy.location('pathname').should('eq', '/payment');
        cy.contains(selectors.paymentHeading, 'Payment').should('be.visible');
    },
    payAndConfirmOrder(payment) {
        find(selectors.cardName).type(payment.name);
        find(selectors.cardNumber).type(payment.number);
        find(selectors.cardCvc).type(payment.cvc);
        find(selectors.cardExpiryMonth).type(payment.expiryMonth);
        find(selectors.cardExpiryYear).type(payment.expiryYear);
        find(selectors.payButton).click();
    },
    assertOrderPlaced() {
        cy.location('pathname').should('match', /\/payment_done\/\d+$/);
        find(selectors.orderPlacedHeading)
            .should('be.visible')
            .and('contain.text', 'Order Placed!');
        cy.contains('Congratulations! Your order has been confirmed!')
            .should('be.visible');
    },
};
