import React from 'react';

const CELL_SIZE = 20;

export default function Cell() {
  
    const { x, y } = this.props;
    return (
      <div className="Cell" style={{
          left: `${CELL_SIZE * x + 1}px`,
          top: `${CELL_SIZE * y + 1}px`,
          width: `${CELL_SIZE - 1}px`,
          height: `${CELL_SIZE - 1}px`,
      }} />
  );
}