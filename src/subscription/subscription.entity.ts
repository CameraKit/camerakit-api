import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  price: number;

  @Column()
  product: string;

  @Column()
  source: string;

  @Column({ nullable: true })
  subscriptionId: string;

  @Column({ nullable: true })
  startDate: number;

  @Column({ nullable: true })
  endDate: number;

  @Column({ nullable: true })
  status: string;
}