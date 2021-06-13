import FeatureModel from '../../../03-backend/src/components/feature/model';
import api from '../api/api';

export default class FeatureService {
    public static getFeatureById(featureId: number): Promise<FeatureModel|null> {
        return new Promise<FeatureModel|null>(resolve => {
            api("get", "/feature/" + featureId)
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve(null);
                }

                resolve(res.data as FeatureModel);
            });
        });
    }

    public static editFeature(featureId: number, newName: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            api("put", "/feature/" + featureId, "administrator", { name: newName })
            .then(res => {
                if (res.status !== "ok") return resolve(false);
                if (res.data?.errorCode !== undefined) return resolve(false);
                resolve(true);
            })
        });
    }

    public static deleteFeature(featureId: number): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            api("delete", "/feature/" + featureId, "administrator")
            .then(res => {
                if (res.status !== "ok") return resolve(false);
                if (res.data?.errorCode !== 0) return resolve(false);
                resolve(true);
            });
        });
    }

    public static addFeature(name: string, categoryId: number): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            api("post", "/feature", "administrator", {
                name: name,
                categoryId: categoryId
            })
            .then(res => {
                if (res.status !== "ok") return resolve(false);
                if (res.data?.errorCode !== undefined) return resolve(false);
                resolve(true);
            })
        });
    }
}