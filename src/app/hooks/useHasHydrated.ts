// store/useHasHydrated.ts
import { useEffect, useState } from 'react';

export function useHasHydrated(store: any) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {

    const unsub = store.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    if (store.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    return () => {
      unsub();
    };
  }, [store]);

  return hasHydrated;
}
