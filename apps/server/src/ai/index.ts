import Groq from "groq-sdk";
import { GROQ_KEY } from "../environments";

export const groq = new Groq({apiKey: GROQ_KEY});