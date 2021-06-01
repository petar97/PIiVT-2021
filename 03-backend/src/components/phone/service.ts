import BaseService from '../../common/BaseService';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import PhoneModel, { PhoneFeatureValue, PhonePhoto } from './model';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.interface';

class PhoneModelAdapterOptions implements IModelAdapterOptions {
    loadCategories: boolean = false;
    loadFeatures: boolean = false;
    loadPhotos: boolean = false;
}

class PhoneService extends BaseService<PhoneModel> {
    protected async adaptModel(
        data: any,
        options: Partial<PhoneModelAdapterOptions>
    ): Promise<PhoneModel> {
        const item: PhoneModel = new PhoneModel();

        item.phoneId = +(data?.phone_id);
        item.title = data?.title;
        item.description = data?.description;
        item.createdAt = new Date(data?.created_at);
        item.price = +(data?.price);

        if (options.loadCategories) {
            item.categories = await this.getAllCategoriesByPhoneId(item.phoneId);
        }

        if (options.loadFeatures) {
            item.features = await this.getAllFeatureValuesByPhoneId(item.phoneId);
        }

        if (options.loadPhotos) {
            item.photos = await this.getAllPhotosByPhoneId(item.phoneId);
        }
        return item;
    }

    private async getAllCategoriesByPhoneId(phoneId: number): Promise<CategoryModel[]> {
        const sql = `
            SELECT
                phone_category.category_id,
                category.name
            FROM
                phone_category
            INNER JOIN category ON category.category_id = phone_category.category_id
            WHERE
                phone_category.phone_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ phoneId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: CategoryModel[] = [];


        for (const row of rows as any) {
            console.log(row);
            items.push({
                categoryId: +(row?.category_id),
                name: row?.name,
            });
        }

        console.log(items);
        return items;
    }

    private async getAllFeatureValuesByPhoneId(phoneId: number): Promise<PhoneFeatureValue[]> {
        const sql = `
            SELECT
                phone_feature.feature_id,
                phone_feature.value,
                feature.name
            FROM
                phone_feature
            INNER JOIN feature ON feature.feature_id = phone_feature.feature_id
            WHERE
                phone_feature.phone_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ phoneId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: PhoneFeatureValue[] = [];

        for (const row of rows as any) {
            items.push({
                featureId: +(row?.feature_id),
                name: row?.name,
                value: row?.value,
            });
        }

        return items;
    }

    private async getAllPhotosByPhoneId(phoneId: number): Promise<PhonePhoto[]> {
        const sql = `SELECT photo_id, image_path FROM photo WHERE phone_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ phoneId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        return rows.map(row => {
            return {
                photoId: +(row?.photo_id),
                imagePath: row?.image_path,
            }
        });
    }

    public async getById(
        phoneId: number,
        options: Partial<PhoneModelAdapterOptions> = {},
    ): Promise<PhoneModel|IErrorResponse|null> {
        return this.getByIdFromTable(
            "phone",
            phoneId,
            options,
        );
    }
}

export default PhoneService;