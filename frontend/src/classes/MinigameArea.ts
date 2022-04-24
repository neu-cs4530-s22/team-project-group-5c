import BoundingBox from "./BoundingBox";
import MiniGame from "./MiniGame";

export type ServerMinigameArea = {
    label: string;
    playersByID: string[];
    boundingBox: BoundingBox;
    minigame?: string;
  };

export type MinigameAreaListener = {
    onPlayersChange?: (newPlayersByID: string[]) => void;
    onMinigameAreaDestroyed?: () => void;
};
export default class MinigameArea {
    private _boundingBox: BoundingBox;

    private _label : string;

    private _playersByID: string[] = [];
    
    private _listeners: MinigameAreaListener[] = [];

    private _minigame : string;

    constructor(boudingBox: BoundingBox, label: string, minigame: string) {
        this._boundingBox = boudingBox;
        this._label = label;
        this._minigame = minigame;
    }

    get label() {
        return this._label;
    }

    set playersByID(newPlayersByID: string[]) {
        if(newPlayersByID.length !== this._playersByID.length || !newPlayersByID.every((val, index) => val === this._playersByID[index])){
            // Calls this minigame area's listeners here to update players list
            this._listeners.forEach((listener: MinigameAreaListener) => {
                listener.onPlayersChange?.(newPlayersByID);
            })
            this._playersByID = newPlayersByID;
        }
    }

    get playersByID() {
        return this._playersByID;
    }

    get minigame() {
        return this._minigame;
    }

    set minigame(minigame: string) {
        this._minigame = minigame;
    }

    getBoundingBox(): BoundingBox {
        return this._boundingBox;
    }

    toServerMinigameArea(): ServerMinigameArea {
        return {
            label: this.label,
            playersByID: this._playersByID,
            boundingBox: this.getBoundingBox(),
            minigame: "replace with actual minigame",
        };
    }

    addPlayerID(playerId: string): void {
        this._playersByID.push(playerId);
    }

    addListener(listener: MinigameAreaListener) {
        this._listeners.push(listener);
    }
    
    removeListener(listener: MinigameAreaListener) {
        this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
    }
    
    copy() : MinigameArea{
        const ret = new MinigameArea(this._boundingBox, this.label, this.minigame);
        ret._playersByID = this._playersByID.concat([]);
        this._listeners.forEach(listener => ret.addListener(listener));
        return ret;
    }

    listenersLength() : number {
        return this._listeners.length;
    }

    emitListenersDestroyArea(): void {
        this._listeners.forEach((listener: MinigameAreaListener) => listener.onMinigameAreaDestroyed?.());
    }
    
    static fromServerMinigameArea(serverArea: ServerMinigameArea): MinigameArea {
        const ret = new MinigameArea(BoundingBox.fromStruct(serverArea.boundingBox), serverArea.label, serverArea.minigame as string);
        ret._playersByID = serverArea.playersByID;
        return ret;
    }
}