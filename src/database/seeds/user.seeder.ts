import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Usuarios de prueba para testear
    const usersToCreate = [
      {
        name: 'Super Administrador',
        email: 'admin@riwi.io',
        password: 'Admin123!',
        role: UserRole.ADMIN,
      },
      {
        name: 'María Gestora',
        email: 'gestor@riwi.io',
        password: 'Gestor123!',
        role: UserRole.GESTOR,
      },
      {
        name: 'Carlos García',
        email: 'gestor2@riwi.io',
        password: 'Gestor123!',
        role: UserRole.GESTOR,
      },
      {
        name: 'Juan Pérez',
        email: 'coder1@riwi.io',
        password: 'Coder123!',
        role: UserRole.CODER,
      },
      {
        name: 'Ana Martínez',
        email: 'coder2@riwi.io',
        password: 'Coder123!',
        role: UserRole.CODER,
      },
      {
        name: 'Pedro Rodríguez',
        email: 'coder3@riwi.io',
        password: 'Coder123!',
        role: UserRole.CODER,
      },
      {
        name: 'Laura Gómez',
        email: 'coder4@riwi.io',
        password: 'Coder123!',
        role: UserRole.CODER,
      },
      {
        name: 'Diego Torres',
        email: 'coder5@riwi.io',
        password: 'Coder123!',
        role: UserRole.CODER,
      },
    ];

    for (const userData of usersToCreate) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        // NO hashear aquí - el @BeforeInsert del entity lo hará automáticamente
        const user = userRepository.create(userData);
        await userRepository.save(user);
        console.log(`✅ User created: ${userData.name} (${userData.email})`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      }
    }

    console.log('🌱 User seeding completed!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('  ADMIN:   admin@riwi.io / Admin123!');
    console.log('  GESTOR:  gestor@riwi.io / Gestor123!');
    console.log('  GESTOR2: gestor2@riwi.io / Gestor123!');
    console.log('  CODER1:  coder1@riwi.io / Coder123!');
    console.log('  CODER2:  coder2@riwi.io / Coder123!');
    console.log('  CODER3:  coder3@riwi.io / Coder123!');
    console.log('  CODER4:  coder4@riwi.io / Coder123!');
    console.log('  CODER5:  coder5@riwi.io / Coder123!');
  }
}
