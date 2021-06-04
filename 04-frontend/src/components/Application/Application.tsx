import React from 'react';
import './Application.sass';
import { Container } from 'react-bootstrap';
import TopMenu from '../TopMenu/TopMenu';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import CategoryPage from '../CategoryPage/CategoryPage';

export default function Application() {
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

            <Route path="/category" component={ CategoryPage } />

            <Route path="/contact">
              Contact information
            </Route>
          </Switch>
        </div>

        <div>
            &copy; 2021...
        </div>
      </Container>
    </BrowserRouter>
  );
}
