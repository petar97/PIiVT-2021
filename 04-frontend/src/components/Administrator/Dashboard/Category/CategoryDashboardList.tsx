import BasePage from '../../../BasePage/BasePage';
import { Link } from 'react-router-dom';
import CategoryService from '../../../../services/CategoryService';
import { isRoleLoggedIn } from '../../../../api/api';
import EventRegister from '../../../../api/EventRegister';
import CategoryModel from '../../../../../../03-backend/src/components/category/model';
import FeatureModel from '../../../../../../03-backend/src/components/feature/model';

interface CategoryDashboardListState {
    categories: CategoryModel[];
    features: FeatureModel[];
}

export default class CategoryDashboardList extends BasePage<{}> {
    state: CategoryDashboardListState;

    constructor(props: any) {
        super(props);

        this.state = {
            categories: [],
            features: [],
        }
    }

    componentDidMount() {
        isRoleLoggedIn("administrator")
        .then(loggedIn => {
            if (!loggedIn) return EventRegister.emit("AUTH_EVENT", "force_login");
            this.loadCategories();
        });
    }

    loadCategories() {
        CategoryService.getTopLevelCategories()
        .then(categories => {
            this.setState({
                categories: categories,
            });
        });
    }

    renderMain(): JSX.Element {
        return (
            <>
                <h1>Categories</h1>
                <div>
                    <Link to="/dashboard/category/add" className="btn btn-sm btn-link">
                        Add new category
                    </Link>
                </div>
                <div>
                    { this.renderCategoryGroup(this.state.categories) }
                </div>
            </>
        );
    }

    private renderCategoryGroup(categories: CategoryModel[]): JSX.Element {
        return (
            <ul>
                {
                    categories.map(category => (
                        <li key={ "category-list-item-" + category.categoryId }>
                            <b>{ category.name }</b> { this.renderCategoryOptions(category) }
                        </li>
                    ))
                }
            </ul>
        );
    }

    private renderCategoryOptions(category: CategoryModel|FeatureModel): JSX.Element {
        return (
            <>
                <Link to={ "/dashboard/category/edit/" + category.categoryId }
                    className="btn btn-sm btn-link" title="Click here to edit this category">
                    Edit
                </Link>

                <Link to={ "/dashboard/category/features/" + category.categoryId + "/list" }
                    className="btn btn-sm btn-link">
                    List features
                </Link>
            </>
        );
    }
}