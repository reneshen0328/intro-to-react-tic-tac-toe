import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square 
            value={this.props.squares[i]} 
            onClick={() => {this.props.onClick(i)}}
            />
    }

    render() {
        return (
            <div>
                <div className='board-row'>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          history: [
            {
              squares: Array(9).fill(null)
            }
          ],
          stepNumber: 0,
          xIsNext: true
        };
      }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        console.log(history)
        const current = history[history.length-1];

        // create a copy of squares to mimic immutable behavior
        const squares = current.squares.slice();

        // if there's a winner, stop the game
        // if the square is not empty, it cannot be assigned with another value
        if(calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext? 'X' : 'O';

        this.setState({
            // not like push, concat doesn't mutate the Array
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            // every other step, xIsNext is true
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;

        // map over history's value(value) and moves(index)
        const moves = history.map((value, move) => {
            const backToMove = move ? 'Go to move #' + move : 'Back to Game start';
            return (
                <li key={move}>
                    <button onClick={() => {this.jumpTo(move)}}>{backToMove}</button>
                </li>
            )
        })

        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board 
                        squares={current.squares} 
                        onClick={(i) => {this.handleClick(i)}}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    // define the indexes on the same line
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

      // if there are 3 same values (all X or all O) on the same line, there's a winner
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    // if there's no winner, pass in null to onHandleClick to continue the game
    return null;
  }

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game />)