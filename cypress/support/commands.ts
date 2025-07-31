Cypress.Commands.add('addIngredient', (selector) => {
    return cy.get(selector).first().click();
});