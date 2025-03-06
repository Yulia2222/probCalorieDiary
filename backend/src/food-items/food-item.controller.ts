import {Controller, Get, Post, Delete, Param, Body, Query} from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { FoodItem } from './food-item.entity';

@Controller('food-items')
export class FoodItemController {
    constructor(private readonly foodItemService: FoodItemService) {}

    @Get()
    async findAll(): Promise<FoodItem[]> {
        return this.foodItemService.findAll();
    }

    @Get('suggest')
    async suggest(@Query('query') query: string): Promise<FoodItem[]> {
        return this.foodItemService.suggest(query);
    }

    @Get('search')
    async findByName(@Query('name') name: string): Promise<FoodItem> {
        return this.foodItemService.findByName(name);
    }

    @Post()
    async create(@Body() foodItem: Partial<FoodItem>): Promise<FoodItem> {
        return this.foodItemService.create(foodItem);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return this.foodItemService.delete(id);
    }
}
