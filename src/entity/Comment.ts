import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  comment_id: string;

  @CreateDateColumn()
  created_at: Date;

  // Soft remove implementation pending
  @DeleteDateColumn()
  deleted_at?: Date;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.comments)
  created_by: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "CASCADE", // comments get deleted when parent post is deleted
  })
  post: Post;

  @OneToMany(() => Comment, (comment) => comment.parent, {
    cascade: true,
  })
  children: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.children)
  parent: Comment;
}
