import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column('float')
    calories: number;

    @Column('float')
    protein: number;

    @Column('float')
    fat: number;

    @Column('float')
    carbs: number;

    @Column('float')
    water: number;

    @Column('float')
    fiber: number;

    @Column('float', { nullable: true })
    vitaminA: number;

    @Column('float', { nullable: true })
    vitaminB1: number;

    @Column('float', { nullable: true })
    vitaminB2: number;

    @Column('float', { nullable: true })
    vitaminB3: number;

    @Column('float', { nullable: true })
    vitaminB5: number;

    @Column('float', { nullable: true })
    vitaminB6: number;

    @Column('float', { nullable: true })
    vitaminB12: number;

    @Column('float', { nullable: true })
    vitaminB13: number;

    @Column('float', { nullable: true })
    vitaminB15: number;

    @Column('float', { nullable: true })
    vitaminC: number;

    @Column('float', { nullable: true })
    vitaminD: number;

    @Column('float', { nullable: true })
    vitaminE: number;

    @Column('float', { nullable: true })
    vitaminK: number;

    @Column('float', { nullable: true })
    vitaminP: number;

    @Column('float', { nullable: true })
    vitaminT: number;

    @Column('float', { nullable: true })
    calcium: number;

    @Column('float', { nullable: true })
    iron: number;

    @Column('float', { nullable: true })
    potassium: number;

    @Column('float', { nullable: true })
    copper: number;

    @Column('float', { nullable: true })
    manganese: number;

    @Column('float', { nullable: true })
    magnesium: number;

    @Column('float', { nullable: true })
    sodium: number;

    @Column('float', { nullable: true })
    sulfur: number;

    @Column('float', { nullable: true })
    silicon: number;

    @Column('float', { nullable: true })
    zinc: number;

    @Column('float', { nullable: true })
    selenium: number;

    @Column('float', { nullable: true })
    chromium: number;

    @Column('float', { nullable: true })
    iodine: number;

    @Column('float', { nullable: true })
    saturatedFats: number;

    @Column('float', { nullable: true })
    monounsaturatedFats: number;

    @Column('float', { nullable: true })
    polyunsaturatedFats: number;

    @Column('float', { nullable: true })
    omega3: number;

    @Column('float', { nullable: true })
    omega6: number;

    @Column('float', { nullable: true })
    transFats: number;

    @Column('float')
    weight: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    addedBy: User;
}
