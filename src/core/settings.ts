import type { Settings } from './jbeam';

// Starting values from the idea owner's notes (plan section 3). Not yet checked
// against the game; an empty string means "leave this bound as it is".
export function defaultSettings(): Settings {
  return {
    camber: { F: { min: '0.55', max: '1.25' }, R: { min: '0.55', max: '1.25' } },
    toe: { F: { min: '0.60', max: '1.50' }, R: { min: '0.60', max: '1.25' } },
    offset: { F: { min: '', max: '0.1' }, R: { min: '', max: '0.1' } },
    height: { F: { min: '-0.50', max: '' }, R: { min: '-0.50', max: '' } },
  };
}
