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
        const items = Object.entries(scores);
        // Sort the array based on the second element (i.e. the value)
        items.sort((first, second) => (second[1] - first[1]));
        // Get top 10 items from list
        const top10List = items.slice(0, 10);
        // Convert top 10 to dictionary
        const top10Dict = Object.fromEntries(top10List);
        return top10Dict;
    }
}