import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.role && currentUser.id === id) {
      throw new ForbiddenException('You cannot change your own role');
    }

    if (updateUserDto.role && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can change user roles');
    }

    if (
      updateUserDto.role &&
      user.role === UserRole.ADMIN &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Only administrators can modify other administrators',
      );
    }

    if (updateUserDto.password && currentUser.id !== id) {
      throw new ForbiddenException('You can only change your own password');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const user = await this.findOne(id);

    if (currentUser.id === id) {
      throw new BadRequestException('You cannot delete your own account');
    }

    if (user.role === UserRole.ADMIN) {
      const adminCount = await this.usersRepository.count({
        where: { role: UserRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new BadRequestException(
          'Cannot delete the last administrator in the system',
        );
      }
    }

    await this.usersRepository.remove(user);
  }

  async getUsersStats() {
    const totalUsers = await this.usersRepository.count();
    
    const usersByRole = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const roleStats = usersByRole.reduce((acc, item) => {
      acc[item.role] = parseInt(item.count);
      return acc;
    }, {});

    const recentUsers = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    return {
      totalUsers,
      usersByRole: roleStats,
      recentUsers,
    };
  }
}
