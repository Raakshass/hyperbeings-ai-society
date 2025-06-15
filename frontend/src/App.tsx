import React from 'react';
import Dashboard from './components/Dashboard';
import { Web3Provider } from './components/Web3Provider';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <Dashboard />
      </div>
    </Web3Provider>
  );
}

export default App;
