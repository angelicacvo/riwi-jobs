import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { UserRole } from '../../common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

/**
 * User entity representing system users
 * Includes role-based access control and password hashing
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // Email must be unique across all users
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  // Password is excluded from default queries for security
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  // User role determines permissions (ADMIN, MANAGER, CODER)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CODER,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // One user can have many job applications
  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  /**
   * Hash password before inserting or updating user
   * Uses bcrypt with salt rounds of 10
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  /**
   * Compare plain text password with hashed password
   * @param attempt - Plain text password to verify
   * @returns Boolean indicating if password matches
   */
  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
