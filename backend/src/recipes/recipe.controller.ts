import {Controller, Get, Post, Body, Param, Query} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipes.entity';

@Controller('recipes')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

    @Post()
    async create(
        @Body() recipeData: { name: string; description: string; ingredients: { foodItemId: number; quantity: number }[] },
    ): Promise<Recipe> {
        return this.recipeService.create(
            { name: recipeData.name },
            recipeData.ingredients,
        );
    }

    @Get('suggest')
    async suggest(@Query('query') query: string): Promise<string[]> {
        console.log("query", query);
        return this.recipeService.suggest(query);
    }



    @Get(':name')
    async findByName(@Param('name') name: string): Promise<any[]> {
        console.log("name", name)
        return this.recipeService.findByName(name);
    }

    @Get()
    async findAll(): Promise<Recipe[]> {
        return this.recipeService.findAll();
    }
}
