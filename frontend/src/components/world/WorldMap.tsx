// import Phaser from 'phaser';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useToast } from '@chakra-ui/react';
// import BoundingBox from '../../classes/BoundingBox';
// import ConversationArea from '../../classes/ConversationArea';
// import MinigameArea from '../../classes/MinigameArea';
// import Player, { ServerPlayer, UserLocation } from '../../classes/Player';
// import Video from '../../classes/Video/Video';
// import useConversationAreas from '../../hooks/useConversationAreas';
// import useCoveyAppState from '../../hooks/useCoveyAppState';
// import usePlayerMovement from '../../hooks/usePlayerMovement';
// import usePlayersInTown from '../../hooks/usePlayersInTown';
// import SocialSidebar from '../SocialSidebar/SocialSidebar';
// import { Callback } from '../VideoCall/VideoFrontend/types';
// import NewConversationModal from './NewCoversationModal';
// import NewMinigameModal from './NewMinigameModal';
// import useMinigameAreas from '../../hooks/useMinigameAreas';

// // Original inspiration and code from:
// // https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6

// type ConversationGameObjects = {
//   labelText: Phaser.GameObjects.Text;
//   topicText: Phaser.GameObjects.Text;
//   sprite: Phaser.GameObjects.Sprite;
//   label: string;
//   conversationArea?: ConversationArea;
// };

// type MiniGameObjects = {
//   labelText: Phaser.GameObjects.Text;
//   topicText: Phaser.GameObjects.Text;
//   sprite: Phaser.GameObjects.Sprite;
//   label: string;
//   minigameArea?: MinigameArea;
// }

// class CoveyGameScene extends Phaser.Scene {
//   private player?: {
//     sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
//     label: Phaser.GameObjects.Text;
//   };

//   private myPlayerID: string;

//   private players: Player[] = [];

//   private conversationAreas: ConversationGameObjects[] = [];

//   private minigameAreas: MiniGameObjects[] = [];

//   private cursors: Phaser.Types.Input.Keyboard.CursorKeys[] = [];

//   /*
//    * A "captured" key doesn't send events to the browser - they are trapped by Phaser
//    * When pausing the game, we uncapture all keys, and when resuming, we re-capture them.
//    * This is the list of keys that are currently captured by Phaser.
//    */
//   private previouslyCapturedKeys: number[] = [];

//   private lastLocation?: UserLocation;

//   private ready = false;

//   private paused = false;

//   private video: Video;

//   private emitMovement: (loc: UserLocation) => void;

//   private currentConversationArea?: ConversationGameObjects;

//   private currentMinigameArea?: MiniGameObjects;

//   private infoTextBox?: Phaser.GameObjects.Text;

//   private joinMinigameTextBox?: Phaser.GameObjects.Text;

//   private occupiedMinigameTextBox?: Phaser.GameObjects.Text;

//   private setNewConversation: (conv: ConversationArea) => void;

//   private setNewMinigame: (minigame: MinigameArea) => void;

//   private setCreateMinigame: (createMinigame: boolean) => void;

//   private _onGameReadyListeners: Callback[] = [];

//   constructor(
//     video: Video,
//     emitMovement: (loc: UserLocation) => void,
//     setNewConversation: (conv: ConversationArea) => void,
//     setNewMinigame: (minigame: MinigameArea) => void,
//     setCreateMinigame: (createMinigame: boolean) => void,
//     myPlayerID: string,
//   ) {
//     super('PlayGame');
//     this.video = video;
//     this.emitMovement = emitMovement;
//     this.myPlayerID = myPlayerID;
//     this.setNewConversation = setNewConversation;
//     this.setNewMinigame = setNewMinigame;
//     this.setCreateMinigame = setCreateMinigame;
//   }

//   preload() {
//     // this.load.image("logo", logoImg);
//     this.load.image('Room_Builder_32x32', '/assets/tilesets/Room_Builder_32x32.png');
//     this.load.image('22_Museum_32x32', '/assets/tilesets/22_Museum_32x32.png');
//     this.load.image(
//       '5_Classroom_and_library_32x32',
//       '/assets/tilesets/5_Classroom_and_library_32x32.png',
//     );
//     this.load.image('12_Kitchen_32x32', '/assets/tilesets/12_Kitchen_32x32.png');
//     this.load.image('1_Generic_32x32', '/assets/tilesets/1_Generic_32x32.png');
//     this.load.image('13_Conference_Hall_32x32', '/assets/tilesets/13_Conference_Hall_32x32.png');
//     this.load.image('14_Basement_32x32', '/assets/tilesets/14_Basement_32x32.png');
//     this.load.image('16_Grocery_store_32x32', '/assets/tilesets/16_Grocery_store_32x32.png');
//     this.load.tilemapTiledJSON('map', '/assets/tilemaps/indoors.json');
//     this.load.atlas('atlas', '/assets/atlas/atlas.png', '/assets/atlas/atlas.json');
//   }

//   /**
//    * Update the WorldMap's view of the current conversation areas, updating their topics and
//    * participants, as necessary
//    *
//    * @param conversationAreas
//    * @returns
//    */
//   updateConversationAreas(conversationAreas: ConversationArea[]) {
//     if (!this.ready) {
//       /*
//        * Due to the asynchronous nature of setting up a Phaser game scene (it requires gathering
//        * some resources using asynchronous operations), it is possible that this could be called
//        * in the period between when the player logs in and when the game is ready. Hence, we
//        * register a callback to complete the initialization once the game is ready
//        */
//       this._onGameReadyListeners.push(() => {
//         this.updateConversationAreas(conversationAreas);
//       });
//       return;
//     }
//     conversationAreas.forEach(eachNewArea => {
//       const existingArea = this.conversationAreas.find(area => area.label === eachNewArea.label);
//       // TODO - if it becomes necessary to support new conversation areas (dynamically created), need to create sprites here to enable rendering on phaser
//       // assert(existingArea);
//       if (existingArea) {
//         // assert(!existingArea.conversationArea);
//         existingArea.conversationArea = eachNewArea;
//         const updateListener = {
//           onTopicChange: (newTopic: string | undefined) => {
//             if (newTopic) {
//               existingArea.topicText.text = newTopic;
//             } else {
//               existingArea.topicText.text = '(No topic)';
//             }
//           },
//         };
//         eachNewArea.addListener(updateListener);
//         updateListener.onTopicChange(eachNewArea.topic);
//       }
//     });
//     this.conversationAreas.forEach(eachArea => {
//       const serverArea = conversationAreas?.find(a => a.label === eachArea.label);
//       if (!serverArea) {
//         eachArea.conversationArea = undefined;
//       }
//     });
//   }

//   /**
//    * Update the WorldMap's view of the current minigame areas based on the minigameAreas passed from the server.
//    * Updates the minigame areas in the WorldMap.
//    */
//   updateMinigameAreas(minigameAreas: MinigameArea[]) {
//     if (!this.ready) {
//       /*
//        * Due to the asynchronous nature of setting up a Phaser game scene (it requires gathering
//        * some resources using asynchronous operations), it is possible that this could be called
//        * in the period between when the player logs in and when the game is ready. Hence, we
//        * register a callback to complete the initialization once the game is ready
//        */
//       this._onGameReadyListeners.push(() => {
//         this.updateMinigameAreas(minigameAreas);
//       });
//       return;
//     }
//     minigameAreas.forEach(eachNewArea => {
//       const existingArea = this.minigameAreas.find(area => area.label === eachNewArea.label);
//       // TODO - if it becomes necessary to support new minigame areas (dynamically created), need to create sprites here to enable rendering on phaser
//       // assert(existingArea);
//       if (existingArea) {
//         // assert(!existingArea.conversationArea);
//         // Connects minigame objects to minigame areas from the server 
//         existingArea.minigameArea = eachNewArea;
//       }
//     });
//     // If the minigame area is removed from the server, it will be updated here
//     this.minigameAreas.forEach(eachArea => {
//       const serverArea = minigameAreas.find(a => a.label === eachArea.label);
//       if (!serverArea) {
//         eachArea.minigameArea = undefined;
//       }
//     });
//   }

//   updatePlayersLocations(players: Player[]) {
//     if (!this.ready) {
//       this.players = players;
//       return;
//     }
//     players.forEach(p => {
//       this.updatePlayerLocation(p);
//     });
//     // Remove disconnected players from board
//     const disconnectedPlayers = this.players.filter(
//       player => !players.find(p => p.id === player.id),
//     );
//     disconnectedPlayers.forEach(disconnectedPlayer => {
//       if (disconnectedPlayer.sprite) {
//         disconnectedPlayer.sprite.destroy();
//         disconnectedPlayer.label?.destroy();
//       }
//     });
//     // Remove disconnected players from list
//     if (disconnectedPlayers.length) {
//       this.players = this.players.filter(
//         player => !disconnectedPlayers.find(p => p.id === player.id),
//       );
//     }
//   }

