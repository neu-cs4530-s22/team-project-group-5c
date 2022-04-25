"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nanoid_1 = require("nanoid");
var Player = (function () {
    function Player(userName) {
        this.location = {
            x: 0,
            y: 0,
            moving: false,
            rotation: 'front',
        };
        this._userName = userName;
        this._id = (0, nanoid_1.nanoid)();
    }
    Object.defineProperty(Player.prototype, "userName", {
        get: function () {
            return this._userName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "activeConversationArea", {
        get: function () {
            return this._activeConversationArea;
        },
        set: function (conversationArea) {
            this._activeConversationArea = conversationArea;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "activeMinigameArea", {
        get: function () {
            return this._activeMinigameArea;
        },
        set: function (minigameArea) {
            this._activeMinigameArea = minigameArea;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.isWithin = function (conversation) {
        return (this.location.x > conversation.boundingBox.x - conversation.boundingBox.width / 2 &&
            this.location.x < conversation.boundingBox.x + conversation.boundingBox.width / 2 &&
            this.location.y > conversation.boundingBox.y - conversation.boundingBox.height / 2 &&
            this.location.y < conversation.boundingBox.y + conversation.boundingBox.height / 2);
    };
    return Player;
}());
exports.default = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R5cGVzL1BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFnQztBQU9oQztJQWVFLGdCQUFZLFFBQWdCO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUc7WUFDZCxDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsT0FBTztTQUNsQixDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFBLGVBQU0sR0FBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxzQkFBSSw0QkFBUTthQUFaO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksc0JBQUU7YUFBTjtZQUNFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNsQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDBDQUFzQjthQUExQjtZQUNFLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDO1FBQ3RDLENBQUM7YUFFRCxVQUEyQixnQkFBb0Q7WUFDN0UsSUFBSSxDQUFDLHVCQUF1QixHQUFHLGdCQUFnQixDQUFDO1FBQ2xELENBQUM7OztPQUpBO0lBTUQsc0JBQUksc0NBQWtCO2FBQXRCO1lBQ0UsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7UUFDbEMsQ0FBQzthQUVELFVBQXVCLFlBQTRDO1lBQ2pFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxZQUFZLENBQUM7UUFDMUMsQ0FBQzs7O09BSkE7SUFjRCx5QkFBUSxHQUFSLFVBQVMsWUFBb0M7UUFDM0MsT0FBTyxDQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDakYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztZQUNqRixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ2xGLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FDbkYsQ0FBQztJQUNKLENBQUM7SUFFSCxhQUFDO0FBQUQsQ0FBQyxBQW5FRCxJQW1FQyJ9