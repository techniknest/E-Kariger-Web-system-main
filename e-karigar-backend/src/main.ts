import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // UPDATED CORS SETTINGS
  app.enableCors({
    origin: true, // This allows both Localhost AND your future Vercel URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Render provides the PORT variable automatically.
  // If running locally, it falls back to 3000.
  await app.listen(process.env.PORT || 3000);
}

bootstrap();