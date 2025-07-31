describe('Constructor', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
        cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.visit('http://localhost:4000');
        cy.wait('@getIngredients');
    });

    it('добавление ингредиентов', () => {
        const bunId = '1';
        const mainId = '2';

        /// Добавляем булку
        cy.get(`[data-id="${bunId}"]`).click();
        cy.get('[data-testid="constructor-bun"]').should('have.length', 2);

        // Добавляем начинку
        cy.get(`[data-id="${mainId}"]`).click();
        cy.get('[data-testid="constructor-main"]').should('exist');
    })

    it('открытие и закрытие модалки ингредиентов', () => {
        const ingredientId = '1';
        // Проверка открытия модалки
        cy.get(`[data-id=${ingredientId}]`).click();
        cy.get('[data-testid="modal"]').should('be.visible');
        cy.get('[data-testid="ingredient-details-name"]').should('contain', 'Краторная булка N-200i');

        // Закрытие через крестик
        cy.get('[data-testid="modal-close"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');

        // Закрытие через оверлей
        cy.get('[data-testid="modal-overlay"]').click();
        cy.get('[data-testid="modal"]').should('not.exist');
    });
        
    it('создание заказа', () => {
        // Добавляем ингредиенты
        cy.get('[data-id="60d3b41abdacab0026a733c6"]').click();
        cy.get('[data-id="60d3b41abdacab0026a733c8"]').click();

        // Оформляем заказ
        cy.get('[data-testid="order-button"]').click();
        cy.wait('@createOrder').its('request.headers.authorization')
            .should('equal', 'Bearer mock-access-token');

        // Проверяем модальное окно заказа
        cy.get('[data-testid="order-number"]').should('contain', '12345');
        cy.get('[data-testid="modal-close"]').click();
        
        // Проверяем очистку конструктора
        cy.get('[data-testid="constructor-bun"]').should('not.exist');
        cy.get('[data-testid="constructor-main"]').should('not.exist');
    });
})
// "constructor-bun" 'constructor-main'  в burger-contructorUI
