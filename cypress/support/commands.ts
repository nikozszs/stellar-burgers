Cypress.Commands.add('login', () => {
    cy.setCookie('accessToken', 'fake-token');
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
});

Cypress.Commands.add('addIngredient', (selector) => {
    return cy.get(selector).first().click();
});