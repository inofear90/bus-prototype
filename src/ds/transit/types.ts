/** Vehicle types the transit components know how to draw. */
export type TransitMode = 'metro' | 'bus';

/** A line/route label such as "MRT1" or "60-3". */
export interface LineRef {
  id: string;
  label: string;
  mode: TransitMode;
}
