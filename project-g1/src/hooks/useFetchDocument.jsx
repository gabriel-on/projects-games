import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

export const useFetchDocument = (docCollection, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [cancelled, setCancelled] = useState(false);
    const [loading, setLoading]  = useState(null)

    useEffect(() => {
        async function loadDocument() {
            setLoading(true)

            if (cancelled) return

            try {
                const docRef = await doc(db, docCollection, id);
                const docSnap = await getDoc(docRef);

                setDocument(docSnap.data());
            } catch (error) {
                console.log(error);
                setError(error.message);
            }

            setLoading(false);
        };

        loadDocument();
    }, [docCollection, id, cancelled]);
    
    console.log(document);

    return { document, loading, error };
};