// App.js
import React from 'react';
import './App.css';
import NavigationBar from './components/Navigation/NavigationBar';
import 'bootstrap/dist/css/bootstrap.css';
import OntologyHome      from './components/Ontology/OntologyHome';
import OntologyDetailPage from './components/OntologyDetail/OntologyDetailPage';
import Home from './components/Home/Home';
// HashRouter keeps routes working on GitHub Pages, which has no server-side
// fallback for client routes (a refresh or direct link to /ontologies 404s).
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <HashRouter>
      <header>
        <NavigationBar />
      </header>
      <br />
      <Layout>
        <Routes>
          <Route path='/'                      element={<Home />} />
          <Route path='/ontologies'            element={<OntologyHome />} />
          <Route path='/ontologies/:slug'      element={<OntologyDetailPage />} />
          {/* Legacy redirect so any saved links still work */}
          <Route path='/ontologyDetail'        element={<Navigate to="/ontologies/strategy" replace />} />
        </Routes>
      </Layout>
      <br />
    </HashRouter>
  );
}

export default App;
