import {defineStore} from 'pinia';
import axios from "axios";

export const useMineralsStore = defineStore('minerals', {
    state: () => ({
        additionalNutrition: {
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
        }
    }),
    actions: {
        resetData(){
            return JSON.parse(JSON.stringify({
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
            }))
        },



        async recalculateAdditionalNutrition(userId:string[] | string, diaryDate:string) {
            const newAdditionalNutrition = this.resetData();
            try {
                const url = `http://localhost:8080/products/${userId}/diary`;
                const {data} = await axios.get(url, {
                    params: {date: diaryDate}
                });


                data.forEach((item: any) => {
                    Object.keys(newAdditionalNutrition).forEach((key) => {
                        newAdditionalNutrition[key] += item[key] || 0;
                    });
                });

                this.additionalNutrition = newAdditionalNutrition;
            } catch (error) {
                console.error('Ошибка при загрузке дневника питания:', error);
            }
        }


    },
});