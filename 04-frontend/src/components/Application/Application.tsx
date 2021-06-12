import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import TopMenu from '../TopMenu/TopMenu';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import CategoryPage from '../CategoryPage/CategoryPage';
import ContactPage from '../ContactPage/ContactPage';
import AdministratorLogin from '../AdministratorLogin/AdministratorLogin';
import AdministratorLogout from '../AdministratorLogout/AdministratorLogout';
import EventRegister from '../../api/EventRegister';
import api from '../../api/api';
import FeaturePage from '../FeaturePage/FeaturePage';
import PhonePage from '../Phone/PhonePage';

class ApplicationState {
  authorizedRole: "administrator" | "visitor" = "visitor";
}

export default class Application extends React.Component {
  state: ApplicationState;

  constructor(props: any) {
    super(props);

    this.state = {
      authorizedRole: "visitor",
    };
  }

  componentDidMount() {
    EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));

    api("get", "/auth/administrator/ok", "administrator")
      .then(res => {
        if (res?.data === "OK") {
          this.setState({
            authorizedRole: "administrator",
          });
          EventRegister.emit("AUTH_EVENT", "administrator_login");
        }
      })
      .catch(() => {});
  }

  componentWillUnmount() {
    EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
  }

  private authEventHandler(message: string) {
    console.log('Application: authEventHandler: ', message);

    if (message === "force_login" || message === "administrator_logout") {
      return this.setState({ authorizedRole: "visitor" });
    }

    if (message === "administrator_login") {
      return this.setState({ authorizedRole: "administrator" });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Container className="Application">
          <div className="Application-header">
            Front-end aplikacije
          </div>

          <TopMenu currentMenuType={ this.state.authorizedRole } />

          <div className="Application-body">
            <Switch>
              <Route exact path="/" component={ HomePage } />

              <Route path="/category/:cid?"
                     render={
                       (props: any) => {
                         return ( <CategoryPage {...props} /> );
                       }
                     } />

              <Route path="/feature/:fid?/phone"
                      render={
                        (props: any) => {
                          return ( <FeaturePage {...props} /> );
                        }
                     } />

              <Route path="/phone/:pid" component={ PhonePage } />

              <Route path="/contact">
                <ContactPage
                  title="Our location in Belgrade"
                  address="Slučajna 42, 11000 Beograd, Srbija"
                  phone="+381 60 123 456" />
              </Route>

              <Route path="/profile">
                My profile
              </Route>

              <Route path="/administrator/login" component={AdministratorLogin} />
              <Route path="/administrator/logout" component={AdministratorLogout} />
            </Switch>
          </div>

          <div>
              &copy; 2021...
          </div>
        </Container>
      </BrowserRouter>
    );
  }
}