//   updatePlayerLocation(player: Player) {
//     let myPlayer = this.players.find(p => p.id === player.id);
//     if (!myPlayer) {
//       let { location } = player;
//       if (!location) {
//         location = {
//           rotation: 'back',
//           moving: false,
//           x: 0,
//           y: 0,
//         };
//       }
//       myPlayer = new Player(player.id, player.userName, location);
//       this.players.push(myPlayer);
//     }
//     if (this.myPlayerID !== myPlayer.id && this.physics && player.location) {
//       let { sprite } = myPlayer;
//       if (!sprite) {
//         sprite = this.physics.add
//           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//           // @ts-ignore - JB todo
//           .sprite(0, 0, 'atlas', 'misa-front')
//           .setSize(30, 40)
//           .setOffset(0, 24);
//         const label = this.add.text(0, 0, myPlayer.userName, {
//           font: '18px monospace',
//           color: '#000000',
//           backgroundColor: '#ffffff',
//         });
//         myPlayer.label = label;
//         myPlayer.sprite = sprite;
//       }
//       if (!sprite.anims) return;
//       sprite.setX(player.location.x);
//       sprite.setY(player.location.y);
//       myPlayer.label?.setX(player.location.x);
//       myPlayer.label?.setY(player.location.y - 20);
//       if (player.location.moving) {
//         sprite.anims.play(`misa-${player.location.rotation}-walk`, true);
//       } else {
//         sprite.anims.stop();
//         sprite.setTexture('atlas', `misa-${player.location.rotation}`);
//       }
//     }
//   }

//   getNewMovementDirection() {
//     if (this.cursors.find(keySet => keySet.left?.isDown)) {
//       return 'left';
//     }
//     if (this.cursors.find(keySet => keySet.right?.isDown)) {
//       return 'right';
//     }
//     if (this.cursors.find(keySet => keySet.down?.isDown)) {
//       return 'front';
//     }
//     if (this.cursors.find(keySet => keySet.up?.isDown)) {
//       return 'back';
//     }
//     return undefined;
//   }

//   /**
//    * This function is used to remove a player from a minigame by updating the minigame label in their location to be undefined 
//    */
//   updatePlayerMinigameLocation() {
//     if (this.lastLocation) {
//       this.lastLocation.minigameLabel = undefined;
//       this.emitMovement(this.lastLocation);
//     }
//   }

//   update() {
//     if (this.paused) {
//       return;
//     }
//     if (this.player && this.cursors) {
//       const speed = 550;

//       const prevVelocity = this.player.sprite.body.velocity.clone();
//       const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;

//       // Stop any previous movement from the last frame
//       body.setVelocity(0);

//       const primaryDirection = this.getNewMovementDirection();
//       switch (primaryDirection) {
//         case 'left':
//           body.setVelocityX(-speed);
//           this.player.sprite.anims.play('misa-left-walk', true);
//           break;
//         case 'right':
//           body.setVelocityX(speed);
//           this.player.sprite.anims.play('misa-right-walk', true);
//           break;
//         case 'front':
//           body.setVelocityY(speed);
//           this.player.sprite.anims.play('misa-front-walk', true);
//           break;
//         case 'back':
//           body.setVelocityY(-speed);
//           this.player.sprite.anims.play('misa-back-walk', true);
//           break;
//         default:
//           // Not moving
//           this.player.sprite.anims.stop();
//           // If we were moving, pick and idle frame to use
//           if (prevVelocity.x < 0) {
//             this.player.sprite.setTexture('atlas', 'misa-left');
//           } else if (prevVelocity.x > 0) {
//             this.player.sprite.setTexture('atlas', 'misa-right');
//           } else if (prevVelocity.y < 0) {
//             this.player.sprite.setTexture('atlas', 'misa-back');
//           } else if (prevVelocity.y > 0) this.player.sprite.setTexture('atlas', 'misa-front');
//           break;
//       }

//       // Normalize and scale the velocity so that player can't move faster along a diagonal
//       this.player.sprite.body.velocity.normalize().scale(speed);

//       const isMoving = primaryDirection !== undefined;
//       this.player.label.setX(body.x);
//       this.player.label.setY(body.y - 20);
//       if (
//         !this.lastLocation ||
//         this.lastLocation.x !== body.x ||
//         this.lastLocation.y !== body.y ||
//         (isMoving && this.lastLocation.rotation !== primaryDirection) ||
//         this.lastLocation.moving !== isMoving
//       ) {
//         if (!this.lastLocation) {
//           this.lastLocation = {
//             x: body.x,
//             y: body.y,
//             rotation: primaryDirection || 'front',
//             moving: isMoving,
//           };
//         }
//         this.lastLocation.x = body.x;
//         this.lastLocation.y = body.y;
//         this.lastLocation.rotation = primaryDirection || 'front';
//         this.lastLocation.moving = isMoving;
//         if (this.currentConversationArea) {
//           if(this.currentConversationArea.conversationArea){
//             this.lastLocation.conversationLabel = this.currentConversationArea.label;
//           }
//           if (
//             !Phaser.Geom.Rectangle.Overlaps(
//               this.currentConversationArea.sprite.getBounds(),
//               this.player.sprite.getBounds(),
//             )
//           ) {
//             this.infoTextBox?.setVisible(false);
//             this.currentConversationArea = undefined;
//             this.lastLocation.conversationLabel = undefined;
//           }
//         }
//         // Current minigame area is populated when they walk into an area
//         if (this.currentMinigameArea) {
//           if (
//             !Phaser.Geom.Rectangle.Overlaps(
//               this.currentMinigameArea.sprite.getBounds(),
//               this.player.sprite.getBounds(),
//             )
//           ) {
//             // When they walk out of an area, the current location is updated so the minigame label is undefined 
//             this.joinMinigameTextBox?.setVisible(false);
//             this.occupiedMinigameTextBox?.setVisible(false);
//             this.currentMinigameArea = undefined;
//             this.lastLocation.minigameLabel = undefined;
//           }
//         }
//         // emitMovement emits a 'playerMovement' on the socket which is read by the server
//         this.emitMovement(this.lastLocation);
//       }
//     }
//   }

//   create() {
//     const map = this.make.tilemap({ key: 'map' });

//     /* Parameters are the name you gave the tileset in Tiled and then the key of the
//      tileset image in Phaser's cache (i.e. the name you used in preload)
//      */
//     const tileset = [
//       'Room_Builder_32x32',
//       '22_Museum_32x32',
//       '5_Classroom_and_library_32x32',
//       '12_Kitchen_32x32',
//       '1_Generic_32x32',
//       '13_Conference_Hall_32x32',
//       '14_Basement_32x32',
//       '16_Grocery_store_32x32',
//     ].map(v => map.addTilesetImage(v));

//     // Parameters: layer name (or index) from Tiled, tileset, x, y
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
//     const wallsLayer = map.createLayer('Walls', tileset, 0, 0);
//     const onTheWallsLayer = map.createLayer('On The Walls', tileset, 0, 0);
//     wallsLayer.setCollisionByProperty({ collides: true });
//     onTheWallsLayer.setCollisionByProperty({ collides: true });

//     const worldLayer = map.createLayer('World', tileset, 0, 0);
//     worldLayer.setCollisionByProperty({ collides: true });
//     const aboveLayer = map.createLayer('Above Player', tileset, 0, 0);
//     aboveLayer.setCollisionByProperty({ collides: true });

//     const veryAboveLayer = map.createLayer('Very Above Player', tileset, 0, 0);
//     /* By default, everything gets depth sorted on the screen in the order we created things.
//      Here, we want the "Above Player" layer to sit on top of the player, so we explicitly give
//      it a depth. Higher depths will sit on top of lower depth objects.
//      */
//     worldLayer.setDepth(5);
//     aboveLayer.setDepth(10);
//     veryAboveLayer.setDepth(15);

//     // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
//     // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
//     const spawnPoint = (map.findObject(
//       'Objects',
//       obj => obj.name === 'Spawn Point',
//     ) as unknown) as Phaser.GameObjects.Components.Transform;

//     // Find all of the transporters, add them to the physics engine
//     const transporters = map.createFromObjects('Objects', { name: 'transporter' });
//     this.physics.world.enable(transporters);

//     // For each of the transporters (rectangle objects), we need to tweak their location on the scene
//     // for reasons that are not obvious to me, but this seems to work. We also set them to be invisible
//     // but for debugging, you can comment out that line.
//     transporters.forEach(transporter => {
//       const sprite = transporter as Phaser.GameObjects.Sprite;
//       sprite.y += sprite.displayHeight; // Phaser and Tiled seem to disagree on which corner is y
//       sprite.setVisible(false); // Comment this out to see the transporter rectangles drawn on
//       // the map
//     });

