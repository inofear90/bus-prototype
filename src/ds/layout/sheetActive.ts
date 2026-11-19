import { ACTIVE_ATTR } from './BottomSheet';

/** Spread on a list item: `<li {...sheetActive(selected)}>`. A BottomSheet keeps that item in view when it lowers. */
export const sheetActive = (active?: boolean) => (active ? { [ACTIVE_ATTR]: '' } : {});
