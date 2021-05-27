import { NextFunction, Request, Response } from 'express';
import CategoryModel from './model';
import CategoryService from './service';
import IErrorResponse from '../../common/IErrorResponse.interface';

class CategoryController {
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const categories = await this.categoryService.getAll();

        res.send(categories);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        const categoryId: number = +id;

        if (categoryId < 1) {
            res.sendStatus(400);
            return;
        }

        const data: CategoryModel|IErrorResponse|null = await this.categoryService.getById(categoryId);
        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof CategoryModel) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }
}

export default CategoryController;
