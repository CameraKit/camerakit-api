import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 254 })
  email: string;

  @Column({ length: 100, nullable: true })
  password: string|undefined;

  @Column({ length:100, nullable: true })
  passwordHash: string|undefined;

  @Column({ nullable: true })
  emailConfirmed: boolean|false;

  @Column({ length:100, nullable: true })
  firstName: string;

  @Column({ length:100, nullable: true })
  lastName: string;

  @Column({ length:100, nullable: true })
  companyName: string;

  @Column({ length:100, nullable: true })
  companyDescription: string;
}