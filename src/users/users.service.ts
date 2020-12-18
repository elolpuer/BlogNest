import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from 'src/dto/user-dto';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>
    ){}

    async findAll(id ?: string): Promise<UserDto[]> {
        if (id) {
            const users =  await this.userRepository.createQueryBuilder()
                .select(["id", "email", "username"])
                .where("id <> :id", { id })
                .getRawMany()
            return users
        }
        const users =  await this.userRepository.createQueryBuilder()
            .select(["id", "email", "username"])
            .getRawMany()
        return users   
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete({id})
        await this.postRepository.delete({user_id: id})
    }
}
