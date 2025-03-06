import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import { Recipe } from './recipes.entity';
import { RecipeIngredient } from './recipe-ingredients.entity';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe) private recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeIngredient) private recipeIngredientRepository: Repository<RecipeIngredient>,
    ) {}

    async create(recipeData: Partial<Recipe>, ingredients: { foodItemId: number; quantity: number }[]): Promise<Recipe> {
        const recipe = this.recipeRepository.create(recipeData);
        const savedRecipe = await this.recipeRepository.save(recipe);

        const recipeIngredients = ingredients.map((ingredient) =>
            this.recipeIngredientRepository.create({
                recipe: savedRecipe,
                foodItem: { id: ingredient.foodItemId },
                quantity: ingredient.quantity,
            }),
        );
        await this.recipeIngredientRepository.save(recipeIngredients);

        return savedRecipe;
    }


    async findByName(recipeName: string): Promise<any[]> {
        const recipes = await this.recipeRepository.find({
            where: { name: recipeName },
            relations: ['ingredients', 'ingredients.foodItem'],
        });

        return recipes.map(recipe =>
            recipe.ingredients.map(ingredient => ({
                quantity: ingredient.quantity.toString(),
                unit: 'г',
                name: ingredient.foodItem.name,
            }))
        );


    }

    async suggest(query: string): Promise<string[]> {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const trimmedQuery = query.trim();
        const recipes = await this.recipeRepository.find({
            where: [
                { name: ILike(`${trimmedQuery}%`) },
                { name: ILike(`% ${trimmedQuery}%`) },
            ],
            take: 10,
        });

        const uniqueNames = Array.from(new Set(recipes.map(recipe => recipe.name.trim())));

        return uniqueNames;
    }



    async findAll(): Promise<Recipe[]> {
        return this.recipeRepository.find({ relations: ['ingredients', 'ingredients.foodItem'] });
    }
}
