import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../../src/hooks/useIsMobile';
import * as responsive from 'react-responsive';

describe('useIsMobile hook', () => {
  it('returns false when useMediaQuery returns false', () => {
    jest.spyOn(responsive, 'useMediaQuery').mockReturnValue(false as boolean);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true when useMediaQuery returns true', () => {
    jest.spyOn(responsive, 'useMediaQuery').mockReturnValue(true as boolean);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
