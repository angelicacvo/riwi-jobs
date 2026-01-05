import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

export enum ModalityEnum {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ONSITE = 'onsite',
}

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 500 })
  technologies: string;

  @Column({ type: 'varchar', length: 100 })
  seniority: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  softSkills: string;

  @Column({ type: 'varchar', length: 100 })
  location: string;

  @Column({
    type: 'enum',
    enum: ModalityEnum,
  })
  modality: ModalityEnum;

  @Column({ type: 'varchar', length: 100 })
  salaryRange: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'int' })
  maxApplicants: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Application, (application) => application.vacancy)
  applications: Application[];
}
