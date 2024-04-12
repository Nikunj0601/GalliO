import { User } from 'src/user/user.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  path: string;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  @ManyToOne(() => User, (user) => user.id)
  user: User | number;

  @Column({ nullable: false })
  caption: string;

  @Column({ type: 'boolean', nullable: false })
  isPublic: boolean;

  @Column({ type: 'boolean', nullable: false })
  moderated: boolean;

  downloadUrl: string;
}
