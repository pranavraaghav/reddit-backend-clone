import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm'
import { Post } from './Post'
import { User } from './User'

@Entity()
export class Community {
    
    @PrimaryGeneratedColumn('uuid')
    community_id: string
    
    @CreateDateColumn()
    created_at: Date
    
    @Column() 
    description: string 
    
    @ManyToOne(() => User, user => user.created_communities)
    created_by_user_id: User
    
    @OneToMany(() => Post, post => post.community_id)
    posts: Post[]
    
}