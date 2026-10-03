/**
 * useTabParam: the active detail-page tab, kept in `?tab=` so links and
 * reloads land on the same tab. The first tab is the default and is not
 * written to the URL; unknown values fall back to it.
 */

import { useSearchParams } from 'react-router-dom';

export function useTabParam<V extends string>(
  tabs: readonly V[]
): [tab: V, setTab: (next: V) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const fallback = tabs[0];
  if (fallback === undefined) throw new Error('useTabParam requires at least one tab');
  const raw = searchParams.get('tab');
  const tab = tabs.find((value) => value === raw) ?? fallback;
  const setTab = (next: V) => {
    setSearchParams(next === fallback ? {} : { tab: next }, { replace: true });
  };
  return [tab, setTab];
}
