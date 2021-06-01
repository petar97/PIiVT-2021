import CategoryService from '../components/category/service';
import FeatureService from '../components/feature/service';
import PhoneService from '../components/phone/service';

export default interface IServices {
    categoryService: CategoryService;
    featureService: FeatureService;
    phoneService: PhoneService;
}
