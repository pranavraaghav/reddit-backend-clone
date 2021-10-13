import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  AfterRemove,
  AfterInsert,
  getConnection,
  TreeParent,
  TreeChildren,
  Tree,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Vote } from "./Vote";

@Entity()
@Tree("closure-table")
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

  @Column({
    default: false,
  })
  isRoot: boolean; // useful while fetching comment trees

  @ManyToOne(() => User, (user) => user.comments)
  created_by: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "CASCADE", // comments get deleted when parent post is deleted
  })
  post: Post;

  @Column({ unsigned: true, default: 0 })
  upvote_count: number;

  @Column({ unsigned: true, default: 0 })
  downvote_count: number;

  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  // Switching from Adjacency Lists to Closure Tables
  @TreeChildren({ cascade: ["remove"] })
  children: Comment[];

  @TreeParent({ onDelete: "CASCADE" })
  parent: Comment;

  @AfterInsert()
  async incrementPostCommentCount() {
    try {
      this.post.incrementCommentCount();
    } catch (error) {
      console.log(error);
    }
  }
}
