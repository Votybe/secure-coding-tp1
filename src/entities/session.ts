import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, RelationId } from 'typeorm'
import { User } from './users'

@Entity()
export class Session {
  @PrimaryColumn()
  "id": string

  @ManyToOne(() => User, { eager: true, cascade: ['insert'], nullable: false })
  "user": User

  @RelationId((session: Session) => session.user)
  "userId": number

  @Column({
    type: "varchar",
    length: 384,
    })
  "token": string;

  @CreateDateColumn()
  "createdAt": string;

  @Column()
  "expiresAt": string;

  @Column()
  "revokedAt": string;
}