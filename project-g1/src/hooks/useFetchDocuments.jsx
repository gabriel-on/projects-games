import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection, addDoc, serverTimestamp
} from "firebase/firestore"

export const useFetchDocuments = (docCollection, documentData, uid) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    async function saveData() {
      setLoading(true);

      try {
        const collectionRef = collection(db, docCollection);

        // Adiciona um campo createdAt com o timestamp do servidor
        const dataToSave = {
          ...documentData,
          createdAt: serverTimestamp(),
          uid: uid
        };

        // Adiciona um novo documento à coleção
        await addDoc(collectionRef, dataToSave);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
      }
    }

    saveData();
  }, [docCollection, documentData, uid])

  return { loading, error }
}
