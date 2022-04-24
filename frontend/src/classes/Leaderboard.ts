// Tic Tac Toe leaderboard type 
export type TicTacToeLeaderBoard = { [username: string]: number; }

// Class with static function used to retrieve top 10 scores from a leaderboard
export default class Leaderboard {
    
    /**
     * Static function used to get top 10 scores from leaderboard
     * @param scores 
     * @returns 
     */
    public static getTop10(scores: TicTacToeLeaderBoard): { [username: string]: number; } {
        const items = [];
        for (const entry of Object.entries(scores)) {
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
}