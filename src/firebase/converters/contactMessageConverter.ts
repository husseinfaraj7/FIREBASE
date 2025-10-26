import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
  } from "firebase/firestore";
  import type { ContactMessage } from "@/types";
  
  /**
   * Firestore data converter for the ContactMessage type.
   * Ensures type safety for reads/writes from the "contact_messages" collection.
   */
  export const contactMessageConverter: FirestoreDataConverter<ContactMessage> = {
    toFirestore(message: ContactMessage) {
      // You can omit "id" because Firestore generates it automatically
      const { id, ...rest } = message;
      return rest;
    },
  
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): ContactMessage {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        ...data,
      } as ContactMessage;
    },
  };
  