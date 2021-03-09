import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const TOTAL_ROW = 9;
const TOTAL_COL = 9;
const WIN_NUM = 5;
// class Square extends React.Component {
//     render() {
//         return (
//             <button 
//             className="square" 
//             onClick={ () => this.props.onClick() }>
//                 {this.props.value}
//             </button>
//         );
//     }
// }
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
// function Square(props) {
//     return (
//         <button
//             className="square"
//             onClick="{props.onClick}">
//             {props.value}
//         </button>
//     );
// }
class Board extends React.Component {
    renderSquare(r, c) {
        const squareKey = TOTAL_ROW * r + c;
        return (
            <Square
                key={squareKey}
                value = {this.props.squares[squareKey]}
                onClick = {() => this.props.onClick(r, c)}
            />
        );
    }
    render() {
        const boardRows = [];
        let boardCols = [];
        for (let i = 0; i < TOTAL_ROW; i++) {
            boardCols = [];
            for (let j = 0; j < TOTAL_COL; j++) {
                boardCols.push(
                    this.renderSquare(i, j)
                )
            }
            boardRows.push(
                <div key={i} className = 'board-row'>
                    {boardCols}
                </div>
            );
        }
        return (
            <div>
                {boardRows}
                {/* <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div> */}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(TOTAL_ROW * TOTAL_COL).fill(null),
                curRow: null,
                curCol: null
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }
    handleClick(row, col) {
        const totalCol = this.state.totalCol;
        const squareKey = row * totalCol + col; //当前格子序号
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[squareKey] || calculateWinner(row, col)) return;
        squares[squareKey] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ 
            history: history.concat([{
                squares,
                curRow: row,
                curCol: col
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
         });
    }
    jumpTo(step){
        const history = this.state.history;
        this.setState({
            stepNumber: step,
            history: history.slice(0, step + 1),
            xIsNext: step % 2 === 0
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.curRow, current.curCol);
        let status;
        if (winner) {
            status = 'Winner is ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');   
        }
        const moves = history.map((hisEl, hisIdx)=>{
            const desc = hisIdx ? 
            ('Go to move #' + hisIdx + '；Position at (' + hisEl.curRow + ', ' + hisEl.curCol + ')') :
            'Go to game start';
            return (
                <li key={hisIdx} style={{"fontWeight": (hisIdx === this.state.stepNumber ? 'bold' : 'normal')}}>
                    <button onClick={()=>this.jumpTo(hisIdx)}>
                        {desc}
                    </button>
                </li>
            );
        });
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares = {current.squares} 
                        onClick = {(r, c)=>this.handleClick(r, c)}
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
/**
 * Number [r] row
 * Number [c] col
 * Array [square] valueList
 */
function checkWinner(row, col, square, direction) {
    let curVal = square[row + col];
    let r = row, c = col;
    let winFlag = false;
    let countNum = 1;
    let squareKey;
    let squareVal;
    let colCtrl;
    let rowCtrl;
    // 水平方向
    for (c = col + 1; c <= TOTAL_COL, countNum < WIN_NUM; c++) {
        squareKey = r + c;
        squareVal = square(squareKey);
        if (squareVal === curVal) countNum++
        else break;
    } // 正向右
    if (countNum < WIN_NUM) {
        for (c = col - 1; c > 0, countNum < WIN_NUM; c--) {
            squareKey = r + c;
            squareVal = square(squareKey);
            if (squareVal === curVal) countNum++
            else break;
        }
    } // 反向左

    // 垂直方向
    countNum = 1;
    for (r = row + 1; r <= TOTAL_ROW, countNum < WIN_NUM; r++) {
        squareKey = r + c;
        squareVal = square(squareKey);
        if (squareVal === curVal) countNum++
        else break;
    } // 正向下
    if (countNum < WIN_NUM) {
        for (r = row - 1; r <= TOTAL_ROW, countNum < WIN_NUM; r--) {
            squareKey = r + c;
            squareVal = square(squareKey);
            if (squareVal === curVal) countNum++
            else break;
        } 
    } // 正向上

    // -45deg斜向
    countNum = 1;
    for (c = (col + TOTAL_COL + 1), r = row + 1; c <+ TOTAL_COL, r <= TOTAL_ROW, countNum < WIN_NUM; r++, c) {
        squareKey = r + c;
        squareVal = square(squareKey);
        if (squareVal === curVal) countNum++
        else break;
    } // 向右下
    if (countNum < WIN_NUM) {
        for (r = row - 1; r <= TOTAL_ROW, countNum < WIN_NUM; r--) {
            squareKey = r + c;
            squareVal = square(squareKey);
            if (squareVal === curVal) countNum++
            else break;
        } 
    } // 向左上

    return countNum === WIN_NUM;
}
// function fiveCross(r, c, square) {
//     let winFlag = crossJudge(r, c, square);
//     // 如果正45度没有，则判断反向45度
//     if (!winFlag) {
//         winFlag = crossJudge(r, c, square, true);
//     }
//     return winFlag;
// }
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
        return squares[a];
      }
    }
    return null;
  }
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

