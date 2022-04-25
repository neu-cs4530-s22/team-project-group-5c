"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nanoid_1 = require("nanoid");
var PlayerSession_1 = __importDefault(require("../types/PlayerSession"));
var TwilioVideo_1 = __importDefault(require("./TwilioVideo"));
var friendlyNanoID = (0, nanoid_1.customAlphabet)('1234567890ABCDEF', 8);
var CoveyTownController = (function () {
    function CoveyTownController(friendlyName, isPubliclyListed) {
        this._players = [];
        this._sessions = [];
        this._videoClient = TwilioVideo_1.default.getInstance();
        this._listeners = [];
        this._conversationAreas = [];
        this._minigameAreas = [];
        this._coveyTownID = process.env.DEMO_TOWN_ID === friendlyName ? friendlyName : friendlyNanoID();
        this._capacity = 50;
        this._townUpdatePassword = (0, nanoid_1.nanoid)(24);
        this._isPubliclyListed = isPubliclyListed;
        this._friendlyName = friendlyName;
    }
    Object.defineProperty(CoveyTownController.prototype, "capacity", {
        get: function () {
            return this._capacity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "isPubliclyListed", {
        get: function () {
            return this._isPubliclyListed;
        },
        set: function (value) {
            this._isPubliclyListed = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "townUpdatePassword", {
        get: function () {
            return this._townUpdatePassword;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "players", {
        get: function () {
            return this._players;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "occupancy", {
        get: function () {
            return this._listeners.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "friendlyName", {
        get: function () {
            return this._friendlyName;
        },
        set: function (value) {
            this._friendlyName = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "coveyTownID", {
        get: function () {
            return this._coveyTownID;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "conversationAreas", {
        get: function () {
            return this._conversationAreas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoveyTownController.prototype, "minigameAreas", {
        get: function () {
            return this._minigameAreas;
        },
        enumerable: false,
        configurable: true
    });
    CoveyTownController.prototype.addPlayer = function (newPlayer) {
        return __awaiter(this, void 0, void 0, function () {
            var theSession, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        theSession = new PlayerSession_1.default(newPlayer);
                        this._sessions.push(theSession);
                        this._players.push(newPlayer);
                        _a = theSession;
                        return [4, this._videoClient.getTokenForTown(this._coveyTownID, newPlayer.id)];
                    case 1:
                        _a.videoToken = _b.sent();
                        this._listeners.forEach(function (listener) { return listener.onPlayerJoined(newPlayer); });
                        return [2, theSession];
                }
            });
        });
    };
    CoveyTownController.prototype.destroySession = function (session) {
        this._players = this._players.filter(function (p) { return p.id !== session.player.id; });
        this._sessions = this._sessions.filter(function (s) { return s.sessionToken !== session.sessionToken; });
        this._listeners.forEach(function (listener) { return listener.onPlayerDisconnected(session.player); });
        var conversation = session.player.activeConversationArea;
        var minigame = session.player.activeMinigameArea;
        if (conversation) {
            this.removePlayerFromConversationArea(session.player, conversation);
        }
        if (minigame) {
            this.removePlayerFromMinigameArea(session.player, minigame);
        }
    };
    CoveyTownController.prototype.updatePlayerLocation = function (player, location) {
        var conversation = this.conversationAreas.find(function (conv) { return conv.label === location.conversationLabel; });
        var prevConversation = player.activeConversationArea;
        player.location = location;
        player.activeConversationArea = conversation;
        if (conversation !== prevConversation) {
            if (prevConversation) {
                this.removePlayerFromConversationArea(player, prevConversation);
            }
            if (conversation) {
                conversation.occupantsByID.push(player.id);
                this._listeners.forEach(function (listener) { return listener.onConversationAreaUpdated(conversation); });
            }
        }
        var minigame = this.minigameAreas.find(function (mg) { return mg.label === location.minigameLabel; });
        var prevMinigame = player.activeMinigameArea;
        player.activeMinigameArea = minigame;
        if (minigame !== prevMinigame) {
            if (prevMinigame) {
                this.removePlayerFromMinigameArea(player, prevMinigame);
            }
            if (minigame) {
                minigame.playersByID.push(player.id);
                this._listeners.forEach(function (listener) { return listener.onMinigameAreaUpdated(minigame); });
            }
        }
        this._listeners.forEach(function (listener) { return listener.onPlayerMoved(player); });
    };
    CoveyTownController.prototype.removePlayerFromMinigameArea = function (player, minigameArea) {
        if (minigameArea.playersByID[0] === player.id) {
            this._minigameAreas.splice(this._minigameAreas.findIndex(function (mg) { return mg === minigameArea; }), 1);
            this._listeners.forEach(function (listener) { return listener.onMinigameAreaDestroyed(minigameArea); });
        }
        else if (this._minigameAreas.some(function (mg) { return mg.label === minigameArea.label; })) {
            minigameArea.playersByID.splice(minigameArea.playersByID.findIndex(function (p) { return p === player.id; }), 1);
            this._listeners.forEach(function (listener) { return listener.onMinigameAreaUpdated(minigameArea); });
        }
    };
    CoveyTownController.prototype.removePlayerFromConversationArea = function (player, conversation) {
        conversation.occupantsByID.splice(conversation.occupantsByID.findIndex(function (p) { return p === player.id; }), 1);
        if (conversation.occupantsByID.length === 0) {
            this._conversationAreas.splice(this._conversationAreas.findIndex(function (conv) { return conv === conversation; }), 1);
            this._listeners.forEach(function (listener) { return listener.onConversationAreaDestroyed(conversation); });
        }
        else {
            this._listeners.forEach(function (listener) { return listener.onConversationAreaUpdated(conversation); });
        }
    };
    CoveyTownController.prototype.addConversationArea = function (_conversationArea) {
        if (this._conversationAreas.find(function (eachExistingConversation) { return eachExistingConversation.label === _conversationArea.label; }))
            return false;
        if (_conversationArea.topic === '') {
            return false;
        }
        if (this._conversationAreas.find(function (eachExistingConversation) {
            return CoveyTownController.boxesOverlap(eachExistingConversation.boundingBox, _conversationArea.boundingBox);
        }) !== undefined) {
            return false;
        }
        var newArea = Object.assign(_conversationArea);
        this._conversationAreas.push(newArea);
        var playersInThisConversation = this.players.filter(function (player) { return player.isWithin(newArea); });
        playersInThisConversation.forEach(function (player) { player.activeConversationArea = newArea; });
        newArea.occupantsByID = playersInThisConversation.map(function (player) { return player.id; });
        this._listeners.forEach(function (listener) { return listener.onConversationAreaUpdated(newArea); });
        return true;
    };
    CoveyTownController.prototype.addMinigameArea = function (_minigameArea, hostID) {
        if (this._minigameAreas.find(function (eachExistingActiveMinigame) { return eachExistingActiveMinigame.label === _minigameArea.label; }))
            return false;
        if (this._minigameAreas.find(function (eachExistingActiveMinigame) {
            return CoveyTownController.boxesOverlap(eachExistingActiveMinigame.boundingBox, _minigameArea.boundingBox);
        }) !== undefined) {
            return false;
        }
        var newMinigame = Object.assign(_minigameArea);
        this._minigameAreas.push(newMinigame);
        var hostPlayer = this.players.filter(function (player) { return player.id === hostID; });
        hostPlayer.forEach(function (player) { player.activeMinigameArea = newMinigame; });
        newMinigame.playersByID.push(hostID);
        this._listeners.forEach(function (listener) { return listener.onMinigameAreaUpdated(newMinigame); });
        return true;
    };
    CoveyTownController.boxesOverlap = function (box1, box2) {
        var toRectPoints = function (box) { return ({ x1: box.x - box.width / 2, x2: box.x + box.width / 2, y1: box.y - box.height / 2, y2: box.y + box.height / 2 }); };
        var rect1 = toRectPoints(box1);
        var rect2 = toRectPoints(box2);
        var noOverlap = rect1.x1 >= rect2.x2 || rect2.x1 >= rect1.x2 || rect1.y1 >= rect2.y2 || rect2.y1 >= rect1.y2;
        return !noOverlap;
    };
    CoveyTownController.prototype.addTownListener = function (listener) {
        this._listeners.push(listener);
    };
    CoveyTownController.prototype.removeTownListener = function (listener) {
        this._listeners = this._listeners.filter(function (v) { return v !== listener; });
    };
    CoveyTownController.prototype.onChatMessage = function (message) {
        this._listeners.forEach(function (listener) { return listener.onChatMessage(message); });
    };
    CoveyTownController.prototype.getSessionByToken = function (token) {
        return this._sessions.find(function (p) { return p.sessionToken === token; });
    };
    CoveyTownController.prototype.disconnectAllPlayers = function () {
        this._listeners.forEach(function (listener) { return listener.onTownDestroyed(); });
    };
    return CoveyTownController;
}());
exports.default = CoveyTownController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ292ZXlUb3duQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvQ292ZXlUb3duQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFnRDtBQUtoRCx5RUFBbUQ7QUFFbkQsOERBQXdDO0FBRXhDLElBQU0sY0FBYyxHQUFHLElBQUEsdUJBQWMsRUFBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztBQU03RDtJQXlFRSw2QkFBWSxZQUFvQixFQUFFLGdCQUF5QjtRQTNCbkQsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUd4QixjQUFTLEdBQW9CLEVBQUUsQ0FBQztRQUdoQyxpQkFBWSxHQUFpQixxQkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBR3ZELGVBQVUsR0FBd0IsRUFBRSxDQUFDO1FBR3JDLHVCQUFrQixHQUE2QixFQUFFLENBQUM7UUFHbEQsbUJBQWMsR0FBeUIsRUFBRSxDQUFDO1FBYWhELElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2hHLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFBLGVBQU0sRUFBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFDMUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7SUFDcEMsQ0FBQztJQTlFRCxzQkFBSSx5Q0FBUTthQUFaO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksaURBQWdCO2FBSXBCO1lBQ0UsT0FBTyxJQUFJLENB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