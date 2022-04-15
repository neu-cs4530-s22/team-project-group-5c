import { keyBy, values } from "lodash";

export default class TicTacToeLeaderBoard {

    // The number of wins by username
    private _scores: { [username: string]: number; } = {};

    constructor(scores: { [username: string]: number; }) {
        this._scores = scores;
    }

    /**
     * Get the scores in the leaderboard
     */
    get scores(): { [username: string]: number; } {
        return this.scores;
    }

    /**
     * Get the top 10 scores on the leaderboard
     */
    get top10(): { [username: string]: number; } {
        // Create the array of key-value pairs
        const items = [];
        for (const entry of Object.entries(this._scores)) {
            items.push(entry);
        }
        // Sort the array based on the second element (i.e. the value)
        items.sort((first, second) => { return second[1] - first[1]});

        // Get the top 10 records
        const top10: { [username: string]: number; } = {};
        for (let i = 0; i < 10; i++) {
            top10[items[i][0]] = items[i][1];
        }

        return top10;
    }

    /**
     * Adds a users win to the scoreboard
     * @param username the user who won
     */
    addScore(username: string): void {
        if (username in this._scores) {
            this._scores[username] += 1;
        }
        else {
            this._scores[username] = 1;
        }
    }
}