'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Adds the document ID to Firestore document data. */
type WithId<T> = T & { id: string };

/** Hook return type for real-time Firestore collection subscription. */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | FirestorePermissionError | null;
}

/**
 * Subscribes to a Firestore collection query in real time.
 * ⚠️ Always memoize your `memoizedQuery` with useMemo().
 */
export function useCollection<T extends DocumentData = DocumentData>(
  memoizedQuery: Query<T> | null | undefined
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FirestoreError | FirestorePermissionError | null>(null);

  useEffect(() => {
    let isMounted = true;

    // If no query is provided, reset state and exit
    if (!memoizedQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Start Firestore listener
    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot<T>) => {
        if (!isMounted) return;

        const docs = snapshot.docs.map((doc) => ({
          ...(doc.data() as T),
          id: doc.id,
        }));

        setData(docs);
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        if (!isMounted) return;

        let contextualError: FirestoreError | FirestorePermissionError = err;

        // Handle permission-denied explicitly
        if (err.code === 'permission-denied') {
          contextualError = new FirestorePermissionError({
            operation: 'list',
            path: 'unknown',
          });
          errorEmitter.emit('permission-error', contextualError);
        }

        setError(contextualError);
        setData(null);
        setIsLoading(false);
      }
    );

    // Cleanup on unmount
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [memoizedQuery]);

  return { data, isLoading, error };
}
