import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Desactivar logs verbosos de NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  
  // Validación automática de datos de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Formato estándar de respuestas
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Configuración CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Permite peticiones sin origin (Postman, curl)
      if (!origin) return callback(null, true);
      
      // En desarrollo, permite cualquier localhost sin importar el puerto
      if (process.env.NODE_ENV !== 'production') {
        const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        return callback(null, isLocalhost);
      }
      
      // En producción, solo permite la URL configurada en .env
      const allowed = origin === process.env.FRONTEND_URL;
      callback(null, allowed);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('Riwi Jobs API')
    .setDescription('API para gestión de vacantes y postulaciones')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key',
      },
      'x-api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
}
bootstrap();
