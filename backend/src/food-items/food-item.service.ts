import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import { FoodItem } from './food-item.entity';

@Injectable()
export class FoodItemService {
    constructor(
        @InjectRepository(FoodItem)
        private foodItemRepository: Repository<FoodItem>,
    ) {}

    async findAll(): Promise<FoodItem[]> {
        return this.foodItemRepository.find();
    }

    async suggest(query: string): Promise<FoodItem[]> {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const trimmedQuery = query.trim();

        return this.foodItemRepository.find({
            where: [
                { name: ILike(`${trimmedQuery}%`) },
                { name: ILike(`% ${trimmedQuery}%`) },
            ],
            take: 10,
        });
    }

    async findByName(name: string): Promise<FoodItem | null> {
        return this.foodItemRepository.findOne({
            where: { name: ILike(`%${name}%`) },
        });
    }


    async create(foodItem: Partial<FoodItem>): Promise<FoodItem> {
        const newItem = this.foodItemRepository.create(foodItem);
        return this.foodItemRepository.save(newItem);
    }

    async delete(id: number): Promise<void> {
        await this.foodItemRepository.delete(id);
    }
}
