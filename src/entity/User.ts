import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";
import { Post } from "./Post";
import { Community } from "./Community";
import { Comment } from "./Comment";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.created_by)
  posts: Post[];

  @OneToMany(() => Community, (community) => community.created_by)
  created_communities: Community[];

  @OneToMany(() => Comment, (comment) => comment.created_by)
  comments: Comment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
