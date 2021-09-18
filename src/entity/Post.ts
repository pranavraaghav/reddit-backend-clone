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
    
    @Column({
        nullable: false
    })
    title: string

    @Column({
        nullable: true
    })
    imageurl: string

    @Column({
        nullable: true
    }) 
    description: string 

    @ManyToOne(() => Community, community => community.posts, { 
        onDelete: 'CASCADE' // When community is deleted, post is also deleted
    })
    community: Community

    @ManyToOne(() => User, user => user.posts)
    created_by: User

    @OneToMany(() => Comment, comment => comment.post_id)
    comments: Comment
}