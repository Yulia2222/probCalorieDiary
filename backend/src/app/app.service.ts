import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class AppService {
    // private clientId = 'e2e00ca9d6334441b2f5339326220423';
    // private clientSecret = '2a4c51a32af64dc99eca7cce9c80d2b7';
    //
    // async getAccessToken(): Promise<string> {
    //     const url = 'https://oauth.fatsecret.com/connect/token';
    //
    //     const data = qs.stringify({
    //         grant_type: 'client_credentials',
    //         scope: 'premier',
    //     });
    //
    //     try {
    //         const response = await axios.post(url, data, {
    //             auth: {
    //                 username: this.clientId,
    //                 password: this.clientSecret,
    //             },
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //         });
    //
    //         return response.data.access_token;
    //     } catch (error) {
    //         console.error('Ошибка при получении токена:', error.message);
    //         throw new HttpException('Failed to get access token', HttpStatus.BAD_REQUEST);
    //     }
    // }
    //
    // async getFoods(foodName: string) {
    //     const accessToken = await this.getAccessToken();
    //     const url = 'https://platform.fatsecret.com/rest/foods/search/v1';
    //
    //     try {
    //         const { data } = await axios.get(url, {
    //             params: {
    //                 search_expression: foodName,
    //                 max_results: 1,
    //                 format: 'json',
    //             },
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         });
    //
    //         const food = data.foods?.food || null;
    //
    //         if (food) {
    //             return {
    //                 name: food.food_name,
    //                 description: food.food_description,
    //             };
    //         } else {
    //             throw new HttpException('No food found', HttpStatus.NOT_FOUND);
    //         }
    //     } catch (error) {
    //         console.error('Ошибка при получении продуктов:', error.response?.data || error.message);
    //         throw new HttpException(
    //             'Failed to fetch foods',
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }
}
