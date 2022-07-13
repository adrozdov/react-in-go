import React from 'react';
import './App.css';
import Game from './Game';

export default function App()  {
  
  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <Game />
    </div>
  );
}