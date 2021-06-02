import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import PhoneController from './controller';
import IRouter from '../../common/IRouter.interface';

export default class PhoneRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        const phoneController = new PhoneController(resources);
        application.get('/phone/:id', phoneController.getById.bind(phoneController));
        application.post('/phone/',   phoneController.add.bind(phoneController));
        application.put('/phone/:id',   phoneController.edit.bind(phoneController));
    }
}
