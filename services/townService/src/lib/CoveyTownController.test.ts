import { nanoid } from 'nanoid';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import { Socket } from 'socket.io';
import TwilioVideo from './TwilioVideo';
import Player from '../types/Player';
import CoveyTownController from './CoveyTownController';
import CoveyTownListener from '../types/CoveyTownListener';
import { UserLocation } from '../CoveyTypes';
import PlayerSession from '../types/PlayerSession';
import { townSubscriptionHandler } from '../requestHandlers/CoveyTownRequestHandlers';
import CoveyTownsStore from './CoveyTownsStore';
import * as TestUtils from '../client/TestUtils';
import minigameSubscriptionHandler from '../requestHandlers/MinigameRequestHandlers';

const mockTwilioVideo = mockDeep<TwilioVideo>();
jest.spyOn(TwilioVideo, 'getInstance').mockReturnValue(mockTwilioVideo);

function generateTestLocation(): UserLocation {
  return {
    rotation: 'back',
    moving: Math.random() < 0.5,
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  };
}

describe('CoveyTownController', () => {
  beforeEach(() => {
    mockTwilioVideo.getTokenForTown.mockClear();
  });
  it('constructor should set the friendlyName property', () => { 
    const townName = `FriendlyNameTest-${nanoid()}`;
    const townController = new CoveyTownController(townName, false);
    expect(townController.friendlyName)
      .toBe(townName);
  });
  describe('addPlayer', () => { 
    it('should use the coveyTownID and player ID properties when requesting a video token',
      async () => {
        const townName = `FriendlyNameTest-${nanoid()}`;
        const townController = new CoveyTownController(townName, false);
        const newPlayerSession = await townController.addPlayer(new Player(nanoid()));
        expect(mockTwilioVideo.getTokenForTown).toBeCalledTimes(1);
        expect(mockTwilioVideo.getTokenForTown).toBeCalledWith(townController.coveyTownID, newPlayerSession.player.id);
      });
  });
  describe('town listeners and events', () => {
    let testingTown: CoveyTownController;
    const mockListeners = [mock<CoveyTownListener>(),
      mock<CoveyTownListener>(),
      mock<CoveyTownListener>()];
    beforeEach(() => {
      const townName = `town listeners and events tests ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
      mockListeners.forEach(mockReset);
    });
    it('should notify added listeners of player movement when updatePlayerLocation is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);
      const newLocation = generateTestLocation();
      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.updatePlayerLocation(player, newLocation);
      mockListeners.forEach(listener => expect(listener.onPlayerMoved).toBeCalledWith(player));
    });
    it('should notify added listeners of player disconnections when destroySession is called', async () => {
      const player = new Player('test player');
      const session = await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.destroySession(session);
      mockListeners.forEach(listener => expect(listener.onPlayerDisconnected).toBeCalledWith(player));
    });
    it('should notify added listeners of new players when addPlayer is called', async () => {
      mockListeners.forEach(listener => testingTown.addTownListener(listener));

      const player = new Player('test player');
      await testingTown.addPlayer(player);
      mockListeners.forEach(listener => expect(listener.onPlayerJoined).toBeCalledWith(player));

    });
    it('should notify added listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.disconnectAllPlayers();
      mockListeners.forEach(listener => expect(listener.onTownDestroyed).toBeCalled());

    });
    it('should not notify removed listeners of player movement when updatePlayerLocation is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const newLocation = generateTestLocation();
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.updatePlayerLocation(player, newLocation);
      expect(listenerRemoved.onPlayerMoved).not.toBeCalled();
    });
    it('should not notify removed listeners of player disconnections when destroySession is called', async () => {
      const player = new Player('test player');
      const session = await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.destroySession(session);
      expect(listenerRemoved.onPlayerDisconnected).not.toBeCalled();

    });
    it('should not notify removed listeners of new players when addPlayer is called', async () => {
      const player = new Player('test player');

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      const session = await testingTown.addPlayer(player);
      testingTown.destroySession(session);
      expect(listenerRemoved.onPlayerJoined).not.toBeCalled();
    });

    it('should not notify removed listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.disconnectAllPlayers();
      expect(listenerRemoved.onTownDestroyed).not.toBeCalled();

    });
  });
  describe('townSubscriptionHandler', () => {
    const mockSocket = mock<Socket>();
    let testingTown: CoveyTownController;
    let player: Player;
    let session: PlayerSession;
    beforeEach(async () => {
      const townName = `connectPlayerSocket tests ${nanoid()}`;
      testingTown = CoveyTownsStore.getInstance().createTown(townName, false);
      mockReset(mockSocket);
      player = new Player('test player');
      session = await testingTown.addPlayer(player);
    });
    it('should reject connections with invalid town IDs by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(nanoid(), session.sessionToken, mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    it('should reject connections with invalid session tokens by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, nanoid(), mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    describe('with a valid session token', () => {
      it('should add a town listener, which should emit "newPlayer" to the socket when a player joins', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        await testingTown.addPlayer(player);
        expect(mockSocket.emit).toBeCalledWith('newPlayer', player);
      });
      it('should add a town listener, which should emit "playerMoved" to the socket when a player moves', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        testingTown.updatePlayerLocation(player, generateTestLocation());
        expect(mockSocket.emit).toBeCalledWith('playerMoved', player);

      });
      it('should add a town listener, which should emit "playerDisconnect" to the socket when a player disconnects', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        testingTown.destroySession(session);
        expect(mockSocket.emit).toBeCalledWith('playerDisconnect', player);
      });
      it('should add a town listener, which should emit "townClosing" to the socket and disconnect it when disconnectAllPlayers is called', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        testingTown.disconnectAllPlayers();
        expect(mockSocket.emit).toBeCalledWith('townClosing');
        expect(mockSocket.disconnect).toBeCalledWith(true);
      });
      it('MinigameRequestHandlers join game room', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        minigameSubscriptionHandler(mockSocket);
        const joinGameHandler = mockSocket.on.mock.calls.find(call => call[0] === 'join_game_room');

        if (joinGameHandler && joinGameHandler[1]) {
          const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
          await joinGameHandler[1](newMinigameArea.label);                    
        } else {
          fail('No joinGameHandler registered');
        }
      });
      it('MinigameRequestHandlers start game', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        minigameSubscriptionHandler(mockSocket);
        const joinGameHandler = mockSocket.on.mock.calls.find(call => call[0] === 'join_game_room');
        const startGameHandler = mockSocket.on.mock.calls.find(call => call[0] === 'start_game');

        if (joinGameHandler && joinGameHandler[1] && startGameHandler && startGameHandler[1]) {
          const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
          await joinGameHandler[1](newMinigameArea.label); 
          try {
            await startGameHandler[1](newMinigameArea.label);
          } catch (error) {
            expect(startGameHandler[1]).not.toBe(undefined);
          }
        } else {
          fail('No startGameHandler registered');
        }                 
      });
      it('MinigameRequestHandlers update game', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        minigameSubscriptionHandler(mockSocket);
        const updateGameHandler = mockSocket.on.mock.calls.find(call => call[0] === 'update_game');

        if (updateGameHandler && updateGameHandler[1]) {
          const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
          const newGameMatrix = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ]; 
          try {
            await updateGameHandler[1](newGameMatrix, newMinigameArea.label);
          } catch (error) {
            expect(updateGameHandler[1]).not.toBe(undefined);
          }
        } else {
          fail('No updateGameHandler registered');
        }                 
      });
      it('MinigameRequestHandlers update leaderboard', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        minigameSubscriptionHandler(mockSocket);
        const updateLeaderboardHandler = mockSocket.on.mock.calls.find(call => call[0] === 'update_leaderboard');

        if (updateLeaderboardHandler && updateLeaderboardHandler[1]) {
          const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
          const playerID = 'Jack';
          try {
            await updateLeaderboardHandler[1](newMinigameArea.label, playerID);
          } catch (error) {
            expect(updateLeaderboardHandler[1]).not.toBe(undefined);
          }
        } else {
          fail('No updateLeaderboardHandler registered');
        }                 
      });
      it('MinigameRequestHandlers game over', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        minigameSubscriptionHandler(mockSocket);
        const updateGameOver = mockSocket.on.mock.calls.find(call => call[0] === 'game_over');

        if (updateGameOver && updateGameOver[1]) {
          const messageLost = 'You Lost!';
          const messageWin = 'Congrats You Won';
          const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
          
          try {
            await updateGameOver[1](messageLost, newMinigameArea.label);
          } catch (error) {
            expect(updateGameOver[1]).not.toBe(undefined);
          }
          try {
            await updateGameOver[1](messageWin, newMinigameArea.label);
          } catch (error) {
            expect(updateGameOver[1]).not.toBe(undefined);
          }
        } else {
          fail('No updateGameOver registered');
        }                 
      });
      describe('when a socket disconnect event is fired', () => {
        it('should remove the town listener for that socket, and stop sending events to it', async () => {
          TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            const newPlayer = new Player('should not be notified');
            await testingTown.addPlayer(newPlayer);
            expect(mockSocket.emit).not.toHaveBeenCalledWith('newPlayer', newPlayer);
          } else {
            fail('No disconnect handler registered');
          }
        });
        it('should destroy the session corresponding to that socket', async () => {
          TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            mockReset(mockSocket);
            TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
            townSubscriptionHandler(mockSocket);
            expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
          } else {
            fail('No disconnect handler registered');
          }

        });
      });
      it('should forward playerMovement events from the socket to subscribed listeners', async () => {
        TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, session.sessionToken, mockSocket);
        townSubscriptionHandler(mockSocket);
        const mockListener = mock<CoveyTownListener>();
        testingTown.addTownListener(mockListener);
        // find the 'playerMovement' event handler for the socket, which should have been registered after the socket was connected
        const playerMovementHandler = mockSocket.on.mock.calls.find(call => call[0] === 'playerMovement');
        if (playerMovementHandler && playerMovementHandler[1]) {
          const newLocation = generateTestLocation();
          player.location = newLocation;
          playerMovementHandler[1](newLocation);
          expect(mockListener.onPlayerMoved).toHaveBeenCalledWith(player);
        } else {
          fail('No playerMovement handler registered');
        }
      });
    });
  });
  describe('addConversationArea', () => {
    let testingTown: CoveyTownController;
    beforeEach(() => {
      const townName = `addConversationArea test town ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
    });
    it('should add the conversation area to the list of conversation areas', ()=>{
      const newConversationArea = TestUtils.createConversationForTesting();
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);
      const areas = testingTown.conversationAreas;
      expect(areas.length).toEqual(1);
      expect(areas[0].label).toEqual(newConversationArea.label);
      expect(areas[0].topic).toEqual(newConversationArea.topic);
      expect(areas[0].boundingBox).toEqual(newConversationArea.boundingBox);
    });
  });
  describe('updatePlayerLocation', () =>{
    let testingTown: CoveyTownController;
    beforeEach(() => {
      const townName = `updatePlayerLocation test town ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
    });
    it('should respect the conversation area reported by the player userLocation.conversationLabel, and not override it based on the player\'s x,y location', async ()=>{
      const newConversationArea = TestUtils.createConversationForTesting({ boundingBox: { x: 10, y: 10, height: 5, width: 5 } });
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);
      const player = new Player(nanoid());
      await testingTown.addPlayer(player);

      const newLocation:UserLocation = { moving: false, rotation: 'front', x: 25, y: 25, conversationLabel: newConversationArea.label };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(player.activeConversationArea?.label).toEqual(newConversationArea.label);
      expect(player.activeConversationArea?.topic).toEqual(newConversationArea.topic);
      expect(player.activeConversationArea?.boundingBox).toEqual(newConversationArea.boundingBox);

      const areas = testingTown.conversationAreas;
      expect(areas[0].occupantsByID.length).toBe(1);
      expect(areas[0].occupantsByID[0]).toBe(player.id);
    }); 
    it('should emit an onConversationUpdated event when a conversation area gets a new occupant', async () =>{

      const newConversationArea = TestUtils.createConversationForTesting({ boundingBox: { x: 10, y: 10, height: 5, width: 5 } });
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);

      const mockListener = mock<CoveyTownListener>();
      testingTown.addTownListener(mockListener);

      const player = new Player(nanoid());
      await testingTown.addPlayer(player);
      const newLocation:UserLocation = { moving: false, rotation: 'front', x: 25, y: 25, conversationLabel: newConversationArea.label };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(mockListener.onConversationAreaUpdated).toHaveBeenCalledTimes(1);
    });
    it('Custom: should respect the mini game area reported by the player userLocation.minigameLabel, and not override it based on the player\'s x,y location', async ()=>{
      const player = new Player(nanoid());
      await testingTown.addPlayer(player);
      const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      const result = testingTown.addMinigameArea(newMinigameArea, player.id);
      expect(result).toBe(true);     
      
      const newLocation:UserLocation = { moving: false, rotation: 'front', x: 25, y: 25, minigameLabel: newMinigameArea.label };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(player.activeMinigameArea?.label).toEqual(newMinigameArea.label);
      expect(player.activeMinigameArea?.boundingBox).toEqual(newMinigameArea.boundingBox);

      const areas = testingTown.minigameAreas;
      expect(areas[0].playersByID.length).toBe(1);
      expect(areas[0].playersByID[0]).toBe(player.id);
    });
    it('Custom: update the player location from the minigame to non minigame area', async ()=>{
      const player = new Player(nanoid());
      const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      player.activeMinigameArea = newMinigameArea;
      await testingTown.addPlayer(player);
      const result = testingTown.addMinigameArea(newMinigameArea, player.id);
      expect(result).toBe(true);     
      
      const newLocation:UserLocation = { moving: false, rotation: 'front', x: 25, y: 25 };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(player.activeMinigameArea).toEqual(undefined);

      const areas = testingTown.minigameAreas;
      expect(areas[0]).toBe(undefined);
    }); 
    it('Custom: should emit an onMinigameAreaUpdated event when a minigame area gets a new player', async () =>{
      const mockListener = mock<CoveyTownListener>();
      testingTown.addTownListener(mockListener);

      const player = new Player(nanoid());
      const hostPlayer = new Player(nanoid());
      await testingTown.addPlayer(player);
      await testingTown.addPlayer(hostPlayer);
      const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      const result = testingTown.addMinigameArea(newMinigameArea, hostPlayer.id);
      expect(result).toBe(true);
      expect(mockListener.onMinigameAreaUpdated).toHaveBeenCalledTimes(1);

      const newLocation:UserLocation = { moving: false, rotation: 'front', x: 25, y: 25, minigameLabel: newMinigameArea.label };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(mockListener.onMinigameAreaUpdated).toHaveBeenCalledTimes(2);
    });
    it('Custom: should emit an onMinigameAreaDestroyed event when a minigame area has no player', async ()=>{
      const mockListener = mock<CoveyTownListener>();
      testingTown.addTownListener(mockListener);

      const player = new Player(nanoid());
      const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      player.activeMinigameArea = newMinigameArea;
      await testingTown.addPlayer(player);
      const result = testingTown.addMinigameArea(newMinigameArea, player.id);
      expect(result).toBe(true);     
      
      const newLocation:UserLocation = { moving: false, rotation: 'front', x: 25, y: 25 };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(player.activeMinigameArea).toEqual(undefined);

      const areas = testingTown.minigameAreas;
      expect(areas[0]).toBe(undefined);
      expect(mockListener.onMinigameAreaDestroyed).toHaveBeenCalledTimes(1);
    }); 
    it('Custom: should emit an onMinigameAreaUpdated event when a player left a minigame area and one still exist', async ()=>{
      const mockListener = mock<CoveyTownListener>();
      testingTown.addTownListener(mockListener);

      const areas = testingTown.minigameAreas;
      const player = new Player(nanoid());
      const joinPlayer = new Player(nanoid());
      const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      const minigameLocation:UserLocation = { moving: false, rotation: 'front', x: 50, y: 50, minigameLabel: newMinigameArea.label };
      player.activeMinigameArea = newMinigameArea;
      await testingTown.addPlayer(player);
      await testingTown.addPlayer(joinPlayer);
      const result1 = testingTown.addMinigameArea(newMinigameArea, player.id);
      expect(result1).toBe(true);
      expect(mockListener.onMinigameAreaUpdated).toHaveBeenCalledTimes(1);
      testingTown.updatePlayerLocation(joinPlayer, minigameLocation);    
      expect(areas[0]).toBe(newMinigameArea);
      expect(mockListener.onMinigameAreaUpdated).toHaveBeenCalledTimes(2);
      
      const newLocation:UserLocation = { moving: false, rotation: 'front', x: 25, y: 25 };
      testingTown.updatePlayerLocation(joinPlayer, newLocation);
      expect(joinPlayer.activeMinigameArea).toEqual(undefined);
      expect(player.activeMinigameArea).toEqual(newMinigameArea);

      expect(areas[0]).toBe(newMinigameArea);
      expect(mockListener.onMinigameAreaDestroyed).toHaveBeenCalledTimes(0);
      expect(mockListener.onMinigameAreaUpdated).toHaveBeenCalledTimes(3);
    }); 
  });
  describe('addMinigameArea', () => {
    let testingTown: CoveyTownController;
    beforeEach(() => {
      const townName = `addConversationArea test town ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
    });
    it('should return false if there is a minigame that has same label as the given mini game', ()=>{
      const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      const player1 = new Player(nanoid());
      const result = testingTown.addMinigameArea(newMinigameArea, player1.id);
      expect(result).toBe(true);
      const newMinigameArea2 = TestUtils.createMiniGameForTesting({ boundingBox: { x: 80, y: 80, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      const player2 = new Player(nanoid());
      const result2 = testingTown.addMinigameArea(newMinigameArea2, player2.id);
      expect(result2).toBe(false);
    });
    it('should return false if there is a minigame bounding box overlapped', ()=>{
      const newMinigameArea = TestUtils.createMiniGameForTesting({ boundingBox: { x: 50, y: 50, height: 5, width: 5 }, minigameLabel: 'tictactoe' });
      const player1 = new Player(nanoid());
      const result = testingTown.addMinigameArea(newMinigameArea, player1.id);
      expect(result).toBe(true);
      const newMinigameArea2 = TestUtils.createMiniGameForTesting({ boundingBox: { x: 52, y: 52, height: 5, width: 5 }, minigameLabel: 'tictactoe2' });
      const player2 = new Player(nanoid());
      const result2 = testingTown.addMinigameArea(newMinigameArea2, player2.id);
      expect(result2).toBe(false);
    });
  });
});

// onMinigameAreaUpdated(minigameArea: ServerMinigameArea) : void;