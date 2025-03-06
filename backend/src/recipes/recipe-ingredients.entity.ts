import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Recipe } from './recipes.entity';
import { FoodItem } from '../food-items/food-item.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
    recipe: Recipe;

    @ManyToOne(() => FoodItem, { onDelete: 'CASCADE' })
    foodItem: FoodItem;

    @Column('float')
    quantity: number;
}