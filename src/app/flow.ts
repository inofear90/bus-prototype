import type { ReactNode } from 'react';
import type { Route } from './navigation';

/** Contract every prototype flow implements (see src/flows/registry.ts). */
export interface FlowDefinition {
  /** Used by prototype.config.json, VITE_FLOW and ?flow=. kebab-case. */
  id: string;
  title: string;
  description: string;
  initialRoute: Route;
  render: (route: Route) => ReactNode;
}
