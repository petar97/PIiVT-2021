import PhoneModel from '../../../03-backend/src/components/phone/model';
import api from '../api/api';
import EventRegister from '../api/EventRegister';

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
                console.log("res.data:", res.data);
                resolve(res.data as PhoneModel[]);
            });
        });
    }
}