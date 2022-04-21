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
exports.townSubscriptionHandler = exports.minigameAreaCreateHandler = exports.conversationAreaCreateHandler = exports.townUpdateHandler = exports.townDeleteHandler = exports.townCreateHandler = exports.townListHandler = exports.townJoinHandler = void 0;
var assert_1 = __importDefault(require("assert"));
var Player_1 = __importDefault(require("../types/Player"));
var CoveyTownsStore_1 = __importDefault(require("../lib/CoveyTownsStore"));
var MinigameRequestHandlers_1 = __importDefault(require("./MinigameRequestHandlers"));
function townJoinHandler(requestData) {
    return __awaiter(this, void 0, void 0, function () {
        var townsStore, coveyTownController, newPlayer, newSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    townsStore = CoveyTownsStore_1.default.getInstance();
                    coveyTownController = townsStore.getControllerForTown(requestData.coveyTownID);
                    if (!coveyTownController) {
                        return [2, {
                                isOK: false,
                                message: 'Error: No such town',
                            }];
                    }
                    newPlayer = new Player_1.default(requestData.userName);
                    return [4, coveyTownController.addPlayer(newPlayer)];
                case 1:
                    newSession = _a.sent();
                    (0, assert_1.default)(newSession.videoToken);
                    return [2, {
                            isOK: true,
                            response: {
                                coveyUserID: newPlayer.id,
                                coveySessionToken: newSession.sessionToken,
                                providerVideoToken: newSession.videoToken,
                                currentPlayers: coveyTownController.players,
                                friendlyName: coveyTownController.friendlyName,
                                isPubliclyListed: coveyTownController.isPubliclyListed,
                                conversationAreas: coveyTownController.conversationAreas,
                                minigameAreas: coveyTownController.minigameAreas,
                            },
                        }];
            }
        });
    });
}
exports.townJoinHandler = townJoinHandler;
function townListHandler() {
    var townsStore = CoveyTownsStore_1.default.getInstance();
    return {
        isOK: true,
        response: { towns: townsStore.getTowns() },
    };
}
exports.townListHandler = townListHandler;
function townCreateHandler(requestData) {
    var townsStore = CoveyTownsStore_1.default.getInstance();
    if (requestData.friendlyName.length === 0) {
        return {
            isOK: false,
            message: 'FriendlyName must be specified',
        };
    }
    var newTown = townsStore.createTown(requestData.friendlyName, requestData.isPubliclyListed);
    return {
        isOK: true,
        response: {
            coveyTownID: newTown.coveyTownID,
            coveyTownPassword: newTown.townUpdatePassword,
        },
    };
}
exports.townCreateHandler = townCreateHandler;
function townDeleteHandler(requestData) {
    var townsStore = CoveyTownsStore_1.default.getInstance();
    var success = townsStore.deleteTown(requestData.coveyTownID, requestData.coveyTownPassword);
    return {
        isOK: success,
        response: {},
        message: !success ? 'Invalid password. Please double check your town update password.' : undefined,
    };
}
exports.townDeleteHandler = townDeleteHandler;
function townUpdateHandler(requestData) {
    var townsStore = CoveyTownsStore_1.default.getInstance();
    var success = townsStore.updateTown(requestData.coveyTownID, requestData.coveyTownPassword, requestData.friendlyName, requestData.isPubliclyListed);
    return {
        isOK: success,
        response: {},
        message: !success ? 'Invalid password or update values specified. Please double check your town update password.' : undefined,
    };
}
exports.townUpdateHandler = townUpdateHandler;
function conversationAreaCreateHandler(_requestData) {
    var townsStore = CoveyTownsStore_1.default.getInstance();
    var townController = townsStore.getControllerForTown(_requestData.coveyTownID);
    if (!(townController === null || townController === void 0 ? void 0 : townController.getSessionByToken(_requestData.sessionToken))) {
        return {
            isOK: false, response: {}, message: "Unable to create conversation area ".concat(_requestData.conversationArea.label, " with topic ").concat(_requestData.conversationArea.topic),
        };
    }
    var success = townController.addConversationArea(_requestData.conversationArea);
    return {
        isOK: success,
        response: {},
        message: !success ? "Unable to create conversation area ".concat(_requestData.conversationArea.label, " with topic ").concat(_requestData.conversationArea.topic) : undefined,
    };
}
exports.conversationAreaCreateHandler = conversationAreaCreateHandler;
function minigameAreaCreateHandler(_requestData) {
    var townsStore = CoveyTownsStore_1.default.getInstance();
    var townController = townsStore.getControllerForTown(_requestData.coveyTownID);
    if (!(townController === null || townController === void 0 ? void 0 : townController.getSessionByToken(_requestData.sessionToken))) {
        return {
            isOK: false, response: {}, message: "Unable to create minigame area ".concat(_requestData.minigameArea.label),
        };
    }
    var success = townController.addMinigameArea(_requestData.minigameArea, _requestData.host);
    return {
        isOK: success,
        response: {},
        message: !success ? "Unable to create minigame area ".concat(_requestData.minigameArea.label) : undefined,
    };
}
exports.minigameAreaCreateHandler = minigameAreaCreateHandler;
function townSocketAdapter(socket) {
    return {
        onPlayerMoved: function (movedPlayer) {
            socket.emit('playerMoved', movedPlayer);
        },
        onPlayerDisconnected: function (removedPlayer) {
            socket.emit('playerDisconnect', removedPlayer);
        },
        onPlayerJoined: function (newPlayer) {
            socket.emit('newPlayer', newPlayer);
        },
        onTownDestroyed: function () {
            socket.emit('townClosing');
            socket.disconnect(true);
        },
        onConversationAreaDestroyed: function (conversation) {
            socket.emit('conversationDestroyed', conversation);
        },
        onConversationAreaUpdated: function (conversation) {
            socket.emit('conversationUpdated', conversation);
        },
        onMinigameAreaUpdated: function (minigame) {
            socket.emit('minigameAreaUpdated', minigame);
        },
        onMinigameAreaDestroyed: function (minigame) {
            socket.emit('minigameAreaDestroyed', minigame);
        },
        onChatMessage: function (message) {
            socket.emit('chatMessage', message);
        },
    };
}
function townSubscriptionHandler(socket) {
    var _a = socket.handshake.auth, token = _a.token, coveyTownID = _a.coveyTownID;
    var townController = CoveyTownsStore_1.default.getInstance()
        .getControllerForTown(coveyTownID);
    var s = townController === null || townController === void 0 ? void 0 : townController.getSessionByToken(token);
    if (!s || !townController) {
        socket.disconnect(true);
        return;
    }
    var listener = townSocketAdapter(socket);
    townController.addTownListener(listener);
    socket.on('disconnect', function () {
        townController.removeTownListener(listener);
        townController.destroySession(s);
    });
    socket.on('chatMessage', function (message) { townController.onChatMessage(message); });
    socket.on('playerMovement', function (movementData) {
        townController.updatePlayerLocation(s.player, movementData);
    });
    (0, MinigameRequestHandlers_1.default)(socket);
}
exports.townSubscriptionHandler = townSubscriptionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ292ZXlUb3duUmVxdWVzdEhhbmRsZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcXVlc3RIYW5kbGVycy9Db3ZleVRvd25SZXF1ZXN0SGFuZGxlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTRCO0FBRTVCLDJEQUFxQztBQUdyQywyRUFBcUQ7QUFFckQsc0ZBQW9FO0FBaUdwRSxTQUFzQixlQUFlLENBQUMsV0FBNEI7Ozs7OztvQkFDMUQsVUFBVSxHQUFHLHlCQUFlLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBRTNDLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3JGLElBQUksQ0FBQyxtQkFBbUIsRUFBRTt3QkFDeEIsV0FBTztnQ0FDTCxJQUFJLEVBQUUsS0FBSztnQ0FDWCxPQUFPLEVBQUUscUJBQXFCOzZCQUMvQixFQUFDO3FCQUNIO29CQUNLLFNBQVMsR0FBRyxJQUFJLGdCQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoQyxXQUFNLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBQTs7b0JBQTNELFVBQVUsR0FBRyxTQUE4QztvQkFDakUsSUFBQSxnQkFBTSxFQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDOUIsV0FBTzs0QkFDTCxJQUFJLEVBQUUsSUFBSTs0QkFDVixRQUFRLEVBQUU7Z0NBQ1IsV0FBVyxFQUFFLFNBQVMsQ0FBQyxFQUFFO2dDQUN6QixpQkFBaUIsRUFBRSxVQUFVLENBQUMsWUFBWTtnQ0FDMUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLFVBQVU7Z0NBQ3pDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxPQUFPO2dDQUMzQyxZQUFZLEVBQUUsbUJBQW1CLENBQUMsWUFBWTtnQ0FDOUMsZ0JB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