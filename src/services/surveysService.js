import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const addSurvey = async (survey) => {
    const surveysCol = collection(db, "surveys");
    await addDoc(surveysCol, survey);
};
