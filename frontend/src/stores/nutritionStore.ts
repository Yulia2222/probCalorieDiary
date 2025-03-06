import {defineStore} from 'pinia';
import axios from 'axios';

export const useNutritionStore = defineStore('nutrition', {
    state: () => ({
        bmr: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        vitaminA: 0,
        vitaminB1: 0,
        vitaminB2: 0,
        vitaminB3: 0,
        vitaminB5: 0,
        vitaminB6: 0,
        vitaminB12: 0,
        vitaminB13: 0,
        vitaminB15: 0,
        vitaminC: 0,
        vitaminD: 0,
        vitaminE: 0,
        vitaminK: 0,
        vitaminP: 0,
        vitaminT: 0,
        calcium: 0,
        iron: 0,
        potassium: 0,
        copper: 0,
        manganese: 0,
        magnesium: 0,
        sodium: 0,
        sulfur: 0,
        silicon: 0,
        zinc: 0,
        selenium: 0,
        chromium: 0,
        iodine: 0,
        saturatedFats: 0,
        monounsaturatedFats: 0,
        polyunsaturatedFats: 0,
        omega3: 0,
        omega6: 0,
        transFats: 0,
        water: 0,
        fiber: 0,
    }),
    actions: {
        setBMR(value) {
            this.bmr = value;
        },
        setProtein(value) {
            this.protein = value;
        },
        setFat(value) {
            this.fat = value;
        },
        setCarbs(value) {
            this.carbs = value;
        },
        setVitaminA(value) {
            this.vitaminA = value;
        },
        setVitaminB1(value) {
            this.vitaminB1 = value;
        },
        setVitaminB2(value) {
            this.vitaminB2 = value;
        },
        setVitaminB3(value) {
            this.vitaminB3 = value;
        },
        setVitaminB5(value) {
            this.vitaminB5 = value;
        },
        setVitaminB6(value) {
            this.vitaminB6 = value;
        },
        setVitaminB12(value) {
            this.vitaminB12 = value;
        },
        setVitaminB13(value) {
            this.vitaminB13 = value;
        },
        setVitaminB15(value) {
            this.vitaminB15 = value;
        },
        setVitaminC(value) {
            this.vitaminC = value;
        },
        setVitaminD(value) {
            this.vitaminD = value;
        },
        setVitaminE(value) {
            this.vitaminE = value;
        },
        setVitaminK(value) {
            this.vitaminK = value;
        },
        setVitaminP(value) {
            this.vitaminP = value;
        },
        setVitaminT(value) {
            this.vitaminT = value;
        },
        setCalcium(value) {
            this.calcium = value;
        },
        setIron(value) {
            this.iron = value;
        },
        setPotassium(value) {
            this.potassium = value;
        },
        setCopper(value) {
            this.copper = value;
        },
        setManganese(value) {
            this.manganese = value;
        },
        setMagnesium(value) {
            this.magnesium = value;
        },
        setSodium(value) {
            this.sodium = value;
        },
        setSulfur(value) {
            this.sulfur = value;
        },
        setSilicon(value) {
            this.silicon = value;
        },
        setZinc(value) {
            this.zinc = value;
        },
        setSelenium(value) {
            this.selenium = value;
        },
        setChromium(value) {
            this.chromium = value;
        },
        setIodine(value) {
            this.iodine = value;
        },
        setSaturatedFats(value) {
            this.saturatedFats = value;
        },
        setMonounsaturatedFats(value) {
            this.monounsaturatedFats = value;
        },
        setPolyunsaturatedFats(value) {
            this.polyunsaturatedFats = value;
        },
        setOmega3(value) {
            this.omega3 = value;
        },
        setOmega6(value) {
            this.omega6 = value;
        },
        setTransFats(value) {
            this.transFats = value;
        },
        setWater(value) {
            this.water = value;
        },
        setFiber(value) {
            this.fiber = value;
        },

        calculateBMR(userData) {
            const {age, weight, height, gender, activityIndex, target} = userData;

            let baseBMR;
            if (gender === 'male') {
                baseBMR = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
            } else {
                baseBMR = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
            }

            const activityMultipliers = {
                1: 1.2,
                2: 1.375,
                3: 1.55,
                4: 1.725,
                5: 1.9,
            };

            const goalMultipliers = {
                Lose: 0.8,
                Maintain: 1,
                Gain: 1.2,
            };

            const activityMultiplier = activityMultipliers[activityIndex] || 1.2;
            let finalBMR = baseBMR * activityMultiplier;

            const goalMultiplier = goalMultipliers[target] || 1;
            finalBMR *= goalMultiplier;

            this.setBMR(Math.round(finalBMR));
            return Math.round(finalBMR);
        },

        calculateProtein(userData) {
            const {weight, target, activityIndex} = userData;
            const bmr = this.bmr;

            let proteinRatio = 1.5;

            if (target === 'Gain') {
                proteinRatio = 2.0;
            } else if (target === 'Lose') {
                proteinRatio = 1.2;
            }

            if (activityIndex && activityIndex > 3) {
                proteinRatio += 0.2;
            }

            const proteinAmount = weight * proteinRatio;
            this.setProtein(Math.round(proteinAmount));
            return Math.round(proteinAmount);
        },

        calculateFat(userData) {
            const {target} = userData;
            const bmr = this.bmr;

            let fatRatio = 0.25;

            if (target === 'Gain') {
                fatRatio = 0.3;
            } else if (target === 'Lose') {
                fatRatio = 0.2;
            }

            const fatCalories = bmr * fatRatio;
            const fatAmount = fatCalories / 9;
            this.setFat(Math.round(fatAmount));
            return Math.round(fatAmount);
        },

        calculateCarbs(userData) {
            const {target} = userData;
            const bmr = this.bmr;
            const proteinCalories = this.protein * 4;
            const fatCalories = this.fat * 9;
            const remainingCalories = bmr - (proteinCalories + fatCalories);

            let carbsRatio = 0.55;
            if (target === 'Gain') {
                carbsRatio = 0.6;
            } else if (target === 'Lose') {
                carbsRatio = 0.5;
            }

            const carbsAmount = remainingCalories * carbsRatio / 4;
            this.setCarbs(Math.round(carbsAmount));
            return Math.round(carbsAmount);
        },

        calculateAdditionalNutrients(userData) {
            const {age, gender, weight} = userData;

            let vitaminA = gender === 'male' ? 900 : 700;
            let vitaminC = gender === 'male' ? 90 : 75;
            let vitaminD = 15;
            let vitaminE = 15;
            let calcium = 1000;
            let iron = gender === 'male' ? 8 : 18;
            let zinc = gender === 'male' ? 11 : 8;
            let omega3 = gender === 'male' ? 1.6 : 1.1;
            let omega6 = gender === 'male' ? 17 : 12;
            let water = gender === 'male' ? 3700 : 2700;
            let fiber = gender === 'male' ? 38 : 25;
            let sf = gender === 'male' ? 30 : 20;

            if (age > 50) {
                calcium = 1200;
                vitaminD = 20;
            }
            if (age > 70) {
                vitaminB12 = 2.6;
            }

            let potassium = 33 * weight;

            this.setVitaminA(vitaminA);
            this.setVitaminB1(1.5);
            this.setVitaminB2(1.8);
            this.setVitaminB3(16);
            this.setVitaminB5(5);
            this.setVitaminB6(2);
            this.setVitaminB12(2.4);
            this.setVitaminC(vitaminC);
            this.setVitaminD(vitaminD);
            this.setVitaminE(vitaminE);
            this.setVitaminK(gender === 'male' ? 120 : 90);
            this.setCalcium(calcium);
            this.setIron(iron);
            this.setPotassium(potassium);
            this.setCopper(900);
            this.setManganese(gender === 'male' ? 2.3 : 1.8);
            this.setMagnesium(gender === 'male' ? 420 : 320);
            this.setSodium(1500);
            this.setZinc(zinc);
            this.setSelenium(55);
            this.setChromium(35);
            this.setIodine(150);
            this.setOmega3(omega3);
            this.setOmega6(omega6);
            this.setWater(water);
            this.setFiber(fiber);

            this.setVitaminB13(1);
            this.setVitaminB15(2);
            this.setVitaminP(40);
            this.setVitaminT(0);
            this.setSulfur(5);
            this.setSilicon(3.5);
            this.setSaturatedFats(sf);
            this.setMonounsaturatedFats(30);
            this.setPolyunsaturatedFats(15);
            this.setTransFats(2);
        },

        async initializeNutritionData(userId) {
            try {
                const response = await axios.get(`http://localhost:8080/users/${userId}`);
                const userData = response.data;

                this.calculateBMR(userData);
                this.calculateProtein(userData);
                this.calculateFat(userData);
                this.calculateCarbs(userData);
                this.calculateAdditionalNutrients(userData);
            } catch (error) {
                console.error("Ошибка при загрузке данных пользователя:", error);
            }
        },
    },
});