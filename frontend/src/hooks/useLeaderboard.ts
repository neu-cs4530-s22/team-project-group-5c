import assert from 'assert';
import { useContext } from 'react';
import TicTacToeLeaderBoard from '../classes/Leaderboard';
import LeaderboardContext from '../contexts/LeaderboardContext';


export default function useLeaderboard(): TicTacToeLeaderBoard {
  const ctx = useContext(LeaderboardContext);
  assert(ctx, 'LeaderboardContext context should be defined.');
  return ctx;
}