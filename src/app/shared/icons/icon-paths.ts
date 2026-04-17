export interface IconDef { path: string; stroke?: number; fill?: boolean; }

export const ICONS: Record<string, IconDef> = {
  plus:        { path: '<path d="M12 5v14M5 12h14"/>', stroke: 2.2 },
  check:       { path: '<path d="M4 12l5 5L20 7"/>', stroke: 3 },
  chevronLeft: { path: '<path d="M15 6l-6 6 6 6"/>', stroke: 2.2 },
  chevronRight:{ path: '<path d="M9 6l6 6-6 6"/>', stroke: 2.2 },
  trash:       { path: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14M10 11v6M14 11v6"/>', stroke: 2 },
  edit:        { path: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>', stroke: 2 },
  search:      { path: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>', stroke: 2 },
  sun:         { path: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>', stroke: 2 },
  moon:        { path: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>', stroke: 2 },
  home:        { path: '<path d="M3 12l9-9 9 9v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z"/>', stroke: 2 },
  grid:        { path: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', stroke: 2 },
  stats:       { path: '<path d="M3 3v18h18"/><path d="M7 16l4-6 4 3 5-8"/>', stroke: 2 },
  user:        { path: '<circle cx="12" cy="8" r="4"/><path d="M4 22c0-4 4-7 8-7s8 3 8 7"/>', stroke: 2 },
  close:       { path: '<path d="M6 6l12 12M18 6L6 18"/>', stroke: 2.2 },
};

export type IconName = keyof typeof ICONS;