//     const minigameAreaObjects = map.filterObjects(
//       'Objects',
//       obj => obj.type === 'minigame',
//     )
//     const minigameSprites = map.createFromObjects(
//       'Objects',
//       minigameAreaObjects.map(obj => ({ id: obj.id })),
//     );
//     this.physics.world.enable(minigameSprites);
//     minigameSprites.forEach(minigame => {
//       const sprite = minigame as Phaser.GameObjects.Sprite;
//       sprite.y += sprite.displayHeight;
//       const labelText = this.add.text(
//         sprite.x - sprite.displayWidth / 2,
//         sprite.y,
//         minigame.name,
//         { color: '#FFFFFF', backgroundColor: '#000000' },
//       );
//       const topicText = this.add.text(
//         sprite.x - sprite.displayWidth / 2,
//         sprite.y + sprite.displayHeight / 2,
//         '(MINI GAME)',
//         { color: '#000000' },
//       );
//       sprite.setTintFill();
//       sprite.setAlpha(0.3);

//       this.minigameAreas.push({
//         labelText,
//         topicText,
//         sprite,
//         label: minigame.name,
//       });
//     });

//     const conversationAreaObjects = map.filterObjects(
//       'Objects',
//       obj => obj.type === 'conversation',
//     );
//     const conversationSprites = map.createFromObjects(
//       'Objects',
//       conversationAreaObjects.map(obj => ({ id: obj.id })),
//     );
//     this.physics.world.enable(conversationSprites);
//     conversationSprites.forEach(conversation => {
//       const sprite = conversation as Phaser.GameObjects.Sprite;
//       sprite.y += sprite.displayHeight;
//       const labelText = this.add.text(
//         sprite.x - sprite.displayWidth / 2,
//         sprite.y - sprite.displayHeight / 2,
//         conversation.name,
//         { color: '#FFFFFF', backgroundColor: '#000000' },
//       );
//       const topicText = this.add.text(
//         sprite.x - sprite.displayWidth / 2,
//         sprite.y + sprite.displayHeight / 2,
//         '(No Topic)',
//         { color: '#000000' },
//       );
//       sprite.setTintFill();
//       sprite.setAlpha(0.3);

//       this.conversationAreas.push({
//         labelText,
//         topicText,
//         sprite,
//         label: conversation.name,
//       });
//     });

//     this.infoTextBox = this.add
//       .text(
//         this.game.scale.width / 2,
//         this.game.scale.height / 2,
//         "You've found an empty conversation area!\nTell others what you'd like to talk about here\nby providing a topic label for the conversation.\nSpecify a topic by pressing the spacebar.",
//         { color: '#000000', backgroundColor: '#FFFFFF' },
//       )
//       .setScrollFactor(0)
//       .setDepth(30);
//     this.infoTextBox.setVisible(false);
//     this.infoTextBox.x = this.game.scale.width / 2 - this.infoTextBox.width / 2;

//     // Seperate textBoxes are added to the game scene for when a user finds a new game vs. an occupied game
//     this.joinMinigameTextBox = this.add
//       .text(
//         this.game.scale.width / 2,
//         this.game.scale.height / 2,
//         "You've found an empty minigame area!\nStart the game by pressing the spacebar.",
//         { color: '#000000', backgroundColor: '#FFFFFF' },
//       )
//       .setScrollFactor(0)
//       .setDepth(30);
//     this.joinMinigameTextBox.setVisible(false);
//     this.joinMinigameTextBox.x = this.game.scale.width / 2 - this.joinMinigameTextBox.width / 2;

//     this.occupiedMinigameTextBox = this.add
//       .text(
//         this.game.scale.width / 2,
//         this.game.scale.height / 2,
//         "This game is already occupied!\nFind another game area or wait here.",
//         { color: '#000000', backgroundColor: '#FFFFFF' },
//       )
//       .setScrollFactor(0)
//       .setDepth(30);
//     this.occupiedMinigameTextBox.setVisible(false);
//     this.occupiedMinigameTextBox.x = this.game.scale.width / 2 - this.occupiedMinigameTextBox.width / 2;

//     const labels = map.filterObjects('Objects', obj => obj.name === 'label');
//     labels.forEach(label => {
//       if (label.x && label.y) {
//         this.add.text(label.x, label.y, label.text.text, {
//           color: '#FFFFFF',
//           backgroundColor: '#000000',
//         });
//       }
//     });

//     const cursorKeys = this.input.keyboard.createCursorKeys();
//     this.cursors.push(cursorKeys);
//     this.cursors.push(
//       this.input.keyboard.addKeys(
//         {
//           up: Phaser.Input.Keyboard.KeyCodes.W,
//           down: Phaser.Input.Keyboard.KeyCodes.S,
//           left: Phaser.Input.Keyboard.KeyCodes.A,
//           right: Phaser.Input.Keyboard.KeyCodes.D,
//         },
//         false,
//       ) as Phaser.Types.Input.Keyboard.CursorKeys,
//     );
//     this.cursors.push(
//       this.input.keyboard.addKeys(
//         {
//           up: Phaser.Input.Keyboard.KeyCodes.H,
//           down: Phaser.Input.Keyboard.KeyCodes.J,
//           left: Phaser.Input.Keyboard.KeyCodes.K,
//           right: Phaser.Input.Keyboard.KeyCodes.L,
//         },
//         false,
//       ) as Phaser.Types.Input.Keyboard.CursorKeys,
//     );

//     // Create a sprite with physics enabled via the physics system. The image used for the sprite
//     // has a bit of whitespace, so I'm using setSize & setOffset to control the size of the
//     // player's body.
//     const sprite = this.physics.add
//       .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'misa-front')
//       .setSize(30, 40)
//       .setOffset(0, 24);
//     const label = this.add.text(spawnPoint.x, spawnPoint.y - 20, '(You)', {
//       font: '18px monospace',
//       color: '#000000',
//       // padding: {x: 20, y: 10},
//       backgroundColor: '#ffffff',
//     });
//     this.player = {
//       sprite,
//       label,
//     };

//     /* Configure physics overlap behavior for when the player steps into
//     a transporter area. If you enter a transporter and press 'space', you'll
//     transport to the location on the map that is referenced by the 'target' property
//     of the transporter.
//      */
//     this.physics.add.overlap(sprite, transporters, (overlappingObject, transporter) => {
//       if (this.player) {
//         // In the tiled editor, set the 'target' to be an *object* pointer
//         // Here, we'll see just the ID, then find the object by ID
//         const transportTargetID = transporter.getData('target') as number;
//         const target = map.findObject(
//           'Objects',
//           obj => ((obj as unknown) as Phaser.Types.Tilemaps.TiledObject).id === transportTargetID,
//         );
//         if (target && target.x && target.y && this.lastLocation) {
//           // Move the player to the target, update lastLocation and send it to other players
//           this.player.sprite.x = target.x;
//           this.player.sprite.y = target.y;
//           this.lastLocation.x = target.x;
//           this.lastLocation.y = target.y;
//           this.emitMovement(this.lastLocation);
//         } else {
//           throw new Error(`Unable to find target object ${target}`);
//         }
//       }
//     });
//     this.physics.add.overlap(
//       sprite,
//       conversationSprites,
//       (overlappingPlayer, conversationSprite) => {
//         const conversationLabel = conversationSprite.name;
//         const conv = this.conversationAreas.find(area => area.label === conversationLabel);
//         this.currentConversationArea = conv;
//         if (conv?.conversationArea) {
//           this.infoTextBox?.setVisible(false);
//           const localLastLocation = this.lastLocation;
//           if(localLastLocation && localLastLocation.conversationLabel !== conv.conversationArea.label){
//             localLastLocation.conversationLabel = conv.conversationArea.label;
//             this.emitMovement(localLastLocation);
//           }
//         } else {
//           if (cursorKeys.space.isDown) {
//             const newConversation = new ConversationArea(
//               conversationLabel,
//               BoundingBox.fromSprite(conversationSprite as Phaser.GameObjects.Sprite),
//             );
//             this.setNewConversation(newConversation);
//           }
//           this.infoTextBox?.setVisible(true);
//         }
//       },
//     );

