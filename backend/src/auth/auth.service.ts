import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(
        username: string,
        password: string,
        weight?: number,
        height?: number,
        age?: number,
        activityIndex?: number,
        gender?:string,
        target?:string,
    ): Promise<User> {
        console.log('Создание пользователя:', { username, weight, height, age, activityIndex });

        const existingUser = await this.userRepository.findOne({ where: { username } });
        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            password: hashedPassword,
            weight,
            height,
            age,
            activityIndex,
            gender,
            target,
        });

        return this.userRepository.save(user);
    }

    async findByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }
}
