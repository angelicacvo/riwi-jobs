import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule, 
    UsersModule, 
    VacanciesModule, 
    ApplicationsModule, 
    DatabaseModule
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
