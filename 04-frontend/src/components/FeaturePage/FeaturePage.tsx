import BasePage, { BasePageProperties } from "../BasePage/BasePage";
import { Link } from 'react-router-dom';
import FeatureModel from "../../../../03-backend/src/components/feature/model";
import PhoneModel from "../../../../03-backend/src/components/phone/model";
import CategoryService from "../../services/CategoryService";
import PhoneService from "../../services/PhoneService";
import FeatureService from "../../services/FeatureService";
import { CardDeck } from 'react-bootstrap';
import PhoneItem from '../Phone/PhoneItem';

class FeaturePageProperties extends BasePageProperties {
    match?: {
        params: {
            fid: string;
        }
    }
}

class FeaturePageState {
    title: string = "";
    showBackButton: boolean = true;
    features: FeatureModel[] = [];
    phones: PhoneModel[] = [];
}

export default class FeaturePage extends BasePage<FeaturePageProperties> {
    state: FeaturePageState;
    
    constructor(props: FeaturePageProperties) {
        super(props);

        this.state = {
            title: "Loading...",
            showBackButton: true,
            features: [],
            phones: [],
        };
    }

    private getFeatureId(): number|null {
        const fid = this.props.match?.params.fid;
        return fid ? +(fid) : null;
    }

    private getCategoryData() {
        const fId = this.getFeatureId();
        this.state.features = [];
        this.state.phones = [];

        if (fId === null) {
            this.setState({
                features: [],
            });
            this.apiGetTopLevelCategories();
        } else {
            this.apiGetFeature(fId);
            this.apiGetPhones(fId);
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

    private apiGetFeature(fId: number) {
        FeatureService.getFeatureById(fId)
        .then(result => {
            if (result === null) {
                return this.setState({
                    title: "Feature not found",
                    features: [],
                    showBackButton: true,
                });
            }

            this.setState({
                title: result.name,
                showBackButton: true,
                features: [
                    {
                        featureId: result.featureId,
                        name: result.name,
                        categoryId: result.categoryId
                    }
                ]
            });
        })
    }

    private apiGetPhones(fId: number) {
        PhoneService.getPhonesByFeatureId(fId)
        .then(result => {
            this.setState({
                phones: result,
            });
        });
    }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(prevProps: FeaturePageProperties, prevState: FeaturePageState) {
        if (prevProps.match?.params.fid !== this.props.match?.params.fid) {
            this.getCategoryData();
        }
    }

    renderMain(): JSX.Element {
        return(
            <>
                <h1>
                    {
                        this.state.showBackButton
                        ? (
                            <>
                                <Link to={ "/category/" + this.state.features[0]?.categoryId }>
                                    &lt; Back
                                </Link> | { this.state.title }
                            </>
                        )
                        : ""
                    }
                </h1>
                {
                    this.state.features.length > 1
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

                <CardDeck className="row">
                {
                    this.state.phones.map(phone => (
                        <PhoneItem key={ "phone-item-" + phone.phoneId } phone={ phone } />
                    ))
                }
                </CardDeck>
            </>
        );
    }
}