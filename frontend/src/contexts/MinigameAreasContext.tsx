import React from 'react';
import MinigameArea from '../classes/MinigameArea';

/**
 * Hint: You will never need to use this directly. Instead, use the
 * `useConversationAreas` hook.
 */
const Context = React.createContext<MinigameArea[]>([]);

export default Context;