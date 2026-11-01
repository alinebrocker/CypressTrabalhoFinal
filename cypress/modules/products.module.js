const navigation = require('./navigation.module');

const selectors = {
    productsLink: '//a[@href="/products"]',
    allProductsHeading: '//h2[normalize-space(.)="All Products"]',
    searchProductInput: '//*[@id="search_product"]',
    searchProductsButton: '//*[@id="submit_search"]',
    searchedProductsHeading: '//h2[normalize-space(.)="Searched Products"]',
    productsList: '//div[contains(@class, "features_items")]//div[contains(@class, "col-sm-4")]',
    firstViewProductLink: '(//div[contains(@class, "features_items")]//a[contains(@href, "/product_details/") and normalize-space(.)="View Product"])[1]',
    addToCartButtons: '.features_items .productinfo .add-to-cart',
    cartModal: '#cartModal',
    closeCartModalButton: '#cartModal .close-modal',
    productCards: '.features_items .product-image-wrapper',
    productInformation: '.product-information',
    productInfoName: '.productinfo p',
    productInfoPrice: '.productinfo h2',
    productDetailName: 'h2',
    productDetailPrice: 'span',
    productDetailAttribute: 'p',
};

function find(selector) {
    return cy.xpath(selector);
}

function addProductFromListing(index) {
    cy.get(selectors.addToCartButtons)
        .eq(index)
        .scrollIntoView()
        .click();
    cy.get(selectors.cartModal).should('have.class', 'show');
    cy.get(selectors.closeCartModalButton).click();
}

function openProductsPage() {
    navigation.openHomePage();
    find(selectors.productsLink).click();
    find(selectors.allProductsHeading).should('be.visible');
    find(selectors.productsList).should(($products) => {
        expect($products.length).to.be.greaterThan(0);
    });
}

module.exports = {
    openProductsPage,
    addProductsToCart() {
        openProductsPage();
        addProductFromListing(0);
        addProductFromListing(1);
    },
    openFirstProduct() {
        let listingProduct;

        cy.get(selectors.productCards)
            .filter(':visible')
            .first()
            .then(($product) => {
                listingProduct = {
                    name: $product.find(selectors.productInfoName).text().trim(),
                    price: $product.find(selectors.productInfoPrice).text().trim(),
                };
                expect(listingProduct.name).not.to.be.empty;
                expect(listingProduct.price).to.match(/^Rs\.\s*\d+$/);
            });
        find(selectors.firstViewProductLink).should('be.visible').click();
        cy.location('pathname').should('match', /\/product_details\/\d+$/);
        cy.get(selectors.productInformation).should('be.visible');
        return cy.then(() => listingProduct);
    },
    assertFirstProductDetails(listingProduct) {
        cy.get(selectors.productInformation).within(() => {
            cy.get(selectors.productDetailName).should('have.text', listingProduct.name);
            cy.contains(selectors.productDetailPrice, listingProduct.price).should('be.visible');

            ['Category', 'Availability', 'Condition', 'Brand'].forEach((label) => {
                cy.contains(selectors.productDetailAttribute, new RegExp(`^${label}:`))
                    .should('be.visible')
                    .invoke('text')
                    .then((text) => {
                        const value = text.replace(new RegExp(`^${label}:\\s*`), '').trim();
                        expect(value, `${label} should have a value`).not.to.be.empty;
                    });
            });
        });
    },
    searchProducts(productName) {
        find(selectors.searchProductInput).type(productName);
        find(selectors.searchProductsButton).click();
    },
    assertSearchedProductsVisible(searchTerm) {
        find(selectors.searchedProductsHeading).should('be.visible');
        cy.get(selectors.productCards)
            .filter(':visible')
            .should('have.length.greaterThan', 0)
            .then(($products) => {
                const hasMatchingProduct = $products.toArray().some((product) => {
                    const productName = Cypress.$(product)
                        .find(selectors.productInfoName)
                        .text()
                        .trim()
                        .toLowerCase();

                    return productName.includes(searchTerm.toLowerCase());
                });

                expect(
                    hasMatchingProduct,
                    `at least one result name should contain "${searchTerm}"`
                ).to.be.true;
            })
            .each(($product) => {
                cy.wrap($product)
                    .find(selectors.productInfoName)
                    .should('be.visible')
                    .and('not.be.empty');
                cy.wrap($product)
                    .find(selectors.productInfoPrice)
                    .should('be.visible')
                    .and('contain.text', 'Rs.');
            });
    },
};
