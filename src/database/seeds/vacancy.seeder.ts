import { DataSource } from 'typeorm';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { ModalityEnum } from '../../common/enums/modality.enum';

export class VacancySeeder {
  async run(dataSource: DataSource): Promise<void> {
    const vacancyRepository = dataSource.getRepository(Vacancy);

    const vacancies = [
      // Vacantes con CUPOS DISPONIBLES para testing
      {
        title: 'Senior Backend Developer - NestJS',
        description: 'Buscamos un desarrollador backend senior con experiencia en Node.js y NestJS. Trabajarás en proyectos de alto impacto para clientes internacionales.',
        technologies: 'Node.js, NestJS, PostgreSQL, TypeORM, TypeScript, Docker, Redis',
        seniority: 'Senior',
        softSkills: 'Liderazgo, Comunicación efectiva, Resolución de problemas, Trabajo en equipo',
        location: 'Medellín',
        modality: ModalityEnum.HYBRID,
        salaryRange: '$3000 - $5000 USD',
        company: 'Riwi Tech',
        maxApplicants: 5,
        isActive: true,
      },
      {
        title: 'Junior Frontend Developer - React',
        description: 'Únete a nuestro equipo como desarrollador frontend junior trabajando con React y tecnologías modernas. Capacitación continua incluida.',
        technologies: 'React, TypeScript, HTML5, CSS3, Tailwind CSS, Vite',
        seniority: 'Junior',
        softSkills: 'Creatividad, Aprendizaje rápido, Comunicación, Proactividad',
        location: 'Bogotá',
        modality: ModalityEnum.REMOTE,
        salaryRange: '$1500 - $2500 USD',
        company: 'Tech Solutions',
        maxApplicants: 10,
        isActive: true,
      },
      {
        title: 'Full Stack Developer - MERN Stack',
        description: 'Desarrollador full stack con experiencia en tecnologías frontend y backend. Proyecto de startup en crecimiento.',
        technologies: 'React, Node.js, Express, MongoDB, Next.js, TypeScript',
        seniority: 'Mid-Level',
        softSkills: 'Adaptabilidad, Resolución de problemas, Colaboración en equipo',
        location: 'Barranquilla',
        modality: ModalityEnum.ONSITE,
        salaryRange: '$2500 - $4000 USD',
        company: 'Innovation Labs',
        maxApplicants: 3,
        isActive: true,
      },
      // Vacantes adicionales para testing de filtros
      {
        title: 'DevOps Engineer',
        description: 'Ingeniero DevOps para automatización de infraestructura y despliegues continuos con AWS y Kubernetes.',
        technologies: 'AWS, Docker, Kubernetes, Terraform, Jenkins, GitLab CI/CD',
        seniority: 'Senior',
        softSkills: 'Pensamiento analítico, Automatización, Comunicación técnica',
        location: 'Cartagena',
        modality: ModalityEnum.REMOTE,
        salaryRange: '$3500 - $5500 USD',
        company: 'Cloud Masters',
        maxApplicants: 4,
        isActive: true,
      },
      {
        title: 'Mobile Developer - Flutter',
        description: 'Desarrollador móvil para aplicaciones multiplataforma con Flutter. Experiencia en aplicaciones de fintech.',
        technologies: 'Flutter, Dart, Firebase, REST APIs, SQLite, Provider',
        seniority: 'Mid-Level',
        softSkills: 'Atención al detalle, UX thinking, Trabajo remoto',
        location: 'Medellín',
        modality: ModalityEnum.HYBRID,
        salaryRange: '$2000 - $3500 USD',
        company: 'FinTech Innovators',
        maxApplicants: 6,
        isActive: true,
      },
      {
        title: 'QA Automation Engineer',
        description: 'Ingeniero de QA especializado en automatización de pruebas con Selenium y Cypress.',
        technologies: 'Selenium, Cypress, Jest, Playwright, JavaScript, TypeScript',
        seniority: 'Mid-Level',
        softSkills: 'Meticulosidad, Pensamiento crítico, Comunicación de bugs',
        location: 'Bogotá',
        modality: ModalityEnum.REMOTE,
        salaryRange: '$2200 - $3800 USD',
        company: 'Quality First',
        maxApplicants: 8,
        isActive: true,
      },
      // Vacante INACTIVA para testing
      {
        title: 'Data Scientist - ML Engineer',
        description: 'Científico de datos con experiencia en machine learning y análisis de datos a gran escala.',
        technologies: 'Python, TensorFlow, PyTorch, Pandas, NumPy, Scikit-learn, SQL',
        seniority: 'Senior',
        softSkills: 'Pensamiento analítico, Investigación, Presentación de resultados',
        location: 'Medellín',
        modality: ModalityEnum.ONSITE,
        salaryRange: '$4000 - $6000 USD',
        company: 'AI Solutions',
        maxApplicants: 3,
        isActive: false, // INACTIVA para testing
      },
      // Vacante SIN CUPOS para testing
      {
        title: 'UI/UX Designer',
        description: 'Diseñador UI/UX para crear experiencias de usuario excepcionales en productos digitales.',
        technologies: 'Figma, Adobe XD, Sketch, Photoshop, Illustrator, Prototyping',
        seniority: 'Mid-Level',
        softSkills: 'Creatividad, Empatía con usuarios, Comunicación visual',
        location: 'Bogotá',
        modality: ModalityEnum.REMOTE,
        salaryRange: '$2000 - $3500 USD',
        company: 'Design Studio',
        maxApplicants: 1, // SOLO 1 CUPO para testing de límite
        isActive: true,
      },
      {
        title: 'Junior Python Developer',
        description: 'Desarrollador Python junior para proyectos de backend con Django y Flask.',
        technologies: 'Python, Django, Flask, PostgreSQL, REST APIs, Git',
        seniority: 'Junior',
        softSkills: 'Aprendizaje continuo, Adaptabilidad, Trabajo en equipo',
        location: 'Cartagena',
        modality: ModalityEnum.REMOTE,
        salaryRange: '$1200 - $2000 USD',
        company: 'Python Experts',
        maxApplicants: 12,
        isActive: true,
      },
      {
        title: 'Tech Lead - Frontend',
        description: 'Líder técnico frontend para guiar equipo de desarrollo en arquitectura y mejores prácticas.',
        technologies: 'React, Vue.js, Angular, TypeScript, Micro-frontends, Webpack',
        seniority: 'Senior',
        softSkills: 'Liderazgo técnico, Mentoría, Comunicación estratégica, Toma de decisiones',
        location: 'Medellín',
        modality: ModalityEnum.HYBRID,
        salaryRange: '$4000 - $6500 USD',
        company: 'Tech Leaders Inc',
        maxApplicants: 2,
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
        console.log(`✅ Vacancy created: ${vacancyData.title} - ${vacancyData.company}`);
      } else {
        console.log(`ℹ️  Vacancy already exists: ${vacancyData.title}`);
      }
    }

    console.log('🌱 Vacancy seeding completed!');
    console.log(`\n📊 Total vacancies: ${vacancies.length}`);
    console.log(`   - Activas: ${vacancies.filter(v => v.isActive).length}`);
    console.log(`   - Inactivas: ${vacancies.filter(v => !v.isActive).length}`);
    console.log(`   - Remote: ${vacancies.filter(v => v.modality === ModalityEnum.REMOTE).length}`);
    console.log(`   - Hybrid: ${vacancies.filter(v => v.modality === ModalityEnum.HYBRID).length}`);
    console.log(`   - Onsite: ${vacancies.filter(v => v.modality === ModalityEnum.ONSITE).length}`);
  }
}
