type Interception = {
    request: {
      headers: {
        authorization: string;
      };
    };
    response?: {
      statusCode: number;
      body: {
        order: {
          number: number;
        };
      };
    };
  };
  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.visit('http://localhost:4000');
      cy.wait('@getIngredients');
      cy.get('main', { timeout: 10000 }).should('be.visible'); 
    });
  
    it('открытие и закрытие модалки ингредиентов', () => {
      cy.get('[data-testid="modal-ingredient"]').should('not.exist');
      cy.get('[data-testid="bun"]').first().click();
      cy.get('[data-testid="modal-ingredient"]').should('exist').within(() => {
        cy.contains('h3', 'Краторная булка N-200i').should('exist');
      })
    });
  });
  
  describe('Создание заказа', () => {
    const mockAccessToken = 'fake-access-token';
    const mockRefreshToken = 'fake-refresh-token';
    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.setCookie('accessToken', mockAccessToken);
      localStorage.setItem('refreshToken', mockRefreshToken);
      cy.visit('http://localhost:4000');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
      cy.get('main', { timeout: 10000 }).should('be.visible'); 
    });
  
    afterEach(() => {
      cy.clearCookies();
      localStorage.clear();
    });
  
    it('создание заказа', () => {
      // Добавляем ингредиенты
      cy.get('[data-testid="bun"]')
        .first()
        .within(() => {
          cy.contains('button', 'Добавить').click({ force: true });
        });
      cy.get('[data-testid="main"]')
        .first()
        .within(() => {
          cy.contains('button', 'Добавить').click({ force: true });
        });
  
      // Кнопка заказа активна
      cy.get('[data-testid="order-button"]')
        .should('not.be.disabled')
        .click({ force: true });
  
      // Запрос на создание заказа
      cy.wait('@createOrder').then((interception: Interception) => {
        expect(interception.request.headers.authorization).to.equal(
          `${mockAccessToken}`
        );
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.response?.body.order.number).to.equal(85737);
      });
  
      // Проверяем модальное окно заказа
      cy.get('[data-testid="modal-order"]', { withinSubject: null })
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="order-number"]').should('contain', '85737');
      });

      // Закрываем модальное окно заказа
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal-order"]').should('not.exist');

      // Проверяем очистку конструктора
      cy.get('[data-testid="constructor-bun"]').should('not.exist');
      cy.get('[data-testid="constructor-main"]').find('li').should('have.length', 0);
    });
  });

describe('Добав ингр', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.visit('http://localhost:4000');
      cy.wait('@getIngredients');
      cy.get('main', { timeout: 10000 }).should('be.visible');
    });
    
      it('Добавление ингредиентов', () => {
        cy.get('[data-testid="constructor-bun"]').should('not.exist');
        cy.get('[data-testid="constructor-main"]').find('li').should('have.length', 0);

        cy.get('[data-testid="bun"]')
        .first()
        .within(() => {
          cy.get('[data-testid="name"]').should('have.text', 'Краторная булка N-200i');
          cy.contains('button', 'Добавить').click({ force: true });
        });
        
        const ingredientName = "Филе Люминесцентного тетраодонтимформа";
        cy.get('[data-testid="main"]')
        .first()
        .within(() => {
          cy.get('[data-testid="name"]').should('have.text', ingredientName);
          cy.contains('button', 'Добавить').click({ force: true });
        });

        cy.get('[data-testid="constructor-bun"]').should('exist');
        cy.get('[data-testid="constructor-main"]').find('li').should('have.length', 1);
        cy.get(`[data-testid="con${ingredientName}"]`)
        .should('exist')
        .and('contain.text', ingredientName);
      })
})

describe('Тестирование модального окна с деталями ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.get('main', { timeout: 10000 }).should('be.visible'); 
    cy.get('[data-testid="bun"]').first().click();
    cy.get('[data-testid="modal-ingredient"]').should('exist');
    cy.contains('Калории, ккал').should('be.visible');
  });

  it('должно закрываться при клике на крестик', () => {
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal-ingredient"]').should('not.exist');
    cy.contains('Калории, ккал').should('not.exist');
  });

  it('должно закрываться при клике на оверлей', () => {
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal-ingredient"]').should('not.exist');
    cy.contains('Калории, ккал').should('not.exist');
  });
})