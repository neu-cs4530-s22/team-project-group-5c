# Covey.Town TicTacToe Minigame Version

https://amazing-rosalind-98f1ce.netlify.app

Covey.Town TicTacToe Minigame Version is an enhanced version of the original Covey.Town with the added TicTacToe Minigame feature. This feature that we have developed as a group is the introduction of minigames into CoveyTown. The concept that inspired our feature is to add some entertainment to CoveyTown so that users can not only talk to each other but also play games in the Town. We have made use of an arcade area in Covey.Town in order to implement our Minigame feature, where users can get together to play minigames. Our specific feature is a multiplayer TicTacToe game as well as a leaderboard for TicTacToe. We added two interactable gameAreas that function similarly to the existing conversationAreas but allow users to play a game of TicTacToe with others in the town.

### Usage

In order to be able to play Tic Tac Toe with another player, the user must first go into the Arcade in Covey.Town. This space can be found by first going as far South as possible and then as far East. Here there will be a "portal" embedded in the wall with two arrows indicating where to go. Once there, there will be two clearly labeled Minigame Areas where users can get together to play TicTacToe. The game will only start when two players join the Minigame Area. Either of the two Minigame Areas can be used to play as long as they are not already fully occupied. Multiple games can also be running at once. The first player who goes into the area will be prompted to start a new game by pressing space. The second player that walks into the Minigame Area will be able to join the game after also pressing space. Any other player that enters the area will not be able to join the game, as it will be occupied! The host will be then prompted to press the start button in order to start the TicTacToe game. Now both playerrs can play TicTacToe until one of them wins, or until they reach a tie. After the game finishes both players will be able to see the leaderboard. Tthe leaderboard displays the top ten players in the town with the most TicTacToe wins.

Covey.Town Arcade
![Covey.Town Arcade](docs/Screen%20Shot%202022-04-25%20at%206.59.22%20PM.png)
Tic Tac Toe Game
![Tic Tac Toe Game](docs/Screen%20Shot%202022-04-25%20at%207.02.06%20PM.png)
Leaderboard
![Leaderboard](docs/Screen%20Shot%202022-04-25%20at%207.08.11%20PM.png)
# Covey.Town

Covey.Town provides a virtual meeting space where different groups of people can have simultaneous video calls, allowing participants to drift between different conversations, just like in real life. Covey.Town was built for Northeastern's [Spring 2021 software engineering course](https://neu-se.github.io/CS4530-CS5500-Spring-2021/), and is designed to be reused across semesters.
You can view our reference deployment of the app at [app.covey.town](https://app.covey.town/) - this is the version that students built on, and our [project showcase](https://neu-se.github.io/CS4530-CS5500-Spring-2021/project-showcase) highlights select projects from Spring 2021.

![Covey.Town Architecture](docs/covey-town-architecture.png)

The figure above depicts the high-level architecture of Covey.Town.
The frontend client (in the `frontend` directory of this repository) uses the [PhaserJS Game Library](https://phaser.io) to create a 2D game interface, using tilemaps and sprites.
The frontend implements video chat using the [Twilio Programmable Video](https://www.twilio.com/docs/video) API, and that aspect of the interface relies heavily on [Twilio's React Starter App](https://github.com/twilio/twilio-video-app-react). Twilio's React Starter App is packaged and reused under the Apache License, 2.0.

A backend service (in the `services/townService` directory) implements the application logic: tracking which "towns" are available to be joined, and the state of each of those towns.

## Running this app locally

Running the application locally entails running both the backend service and a frontend.

### Setting up the backend

To run the backend, you will need a Twilio account. Twilio provides new accounts with $15 of credit, which is more than enough to get started.
To create an account and configure your local environment:

1. Go to [Twilio](https://www.twilio.com/) and create an account. You do not need to provide a credit card to create a trial account.
2. Create an API key and secret (select "API Keys" on the left under "Settings")
3. Create a `.env` file in the `services/townService` directory, setting the values as follows:

| Config Value            | Description                               |
| ----------------------- | ----------------------------------------- |
| `TWILIO_ACCOUNT_SID`    | Visible on your twilio account dashboard. |
| `TWILIO_API_KEY_SID`    | The SID of the new API key you created.   |
| `TWILIO_API_KEY_SECRET` | The secret for the API key you created.   |
| `TWILIO_API_AUTH_TOKEN` | Visible on your twilio account dashboard. |

### Starting the backend

Once your backend is configured, you can start it by running `npm start` in the `services/townService` directory (the first time you run it, you will also need to run `npm install`).
The backend will automatically restart if you change any of the files in the `services/townService/src` directory.

No other installation is required for the added Minigame feature.

### Configuring the frontend

Create a `.env` file in the `frontend` directory, with the line: `REACT_APP_TOWNS_SERVICE_URL=http://localhost:8081` (if you deploy the towns service to another location, put that location here instead)

### Running the frontend

In the `frontend` directory, run `npm start` (again, you'll need to run `npm install` the very first time). After several moments (or minutes, depending on the speed of your machine), a browser will open with the frontend running locally.
The frontend will automatically re-compile and reload in your browser if you change any files in the `frontend/src` directory.

No other installation is required for the added Minigame feature.


