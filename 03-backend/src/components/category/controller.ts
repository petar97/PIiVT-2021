import { NextFunction, Request, Response } from 'express';
import CategoryModel from './model';
import CategoryService from './service';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddCategory, IAddCategoryValidator } from './dto/AddCategory';

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

    async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddCategoryValidator(data)){
            res.status(400).send(IAddCategoryValidator.errors);
            return;
        }

        const result = await this.categoryService.add(data as IAddCategory);
        
        res.send(result);
    }
}

export default CategoryController;
