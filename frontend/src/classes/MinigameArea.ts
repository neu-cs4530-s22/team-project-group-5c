import BoundingBox from "./BoundingBox";
import MiniGame from "./MiniGame";
import Player from "./Player";

export type ServerMinigameArea = {
    label: string;
    occupantsByID: string[];
    boundingBox: BoundingBox;
    minigame: MiniGame;
};

export type MinigameAreaListener = {
    // don't need topic change
    onOccupantsChange?: (newOccupants: string[]) => void;
};
export default class MinigameArea {
    private _boundingBox: BoundingBox;

    // Front end Game icon
    // private _icon : 

    private _label : string;

    private _occupants: string[] = [];
    
    private _listeners: MinigameAreaListener[] = [];

    private _minigame : MiniGame;

    constructor(boudingBox: BoundingBox, label: string, minigame: MiniGame) {
        this._boundingBox = boudingBox;
        this._label = label;
        this._minigame = minigame;
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

    get minigame() {
        return this._minigame;
    }

    getBoundingBox(): BoundingBox {
        return this._boundingBox;
    }

    toServerConversationArea(): ServerMinigameArea {
        return {
            label: this.label,
            occupantsByID: this.occupants,
            boundingBox: this.getBoundingBox(),
            minigame: this.minigame,
        };
    }

    addListener(listener: MinigameAreaListener) {
        this._listeners.push(listener);
    }
    
    removeListener(listener: MinigameAreaListener) {
        this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
    }
    
    copy() : MinigameArea{
        const ret = new MinigameArea(this._boundingBox, this.label, this.minigame);
        ret.occupants = this.occupants.concat([]);
        this._listeners.forEach(listener => ret.addListener(listener));
        return ret;
    }
    
    static fromServerMinigameArea(serverArea: ServerMinigameArea): MinigameArea {
        const ret = new MinigameArea(BoundingBox.fromStruct(serverArea.boundingBox), serverArea.label, serverArea.minigame);
        ret.occupants = serverArea.occupantsByID;
        return ret;
    }

    /**
     * Player join the minigame. 
     * 1. If the minigame is already occupied, return false
     * 2. If the minigame is single player minigame and the list players is empty, push the player into miniminigame player return true
     * 3. If the minigame is multi player minigame and the list players length is less than 2, can join
     * 4. After the player join the minigame, if the minigame get full players, minigame should be occupied true
     * 
     * @param player a player want to join the minigame
     * @returns boolean whether player can join the minigame or not 
     */
     joinGame(player: Player): boolean {
        if (this.minigame.isOccupied) {
            return false;
        }
        
        if ((this.minigame.isSingle && this.minigame.players.length === 0) || (!this.minigame.isSingle && this.minigame.players.length < 2)) {
            const currentPlayers : Player[] = this.minigame.players;
            currentPlayers.push(player);
            this.minigame.players = currentPlayers;
            if ((this.minigame.isSingle && this.minigame.players.length === 1) || (!this.minigame.isSingle && this.minigame.players.length === 2)) {
                this.minigame.checkOccupied();
            }
            return true;
        }
        return false;
    }
}