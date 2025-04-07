import { describe, it, vi, beforeEach } from 'vitest';
import * as saveManager from './saveManager';
import { formConfigStore } from './formStore';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('saveManager error handling via public API', () => {
  it('catches errors during manualSave', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('save error'); });
    saveManager.manualSave();
  });

  it('catches errors during initializeAutoSave (load)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('load error'); });
    saveManager.initializeAutoSave();
  });

  it('catches errors during clearSavedData', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('clear error'); });
    saveManager.clearSavedData();
  });
});