import { GlossaryTerm, TeacherEvaluation } from "../types";

/**
 * Returns the fully qualified API URL or relative path depending on where the application is hosted.
 */
export function getApiUrl(endpoint: string): string {
  const host = window.location.hostname;
  
  // If we are on localhost or on direct Cloud Run, relative APIs work perfectly.
  if (
    host === "localhost" || 
    host === "127.0.0.1" || 
    host.endsWith("run.app")
  ) {
    return endpoint;
  }
  
  // If we are on Netlify or elsewhere, route to the live backend instance
  const baseUrl = "https://ais-pre-am3rmyyt2afox46wx5afiw-567953750766.us-west2.run.app";
  
  // Normalize forward slash combination
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

// Interface for stories used inside backend/local operations
export interface SubmittedStory {
  id: string;
  studentName: string;
  genre: string;
  level: string;
  targetLength: number;
  incipit: string;
  studentText: string;
  wordCount: number;
  vocabularyUsed: string[];
  glossary: GlossaryTerm[];
  status: "pending" | "evaluated";
  createdAt: string;
  evaluation?: TeacherEvaluation;
}

// Storage helpers for browser LocalStorage
const LOCAL_STORAGE_KEY = "scrittura_chiarissima_submissions";

function getLocalStories(): SubmittedStory[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn("Unable to access localStorage:", err);
    return [];
  }
}

function saveLocalStories(stories: SubmittedStory[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
  } catch (err) {
    console.warn("Unable to save to localStorage:", err);
  }
}

/**
 * Code Synchronization Tools (Base64 encoding)
 */
export function exportSubmissionToCode(sub: any): string {
  try {
    const json = JSON.stringify(sub);
    // Encode to UTF-8 base64 safely supporting emojis and accented letters
    const utf8Bytes = new TextEncoder().encode(json);
    let binary = "";
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return "SC_" + window.btoa(binary);
  } catch (err) {
    console.error("Errore durante l'esportazione del codice:", err);
    return "";
  }
}

export function importSubmissionFromCode(code: string): any {
  try {
    const cleanCode = code.trim();
    if (!cleanCode.startsWith("SC_")) return null;
    const base64 = cleanCode.substring(3).trim();
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch (err) {
    console.error("Errore durante l'importazione del codice:", err);
    return null;
  }
}

/**
 * Robust API / Local hybrid data managers.
 * These fall back seamlessly to LocalStorage, bypassing any "Failed to fetch" errors on Netlify.
 */

// 1. Get all stories
export async function apiGetStories(): Promise<SubmittedStory[]> {
  try {
    const response = await fetch(getApiUrl("/api/stories"));
    if (response.ok) {
      const serverStories = await response.json();
      
      // Merge with localStorage stories to avoid losing local submissions
      const localStories = getLocalStories();
      const mergedMap = new Map<string, SubmittedStory>();
      
      // Add local first
      localStories.forEach(s => mergedMap.set(s.id, s));
      // Overwrite or add with server ones (server counts as source of truth if connected)
      if (Array.isArray(serverStories)) {
        serverStories.forEach(s => mergedMap.set(s.id, s));
      }
      
      const mergedList = Array.from(mergedMap.values());
      saveLocalStories(mergedList);
      return mergedList;
    }
  } catch (err) {
    console.log("Using LocalStorage fallback database due to unreachable proxy server:", err);
  }
  
  // Return local if server is offline or blocks
  return getLocalStories();
}

// 2. Submit a new story
export async function apiSubmitStory(storyData: Omit<SubmittedStory, "id" | "status" | "createdAt">): Promise<SubmittedStory> {
  const newLocalStory: SubmittedStory = {
    ...storyData,
    id: "sub_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now(),
    status: "pending",
    createdAt: new Date().toLocaleString("it-IT")
  };

  // Pre-save to local inventory
  const localStories = getLocalStories();
  localStories.push(newLocalStory);
  saveLocalStories(localStories);

  try {
    const response = await fetch(getApiUrl("/api/stories"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(storyData)
    });

    if (response.ok) {
      const serverResult = await response.json();
      // Replace the local placeholder with server result
      const updatedLocal = getLocalStories().map(s => s.studentName === newLocalStory.studentName && s.studentText === newLocalStory.studentText ? serverResult : s);
      saveLocalStories(updatedLocal);
      return serverResult;
    }
  } catch (err) {
    console.log("Submitted story stored successfully in Local Session (Netlify Fallback):", err);
  }

  return newLocalStory;
}

// 3. Evaluate a story (for teacher)
export async function apiEvaluateStory(id: string, evaluation: Omit<TeacherEvaluation, "createdAt">): Promise<SubmittedStory> {
  // Update local copy
  const localStories = getLocalStories();
  const index = localStories.findIndex(s => s.id === id);
  let updatedLocalStory = localStories[index];

  if (index !== -1) {
    localStories[index] = {
      ...localStories[index],
      status: "evaluated",
      evaluation: {
        ...evaluation,
        createdAt: new Date().toLocaleDateString("it-IT", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      }
    };
    saveLocalStories(localStories);
    updatedLocalStory = localStories[index];
  }

  try {
    const response = await fetch(getApiUrl(`/api/stories/${id}/evaluate`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evaluation)
    });

    if (response.ok) {
      const serverResult = await response.json();
      const finalStories = getLocalStories().map(s => s.id === id ? serverResult : s);
      saveLocalStories(finalStories);
      return serverResult;
    }
  } catch (err) {
    console.log("Evaluation saved in Local Session (Netlify Fallback):", err);
  }

  if (!updatedLocalStory) {
    throw new Error("Compito non trovato.");
  }
  return updatedLocalStory;
}

// 4. Delete a story
export async function apiDeleteStory(id: string): Promise<boolean> {
  const localStories = getLocalStories().filter(s => s.id !== id);
  saveLocalStories(localStories);

  try {
    const response = await fetch(getApiUrl(`/api/stories/${id}`), {
      method: "DELETE"
    });
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.log("Story deleted in Local Session:", err);
  }

  return true;
}

// 5. Direct injection (for code/coupon importing)
export function apiAddOrUpdateStoryDirectly(sub: SubmittedStory): SubmittedStory {
  const localStories = getLocalStories();
  const exists = localStories.findIndex(s => s.id === sub.id);
  if (exists !== -1) {
    localStories[exists] = sub;
  } else {
    localStories.push(sub);
  }
  saveLocalStories(localStories);
  return sub;
}
