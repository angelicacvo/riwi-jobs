import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Service responsible for authentication operations
 * Handles user registration, login, and JWT token generation
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user in the system
   * @param registerDto - User registration data
   * @returns User data and JWT access token
   * @throws ConflictException if email already exists
   */
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Check if email is already registered
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create new user entity
    const user = this.usersRepository.create({
      name,
      email,
      password, // Password will be hashed in entity BeforeInsert hook
    });

    // Persist user to database
    await this.usersRepository.save(user);

    // Generate JWT token with user payload
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: token,
    };
  }

  /**
   * Authenticate user and generate JWT token
   * @param loginDto - User login credentials
   * @returns User data and JWT access token
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Query user with password field (normally excluded)
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password using bcrypt comparison
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token with user payload
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: token,
    };
  }

  /**
   * Validate user by ID for JWT strategy
   * @param userId - User UUID
   * @returns User entity or null if not found
   */
  async validateUser(userId: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }
}
