import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { Product } from './product.entity';
import { UserService } from './user.service';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FoodItem } from './food-items/food-item.entity';
import { FoodItemService } from './food-items/food-item.service';
import { FoodItemController } from './food-items/food-item.controller';
import { RecipeService } from './recipes/recipe.service';
import { RecipeController } from './recipes/recipe.controller';
import { Recipe } from './recipes/recipes.entity';
import { RecipeIngredient } from './recipes/recipe-ingredients.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'calorie_tracker',
      entities: [User, Product, FoodItem, Recipe, RecipeIngredient],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, FoodItem, Recipe, RecipeIngredient]),
  ],
  controllers: [AppController, AuthController, UserController, ProductController, FoodItemController, RecipeController],
  providers: [AppService, UserService, AuthService, ProductService, FoodItemService, RecipeService],
})
export class AppModule {}
