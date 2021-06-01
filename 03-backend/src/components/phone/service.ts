import BaseService from '../../common/BaseService';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import PhoneModel, { PhoneFeatureValue, PhonePhoto } from './model';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddPhone, IUploadedPhoto } from './dto/IAddPhone';

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

    public async add(
        data: IAddPhone,
        uploadedPhotos: IUploadedPhoto[],
    ): Promise<PhoneModel|IErrorResponse> {
        return new Promise<PhoneModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then(() => {
                this.db.execute(
                    `
                    INSERT phone
                    SET
                        title = ?,
                        description = ?,
                        price = ?;
                    `,
                    [
                        data.title,
                        data.description,
                        data.price
                    ]
                ).then(async (res: any) => {
                    const newPhoneId: number = +(res[0]?.insertId);

                    const promises = [];

                    promises.push(
                        this.db.execute(
                            `INSERT phone SET price = ?, phone_id = ?;`,
                            [data.price, newPhoneId]
                        )
                    );

                    for (const featureValue of data.features) {
                        promises.push(
                            this.db.execute(
                                `INSERT phone_feature
                                 SET phone_id = ?, feature_id = ?, value = ?;`,
                                [ newPhoneId, featureValue.featureId, featureValue.value, ]
                            ),
                        );
                    }

                    for (const uploadedPhoto of uploadedPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET phone_id = ?, image_path = ?;`,
                                [ newPhoneId, uploadedPhoto.imagePath, ]
                            ),
                        );
                    }

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.phoneService.getById(
                            newPhoneId,
                            {
                                loadCategories: true,
                                loadFeatures: true,
                                loadPhotos: true
                            }
                        ));
                    })
                    .catch(async error => {
                        await this.db.rollback();
    
                        resolve({
                            errorCode: error?.errno,
                            errorMessage: error?.sqlMessage
                        });
                    });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
            });
        });
    }
}

export default PhoneService;
