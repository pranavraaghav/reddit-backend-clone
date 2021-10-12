import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  Connection,
  getConnection,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Community } from "./Community";
import { Vote } from "./Vote";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  post_id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: true,
  })
  imageurl: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({ default: 0, type: "integer" })
  comment_count: number;

  @ManyToOne(() => Community, (community) => community.posts, {
    onDelete: "CASCADE", // When community is deleted, post is also deleted
  })
  community: Community;

  @ManyToOne(() => User, (user) => user.posts)
  created_by: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ unsigned: true, default: 0 })
  upvote_count: number;

  @Column({ unsigned: true, default: 0 })
  downvote_count: number;

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  async incrementCommentCount(value?: number) {
    this.comment_count += value || 1;
    try {
      return getConnection().getRepository(Post).save(this);
    } catch (error) {
      return error;
    }
  }
  async decrementCommentCountBy(value?: number) {
    this.comment_count -= value || 1;
    try {
      getConnection().getRepository(Post).save(this);
    } catch (error) {
      return error;
    }
  }
}