//     // This defines the functionality for when a user overlaps with a minigame area 
//     this.physics.add.overlap(
//       sprite,
//       minigameSprites,
//       (overlappingPlayer, minigameSprite) => {
//         const minigameLabel = minigameSprite.name;
//         const minigame = this.minigameAreas.find(mg => mg.label === minigameLabel);
//         this.currentMinigameArea = minigame;
//         // If there is an existing minigameArea (meaning there is at least a host)
//         // display the corresponding textbox
//         if (minigame?.minigameArea) {
//           // There is a host and a guest
//           if (minigame.minigameArea.playersByID.length === 2) {
//             this.occupiedMinigameTextBox?.setVisible(true);
//             this.joinMinigameTextBox?.setVisible(false);
//           } 
//           // There is a host but not both players
//           else {
//             if (cursorKeys.space.isDown) {
//               const updatedMinigameArea = minigame?.minigameArea;
//               if (updatedMinigameArea) {
//                 const localLastLocation = this.lastLocation;
//                 // When a player clicks space to join the minigame, their location gets updated 
//                 if(localLastLocation && localLastLocation.minigameLabel !== minigame.minigameArea.label){
//                   localLastLocation.minigameLabel = minigame.minigameArea.label;
//                   this.emitMovement(localLastLocation);
//                 }
//                 this.setNewMinigame(updatedMinigameArea);
//                 this.setCreateMinigame(false);
//               }
//             }
//             this.occupiedMinigameTextBox?.setVisible(false);
//             this.joinMinigameTextBox?.setVisible(true);
//           }
//         } else {
//           // There is not an existing minigameArea. Create one if the spacebar button is pressed.
//           // The default for no minigameArea will show the joinMinigameTextBox
//           if (cursorKeys.space.isDown) {
//             const newMinigameArea = new MinigameArea(
//               BoundingBox.fromSprite(minigameSprite as Phaser.GameObjects.Sprite),
//               minigameLabel,
//               // "new TicTacToeModel(
//               //   false,
//               //   [myPlayer],
//               //   false
//               // ),"
//               "tic tac toe"
//             );
//             this.setNewMinigame(newMinigameArea);
//             // Only the host can create a minigame
//             this.setCreateMinigame(true);
//           }
//           this.occupiedMinigameTextBox?.setVisible(false);
//           this.joinMinigameTextBox?.setVisible(true);
//         }
//       },
//     );

//     this.emitMovement({
//       rotation: 'front',
//       moving: false,
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore - JB todo
//       x: spawnPoint.x,
//       y: spawnPoint.y,
//     });

//     // Watch the player and worldLayer for collisions, for the duration of the scene:
//     this.physics.add.collider(sprite, worldLayer);
//     this.physics.add.collider(sprite, wallsLayer);
//     this.physics.add.collider(sprite, aboveLayer);
//     this.physics.add.collider(sprite, onTheWallsLayer);

//     // Create the player's walking animations from the texture atlas. These are stored in the global
//     // animation manager so any sprite can access them.
//     const { anims } = this;
//     anims.create({
//       key: 'misa-left-walk',
//       frames: anims.generateFrameNames('atlas', {
//         prefix: 'misa-left-walk.',
//         start: 0,
//         end: 3,
//         zeroPad: 3,
//       }),
//       frameRate: 10,
//       repeat: -1,
//     });
//     anims.create({
//       key: 'misa-right-walk',
//       frames: anims.generateFrameNames('atlas', {
//         prefix: 'misa-right-walk.',
//         start: 0,
//         end: 3,
//         zeroPad: 3,
//       }),
//       frameRate: 10,
//       repeat: -1,
//     });
//     anims.create({
//       key: 'misa-front-walk',
//       frames: anims.generateFrameNames('atlas', {
//         prefix: 'misa-front-walk.',
//         start: 0,
//         end: 3,
//         zeroPad: 3,
//       }),
//       frameRate: 10,
//       repeat: -1,
//     });
//     anims.create({
//       key: 'misa-back-walk',
//       frames: anims.generateFrameNames('atlas', {
//         prefix: 'misa-back-walk.',
//         start: 0,
//         end: 3,
//         zeroPad: 3,
//       }),
//       frameRate: 10,
//       repeat: -1,
//     });

//     const camera = this.cameras.main;
//     camera.startFollow(this.player.sprite);
//     camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

//     // Help text that has a "fixed" position on the screen
//     this.add
//       .text(
//         16,
//         16,
//         `Arrow keys to move`,
//         {
//           font: '18px monospace',
//           color: '#000000',
//           padding: {
//             x: 20,
//             y: 10,
//           },
//           backgroundColor: '#ffffff',
//         },
//       )
//       .setScrollFactor(0)
//       .setDepth(30);

//     this.ready = true;
//     if (this.players.length) {
//       // Some players got added to the queue before we were ready, make sure that they have
//       // sprites....
//       this.players.forEach(p => this.updatePlayerLocation(p));
//     }
//     // Call any listeners that are waiting for the game to be initialized
//     this._onGameReadyListeners.forEach(listener => listener());
//     this._onGameReadyListeners = [];
//   }

//   pause() {
//     if (!this.paused) {
//       this.paused = true;
//       if(this.player){
//         this.player?.sprite.anims.stop();
//         const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;
//         body.setVelocity(0);
//       }
//       this.previouslyCapturedKeys = this.input.keyboard.getCaptures();
//       this.input.keyboard.clearCaptures();
//     }
//   }

//   resume() {
//     if (this.paused) {
//       this.paused = false;
//       if (Video.instance()) {
//         // If the game is also in process of being torn down, the keyboard could be undefined
//         this.input.keyboard.addCapture(this.previouslyCapturedKeys);
//       }
//       this.previouslyCapturedKeys = [];
//     }
//   }
// }

// export default function WorldMap(): JSX.Element {
//   const {apiClient, sessionToken, currentTownID} = useCoveyAppState();
//   const video = Video.instance();
//   const { emitMovement, myPlayerID } = useCoveyAppState();
//   const conversationAreas = useConversationAreas();
//   const minigameAreas = useMinigameAreas();
//   const [gameScene, setGameScene] = useState<CoveyGameScene>();
//   const [newConversation, setNewConversation] = useState<ConversationArea>();
//   const [newMinigame, setNewMinigame] = useState<MinigameArea>();
//   const playerMovementCallbacks = usePlayerMovement();
//   const players = usePlayersInTown();
//   // const [newGameHost, setNewGameHost] = useState<boolean>(false);
//   const [createMinigame, setCreateMinigame] = useState<boolean>(false);
//   const [shouldEmitMinigameLocationMovement, setShouldEmitMinigameLocationMovement] = useState<boolean>(false);
//   const toast = useToast();

//   useEffect(() => {
//     const config = {
//       type: Phaser.AUTO,
//       backgroundColor: '#000000',
//       parent: 'map-container',
//       pixelArt: true,
//       autoRound: 10,
//       minWidth: 800,
//       fps: { target: 30 },
//       powerPreference: 'high-performance',
//       minHeight: 600,
//       physics: {
//         default: 'arcade',
//         arcade: {
//           gravity: { y: 0 }, // Top down game, so no gravity
//         },
//       },
//     };

//     const game = new Phaser.Game(config);
//     if (video) {
//       const newGameScene = new CoveyGameScene(video, emitMovement, setNewConversation, setNewMinigame, setCreateMinigame, myPlayerID);
//       setGameScene(newGameScene);
//       game.scene.add('coveyBoard', newGameScene, true);
//       video.pauseGame = () => {
//         newGameScene.pause();
//       };
//       video.unPauseGame = () => {
//         newGameScene.resume();
//       };
//     }
//     return () => {
//       game.destroy(true);
//     };
//   }, [video, emitMovement, setNewConversation, setNewMinigame, myPlayerID]);

//   useEffect(() => {
//     const movementDispatcher = (player: ServerPlayer) => {
//       gameScene?.updatePlayerLocation(Player.fromServerPlayer(player));
//     };
//     playerMovementCallbacks.push(movementDispatcher);
//     return () => {
//       playerMovementCallbacks.splice(playerMovementCallbacks.indexOf(movementDispatcher), 1);
//     };
//   }, [gameScene, playerMovementCallbacks]);

//   // Each of these useEffects will update the WorldMap's view of the objects when they change based on their respective hooks 
//   useEffect(() => {
//     gameScene?.updatePlayersLocations(players);
//   }, [gameScene, players]);

//   useEffect(() => {
//     gameScene?.updateConversationAreas(conversationAreas);
//   }, [conversationAreas, gameScene]);

//   useEffect(() => {
//     gameScene?.updateMinigameAreas(minigameAreas);
//   }, [minigameAreas, gameScene])

//   const newConversationModalOpen = newConversation !== undefined;
//   useEffect(() => {
//     if (newConversationModalOpen) {
//       video?.pauseGame();
//     } else {
//       video?.unPauseGame();
//     }
//   }, [video, newConversationModalOpen]);

//   const newConversationModal = useMemo(() => {
//     if (newConversation) {
//       video?.pauseGame();
//       return (
//         <NewConversationModal
//           isOpen={newConversation !== undefined}
//           closeModal={() => {
//             video?.unPauseGame();
//             setNewConversation(undefined);
//           }}
//           newConversation={newConversation}
//         />
//       );
//     } 
//     return <></>;
//   }, [video, newConversation, setNewConversation]);

//   const newMinigameModalOpen = newMinigame !== undefined;
//   useEffect(() => {
//     if (newMinigameModalOpen) {
//       video?.pauseGame();
//     } else {
//       video?.unPauseGame();
//     }
//   }, [video, newMinigameModalOpen]);

