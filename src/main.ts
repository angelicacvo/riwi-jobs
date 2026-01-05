import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Bootstrap function to initialize and configure the NestJS application
 */
async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);
  
  // Configure global validation pipe for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Transform payloads to DTO instances
    }),
  );

  // Apply response interceptor to standardize API responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Enable CORS for cross-origin requests (allow frontend)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:4173'], // Vite dev and preview ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Riwi Jobs API')
    .setDescription('REST API for job vacancy management and developer applications')
    .setVersion('1.0')
    // Add JWT Bearer authentication scheme
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    // Add API Key authentication scheme
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key for authentication',
      },
      'x-api-key',
    )
    .build();

  // Generate Swagger document and setup UI
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start listening on configured port
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
