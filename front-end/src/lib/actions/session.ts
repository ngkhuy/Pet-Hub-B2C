import "server-only";
import { jwtVerify } from "jose";

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtAlgorithm = process.env.JWT_ALGORITHM || "HS256";
const encodedKey = new TextEncoder().encode(jwtSecretKey);

export async function decrypt(jwtToken: string) {
  try {
    const { payload } = await jwtVerify(jwtToken, encodedKey, {
      algorithms: [jwtAlgorithm],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify jwtToken", error);
    return null;
  }
}
