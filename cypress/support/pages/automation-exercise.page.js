const selectors = {
    homeLink: '//a[normalize-space(.)="Home"]',
    loginLink: '//a[contains(@href, "login")]',
    subscriptionHeading: '//*[self::footer or @id="footer"]//h2[translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="subscription"]',
    subscriptionEmail: '//*[@id="susbscribe_email"]',
    subscribeButton: '//*[@id="subscribe"]',
    subscriptionSuccessMessage: '//*[@id="success-subscribe"]//div[contains(@class, "alert-success")]',
    productsLink: '//a[@href="/products"]',
    cartLink: '//header[@id="header"]//a[@href="/view_cart"]',
    allProductsHeading: '//h2[normalize-space(.)="All Products"]',
    searchProductInput: '//*[@id="search_product"]',
    searchProductsButton: '//*[@id="submit_search"]',
    searchedProductsHeading: '//h2[normalize-space(.)="Searched Products"]',
    productsList: '//div[contains(@class, "features_items")]//div[contains(@class, "col-sm-4")]',
    firstViewProductLink: '(//div[contains(@class, "features_items")]//a[contains(@href, "/product_details/") and normalize-space(.)="View Product"])[1]',
    proceedToCheckoutButton: '//a[contains(@class, "check_out") and contains(normalize-space(.), "Proceed To Checkout")]',
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

function openHomePage() {
    cy.visit('/');
    find(selectors.homeLink).should('be.visible');
}

function openProductsPage() {
    cy.visit('/');
    find(selectors.homeLink).should('be.visible');
    find(selectors.productsLink).click();
    find(selectors.allProductsHeading).should('be.visible');
    find(selectors.productsList).should(($products) => {
        expect($products.length).to.be.greaterThan(0);
    });
}

function addProductFromListing(index) {
    cy.get('.features_items .productinfo .add-to-cart')
        .eq(index)
        .scrollIntoView()
        .click();
    cy.get('#cartModal').should('have.class', 'show');
    cy.get('#cartModal .close-modal').click();
}

function removeAllCartItems() {
    cy.get('#cart_info').then(($cart) => {
        const deleteButtons = $cart.find('.cart_quantity_delete');

        if (deleteButtons.length > 0) {
            cy.wrap(deleteButtons[0]).click();
            removeAllCartItems();
        }
    });
}

function startSignup(name, email) {
    cy.contains('h2', 'New User Signup!').should('be.visible');
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
    openLoginPage,
    openHomePage,
    scrollToFooter() {
        cy.get('#footer').scrollIntoView();
    },
    assertSubscriptionHeadingVisible() {
        find(selectors.subscriptionHeading).should('be.visible');
    },
    subscribeFromHomePage(email) {
        find(selectors.subscriptionEmail).type(email);
        find(selectors.subscribeButton).click();
    },
    assertSubscriptionSuccess() {
        find(selectors.subscriptionSuccessMessage)
            .should('be.visible')
            .and('contain.text', 'You have been successfully subscribed!');
    },
    openProductsPage,
    clearCart() {
        cy.visit('/view_cart');
        removeAllCartItems();
        cy.get('#empty_cart').should('be.visible');
    },
    addProductsToCart() {
        openProductsPage();
        addProductFromListing(0);
        addProductFromListing(1);
    },
    openCartPage() {
        find(selectors.cartLink).click();
        cy.location('pathname').should('eq', '/view_cart');
        cy.get('#cart_info').should('be.visible');
    },
    assertCartContainsProducts(productNames) {
        cy.get('#cart_info tbody tr[id^="product-"]')
            .should('have.length', productNames.length);
        productNames.forEach((productName) => {
            cy.get('#cart_info').should('contain.text', productName);
        });
    },
    proceedToCheckout() {
        find(selectors.proceedToCheckoutButton).click();
        cy.location('pathname').should('eq', '/checkout');
        cy.get('[data-qa="checkout-info"]').should('be.visible');
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
        cy.get('#cart_info tbody tr[id^="product-"]')
            .should('have.length', productNames.length);
        productNames.forEach((productName) => {
            cy.get('#cart_info').should('contain.text', productName);
        });
    },
    placeOrder(comment) {
        find(selectors.orderComment).type(comment);
        find(selectors.placeOrderButton).click();
        cy.location('pathname').should('eq', '/payment');
        cy.contains('h2', 'Payment').should('be.visible');
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
    openFirstProduct() {
        find(selectors.firstViewProductLink).should('be.visible').click();
        cy.location('pathname').should('match', /\/product_details\/\d+$/);
        cy.get('.product-information').should('be.visible');
    },
    assertFirstProductDetails() {
        cy.get('.product-information').within(() => {
            cy.get('h2').should('have.text', 'Blue Top');
            cy.contains('p', 'Category:')
                .should('contain.text', 'Women > Tops');
            cy.contains('span', 'Rs. 500').should('be.visible');
            cy.contains('p', 'Availability:')
                .should('contain.text', 'In Stock');
            cy.contains('p', 'Condition:')
                .should('contain.text', 'New');
            cy.contains('p', 'Brand:')
                .should('contain.text', 'Polo');
        });
    },
    searchProducts(productName) {
        find(selectors.searchProductInput).type(productName);
        find(selectors.searchProductsButton).click();
    },
    assertSearchedProductsVisible() {
        find(selectors.searchedProductsHeading).should('be.visible');
        cy.get('.features_items .product-image-wrapper')
            .filter(':visible')
            .should('have.length.greaterThan', 0)
            .each(($product) => {
                cy.wrap($product)
                    .find('.productinfo p')
                    .should('be.visible')
                    .and('not.be.empty');
                cy.wrap($product)
                    .find('.productinfo h2')
                    .should('be.visible')
                    .and('contain.text', 'Rs.');
            });
    },
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
    logoutAfterAccountCreated() {
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
