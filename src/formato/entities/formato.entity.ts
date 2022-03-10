import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Formato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  formato: string;

  @Column({
    default: true,
  })
  ativo: boolean;

  @Column({
    nullable: true,
    select: false,
  })
  usuarioInsert: string;

  @Column({
    nullable: true,
    select: false,
  })
  usuarioUpdate: string;

  @CreateDateColumn({
    select: false,
  })
  dateInsert: Date;

  @UpdateDateColumn({
    select: false,
  })
  dateUpdate: Date;
}
