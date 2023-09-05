import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['subject', 'type'])
export class Otp {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('text')
  subject: string;

  @Column('text')
  type: string;

  @Column('text')
  hash: string;

  @Column('integer', { default: 100 })
  cooldown: number;

  @Column('integer', { default: 0 })
  retryCount: number;

  @Column('integer')
  maxRetryCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'timestamptz' })
  expiryDate: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
