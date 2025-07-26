import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
      setupNodeEvents(on, config) {
        on('before:run', async () => {
          const maxAttempts = 10;
          const delay = 3000;
          
          for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
              await fetch('http://localhost:3000');
              console.log('Сервер доступен');
              return;
            } catch (err) {
              if (attempt === maxAttempts) {
                console.error('Сервер не отвечает после 10 попыток');
                throw err;
              }
              await new Promise(res => setTimeout(res, delay));
            }
          }
        });
        
        return config;
      }
    }
  });