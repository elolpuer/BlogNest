import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({type:"integer"})
    id: string

    @Column({unique: true})
    username: string

    @Column({unique: true})
    email: string

    @Column()
    password: string
}