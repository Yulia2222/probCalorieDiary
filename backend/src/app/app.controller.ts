import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  //
  // @Get('search-foods')
  // async searchFoods(@Query('foodName') foodName: string) {
  //   if (!foodName) {
  //     throw new HttpException('Food name is required', HttpStatus.BAD_REQUEST);
  //   }
  //   return this.appService.getFoods(foodName);
  // }
}
