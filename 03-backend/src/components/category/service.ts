import e = require("express");
import CategoryModel from "./model";

class CategoryService {
    public async getAll(): Promise<CategoryModel[]> {
        const lista: CategoryModel[] = [];

        lista.push({
            categoryId: 1,
            name: "Kategorija 1",
        });

        lista.push({
            categoryId: 2,
            name: "Kategorija 2",
        });

        return lista;
    }

    public async getById(categoryId: number): Promise<CategoryModel|null> {
        if (categoryId === 1 || categoryId === 2) {
            if (categoryId === 1) {
                return {
                    categoryId: 1,
                    name: "Kategorija 1",
                };
            }
            if (categoryId === 2) {
                return {
                    categoryId: 2,
                    name: "Kategorija 2",
                };
            }
        } else {
            return null;
        }
    }
}

export default CategoryService;
