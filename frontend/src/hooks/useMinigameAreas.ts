import assert from 'assert';
import { useContext } from 'react';
import MinigameArea from '../classes/MinigameArea';
import MinigameAreasContext from '../contexts/MinigameAreasContext';

/**
 * This hook provides access to the current list of minigame areas
 * The hook will trigger the components that use it to re-render ONLY if the list of active 
 * minigame areas changes.
 * 
 * Components that need to be re-rendered if the *players* of the minigame area change must
 * arrange to do so by setting up their own listener on the minigame area.
 * 
 */
export default function useConversationAreas(): MinigameArea[] {
  // Reads the minigame areas context from the App.tsx
  const ctx = useContext(MinigameAreasContext);
  assert(ctx, 'Minigame area context should be defined.');
  return ctx;
}