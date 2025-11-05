import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import type { Car } from '@/types';

/**
 * Firestore data converter for the `Car` model.
 * Ensures Firestore reads and writes maintain strong typing.
 */
export const carConverter: FirestoreDataConverter<Car> = {
  toFirestore(car: Car) {
    const { id, ...rest } = car;
    return rest;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Car {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as Car;
  },
};
