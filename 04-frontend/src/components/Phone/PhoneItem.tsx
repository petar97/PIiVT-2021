import { Link } from "react-router-dom";
import { Col, Card, Row } from 'react-bootstrap';
import * as path from "path";
import PhoneModel from "../../../../03-backend/src/components/phone/model";
import { AppConfiguration } from "../../config/app.config";

interface PhoneItemProperties {
    phone: PhoneModel;
}

function getThumbPath(url: string): string {
    const directory = path.dirname(url);
    const extension = path.extname(url);
    const filename  = path.basename(url, extension);
    return directory + "/" + filename + "-thumb" + extension;
}

export default function PhoneItem(props: PhoneItemProperties) {
    return (
        <Col xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } className="mt-3">
            <Card>
                <Link to={ "/phone/" + props.phone.phoneId }>
                    <Card.Img variant="top" src={ getThumbPath(AppConfiguration.API_URL + "/" + props.phone.photos[0]?.imagePath) } />
                </Link>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title>
                                <Link to={ "/phone/" + props.phone.phoneId }>
                                    { props.phone.title }
                                </Link>
                            </Card.Title>
                        </Col>

                        <Col className="text-center">
                            <Card.Text as="div" className="h5">
                                <b>&euro; { props.phone.price }</b>
                            </Card.Text>
                        </Col>
                    </Row>
                    
                    <Card.Text as="div" className="text-truncate">
                        { props.phone.description }
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}