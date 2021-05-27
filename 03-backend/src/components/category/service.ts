import CategoryModel from "./model";
import * as mysql2 from 'mysql2/promise';
import { resolve } from "path";
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddCategory } from "./dto/AddCategory";

class CategoryService {
    private db: mysql2.Connection;

    constructor(db: mysql2.Connection) {
        this.db = db;
    }

    protected async adaptModel(row: any): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;

        return item;
    }

    public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
        return new Promise<CategoryModel[]|IErrorResponse>(async (resolve) => {
            const sql: string = "SELECT * FROM category;";
            this.db.execute(sql)
                .then(async result => {
                    const rows = result[0];
                    const lista: CategoryModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(await this.adaptModel(row));
                        }
                    }
                    
                    resolve(lista);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async getById(categoryId: number): Promise<CategoryModel|IErrorResponse|null> {
        return new Promise<CategoryModel|IErrorResponse|null>(async (resolve) => {
            const sql: string = "SELECT * FROM category WHERE category_id = ?;";
            this.db.execute(sql, [categoryId])
                .then(async result => {
                    const rows = result[0];

                    if (!Array.isArray(rows)) {
                        resolve(null);
                        return;
                    }
        
                    if (rows.length === 0) {
                        resolve(null);
                        return;
                    }
        
                    resolve(await this.adaptModel(rows[0]));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
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
