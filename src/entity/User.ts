import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, CreateDateColumn } from 'typeorm'
import { Post } from './Post'
import { Community } from './Community'
import { Comment } from './Comment'

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_id: string
    
    @CreateDateColumn()
    created_at: Date

    @Column()
    username: string

    @OneToMany(() => Post, post => post.user_id)
    posts: Post[]

    @OneToMany(() => Community, community => community.created_by_user_id)
    created_communities: Community[]

    @OneToMany(() => Comment, comment => comment.user_id)
    comments: Comment[]

}