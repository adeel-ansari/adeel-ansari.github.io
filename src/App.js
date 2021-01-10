// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import NavigationBar from './components/Navigation/NavigationBar';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'react-bootstrap';
import Tabview from './components/Tabview/Tabview';
import Home from './components/Home/Home';

// const graph = ({
//   nodes: Array.from({ length: 13 }, () => ({})),
//   links: [
//       { source: 0, target: 1 },
//       { source: 1, target: 2 },
//       { source: 2, target: 0 },
//       { source: 1, target: 3 },
//       { source: 3, target: 2 },
//       { source: 3, target: 4 },
//       { source: 4, target: 5 },
//       { source: 5, target: 6 },
//       { source: 5, target: 7 },
//       { source: 6, target: 7 },
//       { source: 6, target: 8 },
//       { source: 7, target: 8 },
//       { source: 9, target: 4 },
//       { source: 9, target: 11 },
//       { source: 9, target: 10 },
//       { source: 10, target: 11 },
//       { source: 11, target: 12 },
//       { source: 12, target: 10 }
//   ]
// });



function App() {

  const [data] = useState([]);

  return (
    <div className="App">
      <header>
        <NavigationBar />
      </header>
      <br />
      <Home />
      {/* <h1 align="center">Strategic Choice Cascade</h1> */}
      {/* <Container>
        <Tabview />
      </Container> */}
    </div>
  );
}

export default App;