//   // Performs the API call to actually create the minigame on the server 
//   const createMinigameArea = useCallback(async () => {
//     const minigameToCreate = newMinigame;
//       try {
//         if (minigameToCreate) {
//           await apiClient.createMinigameArea({
//             coveyTownID: currentTownID,
//             sessionToken,
//             host: myPlayerID,
//             minigameArea: minigameToCreate.toServerMinigameArea(),
//           });
//           toast({
//             title: 'Minigame Created!',
//             status: 'success',
//           });
//         }
//       } catch (err) {
//         toast({
//           title: 'Unable to create minigame',
//           description: err.toString(),
//           status: 'error',
//         });
//       }
//   }, [newMinigame, apiClient, currentTownID, sessionToken, myPlayerID, toast]);

//   // Creates a minigame only when createMinigame is set to true. This happens when the host presses space to create the game. 
//   // TODO: this can be removed from the useEffect and put elsewhere.
//   useEffect(() => {
//     if (newMinigame && createMinigame) {
//       // Original
//       console.log("In line 1008 use effect");
//        createMinigameArea();
//        setCreateMinigame(false);
//       // End original

      

//     }
//   }, [createMinigame, createMinigameArea, newMinigame]);

//   // This is used to remove a player from a minigame only when the boolean flag is set to true 
//   useEffect(() => {
//     if (shouldEmitMinigameLocationMovement) {
//       gameScene?.updatePlayerMinigameLocation();
//       setShouldEmitMinigameLocationMovement(false);
//     }
//   }, [shouldEmitMinigameLocationMovement, gameScene]);

//   const newMinigameModal = useMemo(() => {

    
//     video?.pauseGame();

//     if (newMinigame && createMinigame) {
      
//       console.log(`new minigame is ${newMinigame} in world map line 1021`);
//       // if (newGameHost) {
//       //   if (!isNewMinigameCreated) {
//       //     createMinigameArea();
//       //   }
//       // }
//       const closeMinigameModal = () => {
//           video?.unPauseGame();
//           setNewMinigame(undefined);
//           setShouldEmitMinigameLocationMovement(true);
//       }

//       return (
//         <NewMinigameModal
//           isOpen={newMinigame !== undefined}
//           myPlayerID={myPlayerID}
//           closeModal={closeMinigameModal}
//           newMinigameLabel={newMinigame.label}
//         />
//       );
//     }
//     return <></>;
//   }, [video, newMinigame, myPlayerID]);

//   return (
//     <div id='app-container'>
//       {newConversationModal}
//       {newMinigameModal}
//       <div id='map-container' />
//       <div id='social-container'>
//         <SocialSidebar />
//       </div>
//     </div>
//   );
// }

import Phaser from 'phaser';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import BoundingBox from '../../classes/BoundingBox';
import ConversationArea from '../../classes/ConversationArea';
import MinigameArea from '../../classes/MinigameArea';
import Player, { ServerPlayer, UserLocation } from '../../classes/Player';
import Video from '../../classes/Video/Video';
import useConversationAreas from '../../hooks/useConversationAreas';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import usePlayerMovement from '../../hooks/usePlayerMovement';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import SocialSidebar from '../SocialSidebar/SocialSidebar';
import { Callback } from '../VideoCall/VideoFrontend/types';
import NewConversationModal from './NewCoversationModal';
import NewMinigameModal from './NewMinigameModal';
import useMinigameAreas from '../../hooks/useMinigameAreas';
import App from "../world/App";

// Original inspiration and code from:
// https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6

type ConversationGameObjects = {
  labelText: Phaser.GameObjects.Text;
  topicText: Phaser.GameObjects.Text;
  sprite: Phaser.GameObjects.Sprite;
  label: string;
  conversationArea?: ConversationArea;
};

type MiniGameObjects = {
  labelText: Phaser.GameObjects.Text;
  topicText: Phaser.GameObjects.Text;
  sprite: Phaser.GameObjects.Sprite;
  label: string;
  minigameArea?: MinigameArea;
}

class CoveyGameScene extends Phaser.Scene {
  private player?: {
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    label: Phaser.GameObjects.Text;
  };

  private myPlayerID: string;

  private players: Player[] = [];

  private conversationAreas: ConversationGameObjects[] = [];

  private minigameAreas: MiniGameObjects[] = [];

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys[] = [];

  /*
   * A "captured" key doesn't send events to the browser - they are trapped by Phaser
   * When pausing the game, we uncapture all keys, and when resuming, we re-capture them.
   * This is the list of keys that are currently captured by Phaser.
   */
  private previouslyCapturedKeys: number[] = [];

  private lastLocation?: UserLocation;

  private ready = false;

  private paused = false;

  private video: Video;

  private emitMovement: (loc: UserLocation) => void;

  private currentConversationArea?: ConversationGameObjects;

  private currentMinigameArea?: MiniGameObjects;

  private infoTextBox?: Phaser.GameObjects.Text;

  private joinMinigameTextBox?: Phaser.GameObjects.Text;

  private occupiedMinigameTextBox?: Phaser.GameObjects.Text;

  private setNewConversation: (conv: ConversationArea) => void;

  private setNewMinigame: (minigame: MinigameArea) => void;

  private setCreateMinigame: (createMinigame: boolean) => void;

  private _onGameReadyListeners: Callback[] = [];

  constructor(
    video: Video,
    emitMovement: (loc: UserLocation) => void,
    setNewConversation: (conv: ConversationArea) => void,
    setNewMinigame: (minigame: MinigameArea) => void,
    setCreateMinigame: (createMinigame: boolean) => void,
    myPlayerID: string,
  ) {
    super('PlayGame');
    this.video = video;
    this.emitMovement = emitMovement;
    this.myPlayerID = myPlayerID;
    this.setNewConversation = setNewConversation;
    this.setNewMinigame = setNewMinigame;
    this.setCreateMinigame = setCreateMinigame;
  }

  preload() {
    // this.load.image("logo", logoImg);
    this.load.image('Room_Builder_32x32', '/assets/tilesets/Room_Builder_32x32.png');
    this.load.image('22_Museum_32x32', '/assets/tilesets/22_Museum_32x32.png');
    this.load.image(
      '5_Classroom_and_library_32x32',
      '/assets/tilesets/5_Classroom_and_library_32x32.png',
    );
    this.load.image('12_Kitchen_32x32', '/assets/tilesets/12_Kitchen_32x32.png');
    this.load.image('1_Generic_32x32', '/assets/tilesets/1_Generic_32x32.png');
    this.load.image('13_Conference_Hall_32x32', '/assets/tilesets/13_Conference_Hall_32x32.png');
    this.load.image('14_Basement_32x32', '/assets/tilesets/14_Basement_32x32.png');
    this.load.image('16_Grocery_store_32x32', '/assets/tilesets/16_Grocery_store_32x32.png');
    this.load.tilemapTiledJSON('map', '/assets/tilemaps/indoors.json');
    this.load.atlas('atlas', '/assets/atlas/atlas.png', '/assets/atlas/atlas.json');
  }

  /**
   * Update the WorldMap's view of the current conversation areas, updating their topics and
   * participants, as necessary
   *
   * @param conversationAreas
   * @returns
   */
  updateConversationAreas(conversationAreas: ConversationArea[]) {
    if (!this.ready) {
      /*
       * Due to the asynchronous nature of setting up a Phaser game scene (it requires gathering
       * some resources using asynchronous operations), it is possible that this could be called
       * in the period between when the player logs in and when the game is ready. Hence, we
       * register a callback to complete the initialization once the game is ready
       */
      this._onGameReadyListeners.push(() => {
        this.updateConversationAreas(conversationAreas);
      });
      return;
    }
    conversationAreas.forEach(eachNewArea => {
      const existingArea = this.conversationAreas.find(area => area.label === eachNewArea.label);
      // TODO - if it becomes necessary to support new conversation areas (dynamically created), need to create sprites here to enable rendering on phaser
      // assert(existingArea);
      if (existingArea) {
        // assert(!existingArea.conversationArea);
        existingArea.conversationArea = eachNewArea;
        const updateListener = {
          onTopicChange: (newTopic: string | undefined) => {
            if (newTopic) {
              existingArea.topicText.text = newTopic;
            } else {
              existingArea.topicText.text = '(No topic)';
            }
          },
        };
        eachNewArea.addListener(updateListener);
        updateListener.onTopicChange(eachNewArea.topic);
      }
    });
    this.conversationAreas.forEach(eachArea => {
      const serverArea = conversationAreas?.find(a => a.label === eachArea.label);
      if (!serverArea) {
        eachArea.conversationArea = undefined;
      }
    });
  }

