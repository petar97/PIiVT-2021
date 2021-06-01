import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class Photo implements IModel {
    photoId: number;
    imagePath: string;
}

class FeatureValue implements IModel {
    featureId: number;
    name?: string;
    value: string;
}

class PhoneModel implements IModel {
    phoneId: number;
    createdAt: Date;
    title: string;
    description: string;
    price: number;
    categories?: CategoryModel[] = [];
    photos: Photo[] = [];
    features: FeatureValue[] = [];
}

export default PhoneModel;
export { Photo as PhonePhoto };
export { FeatureValue as PhoneFeatureValue };
