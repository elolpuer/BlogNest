import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('posts')
export class Post{
    @PrimaryGeneratedColumn({type: "integer"})
    id: string

    @Column({type: "integer"})
    user_id: string

    @Column()
    username: string

    @Column({type: "text"})
    text: string

    @Column({type: "time"})
    time: Date

    @Column({type: "date"})
    date: Date
}