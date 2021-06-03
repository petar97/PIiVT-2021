import BaseService from '../../common/BaseService';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import PhoneModel, { PhoneFeatureValue, PhonePhoto } from './model';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddPhone, IUploadedPhoto } from './dto/IAddPhone';
import { IEditPhone } from './dto/IEditPhone';
import * as fs from "fs";
import Config from '../../config/dev';
import * as path from 'path';

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
            items.push({
                categoryId: +(row?.category_id),
                name: row?.name,
            });
        }

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
                        data?.title,
                        data.description,
                        data.price
                    ]
                ).then(async (res: any) => {
                    const newPhoneId: number = +(res[0]?.insertId);

                    const promises = [];

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

    private editPhone(phoneId: number, data: IEditPhone) {
        return this.db.execute(
            `UPDATE
                phone
            SET
                title = ?,
                description = ?,
                price = ?
            WHERE
                phone_id = ?;`,
            [
                data.title,
                data.description,
                data.price,
                phoneId,
            ]
        );
    }

    private deletePhoneFeature(phoneId: number, featureId: number) {
        return this.db.execute(
            `DELETE FROM
                phone_feature
            WHERE
                phone_id = ? AND
                feature_id = ?;`,
            [
                phoneId,
                featureId,
            ]
        );
    }

    private insertOrUpdateFeatureValue(phoneId: number, fv: PhoneFeatureValue) {
        return this.db.execute(
            `INSERT
                phone_feature
            SET
                phone_id = ?,
                feature_id = ?,
                value = ?
            ON DUPLICATE KEY
            UPDATE
                value = ?;`,
            [
                phoneId,
                fv.featureId,
                fv.value,
                fv.value,
            ],
        );
    }

    public async edit(phoneId: number, data: IEditPhone): Promise<PhoneModel|null|IErrorResponse> {
        return new Promise<PhoneModel|null|IErrorResponse>(async resolve => {
            const currentPhone = await this.getById(phoneId, {
                loadFeatures: true,
            });

            if (currentPhone === null) {
                return resolve(null);
            }

            const rollbackAndResolve = async (error) => {
                await this.db.rollback();
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            }

            this.db.beginTransaction()
                .then(() => {
                    this.editPhone(phoneId, data)
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Phone: " + error?.sqlMessage,
                        });
                    });
                })
                .then(async () => {
                    const willHaveFeatures = data.features.map(fv => fv.featureId);
                    const currentFeatures  = (currentPhone as PhoneModel).features.map(f => f.featureId);

                    for (const currentFeature of currentFeatures) {
                        if (!willHaveFeatures.includes(currentFeature)) {
                            this.deletePhoneFeature(phoneId, currentFeature)
                            .catch(error => {
                                rollbackAndResolve({
                                    errno: error?.errno,
                                    sqlMessage: `Delete feature ID(${currentFeature}): ${error?.sqlMessage}`,
                                });
                            });
                        }
                    }
                })
                .then(async () => {
                    for (const fv of data.features) {
                        this.insertOrUpdateFeatureValue(phoneId, fv)
                        .catch(error => {
                            rollbackAndResolve({
                                errno: error?.errno,
                                sqlMessage: `Add/edit feature ID(${fv.featureId}): ${error?.sqlMessage}`,
                            });
                        });
                    }
                })
                .then(async () => {
                    this.db.commit()
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: `Save changes: ${error?.sqlMessage}`,
                        });
                    });
                })
                .then(async () => {
                    resolve(await this.getById(phoneId, {
                        loadCategories: true,
                        loadFeatures: true,
                        loadPhotos: true,
                    }));
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(phoneId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse>(async resolve => {
            const currentPhone = await this.getById(phoneId, {
                loadFeatures: true,
                loadPhotos: true,
            });

            if (currentPhone === null) {
                return resolve(null);
            }

            this.db.beginTransaction()
                .then(async () => {
                    if (await this.deletePhoneFeatureValues(phoneId)) return;
                    throw { errno: -1003, sqlMessage: "Could not delete phone feature values.", };
                })
                .then(async () => {
                    const filesToDelete = await this.deletePhonePhotoRecords(phoneId);

                    if (filesToDelete.length !== 0) return filesToDelete;
                    throw { errno: -1005, sqlMessage: "Could not delete phone photo records.", };
                })
                .then(async (filesToDelete) => {
                    if (await this.deletePhoneRecord(phoneId)) return filesToDelete;
                    throw { errno: -1006, sqlMessage: "Could not delete the phone records.", };
                })
                .then(async (filesToDelete) => {
                    await this.db.commit();
                    return filesToDelete;
                })
                .then((filesToDelete) => {
                    this.deletePhonePhotosAndResizedVersion(filesToDelete);
                })
                .then(() => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "Phone deleted!",
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
    }

    private async deletePhoneFeatureValues(phoneId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM phone_feature WHERE phone_id = ?;`,
                [ phoneId ]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
    }

    private async deletePhonePhotoRecords(phoneId: number): Promise<string[]> {
        return new Promise<string[]>(async resolve => {
            const [ rows ] = await this.db.execute(
                `SELECT image_path FROM photo WHERE phone_id = ?;`,
                [ phoneId ]
            );

            if (!Array.isArray(rows) || rows.length === 0) return resolve([]);

            const filesToDelete = rows.map(row => row?.image_path);

            this.db.execute(
                `DELETE FROM photo WHERE phone_id = ?;`,
                [ phoneId ]
            )
            .then(() => resolve(filesToDelete))
            .catch(() => resolve([]))

            resolve(filesToDelete);
        });
    }

    private async deletePhoneRecord(phoneId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM phone WHERE phone_id = ?;`,
                [ phoneId ]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
    }

    private deletePhonePhotosAndResizedVersion(filesToDelete: string[]) {
        try {
            for (const fileToDelete of filesToDelete) {
                fs.unlinkSync(fileToDelete);

                const pathParts = path.parse(fileToDelete);

                const directory = pathParts.dir;
                const filename  = pathParts.name;
                const extension = pathParts.ext;

                for (const resizeSpecification of Config.fileUpload.photos.resizes) {
                    const resizedImagePath = directory + "/" +
                                             filename +
                                             resizeSpecification.sufix +
                                             extension;

                    fs.unlinkSync(resizedImagePath);
                }
            }
        } catch (e) { }
    }

    public async deletePhonePhoto(phoneId: number, photoId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse|null>(async resolve => {
            const phone = await this.getById(phoneId, {
                loadPhotos: true,
            });

            if (phone === null) {
                return resolve(null);
            }

            const filteredPhotos = (phone as PhoneModel).photos.filter(p => p.photoId === photoId);

            if (filteredPhotos.length === 0) {
                return resolve(null);
            }

            const photo = filteredPhotos[0];

            this.db.execute(
                `DELETE FROM photo WHERE photo_id = ?;`,
                [ photo.photoId ]
            )
            .then(() => {
                this.deletePhonePhotosAndResizedVersion([
                    photo.imagePath
                ]);

                resolve({
                    errorCode: 0,
                    errorMessage: "Photo deleted.",
                });
            })
            .catch(error => resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }))
        });
    }
}

export default PhoneService;
