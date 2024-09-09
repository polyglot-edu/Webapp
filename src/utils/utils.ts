import { useEffect, useState } from 'react';
import { MarkerType } from 'reactflow';
import { v4 as UUIDv4 } from 'uuid';
import { PolyglotEdge, PolyglotFlow } from '../types/polyglotElements';

// fix zust persist issue https://github.com/pmndrs/zustand/issues/324
// if an error like Extra attributes from the server appear use this hook
export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export const isObject = (variable: any) => {
  return (
    typeof variable === 'object' &&
    !Array.isArray(variable) &&
    variable !== null
  );
};

export const useToggleCSSVariable = (variable: string, values: string[]) => {
  if (values.length <= 0) {
    throw new Error(
      'useToggleCSSVariable: values must be an array with at least one element'
    );
  }

  const [currentIndex, setIndex] = useState<number>(0);
  document.documentElement.style.setProperty(variable, values[currentIndex]);

  function handleChange() {
    setIndex((currentIndex + 1) % values.length);
    document.documentElement.style.setProperty(variable, values[currentIndex]);
  }

  return {
    index: currentIndex,
    value: values[currentIndex],
    toggle: handleChange,
  };
};

export const zip = <T, K>(a: T[], b: K[]) =>
  a.map((k, i) => ({ first: k, second: b[i] }));
