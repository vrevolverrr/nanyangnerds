import { initializeApp, FirebaseApp } from "firebase/app";
import { Firestore, getFirestore, getDocs, collection, GeoPoint } from "firebase/firestore";

export class FirestoreDB {
    app: FirebaseApp
    db: Firestore

    constructor() {
        this.app = initializeApp({
            apiKey: "AIzaSyAAn5oo8F_zrv52iNMRNtWfRro0i7D9tU8",
            authDomain: "nanyangnerds.firebaseapp.com",
            projectId: "nanyangnerds",
            storageBucket: "nanyangnerds.appspot.com",
            messagingSenderId: "286028816547",
            appId: "1:286028816547:web:da2303cbefb1ba1332df16"
          });

          this.db = getFirestore(this.app)
    }

    async fetchEvents(dateStr: string) {
        const snapshot = await getDocs(collection(this.db, dateStr))
        return snapshot.docs.map((doc) => doc.data() as NewsEvent)
    }
}

export interface NewsEvent {
    title: string
    disruptive: boolean
    risk: number
    location: GeoPoint
    timestamp: string
    city: string
    segment: string
    content: string
    url: string
}

const firedb = new FirestoreDB()
export default firedb