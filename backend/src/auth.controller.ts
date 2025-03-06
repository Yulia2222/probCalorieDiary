import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService) {}

    @Post('register')
    async register(
        @Body()
            body: {
            username: string;
            password: string;
            weight?: number;
            height?: number;
            age?: number;
            activityIndex?: number;
            gender?: string,
            target?: string,
        },
    ) {
        const { username, password, weight, height, age, activityIndex, gender, target } = body;

        console.log('Регистрация пользователя:', { username, weight, height, age, activityIndex });

        if (!username || !password) {
            throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
        }

        return this.userService.createUser(username, password, weight, height, age, activityIndex, gender, target);
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const { username, password } = body;
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
        }

        const token = jwt.sign({ id: user.id, username: user.username }, 'secretKey', { expiresIn: '1h' });
        return { token, userId: user.id };
    }
}
