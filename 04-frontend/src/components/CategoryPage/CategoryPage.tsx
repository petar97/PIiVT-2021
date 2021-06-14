import { Link } from 'react-router-dom';
import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import CategoryService from '../../services/CategoryService';
import PhoneService from '../../services/PhoneService';
import CategoryModel from '../../../../03-backend/src/components/category/model';
import PhoneModel from '../../../../03-backend/src/components/phone/model';
import FeatureModel from '../../../../03-backend/src/components/feature/model';

class CategoryPageProperties extends BasePageProperties {
    match?: {
        params: {
            cid: string;
        }
    }
}

class CategoryPageState {
    title: string = "";
    categories: CategoryModel[] = [];
    features: FeatureModel[] = [];
    showBackButton: boolean = false;
    phones: PhoneModel[] = [];
}

export default class CategoryPage extends BasePage<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: CategoryPageProperties) {
        super(props);

        this.state = {
            title: "Loading...",
            categories: [],
            features: [],
            showBackButton: false,
            phones: [],
        };
    }

    private getCategoryId(): number|null {
        const cid = this.props.match?.params.cid;
        return cid ? +(cid) : null;
    }

    private getCategoryData() {
        const cId = this.getCategoryId();
        this.state.categories = [];
        this.state.features = [];
        this.state.phones = [];

        if (cId === null) {
            this.setState({
                categories: [],
            });
            this.apiGetTopLevelCategories();
        } else {
            this.apiGetCategory(cId);
            this.apiGetPhones(cId);
        }
    }

    private apiGetTopLevelCategories() {
        CategoryService.getTopLevelCategories()
        .then(categories => {
            if (categories.length === 0) {
                return this.setState({
                    title: "No categories found",
                    categories: [],
                    showBackButton: true,
                    parentCategoryId: null,
                });
            }

            this.setState({
                title: "All categories",
                categories: categories,
                showBackButton: false,
            });
        })
    }

    private apiGetCategory(cId: number) {
        CategoryService.getCategoryById(cId)
        .then(result => {
            if (result === null) {
                return this.setState({
                    title: "Category not found",
                    categories: [],
                    showBackButton: true,
                });
            }

            this.setState({
                title: result.name,
                features: result.features,
                showBackButton: true,
            });
        })
    }

    private apiGetPhones(cId: number) {
        PhoneService.getPhonesByFeatureId(cId)
        .then(result => {
            this.setState({
                phones: result,
            });
        });
    }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(prevProps: CategoryPageProperties, prevState: CategoryPageState) {
        if (prevProps.match?.params.cid !== this.props.match?.params.cid) {
            this.getCategoryData();
        }
    }

    renderMain(): JSX.Element {
        return (
            <>
                <h1>
                    {
                        this.state.showBackButton
                        ? (
                            <>
                                <Link to={ "/category/" }>
                                    &lt; Back
                                </Link> |
                            </>
                        )
                        : ""
                    }
                    { " " + this.state.title }
                </h1>
                {
                    this.state.categories.length > 0
                    ? (
                        <>
                            <ul>
                                {
                                    this.state.categories.map(
                                        catategory => (
                                            <li key={ "subcategory-link-" + catategory.categoryId }>
                                                <Link to={ "/category/" + catategory.categoryId }>
                                                    { catategory.name }
                                                </Link>
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </>
                    ) : ""
                }

                {
                    this.state.features.length > 0
                    ? (
                        <>
                            <ul>
                                {
                                    this.state.features.map(
                                        feature => (
                                            <li key={ "feature-link-" + feature.featureId }>
                                                <Link to={ "/feature/" + feature.featureId + "/phone" }>
                                                    { feature.name }
                                                </Link>
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </>
                    ) : ""
                }
            </>
        );
    }
}