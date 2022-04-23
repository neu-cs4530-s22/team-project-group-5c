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
        return this._scores;
    }

    /**
     * Get the top 10 scores on the leaderboard
     */
    public get top10(): { [username: string]: number; } {
        // Create the array of key-value pairs
        const items = [];
        for (const entry of Object.entries(this._scores)) {
            items.push(entry);
        }
        // Sort the array based on the second element (i.e. the value)
        items.sort((first, second) => (second[1] - first[1]));

        // Get the top 10 records
        const top10: { [username: string]: number; } = {};

        // if there is item more than 10, pick top most 10
        if (items.length >= 10) {
            for (let i = 0; i < 10; i += 1) {
                // eslint-disable-next-line prefer-destructuring
                top10[items[i][0]] = items[i][1];
            }
        } else {
            for (let i = 0; i < items.length; i += 1) {
                // eslint-disable-next-line prefer-destructuring
                top10[items[i][0]] = items[i][1];
            }
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