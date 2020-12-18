import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('comments')
export class Comment{
    @PrimaryGeneratedColumn({type: "integer"})
    id: string

    @Column({type: "integer"})
    post_id: string

    @Column({type: "text"})
    text: string

    @Column({type: "time"})
    time: Date

    @Column({type: "date"})
    date: Date

    @Column()
    username: string
}