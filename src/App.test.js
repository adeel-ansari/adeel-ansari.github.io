import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the home page', () => {
  render(<App />);
  expect(screen.getByText(/Explore Ontologies/i)).toBeInTheDocument();
});

test('ontology detail page renders the choice cascade without a network call', () => {
  window.location.hash = '#/ontologyDetail';
  render(<App />);
  expect(screen.getByText('What is our winning aspiration?')).toBeInTheDocument();
  expect(screen.getByText('What management systems are required?')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Grid View'));
  expect(screen.getByText('WhereToPlay.consumerSegment')).toBeInTheDocument();
});