  /**
   * Update the WorldMap's view of the current minigame areas based on the minigameAreas passed from the server.
   * Updates the minigame areas in the WorldMap.
   */
  updateMinigameAreas(minigameAreas: MinigameArea[]) {
    if (!this.ready) {
      /*
       * Due to the asynchronous nature of setting up a Phaser game scene (it requires gathering
       * some resources using asynchronous operations), it is possible that this could be called
       * in the period between when the player logs in and when the game is ready. Hence, we
       * register a callback to complete the initialization once the game is ready
       */
      this._onGameReadyListeners.push(() => {
        this.updateMinigameAreas(minigameAreas);
      });
      return;
    }
    minigameAreas.forEach(eachNewArea => {
      const existingArea = this.minigameAreas.find(area => area.label === eachNewArea.label);
      // TODO - if it becomes necessary to support new minigame areas (dynamically created), need to create sprites here to enable rendering on phaser
      // assert(existingArea);
      if (existingArea) {
        // assert(!existingArea.conversationArea);
        // Connects minigame objects to minigame areas from the server 
        existingArea.minigameArea = eachNewArea;
      }
    });
    // If the minigame area is removed from the server, it will be updated here
    this.minigameAreas.forEach(eachArea => {
      const serverArea = minigameAreas.find(a => a.label === eachArea.label);
      if (!serverArea) {
        eachArea.minigameArea = undefined;
      }
    });
  }

  updatePlayersLocations(players: Player[]) {
    if (!this.ready) {
      this.players = players;
      return;
    }
    players.forEach(p => {
      this.updatePlayerLocation(p);
    });
    // Remove disconnected players from board
    const disconnectedPlayers = this.players.filter(
      player => !players.find(p => p.id === player.id),
    );
    disconnectedPlayers.forEach(disconnectedPlayer => {
      if (disconnectedPlayer.sprite) {
        disconnectedPlayer.sprite.destroy();
        disconnectedPlayer.label?.destroy();
      }
    });
    // Remove disconnected players from list
    if (disconnectedPlayers.length) {
      this.players = this.players.filter(
        player => !disconnectedPlayers.find(p => p.id === player.id),
      );
    }
  }

  updatePlayerLocation(player: Player) {
    let myPlayer = this.players.find(p => p.id === player.id);
    if (!myPlayer) {
      let { location } = player;
      if (!location) {
        location = {
          rotation: 'back',
          moving: false,
          x: 0,
          y: 0,
        };
      }
      myPlayer = new Player(player.id, player.userName, location);
      this.players.push(myPlayer);
    }
    if (this.myPlayerID !== myPlayer.id && this.physics && player.location) {
      let { sprite } = myPlayer;
      if (!sprite) {
        sprite = this.physics.add
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - JB todo
          .sprite(0, 0, 'atlas', 'misa-front')
          .setSize(30, 40)
          .setOffset(0, 24);
        const label = this.add.text(0, 0, myPlayer.userName, {
          font: '18px monospace',
          color: '#000000',
          backgroundColor: '#ffffff',
        });
        myPlayer.label = label;
        myPlayer.sprite = sprite;
      }
      if (!sprite.anims) return;
      sprite.setX(player.location.x);
      sprite.setY(player.location.y);
      myPlayer.label?.setX(player.location.x);
      myPlayer.label?.setY(player.location.y - 20);
      if (player.location.moving) {
        sprite.anims.play(`misa-${player.location.rotation}-walk`, true);
      } else {
        sprite.anims.stop();
        sprite.setTexture('atlas', `misa-${player.location.rotation}`);
      }
    }
  }

  getNewMovementDirection() {
    if (this.cursors.find(keySet => keySet.left?.isDown)) {
      return 'left';
    }
    if (this.cursors.find(keySet => keySet.right?.isDown)) {
      return 'right';
    }
    if (this.cursors.find(keySet => keySet.down?.isDown)) {
      return 'front';
    }
    if (this.cursors.find(keySet => keySet.up?.isDown)) {
      return 'back';
    }
    return undefined;
  }

  /**
   * This function is used to remove a player from a minigame by updating the minigame label in their location to be undefined 
   */
  updatePlayerMinigameLocation() {
    if (this.lastLocation) {
      this.lastLocation.minigameLabel = undefined;
      this.emitMovement(this.lastLocation);
    }
  }

  update() {
    if (this.paused) {
      return;
    }
    if (this.player && this.cursors) {
      const speed = 550;

      const prevVelocity = this.player.sprite.body.velocity.clone();
      const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;

      // Stop any previous movement from the last frame
      body.setVelocity(0);

      const primaryDirection = this.getNewMovementDirection();
      switch (primaryDirection) {
        case 'left':
          body.setVelocityX(-speed);
          this.player.sprite.anims.play('misa-left-walk', true);
          break;
        case 'right':
          body.setVelocityX(speed);
          this.player.sprite.anims.play('misa-right-walk', true);
          break;
        case 'front':
          body.setVelocityY(speed);
          this.player.sprite.anims.play('misa-front-walk', true);
          break;
        case 'back':
          body.setVelocityY(-speed);
          this.player.sprite.anims.play('misa-back-walk', true);
          break;
        default:
          // Not moving
          this.player.sprite.anims.stop();
          // If we were moving, pick and idle frame to use
          if (prevVelocity.x < 0) {
            this.player.sprite.setTexture('atlas', 'misa-left');
          } else if (prevVelocity.x > 0) {
            this.player.sprite.setTexture('atlas', 'misa-right');
          } else if (prevVelocity.y < 0) {
            this.player.sprite.setTexture('atlas', 'misa-back');
          } else if (prevVelocity.y > 0) this.player.sprite.setTexture('atlas', 'misa-front');
          break;
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      this.player.sprite.body.velocity.normalize().scale(speed);

      const isMoving = primaryDirection !== undefined;
      this.player.label.setX(body.x);
      this.player.label.setY(body.y - 20);
      if (
        !this.lastLocation ||
        this.lastLocation.x !== body.x ||
        this.lastLocation.y !== body.y ||
        (isMoving && this.lastLocation.rotation !== primaryDirection) ||
        this.lastLocation.moving !== isMoving
      ) {
        if (!this.lastLocation) {
          this.lastLocation = {
            x: body.x,
            y: body.y,
            rotation: primaryDirection || 'front',
            moving: isMoving,
          };
        }
        this.lastLocation.x = body.x;
        this.lastLocation.y = body.y;
        this.lastLocation.rotation = primaryDirection || 'front';
        this.lastLocation.moving = isMoving;
        if (this.currentConversationArea) {
          if(this.currentConversationArea.conversationArea){
            this.lastLocation.conversationLabel = this.currentConversationArea.label;
          }
          if (
            !Phaser.Geom.Rectangle.Overlaps(
              this.currentConversationArea.sprite.getBounds(),
              this.player.sprite.getBounds(),
            )
          ) {
            this.infoTextBox?.setVisible(false);
            this.currentConversationArea = undefined;
            this.lastLocation.conversationLabel = undefined;
          }
        }
        // Current minigame area is populated when they walk into an area
        if (this.currentMinigameArea) {
          if (
            !Phaser.Geom.Rectangle.Overlaps(
              this.currentMinigameArea.sprite.getBounds(),
              this.player.sprite.getBounds(),
            )
          ) {
            // When they walk out of an area, the current location is updated so the minigame label is undefined 
            this.joinMinigameTextBox?.setVisible(false);
            this.occupiedMinigameTextBox?.setVisible(false);
            this.currentMinigameArea = undefined;
            this.lastLocation.minigameLabel = undefined;
          }
        }
        // emitMovement emits a 'playerMovement' on the socket which is read by the server
        this.emitMovement(this.lastLocation);
      }
    }
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });

    /* Parameters are the name you gave the tileset in Tiled and then the key of the
     tileset image in Phaser's cache (i.e. the name you used in preload)
     */
    const tileset = [
      'Room_Builder_32x32',
      '22_Museum_32x32',
      '5_Classroom_and_library_32x32',
      '12_Kitchen_32x32',
      '1_Generic_32x32',
      '13_Conference_Hall_32x32',
      '14_Basement_32x32',
      '16_Grocery_store_32x32',
    ].map(v => map.addTilesetImage(v));

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
    const wallsLayer = map.createLayer('Walls', tileset, 0, 0);
    const onTheWallsLayer = map.createLayer('On The Walls', tileset, 0, 0);
    wallsLayer.setCollisionByProperty({ collides: true });
    onTheWallsLayer.setCollisionByProperty({ collides: true });

