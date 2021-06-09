import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import TopMenu from '../TopMenu/TopMenu';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import CategoryPage from '../CategoryPage/CategoryPage';
import ContactPage from '../ContactPage/ContactPage';
import AdministratorLogin from '../AdministratorLogin/AdministratorLogin';
import AdministratorLogout from '../AdministratorLogin/AdministratorLogout';

export default function Application(props: any) {
  return (
    <BrowserRouter>
      <Container className="Application">
        <div className="Application-header">
          Front-end aplikacije
        </div>

        <TopMenu />

        <div className="Application-body">
          <Switch>
            <Route exact path="/" component={ HomePage } />

            <Route path="/category/:cid?"
                   render={
                     (props: any) => {
                       return ( <CategoryPage {...props} /> );
                     }
                   } />

            <Route path="/contact">
            <ContactPage
                title="Our location in Belgrade"
                address="Slučajna 42, 11000 Beograd, Srbija"
                phone="+381 60 123 456" />
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
