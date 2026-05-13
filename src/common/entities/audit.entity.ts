import { Expose } from 'class-transformer';
import { JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from '../../modules/users/entities/user.entity';

/**
 * Entity with audit fields (createdBy, updatedBy)
 * Extends BaseEntity with user tracking capabilities
 */
export abstract class AuditEntity extends BaseEntity {
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User;
}