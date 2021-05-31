import * as express from 'express';
import FeatureService from './service';
import FeatureController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';

export default class FeatureRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const featureService: FeatureService = new FeatureService(resources.dbConnection);
        const featureController: FeatureController = new FeatureController(featureService);

        application.get("/feature/:id",           featureController.getById.bind(featureController));
        application.get("/category/:cid/feature", featureController.getAllInCategory.bind(featureController));
        application.post("/feature",              featureController.add.bind(featureController));
        application.put("/feature/:id",          featureController.edit.bind(featureController));
    }
}