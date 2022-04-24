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
Object.defineProperty(exports, "__esModule", { value: true });
function minigameSubscriptionHandler(socket) {
    var _this = this;
    socket.on('join_game_room', function (minigameLabel) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, socket.join(minigameLabel)];
                case 1:
                    _a.sent();
                    console.log("in join_game label: ", minigameLabel);
                    socket.emit("".concat(minigameLabel, "_room_joined"));
                    return [2];
            }
        });
    }); });
    socket.on('start_game', function (minigameLabel) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            socket.emit('host_start_game', { start: true, symbol: "x" });
            socket.to(minigameLabel).emit("".concat(minigameLabel, "_game_started"), { start: false, symbol: "o" });
            return [2];
        });
    }); });
    socket.on('join_game', function (minigameLabel) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            socket.emit('start_game', { start: true, symbol: "x" });
            socket.to(minigameLabel).emit("start_game", { start: false, symbol: "o" });
            return [2];
        });
    }); });
    socket.on('update_game', function (gameMatrix, roomId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("update game in request handler line 28 with label of", roomId.roomLabel, "message: ", gameMatrix);
            socket.emit('on_game_update', gameMatrix);
            socket.to(roomId.roomLabel).emit("on_game_update", gameMatrix);
            return [2];
        });
    }); });
}
exports.default = minigameSubscriptionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluaWdhbWVSZXF1ZXN0SGFuZGxlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVxdWVzdEhhbmRsZXJzL01pbmlnYW1lUmVxdWVzdEhhbmRsZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU0EsU0FBd0IsMkJBQTJCLENBQUMsTUFBYztJQUFsRSxpQkFtQ0M7SUE5QkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFPLGFBQXFCOzs7d0JBQ3RELFdBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBQTs7b0JBQWhDLFNBQWdDLENBQUM7b0JBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxDQUFDLENBQUM7b0JBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBRyxhQUFhLGlCQUFjLENBQUMsQ0FBQzs7OztTQUM3QyxDQUFDLENBQUM7SUFJSCxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFPLGFBQXFCOztZQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFHLGFBQWEsa0JBQWUsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7OztTQUM3RixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFPLGFBQXFCOztZQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQzs7O1NBQzFFLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQU8sVUFBZSxFQUFFLE1BQVc7O1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDL0csTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7OztTQUNoRSxDQUFDLENBQUM7QUFRTCxDQUFDO0FBbkNELDhDQW1DQyJ9