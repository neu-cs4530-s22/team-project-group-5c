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
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var http_status_codes_1 = require("http-status-codes");
var CoveyTownRequestHandlers_1 = require("../requestHandlers/CoveyTownRequestHandlers");
var Utils_1 = require("../Utils");
function addTownRoutes(http, app) {
    var _this = this;
    app.post('/sessions', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, (0, CoveyTownRequestHandlers_1.townJoinHandler)({
                            userName: req.body.userName,
                            coveyTownID: req.body.coveyTownID,
                        })];
                case 1:
                    result = _a.sent();
                    res.status(http_status_codes_1.StatusCodes.OK)
                        .json(result);
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    (0, Utils_1.logError)(err_1);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({
                        message: 'Internal server error, please see log in server for more details',
                    });
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); });
    app.delete('/towns/:townID/:townPassword', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            try {
                result = (0, CoveyTownRequestHandlers_1.townDeleteHandler)({
                    coveyTownID: req.params.townID,
                    coveyTownPassword: req.params.townPassword,
                });
                res.status(200)
                    .json(result);
            }
            catch (err) {
                (0, Utils_1.logError)(err);
                res.status(500)
                    .json({
                    message: 'Internal server error, please see log in server for details',
                });
            }
            return [2];
        });
    }); });
    app.get('/towns', express_1.default.json(), function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            try {
                result = (0, CoveyTownRequestHandlers_1.townListHandler)();
                res.status(http_status_codes_1.StatusCodes.OK)
                    .json(result);
            }
            catch (err) {
                (0, Utils_1.logError)(err);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({
                    message: 'Internal server error, please see log in server for more details',
                });
            }
            return [2];
        });
    }); });
    app.post('/towns', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            try {
                result = (0, CoveyTownRequestHandlers_1.townCreateHandler)(req.body);
                res.status(http_status_codes_1.StatusCodes.OK)
                    .json(result);
            }
            catch (err) {
                (0, Utils_1.logError)(err);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({
                    message: 'Internal server error, please see log in server for more details',
                });
            }
            return [2];
        });
    }); });
    app.patch('/towns/:townID', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            try {
                result = (0, CoveyTownRequestHandlers_1.townUpdateHandler)({
                    coveyTownID: req.params.townID,
                    isPubliclyListed: req.body.isPubliclyListed,
                    friendlyName: req.body.friendlyName,
                    coveyTownPassword: req.body.coveyTownPassword,
                });
                res.status(http_status_codes_1.StatusCodes.OK)
                    .json(result);
            }
            catch (err) {
                (0, Utils_1.logError)(err);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({
                    message: 'Internal server error, please see log in server for more details',
                });
            }
            return [2];
        });
    }); });
    app.post('/towns/:townID/conversationAreas', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            try {
                result = (0, CoveyTownRequestHandlers_1.conversationAreaCreateHandler)({
                    coveyTownID: req.params.townID,
                    sessionToken: req.body.sessionToken,
                    conversationArea: req.body.conversationArea,
                });
                res.status(http_status_codes_1.StatusCodes.OK)
                    .json(result);
            }
            catch (err) {
                (0, Utils_1.logError)(err);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({
                    message: 'Internal server error, please see log in server for more details',
                });
            }
            return [2];
        });
    }); });
    app.post('/towns/:townID/minigameAreas', express_1.default.json(), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            try {
                result = (0, CoveyTownRequestHandlers_1.minigameAreaCreateHandler)({
                    coveyTownID: req.params.townID,
                    sessionToken: req.body.sessionToken,
                    host: req.body.host,
                    minigameArea: req.body.minigameArea,
                });
                res.status(http_status_codes_1.StatusCodes.OK)
                    .json(result);
            }
            catch (err) {
                (0, Utils_1.logError)(err);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({
                    message: 'Internal server error, please see log in server for more details',
                });
            }
            return [2];
        });
    }); });
    var socketServer = new socket_io_1.default.Server(http, { cors: { origin: '*' } });
    socketServer.on('connection', CoveyTownRequestHandlers_1.townSubscriptionHandler);
    return socketServer;
}
exports.default = addTownRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG93bnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVyL3Rvd25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTJDO0FBQzNDLHdEQUEyQjtBQUUzQix1REFBZ0Q7QUFDaEQsd0ZBUXFEO0FBQ3JELGtDQUFvQztBQUVwQyxTQUF3QixhQUFhLENBQUMsSUFBWSxFQUFFLEdBQVk7SUFBaEUsaUJBMklDO0lBdklDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGlCQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBTyxHQUFHLEVBQUUsR0FBRzs7Ozs7O29CQUVsQyxXQUFNLElBQUEsMENBQWUsRUFBQzs0QkFDbkMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTs0QkFDM0IsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVzt5QkFDbEMsQ0FBQyxFQUFBOztvQkFISSxNQUFNLEdBQUcsU0FHYjtvQkFDRixHQUFHLENBQUMsTUFBTSxDQUFDLCtCQUFXLENBQUMsRUFBRSxDQUFDO3lCQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7b0JBRWhCLElBQUEsZ0JBQVEsRUFBQyxLQUFHLENBQUMsQ0FBQztvQkFDZCxHQUFHLENBQUMsTUFBTSxDQUFDLCtCQUFXLENBQUMscUJBQXFCLENBQUM7eUJBQzFDLElBQUksQ0FBQzt3QkFDSixPQUFPLEVBQUUsa0VBQWtFO3FCQUM1RSxDQUFDLENBQUM7Ozs7O1NBRVIsQ0FBQyxDQUFDO0lBS0gsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxpQkFBTyxDQUFDLElBQUksRUFBRSxFQUFFLFVBQU8sR0FBRyxFQUFFLEdBQUc7OztZQUN4RSxJQUFJO2dCQUNJLE1BQU0sR0FBRyxJQUFBLDRDQUFpQixFQUFDO29CQUMvQixXQUFXLEVBQUUsR0FBRyxD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