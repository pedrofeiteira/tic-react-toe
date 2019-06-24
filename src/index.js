import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
  
function Square(props) {
  return (
    <button className={!props.highlight ? "square" : "square highlight"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Move(props) {
  const msg = 'Go to move #' + props.index + ` (${Math.floor(props.move.moveCoordinates.row)}, ${Math.floor(props.move.moveCoordinates.column)})`;
  return props.index === props.stepNumber 
  ? (<b>{msg}</b>) 
  : msg
}

class Board extends React.Component {
  renderSquare(i) {
    return (
          <Square
            key={i} 
            value={this.props.squares[i]}
            highlight={this.props.winningLine && this.props.winningLine.indexOf(i) !== -1} // Check if square is part of a winning line (to highlight it) 
            onClick={() => this.props.onClick(i)} 
          />
    );
  }

  renderBoard() {
    let rows = [];
    let currentIndex = 0;
    for (let i = 0; i < 3; i++) {
      let rowSquares = [];
      for (let j = 0; j < 3; j++) {
        rowSquares.push(this.renderSquare(currentIndex++));
      }
      rows.push(<div className="board-row">{rowSquares}</div>)
    }
    return rows;
  }

  render() {
    return this.renderBoard();
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveCoordinates: {
          row: null,
          column: null
        }
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveCoordinates: {
          row: Math.floor(i / 3) + 1,
          column: Math.floor(i % 3) + 1
        }
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((move, moveIndex) => {
      const desc = moveIndex 
      ? <Move move={move} index={moveIndex} stepNumber={this.state.stepNumber}/> 
      : 'Go to game start';
      return (
        <li key={moveIndex}>
          <button onClick={() => this.jumpTo(moveIndex)}>{desc}</button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else if (this.state.stepNumber === 9) { // No more moves to play
      status = 'Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningLine={winner ? winner.line : null} 
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i]
      };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  