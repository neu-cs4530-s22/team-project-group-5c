import assert from 'assert';
import { useContext } from 'react';
import { TicTacToeLeaderBoard } from '../classes/Leaderboard';
import LeaderboardContext from '../contexts/LeaderboardContext';

/**
 * This hook provides access to the current state of the leaderboard for tic tac toe in the town.
 */
export default function useLeaderboard(): TicTacToeLeaderBoard {
  const ctx = useContext(LeaderboardContext);
  assert(ctx, 'LeaderboardContext context should be defined.');
  return ctx;
}