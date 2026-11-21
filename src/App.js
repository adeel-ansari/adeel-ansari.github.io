// App.js
import React, { useEffect, useState, Component } from 'react';
import './App.css';
import NavigationBar from './components/Navigation/NavigationBar';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Tabview from './components/Tabview/Tabview';
import OntologyHome from './components/Ontology/OntologyHome';
import Home from './components/Home/Home';
// HashRouter keeps routes working on GitHub Pages, which has no server-side
// fallback for client routes (a refresh or direct link to /ontologies 404s).
import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from './components/Layout/Layout';

function App() {

  const [data] = useState([]);

  return (
    <HashRouter>
      <header>
        <NavigationBar />
      </header>
      <br>
      </br>
      <React.Fragment>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/ontologies' element={<OntologyHome />} />
            <Route path='/ontologyDetail' element={<Tabview />} />
          </Routes>
        </Layout>
      </React.Fragment>
      <br />
    </HashRouter>

  );
}

export default App;
