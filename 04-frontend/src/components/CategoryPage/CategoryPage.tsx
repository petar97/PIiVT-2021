import axios from 'axios';
import { Link } from 'react-router-dom';
import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import CategoryModel from '../../../../03-backend/src/components/category/model';

class CategoryPageProperties extends BasePageProperties {
    match?: {
        params: {
            cid: string;
        }
    }
}

class CategoryPageState {
    title: string = "";
    subcategories: CategoryModel[] = [];
    showBackButton: boolean = false;
}

export default class CategoryPage extends BasePage<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: CategoryPageProperties) {
        super(props);

        this.state = {
            title: "Loading...",
            subcategories: [],
            showBackButton: false,
        };
    }

    private getCategoryId(): number|null {
        const cid = this.props.match?.params.cid;
        return cid ? +(cid) : null;
    }

    private getCategoryData() {
        const cId = this.getCategoryId();

        if (cId === null) {
            this.setState({
                subcategories: [],
            });
            this.apiGetTopLevelCategories();
        } else {
            this.apiGetCategory(cId);
        }
    }

    private apiGetTopLevelCategories() {
        axios({
            method: "get",
            baseURL: "http://localhost:40080",
            url: "/category",
            timeout: 10000,
            responseType: "text",
            headers: {
                Authorization: "Bearer FAKE-TOKEN"
            },
            // withCredentials: true,
            maxRedirects: 0,
        })
        .then(res => {
            if (!Array.isArray(res.data)) {
                throw new Error("Invalid data received.");
            }

            this.setState({
                title: "All categories",
                subcategories: res.data,
                showBackButton: false,
            });
        })
        .catch(err => {
            const errorMessage = "" + err;

            if (errorMessage.includes("404")) {
                this.setState({
                    title: "No categories found",
                    subcategories: [],
                });
            } else {
                this.setState({
                    title: "Unable to load categories",
                    subcategories: [],
                });
            }
        });
    }

    private apiGetCategory(cId: number) {
        axios({
            method: "get",
            baseURL: "http://localhost:40080",
            url: "/category/" + cId,
            timeout: 10000,
            responseType: "text",
            headers: {
                Authorization: "Bearer FAKE-TOKEN"
            },
            // withCredentials: true,
            maxRedirects: 0,
        })
        .then(res => {
            this.setState({
                title: res.data?.name,
                subcategories: res.data?.features,
                showBackButton: true,
            });
        })
        .catch(err => {
            const errorMessage = "" + err;

            if (errorMessage.includes("404")) {
                this.setState({
                    title: "Category not found",
                    subcategories: [],
                });
            } else {
                this.setState({
                    title: "Unable to load category data",
                    subcategories: [],
                });
            }
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
                                </Link>
                                |
                            </>
                        )
                        : ""
                    }
                    { this.state.title }
                </h1>
                {
                    this.state.subcategories.length > 0
                    ? (
                        <>
                            <ul>
                                {
                                    this.state.subcategories.map(
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
                    )
                    : ""
                }
            </>
        );
    }
}