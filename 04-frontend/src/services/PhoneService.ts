import PhoneModel from '../../../03-backend/src/components/phone/model';
import api, { apiAsForm } from '../api/api';
import EventRegister from '../api/EventRegister';

export interface IAddPhone {
    title: string;
    description: string;
    categoryId: number;
    price: number;

    features: Map<number, string>;

    images: File[];
}

export default class PhoneService {
    public static getPhoneById(phoneId: number): Promise<PhoneModel|null> {
        return new Promise<PhoneModel|null>(resolve => {
            api("get", "/phone/" + phoneId)
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve(null);
                }
                resolve(res.data as PhoneModel);
            });
        });
    }

    public static getPhonesByFeatureId(featureId: number): Promise<PhoneModel[]> {
        return new Promise<PhoneModel[]>(resolve => {
            api("get", "/feature/" + featureId + "/phone")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve([]);
                }
                resolve(res.data as PhoneModel[]);
            });
        });
    }

    public static getPhones(): Promise<PhoneModel[]> {
        return new Promise<PhoneModel[]>(resolve => {
            api("get", "/phone")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve([]);
                }
                resolve(res.data as PhoneModel[]);
            });
        });
    }

    public static addPhone(data: IAddPhone): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const features: {
                featureId: number;
                value: string;
            }[] = [];

            data.features.forEach((value, key) => {
                features.push({
                    featureId: key,
                    value: value,
                });
            });

            const formData = new FormData();
            formData.append("data", JSON.stringify({
                title: data.title,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                features: features,
            }));

            for (let image of data.images) {
                formData.append("image", image);
            }

            apiAsForm("post", "/phone", "administrator", formData)
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") EventRegister.emit("AUTH_EVENT", "force_login");

                    return resolve(false);
                }

                resolve(true);
            });
        });
    }
}