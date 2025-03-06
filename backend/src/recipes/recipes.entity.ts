import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { RecipeIngredient } from './recipe-ingredients.entity';

@Entity('recipes')
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe)
    ingredients: RecipeIngredient[];
}