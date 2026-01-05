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

    const coders = await userRepository.find({
      where: { role: UserRole.CODER },
    });

    const vacancies = await vacancyRepository.find({
      where: { isActive: true },
    });

    if (coders.length === 0 || vacancies.length === 0) {
      console.log('⚠️  No coders or vacancies found. Skipping application seeding.');
      return;
    }

    const applicationsToCreate = [
      { coder: coders[0], vacancy: vacancies[0] },
      { coder: coders[0], vacancy: vacancies[1] },
      { coder: coders[1], vacancy: vacancies[0] },
      { coder: coders[1], vacancy: vacancies[2] },
      { coder: coders[2], vacancy: vacancies[1] },
    ];

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
      } else {
        console.log(
          `ℹ️  Application already exists: ${appData.coder.name} -> ${appData.vacancy.title}`,
        );
      }
    }

    console.log('🌱 Application seeding completed!');
  }
}