    const worldLayer = map.createLayer('World', tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });
    const aboveLayer = map.createLayer('Above Player', tileset, 0, 0);
    aboveLayer.setCollisionByProperty({ collides: true });

    const veryAboveLayer = map.createLayer('Very Above Player', tileset, 0, 0);
    /* By default, everything gets depth sorted on the screen in the order we created things.
     Here, we want the "Above Player" layer to sit on top of the player, so we explicitly give
     it a depth. Higher depths will sit on top of lower depth objects.
     */
    worldLayer.setDepth(5);
    aboveLayer.setDepth(10);
    veryAboveLayer.setDepth(15);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const spawnPoint = (map.findObject(
      'Objects',
      obj => obj.name === 'Spawn Point',
    ) as unknown) as Phaser.GameObjects.Components.Transform;

    // Find all of the transporters, add them to the physics engine
    const transporters = map.createFromObjects('Objects', { name: 'transporter' });
    this.physics.world.enable(transporters);

    // For each of the transporters (rectangle objects), we need to tweak their location on the scene
    // for reasons that are not obvious to me, but this seems to work. We also set them to be invisible
    // but for debugging, you can comment out that line.
    transporters.forEach(transporter => {
      const sprite = transporter as Phaser.GameObjects.Sprite;
      sprite.y += sprite.displayHeight; // Phaser and Tiled seem to disagree on which corner is y
      sprite.setVisible(false); // Comment this out to see the transporter rectangles drawn on
      // the map
    });

    const minigameAreaObjects = map.filterObjects(
      'Objects',
      obj => obj.type === 'minigame',
    )
    const minigameSprites = map.createFromObjects(
      'Objects',
      minigameAreaObjects.map(obj => ({ id: obj.id })),
    );
    this.physics.world.enable(minigameSprites);
    minigameSprites.forEach(minigame => {
      const sprite = minigame as Phaser.GameObjects.Sprite;
      sprite.y += sprite.displayHeight;
      const labelText = this.add.text(
        sprite.x - sprite.displayWidth / 2,
        sprite.y,
        minigame.name,
        { color: '#FFFFFF', backgroundColor: '#000000' },
      );
      const topicText = this.add.text(
        sprite.x - sprite.displayWidth / 2,
        sprite.y + sprite.displayHeight / 2,
        '(MINI GAME)',
        { color: '#000000' },
      );
      sprite.setTintFill();
      sprite.setAlpha(0.3);

      this.minigameAreas.push({
        labelText,
        topicText,
        sprite,
        label: minigame.name,
      });
    });

    const conversationAreaObjects = map.filterObjects(
      'Objects',
      obj => obj.type === 'conversation',
    );
    const conversationSprites = map.createFromObjects(
      'Objects',
      conversationAreaObjects.map(obj => ({ id: obj.id })),
    );
    this.physics.world.enable(conversationSprites);
    conversationSprites.forEach(conversation => {
      const sprite = conversation as Phaser.GameObjects.Sprite;
      sprite.y += sprite.displayHeight;
      const labelText = this.add.text(
        sprite.x - sprite.displayWidth / 2,
        sprite.y - sprite.displayHeight / 2,
        conversation.name,
        { color: '#FFFFFF', backgroundColor: '#000000' },
      );
      const topicText = this.add.text(
        sprite.x - sprite.displayWidth / 2,
        sprite.y + sprite.displayHeight / 2,
        '(No Topic)',
        { color: '#000000' },
      );
      sprite.setTintFill();
      sprite.setAlpha(0.3);

      this.conversationAreas.push({
        labelText,
        topicText,
        sprite,
        label: conversation.name,
      });
    });

    this.infoTextBox = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2,
        "You've found an empty conversation area!\nTell others what you'd like to talk about here\nby providing a topic label for the conversation.\nSpecify a topic by pressing the spacebar.",
        { color: '#000000', backgroundColor: '#FFFFFF' },
      )
      .setScrollFactor(0)
      .setDepth(30);
    this.infoTextBox.setVisible(false);
    this.infoTextBox.x = this.game.scale.width / 2 - this.infoTextBox.width / 2;

    // Seperate textBoxes are added to the game scene for when a user finds a new game vs. an occupied game
    this.joinMinigameTextBox = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2,
        "You've found an empty minigame area!\nStart the game by pressing the spacebar.",
        { color: '#000000', backgroundColor: '#FFFFFF' },
      )
      .setScrollFactor(0)
      .setDepth(30);
    this.joinMinigameTextBox.setVisible(false);
    this.joinMinigameTextBox.x = this.game.scale.width / 2 - this.joinMinigameTextBox.width / 2;

    this.occupiedMinigameTextBox = this.add
      .text(
        this.game.scale.width / 2,
        this.game.scale.height / 2,
        "This game is already occupied!\nFind another game area or wait here.",
        { color: '#000000', backgroundColor: '#FFFFFF' },
      )
      .setScrollFactor(0)
      .setDepth(30);
    this.occupiedMinigameTextBox.setVisible(false);
    this.occupiedMinigameTextBox.x = this.game.scale.width / 2 - this.occupiedMinigameTextBox.width / 2;

    const labels = map.filterObjects('Objects', obj => obj.name === 'label');
    labels.forEach(label => {
      if (label.x && label.y) {
        this.add.text(label.x, label.y, label.text.text, {
          color: '#FFFFFF',
          backgroundColor: '#000000',
        });
      }
    });

    const cursorKeys = this.input.keyboard.createCursorKeys();
    this.cursors.push(cursorKeys);
    this.cursors.push(
      this.input.keyboard.addKeys(
        {
          up: Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        },
        false,
      ) as Phaser.Types.Input.Keyboard.CursorKeys,
    );
    this.cursors.push(
      this.input.keyboard.addKeys(
        {
          up: Phaser.Input.Keyboard.KeyCodes.H,
          down: Phaser.Input.Keyboard.KeyCodes.J,
          left: Phaser.Input.Keyboard.KeyCodes.K,
          right: Phaser.Input.Keyboard.KeyCodes.L,
        },
        false,
      ) as Phaser.Types.Input.Keyboard.CursorKeys,
    );

    // Create a sprite with physics enabled via the physics system. The image used for the sprite
    // has a bit of whitespace, so I'm using setSize & setOffset to control the size of the
    // player's body.
    const sprite = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'misa-front')
      .setSize(30, 40)
      .setOffset(0, 24);
    const label = this.add.text(spawnPoint.x, spawnPoint.y - 20, '(You)', {
      font: '18px monospace',
      color: '#000000',
      // padding: {x: 20, y: 10},
      backgroundColor: '#ffffff',
    });
    this.player = {
      sprite,
      label,
    };

    /* Configure physics overlap behavior for when the player steps into
    a transporter area. If you enter a transporter and press 'space', you'll
    transport to the location on the map that is referenced by the 'target' property
    of the transporter.
     */
    this.physics.add.overlap(sprite, transporters, (overlappingObject, transporter) => {
      if (this.player) {
        // In the tiled editor, set the 'target' to be an *object* pointer
        // Here, we'll see just the ID, then find the object by ID
        const transportTargetID = transporter.getData('target') as number;
        const target = map.findObject(
          'Objects',
          obj => ((obj as unknown) as Phaser.Types.Tilemaps.TiledObject).id === transportTargetID,
        );
        if (target && target.x && target.y && this.lastLocation) {
          // Move the player to the target, update lastLocation and send it to other players
          this.player.sprite.x = target.x;
          this.player.sprite.y = target.y;
          this.lastLocation.x = target.x;
          this.lastLocation.y = target.y;
          this.emitMovement(this.lastLocation);
        } else {
          throw new Error(`Unable to find target object ${target}`);
        }
      }
    });
    this.physics.add.overlap(
      sprite,
      conversationSprites,
      (overlappingPlayer, conversationSprite) => {
        const conversationLabel = conversationSprite.name;
        const conv = this.conversationAreas.find(area => area.label === conversationLabel);
        this.currentConversationArea = conv;
        if (conv?.conversationArea) {
          this.infoTextBox?.setVisible(false);
          const localLastLocation = this.lastLocation;
          if(localLastLocation && localLastLocation.conversationLabel !== conv.conversationArea.label){
            localLastLocation.conversationLabel = conv.conversationArea.label;
            this.emitMovement(localLastLocation);
          }
        } else {
          if (cursorKeys.space.isDown) {
            const newConversation = new ConversationArea(
              conversationLabel,
              BoundingBox.fromSprite(conversationSprite as Phaser.GameObjects.Sprite),
            );
            this.setNewConversation(newConversation);
          }
          this.infoTextBox?.setVisible(true);
        }
      },
    );

    // This defines the functionality for when a user overlaps with a minigame area 
    this.physics.add.overlap(
      sprite,
      minigameSprites,
      (overlappingPlayer, minigameSprite) => {
        const minigameLabel = minigameSprite.name;
        const minigame = this.minigameAreas.find(mg => mg.label === minigameLabel);
        this.currentMinigameArea = minigame;
        // If there is an existing minigameArea (meaning there is at least a host)
        // display the corresponding textbox
        if (minigame?.minigameArea) {
          // There is a host and a guest
          if (minigame.minigameArea.playersByID.length === 2) {
            this.occupiedMinigameTextBox?.setVisible(true);
            this.joinMinigameTextBox?.setVisible(false);
          } 
          // There is a host but not both players
          else {
            if (cursorKeys.space.isDown) {
              const updatedMinigameArea = minigame?.minigameArea;
              if (updatedMinigameArea) {
                const localLastLocation = this.lastLocation;
                // When a player clicks space to join the minigame, their location gets updated 
                if(localLastLocation && localLastLocation.minigameLabel !== minigame.minigameArea.label){
                  localLastLocation.minigameLabel = minigame.minigameArea.label;
                  this.emitMovement(localLastLocation);
                }
                this.setNewMinigame(updatedMinigameArea);
                this.setCreateMinigame(false);
              }
            }
            this.occupiedMinigameTextBox?.setVisible(false);
            this.joinMinigameTextBox?.setVisible(true);
          }
        } else {
          // There is not an existing minigameArea. Create one if the spacebar button is pressed.
          // The default for no minigameArea will show the joinMinigameTextBox
          if (cursorKeys.space.isDown) {
            const newMinigameArea = new MinigameArea(
              BoundingBox.fromSprite(minigameSprite as Phaser.GameObjects.Sprite),
              minigameLabel,
              // "new TicTacToeModel(
              //   false,
              //   [myPlayer],
              //   false
              // ),"
              "tic tac toe"
            );
            this.setNewMinigame(newMinigameArea);
            // Only the host can create a minigame
            this.setCreateMinigame(true);
          }
          this.occupiedMinigameTextBox?.setVisible(false);
          this.joinMinigameTextBox?.setVisible(true);
        }
      },
    );

    this.emitMovement({
      rotation: 'front',
      moving: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - JB todo
      x: spawnPoint.x,
      y: spawnPoint.y,
    });

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(sprite, worldLayer);
    this.physics.add.collider(sprite, wallsLayer);
    this.physics.add.collider(sprite, aboveLayer);
    this.physics.add.collider(sprite, onTheWallsLayer);

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const { anims } = this;
    anims.create({
      key: 'misa-left-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-left-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-right-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-right-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-front-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-front-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: 'misa-back-walk',
      frames: anims.generateFrameNames('atlas', {
        prefix: 'misa-back-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(
        16,
        16,
        `Arrow keys to move`,
        {
          font: '18px monospace',
          color: '#000000',
          padding: {
            x: 20,
            y: 10,
          },
          backgroundColor: '#ffffff',
        },
      )
      .setScrollFactor(0)
      .setDepth(30);

    this.ready = true;
    if (this.players.length) {
      // Some players got added to the queue before we were ready, make sure that they have
      // sprites....
      this.players.forEach(p => this.updatePlayerLocation(p));
    }
    // Call any listeners that are waiting for the game to be initialized
    this._onGameReadyListeners.forEach(listener => listener());
    this._onGameReadyListeners = [];
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      if(this.player){
        this.player?.sprite.anims.stop();
        const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0);
      }
      this.previouslyCapturedKeys = this.input.keyboard.getCaptures();
      this.input.keyboard.clearCaptures();
    }
  }

  resume() {
    if (this.paused) {
      this.paused = false;
      if (Video.instance()) {
        // If the game is also in process of being torn down, the keyboard could be undefined
        this.input.keyboard.addCapture(this.previouslyCapturedKeys);
      }
      this.previouslyCapturedKeys = [];
    }
  }
}

