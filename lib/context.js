// Simple helper variable to distinguish between browser and Node, and values respectively a "window" or a "global" object
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? true : false;
export const context = isBrowser ? window : global;