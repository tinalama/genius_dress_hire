import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('adminUsers')
@Index(['email'])
@Index(['firstName'])
@Index(['lastName'])
@Index(['phoneNumber'])
@Index(['status'])
export class AdminUser {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: '_id', type: 'uuid', generated: 'uuid', unique: true })
  uuid!: string;

  @Column({ name: 'firstName', type: 'varchar', length: '200', nullable: true })
  firstName!: string | null;

  @Column({ name: 'lastName', type: 'varchar', length: '200', nullable: true })
  lastName!: string | null;

  @Column({ type: 'varchar', length: '200', unique: true })
  email!: string;

  @Column({ name: 'phoneNumber', type: 'varchar', length: '20', nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'varchar', nullable: true, select: false })
  password!: string | null;

  @Column({ type: 'varchar', nullable: true, select: false })
  salt!: string | null;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'varchar', nullable: true })
  token!: string | null;

  @Column({ name: 'tokenExpiry', type: 'timestamp', nullable: true })
  tokenExpiry!: Date | null;

  @Column({ name: 'tokenValidityDate', type: 'timestamp', nullable: true })
  tokenValidityDate!: Date | null;

  @Column({ name: 'lastLoginAt', type: 'timestamp', nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;
}