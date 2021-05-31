import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import BaseService from "../../services/BaseService";
import FeatureModel from './model';
import * as mysql2 from 'mysql2/promise';
import CategoryService from '../category/service';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddFeature } from "./dto/AddFeature";
import { IEditFeature } from "./dto/EditFeature";

class FeatureModelAdapterOptions implements IModelAdapterOptions {
    loadCategory: boolean = false;
}

class FeatureService extends BaseService<FeatureModel> {
    private categoryService: CategoryService;

    constructor(db: mysql2.Connection) {
        super(db);

        this.categoryService = new CategoryService(this.db);
    }

    protected async adaptModel(
        data: any,
        options: Partial<FeatureModelAdapterOptions>    
    ): Promise<FeatureModel> {
        const item: FeatureModel = new FeatureModel();
        
        item.featureId  = +(data?.feature_id);
        item.name       = data?.name;
        item.categoryId = +(data?.category_id);

        if (options.loadCategory && item.categoryId) {
            const result = await this.categoryService.getById(item.categoryId);

            if (result instanceof CategoryModel) {
                item.category = result;
            }
        }

        return item;
    }

    public async getById(
        featureId: number,
        options: Partial<FeatureModelAdapterOptions> = { },
    ): Promise<FeatureModel|IErrorResponse|null> {
        return await this.getByIdFromTable("feature", featureId, options);
    }

    public async getAllByCategoryId(
        categoryId: number,
        options: Partial<FeatureModelAdapterOptions> = { },
    ): Promise<FeatureModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable("feature", "category_id", categoryId, options);
    }

    public async add(
        data: IAddFeature,
        options: Partial<FeatureModelAdapterOptions> = { },
    ): Promise<FeatureModel|IErrorResponse> {
        return new Promise<FeatureModel|IErrorResponse>(resolve => {
            const sql = `INSERT feature SET name = ?, category_id = ?;`;
            this.db.execute(sql, [data.name, data.categoryId])
                .then(async result => {
                    const insertInfo: any = result[0];
                    const newId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async edit(
        featureId: number,
        data: IEditFeature,
        options: Partial<FeatureModelAdapterOptions> = { },   
    ): Promise<FeatureModel|IErrorResponse> {
        return new Promise<FeatureModel|IErrorResponse>(resolve => {
            const sql = `UPDATE feature SET name = ? WHERE feature_id = ?;`;
            this.db.execute(sql, [data.name, featureId])
                .then(async result => {
                    resolve(await this.getById(featureId, options));
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

export default FeatureService;
