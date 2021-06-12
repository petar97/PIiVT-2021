import { Link } from 'react-router-dom';
import PhoneService from '../../services/PhoneService';
import BasePage, { BasePageProperties } from '../BasePage/BasePage';
import { Row, Col, Card } from 'react-bootstrap';
import * as path from "path";
import { AppConfiguration } from "../../config/app.config";
//import "./PhonePage.sass";
import PhoneModel from '../../../../03-backend/src/components/phone/model';

class PhonePageProperties extends BasePageProperties {
    match?: {
        params: {
            pid: string;
        }
    }
}

class PhonePageState {
    data: PhoneModel|null = null;
}

export default class PhonePage extends BasePage<PhonePageProperties> {
    state: PhonePageState;

    constructor(props: PhonePageProperties) {
        super(props);

        this.state = {
            data: null,
        }
    }

    private getPhoneId(): number {
        return Number(this.props.match?.params.pid);
    }

    private getPhoneData() {
        PhoneService.getPhoneById(this.getPhoneId())
        .then(res => {
            this.setState({
                data: res
            });
        })
    }

    componentDidMount() {
        this.getPhoneData();
    }

    componentDidUpdate(oldProps: PhonePageProperties) {
        if (oldProps.match?.params.pid !== this.props.match?.params.pid) {
            this.getPhoneData();
        }
    }

    getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-thumb" + extension;
    }

    renderMain(): JSX.Element {
        if (this.state.data === null) {
            return (
                <>
                    <h1>Phone not found</h1>
                    <p>The phone you are looking for does not exist.</p>
                </>
            );
        }

        const phone = this.state.data as PhoneModel;

        return (
            <>
                <h1>
                    <Link to={ "/feature/" + phone.features[0].featureId + "/phone" }>
                        &lt; Back
                    </Link> | { phone.title }
                </h1>

                <Row>
                    <Col xs={ 12 } md={ 8 }>
                        <Card className="mb-3">
                            <Row>
                                {
                                    phone.photos.map(photo => (
                                        <Col key={ "phone-photo-" + photo.photoId }
                                             xs={12} sm={6} md={4} lg={3}>
                                            <Card.Img variant="top"
                                                src={ this.getThumbPath(AppConfiguration.API_URL + "/" + photo.imagePath) } />
                                        </Col>
                                    ))
                                }
                            </Row>

                            <Card.Body>
                                <Card.Text as="div">
                                    <Row>
                                        <Col>
                                            <b className="h1">
                                                &euro; { phone.price.toFixed(2) }
                                            </b>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            { phone.description }
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={ 12 } md={ 4 }>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Features</b>
                                </Card.Title>
                                <Card.Text as="div">
                                    <table className="table table-hover table-sm">
                                        <tr>
                                            <th>Feature</th>
                                            <th>Value</th>
                                        </tr>
                                        {
                                            phone.features.map(af => (
                                                <tr key={ "table-phone-feature-value-" + af.featureId }>
                                                    <th>
                                                        { af.name }
                                                    </th>
                                                    <td>
                                                        { af.value }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </table>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}