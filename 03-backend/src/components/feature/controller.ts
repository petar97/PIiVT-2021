import { NextFunction, Request, Response } from 'express';
import FeatureService from './service';
import FeatureModel from './model';
import { IAddFeature, IAddFeatureValidator } from './dto/AddFeature';
import { IEditFeature, IEditFeatureValidator } from './dto/EditFeature';
import BaseController from '../../common/BaseController';

class FeatureController extends BaseController {
    public async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        const featureId: number = +id;

        if (featureId < 1) {
            res.sendStatus(400);
            return;
        }

        const result = await this.services.featureService.getById(featureId, {
            loadCategory: true,
        });
    
        if (result === null) {
            res.sendStatus(404);
            return;
        }

        if (result instanceof FeatureModel) {
            res.send(result);
            return;
        }

        res.status(500).send(result);
    }

    public async getAllInCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId: number = +(req.params.cid);
        res.send(await this.services.featureService.getAllByCategoryId(categoryId, {
            loadCategory: true,
        }));
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const item = req.body;

        if(!IAddFeatureValidator(item)) {
            res.status(400).send(IAddFeatureValidator.errors);
            return;
        }

        res.send(await this.services.featureService.add(item as IAddFeature, {
            loadCategory: true,
        }));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const featureId: number = +(req.params.id);

        if (featureId < 1) {
            res.sendStatus(400);
            return;
        }

        if(!IEditFeatureValidator(req.body)) {
            res.status(400).send(IEditFeatureValidator.errors);
            return;
        }

        const result = await this.services.featureService.getById(featureId);
    
        if (result === null) {
            res.sendStatus(404);
            return;
        }

        if (!(result instanceof FeatureModel)) {
            res.status(500).send(result);
            return;
        }


        res.send(await this.services.featureService.edit(featureId, req.body as IEditFeature, {
            loadCategory: true,
        }));
    }

    public async delete(req: Request, res: Response) {
        const featureId = +(req.params.id);
        if (featureId < 1) return res.sendStatus(400);

        const result = await this.services.featureService.getById(featureId);
        if (result === null) return res.sendStatus(404);
        
        res.send(await this.services.featureService.deleteById(featureId));
    }
}

export default FeatureController;