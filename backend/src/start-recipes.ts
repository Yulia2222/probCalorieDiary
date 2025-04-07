import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RecipeService } from './recipes/recipe.service';
import { FoodItemService } from './food-items/food-item.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const recipeService = app.get(RecipeService);
    const foodItemService = app.get(FoodItemService);

    const foodItems = await foodItemService.findAll();

    if (foodItems.length === 0) {
        console.error('Нет ингредиентов в базе! Сначала заполните food_items.');
        await app.close();
        return;
    }

    const foodItemMap = new Map(foodItems.map(item => [item.name, item.id]));

    const recipes = [
        {
            name: 'Борщ',
            ingredients: [
                { foodItemName: 'Говядина', quantity: 500 },
                { foodItemName: 'Свёкла', quantity: 400 },
                { foodItemName: 'Картофель', quantity: 350 },
                { foodItemName: 'Морковь', quantity: 100 },
                { foodItemName: 'Лук репчатый', quantity: 100 },
                { foodItemName: 'Капуста белокачанная', quantity: 300 },
                { foodItemName: 'Томатная паста', quantity: 30 },
                { foodItemName: 'Сахар', quantity: 10 },
                { foodItemName: 'Вода', quantity: 2500 },
                { foodItemName: 'Растительное масло подсолнечное', quantity: 30 },
            ],
        },
        {
            name: 'Борщ',
            ingredients: [
                { foodItemName: 'Свёкла', quantity: 500 },
                { foodItemName: 'Картофель', quantity: 350 },
                { foodItemName: 'Морковь', quantity: 100 },
                { foodItemName: 'Лук репчатый', quantity: 100 },
                { foodItemName: 'Капуста белокачанная', quantity: 300 },
                { foodItemName: 'Томатная паста', quantity: 30 },
                { foodItemName: 'Сахар', quantity: 10 },
                { foodItemName: 'Вода', quantity: 2500 },
                { foodItemName: 'Растительное масло подсолнечное', quantity: 30 },
            ],
        },
        {
            name: 'Борщ',
            ingredients: [
                { foodItemName: 'Куриное филе сырое', quantity: 500 },
                { foodItemName: 'Свёкла', quantity: 500 },
                { foodItemName: 'Картофель', quantity: 350 },
                { foodItemName: 'Морковь', quantity: 100 },
                { foodItemName: 'Лук репчатый', quantity: 100 },
                { foodItemName: 'Капуста белокачанная', quantity: 300 },
                { foodItemName: 'Томатная паста', quantity: 30 },
                { foodItemName: 'Сахар', quantity: 10 },
                { foodItemName: 'Вода', quantity: 2500 },
                { foodItemName: 'Растительное масло подсолнечное', quantity: 30 },
            ],
        },
        {
            name: 'Борщ',
            ingredients: [
                { foodItemName: 'Говядина', quantity: 600 },
                { foodItemName: 'Свёкла', quantity: 500 },
                { foodItemName: 'Картофель', quantity: 400 },
                { foodItemName: 'Морковь', quantity: 100 },
                { foodItemName: 'Лук репчатый', quantity: 100 },
                { foodItemName: 'Капуста белокачанная', quantity: 300 },
                { foodItemName: 'Томатная паста', quantity: 45 },
                { foodItemName: 'Сахар', quantity: 15 },
                { foodItemName: 'Растительное масло подсолнечное', quantity: 45 },
                { foodItemName: 'Вода', quantity: 3000 },
            ],
        },
        {
            name: 'Борщ',
            ingredients: [
                { foodItemName: 'Говядина', quantity: 600 },
                { foodItemName: 'Свёкла', quantity: 400 },
                { foodItemName: 'Вода', quantity: 2500 },
                { foodItemName: 'Картофель', quantity: 350 },
                { foodItemName: 'Морковь', quantity: 100 },
                { foodItemName: 'Лук репчатый', quantity: 100 },
                { foodItemName: 'Капуста белокачанная', quantity: 300 },
                { foodItemName: 'Помидор', quantity: 130 },
                { foodItemName: 'Растительное масло подсолнечное', quantity: 45 },
            ],
        },
    ];

    for (const recipeData of recipes) {
        const ingredients = recipeData.ingredients
            .map(({ foodItemName, quantity }) => ({
                foodItemId: foodItemMap.get(foodItemName),
                quantity,
            }))
            .filter(ingredient => ingredient.foodItemId !== undefined);

        if (ingredients.length === 0) {
            console.warn(`Пропускаем рецепт "${recipeData.name}", так как нет доступных ингредиентов.`);
            continue;
        }

        await recipeService.create({ name: recipeData.name }, ingredients);
        console.log(`Добавлен рецепт: ${recipeData.name}`);
    }

    console.log('Заполнение завершено!');
    await app.close();
}

bootstrap();
