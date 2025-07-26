const fakeAccessToken = 'fake-access-token';
const fakeRefreshToken = 'fake-refresh-token';
interface InterceptedRequest {
    request: {
      headers: {
        authorization?: string;
      };
    };
}
const setupIngredients = () => {
    cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'}).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
};

describe('Добавление ингредиентов', () => {
    beforeEach(() => {
        setupIngredients();
    });
    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
    test('Добавляет булку в конструктор', () => {
        cy.get('[data-testid="ingredient-bun"]').first().click();
        cy.get('[data-testid="constructor-bun"]').should('exist');
        cy.get('[data-testid="order-total"]').should('contain', '1255');
    });
    test('Добавляет начинку в конструктор', () => {
        cy.get('[data-testid="ingredient-main"]').first().click();
        cy.get('[data-testid="constructor-main"]').should('exist');
    });
})

describe('Создает заказ', () => {
    beforeEach(() => {
        cy.setCookie('accessToken', fakeAccessToken);
        window.localStorage.setItem('refreshToken', fakeRefreshToken);
        cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
        cy.get('[data-testid="ingredient-bun"]').first().click();
        cy.get('[data-testid="ingredient-main"]').first().click();
    })
    test('Успешно создает заказ', () => {
        cy.get('[data-testid="order-button"]').click();
        cy.wait('@createOrder').then((interception) => {
            const req = interception as unknown as InterceptedRequest;
            expect(req.request.headers.authorization).to.eq('Bearer fake-access-token');
        });
        cy.get('[data-testid="order-modal"]').should('be.visible');
        cy.get('[data-testid="order-number"]').should('contain', '12345');
    })
    test('Очищает конструктор после создания заказа', () => {
        cy.get('[data-testid="order-button"]').click();
        cy.wait('@createOrder');
        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="constructor-bun"]').should('not.exist');
        cy.get('[data-testid="constructor-main"]').should('not.exist');
    })
    test('Показывает ошибку при неавторизованном пользователе', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.get('[data-testid="ingredient-bun"]').first().click();
        cy.get('[data-testid="ingredient-main"]').first().click();
        cy.get('[data-testid="order-button"]').click();
        cy.get('[data-testid="error-message"]').should('contain', 'Необходимо авторизоваться');
    })
})

describe('Работа с модальными окнами', () => {
    beforeEach(() => {
        setupIngredients();
    });
    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });
    test('Открывает модальное окно при клике на ингредиент', () => {
        cy.get('[data-testid="ingredient-main"]').first().click();
        cy.get('[data-testid="ingredient-details"]').should('be.visible');
        cy.get('[data-testid="ingredient-name"]').should('contain', 'Краторная булка N-200i');
    });
    test('Закрывает модальное окно по клику на крестик', () => {
        cy.get('[data-testid="ingredient-main"]').first().click();
        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="ingredient-details"]').should('not.exist');
    });
    test('Закрывает модальное окно по клику на оверлей', () => {
        cy.get('[data-testid="ingredient-main"]').first().click();
        cy.get('[data-testid="modal-overlay"]').click({ force: true });
        cy.get('[data-testid="ingredient-details"]').should('not.exist');
    });
})

describe('Модальное окно заказа', () => {
    beforeEach(() => {
        cy.setCookie('accessToken', fakeAccessToken);
        window.localStorage.setItem('refreshToken', fakeRefreshToken);
        cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
        cy.get('[data-testid="ingredient-bun"]').first().click();
        cy.get('[data-testid="ingredient-main"]').first().click();
        cy.get('[data-testid="order-button"]').click();
        cy.wait('@createOrder');
    });
    test('Открывает модальное окно заказа', () => {
        cy.get('[data-testid="order-modal"]').should('be.visible');
    });
    test('Закрывает модальное окно заказа по клику на крестик', () => {
        cy.get('[data-testid="modal-close-button"]').click();
        cy.get('[data-testid="order-modal"]').should('not.exist');
    });
    test('Закрывает модальное окно заказа по клику на оверлей', () => {
        cy.get('[data-testid="modal-overlay"]').click({ force: true });
        cy.get('[data-testid="order-modal"]').should('not.exist');
    });
})