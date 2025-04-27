import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function useAsyncResult(callback, initial) {
  const [res, setRes] = useState(initial);
  useFocusEffect(
    useCallback(() => {
      callback().then(setRes);
      return () => {
      };
    }, [])
  );
  return res;
}

function useAsyncResultWithDeps(callback, initial, deps = []) {
  const [res, setRes] = useState(initial);

  const update = () => {
    callback().then(setRes);
    return () => {
    };
  };
  useFocusEffect(
    useCallback(update, [])
  );
  useEffect(update, deps);

  return res;
}

function useAsyncResultForEventSort(callback1, callback2, initial, deps) {
  const [res, setRes] = useState(initial);

  const update = () => {
    if (deps) {
      callback1(1).then(setRes);
    } else callback2(1).then(setRes);
    return () => {
    };
  };

  useFocusEffect(
    useCallback(update, [])
  );

  useEffect(update, [deps]);

  return res;
}

export { useAsyncResult, useAsyncResultWithDeps, useAsyncResultForEventSort };
