import React from 'react';
import { TicTacToeLeaderBoard } from '../classes/Leaderboard';

const Context = React.createContext<TicTacToeLeaderBoard>({});

export default Context;