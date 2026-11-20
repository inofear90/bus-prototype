import type { FlowDefinition } from '@app/flow';
import { metroStationFlow } from './metro-station';

/**
 * All prototype flows. Add a new flow here (one line) after creating src/flows/<id>/index.tsx.
 * Which flow starts is chosen by prototype.config.json, VITE_FLOW or ?flow=<id> (see README).
 */
export const FLOWS: FlowDefinition[] = [metroStationFlow];
