import CategoryModel from "./model";
import * as mysql2 from 'mysql2/promise';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddCategory } from "./dto/AddCategory";
import BaseService from '../../services/BaseService';

class CategoryService extends BaseService<CategoryModel>{
    protected async adaptModel(row: any): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;

        return item;
    }

    public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
        return await this.getAllFromTable("category");
    }

    public async getById(categoryId: number): Promise<CategoryModel|IErrorResponse|null> {
        return await this.getByIdFromTable("category", categoryId);
    }

    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `INSERT category SET name = ?;`;
            this.db.execute(sql, [data.name])
                .then(async result => {
                    const insertInfo: any = result[0];

                    const newCategoryId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newCategoryId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }
}

export default CategoryService;
