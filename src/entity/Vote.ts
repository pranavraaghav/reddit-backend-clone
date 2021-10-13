import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  BeforeInsert,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";
import { Community } from "./Community";
import { Comment } from "./Comment";
import * as bcrypt from "bcrypt";

export enum voteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote",
  NONE = "none",
}

@Entity()
export class Vote {
  @PrimaryGeneratedColumn("increment")
  vote_id: number;

  @Column({ default: voteType.NONE, type: "enum", enum: voteType })
  value: voteType;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Post, (post) => post.votes, {
    onDelete: "CASCADE",
    cascade: true,
    nullable: true,
  })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.votes, {
    onDelete: "CASCADE",
    cascade: true, // buggy
    nullable: true,
  })
  comment: Comment;
}
