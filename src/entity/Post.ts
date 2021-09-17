import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm'
import { User } from './User'
import { Comment } from './Comment'
import { Community } from './Community'

@Entity()
export class Post {

    @PrimaryGeneratedColumn('uuid')
    post_id: string

    @CreateDateColumn()
    created_at: Date
    
    @Column()
    imageurl: string

    @ManyToOne(() => Community, community => community.posts)
    community_id: Community

    @OneToMany(() => Comment, comment => comment.post_id)
    comments: Comment

    @ManyToOne(() => User, user => user.posts)
    user_id: User
}