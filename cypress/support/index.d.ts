declare namespace Cypress {
    interface Chainable {
      /**
       * Авторизация пользователя
       * @example cy.login()
       */
      login(): Chainable<void>;
      
      /**
       * Добавление ингредиента кликом
       * @example cy.addIngredient('[data-testid="ingredient-bun"]')
       */
      addIngredient(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }