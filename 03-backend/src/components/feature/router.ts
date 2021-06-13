import * as express from 'express';
import FeatureController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class FeatureRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const featureController: FeatureController = new FeatureController(resources);

        application.get("/feature/:id",           featureController.getById.bind(featureController));
        application.get("/category/:cid/feature", featureController.getAllInCategory.bind(featureController));
        
        application.post("/feature",
            AuthMiddleware.getVerifier("administrator"),
            featureController.add.bind(featureController)
        );

        application.put("/feature/:id",
            AuthMiddleware.getVerifier("administrator"),
            featureController.edit.bind(featureController)
        );

        application.delete("/feature/:id",
            AuthMiddleware.getVerifier("administrator"),
            featureController.delete.bind(featureController)
        );
    }
}