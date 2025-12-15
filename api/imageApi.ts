
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

/**
 * Laster opp et lokalt bilde til Firebase Storage og returnerer en offentlig URL.
 * @param localUri f.eks. "file:///.../image.jpg" fra ImagePicker
 */
export async function uploadDugnadImage(localUri: string): Promise<string> {
  // 1. Hent innholdet som blob
  const response = await fetch(localUri);
  const blob = await response.blob();

  // 2. Lag et filnavn i en egen "dugnader/"-mappe
  const fileName = `dugnader/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.jpg`;

  const storageRef = ref(storage, fileName);

  // 3. Last opp bloben
  await uploadBytes(storageRef, blob);

  // 4. Hent nedlastings-URL
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}
