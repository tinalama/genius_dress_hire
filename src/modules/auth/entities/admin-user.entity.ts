import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
  DeleteDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { AdminUserStatusEnum } from '../enums/admin-user-status.enum';

/**
 * Admin User Entity
 */
@Entity({
  name: 'adminUsers'
})
@Index(['email'])
@Index(['firstName'])
@Index(['lastName'])
@Index(['phoneNumber'])
@Index(['status'])
export class AdminUser {
  @PrimaryGeneratedColumn('increment')
  @Expose({ name: 'id' })
  id!: number;

  @Index({
    unique: true
  })
  @Column({
    name: '_id',
    type: 'uuid',
    generated: 'uuid'
  })
  _id!: string;

  @Column({
    name: 'firstName',
    type: 'varchar',
    length: '200',
    nullable: true
  })
  firstName!: string | null;

  @Column({
    name: 'lastName',
    type: 'varchar',
    length: '200',
    nullable: true
  })
  lastName!: string | null;

  @Column({
    type: 'varchar',
    length: '200',
    unique: true
  })
  email!: string;

  @Column({
    name: 'phoneNumber',
    type: 'varchar',
    length: '20',
    nullable: true
  })
  phoneNumber!: string | null;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: true,
    select: false
  })
  @Exclude({
    toPlainOnly: true
  })
  password!: string | null;

  @Column({
    name: 'salt',
    type: 'varchar',
    nullable: true,
    select: false
  })
  @Exclude({
    toPlainOnly: true
  })
  salt!: string | null;

  @Column({
    name: 'status',
    type: 'boolean',
    default: false,
    transformer: {
      to(value: AdminUserStatusEnum): boolean {
        return value === AdminUserStatusEnum.ACTIVE;
      },
      from(value: boolean): AdminUserStatusEnum {
        return value ? AdminUserStatusEnum.ACTIVE : AdminUserStatusEnum.INACTIVE;
      }
    }
  })
  status: AdminUserStatusEnum;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @Exclude({
    toPlainOnly: true
  })
  token!: string | null;

  @Column({
    name: 'tokenExpiry',
    type: 'timestamp',
    nullable: true
  })
  @Exclude({
    toPlainOnly: true
  })
  tokenExpiry!: Date | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Exclude({
    toPlainOnly: true
  })
  tokenValidityDate!: Date | null;

  @Column({
    name: 'lastLoginAt',
    type: 'timestamp',
    nullable: true
  })
  lastLoginAt!: Date | null;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Expose({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  @Expose({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
    type: 'timestamp',
    nullable: true
  })
  @Exclude({
    toPlainOnly: true
  })
  deletedAt!: Date | null;

  @Exclude({
    toPlainOnly: true
  })
  skipHashPassword = false;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordUpsert() {
    if (this.password && !this.skipHashPassword && !this.salt) {
      await this.hashPassword();
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password || !this.salt) {
      return false;
    }
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  async hashPassword() {
    if (!this.password) {
      return;
    }
    if (!this.salt) {
      this.salt = await bcrypt.genSalt(10);
    }
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
