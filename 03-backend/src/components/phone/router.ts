import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import PhoneController from './controller';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class PhoneRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        const phoneController = new PhoneController(resources);
        application.get('/phone/:id', phoneController.getById.bind(phoneController));

        application.post(
            '/phone',
            AuthMiddleware.getVerifier("administrator"),
            phoneController.add.bind(phoneController)
        );

        application.put(
            '/phone/:id',
            AuthMiddleware.getVerifier("administrator"),
            phoneController.edit.bind(phoneController)
        );

        application.delete(
            '/phone/:id',
            AuthMiddleware.getVerifier("administrator"),
            phoneController.delete.bind(phoneController)
        );

        application.delete(
            '/phone/:aid/photo/:pid',
            AuthMiddleware.getVerifier("administrator"),
            phoneController.deletePhonePhoto.bind(phoneController)
        );

        application.post(
            '/phone/:id/photo',
            AuthMiddleware.getVerifier("administrator"),
            phoneController.addPhonePhotos.bind(phoneController)
        );
        
        application.get("/feature/:id/phone", phoneController.getAllByFeatureId.bind(phoneController));
        application.get("/phone", phoneController.getAllPhones.bind(phoneController));
    }
}
