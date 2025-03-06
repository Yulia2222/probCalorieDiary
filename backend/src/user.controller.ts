import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userService.findById(userId);

        return { username: user.username , weight: user.weight , height : user.height, age: user.age, activityIndex: user.activityIndex, gender: user.gender, target: user.target };
    }
}
