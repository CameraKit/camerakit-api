import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 254 })
  email: string;

  @Column()
  emailConfirmed: boolean;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 100 })
  companyName: string;

  @Column({ length: 1000 })
  companyDescription: string;
}