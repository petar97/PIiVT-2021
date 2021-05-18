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
}

export default CategoryService;
