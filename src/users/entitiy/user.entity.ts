import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usernames: string;

  @Column()
  password: string;

  @Column()
  email: string;
}
