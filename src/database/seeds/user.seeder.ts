import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@riwi.com' },
    });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('Admin123!', 10);
      const admin = userRepository.create({
        name: 'Administrator',
        email: 'admin@riwi.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      });
      await userRepository.save(admin);
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    const existingGestor = await userRepository.findOne({
      where: { email: 'gestor@riwi.com' },
    });

    if (!existingGestor) {
      const gestorPassword = await bcrypt.hash('Gestor123!', 10);
      const gestor = userRepository.create({
        name: 'Gestor Riwi',
        email: 'gestor@riwi.com',
        password: gestorPassword,
        role: UserRole.GESTOR,
      });
      await userRepository.save(gestor);
      console.log('✅ Gestor user created');
    } else {
      console.log('ℹ️  Gestor user already exists');
    }

    console.log('🌱 User seeding completed!');
  }
}
