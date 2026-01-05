import { DataSource } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { UserRole } from '../../common/enums/roles.enum';

export class ApplicationSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const applicationRepository = dataSource.getRepository(Application);
    const userRepository = dataSource.getRepository(User);
    const vacancyRepository = dataSource.getRepository(Vacancy);

    // Obtener todos los coders
    const coders = await userRepository.find({
      where: { role: UserRole.CODER },
    });

    // Obtener todas las vacantes activas
    const vacancies = await vacancyRepository.find({
      where: { isActive: true },
    });

    if (coders.length === 0) {
      console.log('⚠️  No coders found. Skipping application seeding.');
      return;
    }

    if (vacancies.length === 0) {
      console.log('⚠️  No active vacancies found. Skipping application seeding.');
      return;
    }

    // Crear aplicaciones de prueba para diferentes escenarios
    const applicationsToCreate: Array<{ coder: User; vacancy: Vacancy }> = [];

    // Coder 1 - Juan Pérez: 2 aplicaciones (puede aplicar a 1 más)
    if (coders[0] && vacancies[0] && vacancies[1]) {
      applicationsToCreate.push(
        { coder: coders[0], vacancy: vacancies[0] },
        { coder: coders[0], vacancy: vacancies[1] },
      );
    }

    // Coder 2 - Ana Martínez: 3 aplicaciones (límite alcanzado - para testing)
    if (coders[1] && vacancies[2] && vacancies[3] && vacancies[4]) {
      applicationsToCreate.push(
        { coder: coders[1], vacancy: vacancies[2] },
        { coder: coders[1], vacancy: vacancies[3] },
        { coder: coders[1], vacancy: vacancies[4] },
      );
    }

    // Coder 3 - Pedro Rodríguez: 1 aplicación
    if (coders[2] && vacancies[0]) {
      applicationsToCreate.push(
        { coder: coders[2], vacancy: vacancies[0] },
      );
    }

    // Coder 4 - Laura Gómez: 2 aplicaciones
    if (coders[3] && vacancies[5] && vacancies[6]) {
      applicationsToCreate.push(
        { coder: coders[3], vacancy: vacancies[5] },
        { coder: coders[3], vacancy: vacancies[6] },
      );
    }

    // Coder 5 - Diego Torres: 1 aplicación
    if (coders[4] && vacancies[1]) {
      applicationsToCreate.push(
        { coder: coders[4], vacancy: vacancies[1] },
      );
    }

    // Aplicar a vacante con cupo límite (UI/UX Designer tiene maxApplicants: 1)
    const limitedVacancy = vacancies.find(v => v.title === 'UI/UX Designer');
    if (limitedVacancy && coders[2]) {
      applicationsToCreate.push(
        { coder: coders[2], vacancy: limitedVacancy },
      );
    }

    let createdCount = 0;
    let existingCount = 0;

    for (const appData of applicationsToCreate) {
      if (!appData.coder || !appData.vacancy) continue;

      const existingApplication = await applicationRepository.findOne({
        where: {
          userId: appData.coder.id,
          vacancyId: appData.vacancy.id,
        },
      });

      if (!existingApplication) {
        const application = applicationRepository.create({
          userId: appData.coder.id,
          vacancyId: appData.vacancy.id,
        });
        await applicationRepository.save(application);
        console.log(
          `✅ Application created: ${appData.coder.name} -> ${appData.vacancy.title}`,
        );
        createdCount++;
      } else {
        console.log(
          `ℹ️  Application already exists: ${appData.coder.name} -> ${appData.vacancy.title}`,
        );
        existingCount++;
      }
    }

    console.log('🌱 Application seeding completed!');
    console.log(`\n📊 Applications summary:`);
    console.log(`   - Created: ${createdCount}`);
    console.log(`   - Already existed: ${existingCount}`);
    console.log(`   - Total attempted: ${applicationsToCreate.length}`);
  }
}
