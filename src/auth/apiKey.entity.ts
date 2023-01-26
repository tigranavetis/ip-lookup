import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'api_key' })
export class ApiKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  key: string;

  @Column({ default: 0 })
  calls: number;
}
