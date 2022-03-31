import BoundingBox from "./BoundingBox";
import MiniGame from "./MiniGame";
import Player from "./Player";

export type ServerGameArea = {
    label: string;
    occupantsByID: string[];
    boundingBox: BoundingBox;
    game: MiniGame;
};

export type GameAreaListener = {
    // don't need topic change
    onOccupantsChange?: (newOccupants: string[]) => void;
};
export default class GameArea {
    private _boundingBox: BoundingBox;

    // Front end Game icon
    // private _icon : 

    private _label : string;

    private _occupants: string[] = [];
    
    private _listeners: GameAreaListener[] = [];

    private _game : MiniGame;

    constructor(boudingBox: BoundingBox, label: string, game: MiniGame) {
        this._boundingBox = boudingBox;
        this._label = label;
        this._game = game;
    }

    get label() {
        return this._label;
    }

    set occupants(newOccupants: string[]) {
        if(newOccupants.length !== this._occupants.length || !newOccupants.every((val, index) => val === this._occupants[index])){
            this._listeners.forEach(listener => listener.onOccupantsChange?.(newOccupants));
            this._occupants = newOccupants;
        }
    }

    get occupants() {
        return this._occupants;
    }

    get game() {
        return this._game;
    }

    getBoundingBox(): BoundingBox {
        return this._boundingBox;
    }

    toServerConversationArea(): ServerGameArea {
        return {
            label: this.label,
            occupantsByID: this.occupants,
            boundingBox: this.getBoundingBox(),
            game: this.game,
        };
    }

    addListener(listener: GameAreaListener) {
        this._listeners.push(listener);
    }
    
    removeListener(listener: GameAreaListener) {
        this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
    }
    
    copy() : GameArea{
        const ret = new GameArea(this._boundingBox, this.label, this.game);
        ret.occupants = this.occupants.concat([]);
        this._listeners.forEach(listener => ret.addListener(listener));
        return ret;
    }
    
    static fromServerGameArea(serverArea: ServerGameArea): GameArea {
        const ret = new GameArea(BoundingBox.fromStruct(serverArea.boundingBox), serverArea.label, serverArea.game);
        ret.occupants = serverArea.occupantsByID;
        return ret;
    }

    /**
     * Player join the game. 
     * 1. If the game is already occupied, return false
     * 2. If the game is single player game and the list players is empty, push the player into game player return true
     * 3. If the game is multi player game and the list players length is less than 2, can join
     * 4. After the player join the game, if the game get full players, game should be occupied true
     * 
     * @param player a player want to join the game
     * @returns boolean whether player can join the game or not 
     */
     joinGame(player: Player): boolean {
        if (this.game.isOccupied) {
            return false;
        }
        
        if ((this.game.isSingle && this.game.players.length === 0) || (!this.game.isSingle && this.game.players.length < 2)) {
            const currentPlayers : Player[] = this.game.players;
            currentPlayers.push(player);
            this.game.players = currentPlayers;
            if ((this.game.isSingle && this.game.players.length === 1) || (!this.game.isSingle && this.game.players.length === 2)) {
                this.game.checkOccupied();
            }
            return true;
        }
        return false;
    }
}