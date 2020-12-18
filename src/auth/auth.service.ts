import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/create-user-dto';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from 'src/dto/login-user-dto';
import { UserDto } from 'src/dto/user-dto';


@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async createUser(createUserDto: CreateUserDto, res: Response): Promise<any> {
        const user = await this.userRepository.findOne({username: createUserDto.username}) || await this.userRepository.findOne({email: createUserDto.email})
        if (user) {
            return res.status(400).json({message:'User with this username/email has been created'}) 
        }
        const hash = await bcrypt.hash(createUserDto.password, 13)

        const newUser = new User
            newUser.username = createUserDto.username
            newUser.email = createUserDto.email
            newUser.password = hash
        
        await this.userRepository.save(newUser)
    }

    async login(loginUserDto: LoginUserDto, res: Response): Promise<any> {
        const user = await this.userRepository.findOne({email: loginUserDto.email})
        if (!user) {
            return res.status(400).json({message: 'Wrong data'})
        }

        const isMatch = await bcrypt.compare(loginUserDto.password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'Wrong data'})
        }

        return await this.createSessionUser(user.id, user.username, user.email)
    }

    async createSessionUser(id: string, username: string, email: string): Promise<UserDto> {
        return {
            id,
            username,
            email
        }
    }
}
