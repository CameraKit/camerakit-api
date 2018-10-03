import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 254 })
  email: string;

  @Column({ length:100, nullable: true })
  name: string;

  @Column({ length:100, nullable: true })
  company: string;

  @Column({ length:500, nullable: true })
  message: string;
}