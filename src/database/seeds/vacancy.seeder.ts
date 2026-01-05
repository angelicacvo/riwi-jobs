import { DataSource } from 'typeorm';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { ModalityEnum } from '../../common/enums/modality.enum';

export class VacancySeeder {
  async run(dataSource: DataSource): Promise<void> {
    const vacancyRepository = dataSource.getRepository(Vacancy);

    const vacancies = [
      {
        title: 'Senior Backend Developer',
        description: 'We are looking for an experienced backend developer to work with Node.js and NestJS',
        technologies: 'Node.js, NestJS, PostgreSQL, TypeORM, TypeScript',
        seniority: 'Senior',
        softSkills: 'Leadership, Communication, Problem Solving, Teamwork',
        location: 'Medellín',
        modality: ModalityEnum.HYBRID,
        salaryRange: '$3000 - $5000 USD',
        company: 'Riwi Tech',
        maxApplicants: 5,
        isActive: true,
      },
      {
        title: 'Junior Frontend Developer',
        description: 'Join our team as a junior frontend developer working with React and modern technologies',
        technologies: 'React, TypeScript, HTML, CSS, Tailwind',
        seniority: 'Junior',
        softSkills: 'Creativity, Fast Learning, Communication',
        location: 'Bogotá',
        modality: ModalityEnum.REMOTE,
        salaryRange: '$1500 - $2500 USD',
        company: 'Tech Solutions',
        maxApplicants: 10,
        isActive: true,
      },
      {
        title: 'Full Stack Developer',
        description: 'Full stack developer with experience in both frontend and backend technologies',
        technologies: 'React, Node.js, Express, MongoDB, Next.js',
        seniority: 'Mid-Level',
        softSkills: 'Adaptability, Problem Solving, Team Collaboration',
        location: 'Barranquilla',
        modality: ModalityEnum.ONSITE,
        salaryRange: '$2500 - $4000 USD',
        company: 'Innovation Labs',
        maxApplicants: 3,
        isActive: true,
      },
    ];

    for (const vacancyData of vacancies) {
      const existingVacancy = await vacancyRepository.findOne({
        where: { title: vacancyData.title, company: vacancyData.company },
      });

      if (!existingVacancy) {
        const vacancy = vacancyRepository.create(vacancyData);
        await vacancyRepository.save(vacancy);
        console.log(`✅ Vacancy created: ${vacancyData.title}`);
      } else {
        console.log(`ℹ️  Vacancy already exists: ${vacancyData.title}`);
      }
    }

    console.log('🌱 Vacancy seeding completed!');
  }
}
