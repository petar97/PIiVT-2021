import api from '../api/api';
import CategoryModel from '../../../03-backend/src/components/category/model';

export default class CategoryService {
    public static getTopLevelCategories(): Promise<CategoryModel[]> {
        return new Promise<CategoryModel[]>(resolve => {
            api("get", "/category")
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                }

                resolve(res.data as CategoryModel[]);
            });
        });
    }

    public static getCategoryById(categoryId: number): Promise<CategoryModel|null> {
        return new Promise<CategoryModel|null>(resolve => {
            api("get", "/category/" + categoryId)
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve(null);
                }

                resolve(res.data as CategoryModel);
            });
        });
    }
}