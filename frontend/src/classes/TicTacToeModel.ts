import MiniGame from "./MiniGame";

/**
 * TODO:
 * Need to cooperate with frontend side (e.g.click the board etc)
 * Need Restart?
 * if so, game ends only if click the 'x' button? 
 */

/**
 * FIXME:
 * constructors
 * players (how do I know which player would be play?) 
 * the first player click the button, alternate to the second player. Need frontend
 */


export default class TicTacToeModel extends MiniGame {
    private _board : string[] = ['', '', '', '', '', '', '', '', ''];

    private _gameName = 'Tic Tac Toe';

    private _isGameOver = false;

    private _currentPlayer = 'X';

    // constructor(isSingle: boolean, players: Player[], occupied: boolean) {
    //     super(false, [], false);
    // }
    
    /**
     * Alternate the player in Tic Tac Toe
     */
    alternatePlayer(): void {
        this._currentPlayer = this._currentPlayer === 'X' ? 'O' : 'X';
    }

    /**
     * decide the game state depending on the board
     * @returns 
     */
    checkWinner() : void {
        let existWinner = false;
        const conditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let i = 0; i < conditions.length; i += 1) {
            const condition = conditions[i];
            const cell1 = this._board[condition[0]];
            const cell2 = this._board[condition[1]];
            const cell3 = this._board[condition[2]];

            if (cell1 === cell2 && cell2 === cell3) {
                existWinner = true;
                break;
            }
        }

        if (existWinner) {
            this._isGameOver = true;
            return;
        }

        if (this._board.includes('')) {
            this._isGameOver = true;
            return;
        }

        this.alternatePlayer();
    }

    // This function should cooperate with frontend side
    // clickBoard() {

    // }

    getGameName(): string {
        return this._gameName;
    }

    
}