import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm'
import { User } from './User'
import { Post } from './Post'

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    comment_id: string
    
    @CreateDateColumn()
    created_at: Date
    
    @Column()
    comment: string

    @ManyToOne(() => User, user => user.comments)
    created_by: User

    @ManyToOne(() => Post, post => post.comments, {
        onDelete: 'CASCADE' // comments get deleted when parent post is deleted
    })
    post_id: Post

    @ManyToOne(() => Comment, comment => comment.parent_comment_id)
    child_comment_id: Comment

    @OneToMany(() => Comment, comment => comment.child_comment_id)
    parent_comment_id: Comment
}