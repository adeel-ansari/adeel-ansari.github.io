// App.js
import React, { useEffect, useState, Component } from 'react';
import './App.css';
import NavigationBar from './components/Navigation/NavigationBar';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Tabview from './components/Tabview/Tabview';
import OntologyHome from './components/Ontology/OntologyHome';
import Home from './components/Home/Home';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Layout } from './components/Layout/Layout';

function App() {

  const [data] = useState([]);

  return (
    <BrowserRouter>
      <header>
        <NavigationBar />
      </header>
      <br>
      </br>
      <React.Fragment>
        <Layout>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/ontologies' component={OntologyHome} />
            <Route path='/ontologyDetail' component={Tabview} />
          </Switch>
        </Layout>
      </React.Fragment>
      <br />
    </BrowserRouter>

  );
}

export default App;
