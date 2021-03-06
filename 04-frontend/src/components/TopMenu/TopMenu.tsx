import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class TopMenuProperties {
    currentMenuType: "administrator" | "visitor" = "visitor";
}

export default class TopMenu extends React.Component<TopMenuProperties> {
    render() {
        if (this.props.currentMenuType === "visitor") {
            return (
                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/">Phones</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/category">Categories</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/contact">Contact</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/login">Admin Login</Link>
                    </Nav.Item>
                </Nav>
            );
        }

        if (this.props.currentMenuType === "administrator") {
            return (
                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/">Phones</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/dashboard/category">Categories</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/dashboard/phone/new">Add New Phone</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/logout">Logout</Link>
                    </Nav.Item>
                </Nav>
            );
        }
    }
}