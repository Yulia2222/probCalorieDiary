import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipes.entity';
import { RecipeIngredient } from './recipe-ingredients.entity';
import { FoodItem } from '../food-items/food-item.entity';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient, FoodItem])],
    providers: [RecipeService],
    controllers: [RecipeController],
})
export class RecipeModule {}
