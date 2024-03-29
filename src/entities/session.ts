import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm'
import { User } from './user'

const crypto = require('crypto');

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  "id": string

  @ManyToOne(() => User, { eager: true, cascade: ['insert'], onDelete: 'CASCADE', nullable: false })
  "user": User

  @RelationId((session: Session) => session.user)
  "userId": number

  @Column({
    type: "varchar",
    length: 384,
    unique: true,
    })
  "token": string;

  @CreateDateColumn()
  "createdAt": Date;

  @Column()
  "expiresAt": Date;

  @Column({ nullable: true})
  "revokedAt": Date;

  @BeforeInsert()
  initialisation() {
    this.token = crypto.randomBytes(32).toString('base64');
    this.expiresAt = new Date((new Date()).getTime() + 30*60000);
  }
}