export default function WorldMap(): JSX.Element {
  const {apiClient, sessionToken, currentTownID} = useCoveyAppState();
  const video = Video.instance();
  const { emitMovement, myPlayerID } = useCoveyAppState();
  const conversationAreas = useConversationAreas();
  const minigameAreas = useMinigameAreas();
  const [gameScene, setGameScene] = useState<CoveyGameScene>();
  const [newConversation, setNewConversation] = useState<ConversationArea>();
  const [newMinigame, setNewMinigame] = useState<MinigameArea>();
  const playerMovementCallbacks = usePlayerMovement();
  const players = usePlayersInTown();
  // const [newGameHost, setNewGameHost] = useState<boolean>(false);
  const [createMinigame, setCreateMinigame] = useState<boolean>(false);
  const [shouldEmitMinigameLocationMovement, setShouldEmitMinigameLocationMovement] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      backgroundColor: '#000000',
      parent: 'map-container',
      pixelArt: true,
      autoRound: 10,
      minWidth: 800,
      fps: { target: 30 },
      powerPreference: 'high-performance',
      minHeight: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }, // Top down game, so no gravity
        },
      },
    };

    const game = new Phaser.Game(config);
    if (video) {
      const newGameScene = new CoveyGameScene(video, emitMovement, setNewConversation, setNewMinigame, setCreateMinigame, myPlayerID);
      setGameScene(newGameScene);
      game.scene.add('coveyBoard', newGameScene, true);
      video.pauseGame = () => {
        newGameScene.pause();
      };
      video.unPauseGame = () => {
        newGameScene.resume();
      };
    }
    return () => {
      game.destroy(true);
    };
  }, [video, emitMovement, setNewConversation, setNewMinigame, myPlayerID]);

  useEffect(() => {
    const movementDispatcher = (player: ServerPlayer) => {
      gameScene?.updatePlayerLocation(Player.fromServerPlayer(player));
    };
    playerMovementCallbacks.push(movementDispatcher);
    return () => {
      playerMovementCallbacks.splice(playerMovementCallbacks.indexOf(movementDispatcher), 1);
    };
  }, [gameScene, playerMovementCallbacks]);

  // Each of these useEffects will update the WorldMap's view of the objects when they change based on their respective hooks 
  useEffect(() => {
    gameScene?.updatePlayersLocations(players);
  }, [gameScene, players]);

  useEffect(() => {
    gameScene?.updateConversationAreas(conversationAreas);
  }, [conversationAreas, gameScene]);

  useEffect(() => {
    gameScene?.updateMinigameAreas(minigameAreas);
  }, [minigameAreas, gameScene])

  const newConversationModalOpen = newConversation !== undefined;
  useEffect(() => {
    if (newConversationModalOpen) {
      video?.pauseGame();
    } else {
      video?.unPauseGame();
    }
  }, [video, newConversationModalOpen]);

  const newConversationModal = useMemo(() => {
    if (newConversation) {
      video?.pauseGame();
      return (
        <NewConversationModal
          isOpen={newConversation !== undefined}
          closeModal={() => {
            video?.unPauseGame();
            setNewConversation(undefined);
          }}
          newConversation={newConversation}
        />
      );
    } 
    return <></>;
  }, [video, newConversation, setNewConversation]);

  const newMinigameModalOpen = newMinigame !== undefined;
  useEffect(() => {
    if (newMinigameModalOpen) {
      video?.pauseGame();
    } else {
      video?.unPauseGame();
    }
  }, [video, newMinigameModalOpen]);

  // Performs the API call to actually create the minigame on the server 
  const createMinigameArea = useCallback(async () => {
    const minigameToCreate = newMinigame;
      try {
        if (minigameToCreate) {
          await apiClient.createMinigameArea({
            coveyTownID: currentTownID,
            sessionToken,
            host: myPlayerID,
            minigameArea: minigameToCreate.toServerMinigameArea(),
          });
          toast({
            title: 'Minigame Created!',
            status: 'success',
          });
        }
      } catch (err) {
        toast({
          title: 'Unable to create minigame',
          description: err.toString(),
          status: 'error',
        });
      }
  }, [newMinigame, apiClient, currentTownID, sessionToken, myPlayerID, toast]);

  // Creates a minigame only when createMinigame is set to true. This happens when the host presses space to create the game. 
  // TODO: this can be removed from the useEffect and put elsewhere.
  useEffect(() => {
    if (newMinigame && createMinigame) {
      createMinigameArea();
      setCreateMinigame(false);
    }
  }, [createMinigame, createMinigameArea, newMinigame]);

  // This is used to remove a player from a minigame only when the boolean flag is set to true 
  useEffect(() => {
    if (shouldEmitMinigameLocationMovement) {
      gameScene?.updatePlayerMinigameLocation();
      setShouldEmitMinigameLocationMovement(false);
    }
  }, [shouldEmitMinigameLocationMovement, gameScene]);

  const newMinigameModal = useMemo(() => {

    video?.pauseGame();

    if (newMinigame) {
      // if (newGameHost) {
      //   if (!isNewMinigameCreated) {
      //     createMinigameArea();
      //   }
      // }
      const closeMinigameModal = () => {
          video?.unPauseGame();
          setNewMinigame(undefined);
          setShouldEmitMinigameLocationMovement(true);
      }

      return (
        <App />
      )

      // return (
      //   <NewMinigameModal
      //     isOpen={newMinigame !== undefined}
      //     myPlayerID={myPlayerID}
      //     closeModal={closeMinigameModal}
      //     newMinigameLabel={newMinigame.label}
      //   />
      // );
    }
    return <></>;
  }, [video, newMinigame, myPlayerID]);

  return (
    <div id='app-container'>
      {newConversationModal}
      {newMinigameModal}
      <div id='map-container' />
      <div id='social-container'>
        <SocialSidebar />
      </div>
    </div>
  );
}