import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Generate TypeORM database configuration from environment variables
 * @param configService - NestJS ConfigService to access environment variables
 * @returns TypeORM module options with PostgreSQL configuration
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const config = {
    type: 'postgres' as const,
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    autoLoadEntities: true, // Automatically load entity files
    synchronize: true, // Auto-sync schema (disable in production)
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    ssl: {
      rejectUnauthorized: false, // Required for some cloud PostgreSQL providers
    },
  };

  return config;
};

