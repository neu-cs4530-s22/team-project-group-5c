import Player from "./Player";


export default abstract class MiniGame {

    // we don't have leaderboard class yet
    // leaderBoard : LeaderBoard;

    // Single player game or multi player game
    private _isSingle : boolean;

    private _players : Player[] = [];

    // There is enough space to join the game or not
    private _isOccupied = false;

    constructor(isSingle: boolean, players: Player[], isOccupied: boolean) {
        this._isSingle = isSingle;
        this._players = players;
        this._isOccupied = isOccupied;
    }

    // get leaderBoard() : LeaderBoard {
    //     return this.leaderBoard
    // }

    /**
     * Get the players in the game
     */
    get players(): Player[] {
        return this._players;
    }

    /**
     * Get the name of the game
     */
     abstract getGameName(): string; 

    /**
     * Check the game is active or not
     */
    get isOccupied(): boolean {
        return this._isOccupied;
    }

    /**
     * After player join the game, check and change the occupied field
     * if the single player game have more than a player, occupied should be true
     * if the multi player game have more than 2 players, occupied should be true
     */
    checkOccupied(): void {
        if (this._isSingle && this._players.length >= 1) {
            this._isOccupied = true;
        }
        if (!this._isSingle && this._players.length >= 2) {
            this._isOccupied = true;
        }
    }
}