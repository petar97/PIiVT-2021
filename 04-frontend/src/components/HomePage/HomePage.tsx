import BasePage from '../BasePage/BasePage';
import { CardDeck } from 'react-bootstrap';
import PhoneItem from '../Phone/PhoneItem';
import PhoneModel from '../../../../03-backend/src/components/phone/model';
import PhoneService from "../../services/PhoneService";

class HomePageState {
    phones: PhoneModel[] = [];
}

export default class HomePage extends BasePage<{}> {
    state: HomePageState= {
        phones: [],
    };

    private getPhones() {
        PhoneService.getPhones()
        .then(result => {
            this.setState({
                phones: result,
            });
        });
    }

    componentDidMount() {
        this.getPhones();
    }

    renderMain(): JSX.Element {
        return (
            <CardDeck className="row">
                {
                    this.state.phones.map(phone => (
                        <PhoneItem key={ "phone-item-" + phone.phoneId } phone={ phone } />
                    ))
                }
            </CardDeck>
        );
    }
}