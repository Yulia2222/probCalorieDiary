import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { FoodItemService } from './food-items/food-item.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const foodItemService = app.get(FoodItemService);

    const foodItems = [
        {
            name: 'Говядина',
            calories: 190,
            protein: 22,
            fat: 7,
            carbs: 0,
            water: 73,
            fiber: 0,
            vitaminA: 0,
            vitaminB1: 0.08,
            vitaminB2: 0.16,
            vitaminB3: 5,
            vitaminB5: 0.6,
            vitaminB6: 0.5,
            vitaminB12: 1.8,
            vitaminB13: null,
            vitaminB15: null,
            vitaminC: 0,
            vitaminD: 0,
            vitaminE: 0.28,
            vitaminK: 1.1,
            vitaminP: 0,
            vitaminT: null,
            calcium: 16,
            iron: 1.93,
            potassium: 337,
            copper: 93,
            manganese: 0.014,
            magnesium: 23,
            sodium: 74,
            sulfur: 221,
            silicon: 0,
            zinc: 5.5,
            selenium: 25.2,
            chromium: 0,
            iodine: 0,
            saturatedFats: 0,
            monounsaturatedFats: 0,
            polyunsaturatedFats: 0,
            omega3: 0,
            omega6: 0,
            transFats: 0,
        },


    ];

    for (const item of foodItems) {
        await foodItemService.create(item);
        console.log(`Added: ${item.name}`);
    }

    await app.close();
}

bootstrap();
