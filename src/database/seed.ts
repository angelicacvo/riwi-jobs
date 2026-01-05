import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSeeder } from './seeds/user.seeder';
import { VacancySeeder } from './seeds/vacancy.seeder';
import { ApplicationSeeder } from './seeds/application.seeder';
import { DataSource } from 'typeorm';

async function runSeeders() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    console.log('📦 Database connection established');
    console.log('');

    // Run seeders in order
    const userSeeder = new UserSeeder();
    await userSeeder.run(dataSource);
    console.log('');

    const vacancySeeder = new VacancySeeder();
    await vacancySeeder.run(dataSource);
    console.log('');

    const applicationSeeder = new ApplicationSeeder();
    await applicationSeeder.run(dataSource);
    console.log('');

    console.log('✅ All seeders completed successfully!');
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    await app.close();
    process.exit(1);
  }
}

runSeeders();
