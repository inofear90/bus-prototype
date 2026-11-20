import { FLOWS } from '../flows/registry';

declare const __PROTOTYPE_FLOW__: string;

/**
 * Flow to open directly, in priority order:
 *   1. ?flow=<id> in the URL (handy for sharing a link to one flow)
 *   2. VITE_FLOW env var / prototype.config.json "flow" (baked in at dev/build time – one per code layer)
 * Empty or unknown → the flow picker.
 */
export function startFlowId(): string | null {
  const fromUrl = new URLSearchParams(window.location.search).get('flow');
  const id = fromUrl || __PROTOTYPE_FLOW__;
  return FLOWS.some((f) => f.id === id) ? id : null;
}
