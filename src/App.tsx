import React, { useState } from "react";
import SetupStage from "./components/SetupStage";
import WritingWorkspace from "./components/WritingWorkspace";
import EvaluationCertificate from "./components/EvaluationCertificate";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentPortal from "./components/StudentPortal";
import { VocabularyTerm, GlossaryTerm, TutorResponse } from "./types";
import { BookOpen, Sparkles, Feather } from "lucide-react";

export default function App() {
  const [stage, setStage] = useState<"setup" | "writing" | "evaluated" | "teacher" | "student_portal">("setup");
  
  // Game Configuration Parameters
  const [genre, setGenre] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [targetLength, setTargetLength] = useState<number>(3);
  const [incipit, setIncipit] = useState<string>("");
  const [vocabulary, setVocabulary] = useState<VocabularyTerm[]>([]);
  
  // Dynamic Outputs
  const [studentText, setStudentText] = useState<string>("");
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [usedWords, setUsedWords] = useState<Record<string, boolean>>({});

  // Trigger: Start story configuration
  const handleStartGame = (config: {
    genre: string;
    level: string;
    targetLength: number;
    incipit: string;
    vocabulary: VocabularyTerm[];
  }) => {
    setGenre(config.genre);
    setLevel(config.level);
    setTargetLength(config.targetLength);
    setIncipit(config.incipit);
    setVocabulary(config.vocabulary);
    setStudentText("");
    setGlossary([]);
    setUsedWords({});
    setStage("writing");
  };

  // API Call: Request Tutor Review (Fase 3)
  const handleTutorRequest = async (currentText: string): Promise<TutorResponse> => {
    // Collect the past history / text block
    const response = await fetch("/api/tutor/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        genre,
        level,
        targetLength,
        incipit,
        studentText: currentText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Impossibile ottenere risposta dal Tutor.");
    }

    return response.json();
  };

  // API Call: Extract Story Glossary
  const handleGenerateGlossary = async (currentText: string): Promise<GlossaryTerm[]> => {
    const response = await fetch("/api/tutor/glossary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentText: currentText,
        incipit,
        level,
        genre,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Impossibile calcolare il glossario.");
    }

    const outcome = await response.json();
    return outcome.glossary || [];
  };

  // Trigger: Conclude writing and transfer to the Teacher review page
  const handleFinishStory = (finalText: string, finalGlossary: GlossaryTerm[]) => {
    setStudentText(finalText);
    setGlossary(finalGlossary);
    
    // Quick recap scan for final certificate metrics
    const textLower = finalText.toLowerCase();
    const matches: Record<string, boolean> = {};
    vocabulary.forEach((item) => {
      const wordLower = item.word.toLowerCase();
      const wordRoot = wordLower.endsWith("are") || wordLower.endsWith("ere") || wordLower.endsWith("ire")
        ? wordLower.slice(0, -3)
        : wordLower.slice(0, -1);

      const isUsed = textLower.includes(wordLower) || (wordRoot.length > 3 && textLower.includes(wordRoot));
      if (isUsed) {
        matches[item.word] = true;
      }
    });

    setUsedWords(matches);
    setStage("evaluated");
  };

  const handleRestart = () => {
    setStage("setup");
  };

  return (
    <div className="min-h-screen bg-neutral-50/40 text-neutral-800 antialiased selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Decorative top colored line */}
      <div className="no-print h-1 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-indigo-500" />

      {/* Main Container */}
      <main className="py-6">
        {stage === "setup" && (
          <SetupStage 
            onStart={handleStartGame} 
            onOpenTeacher={() => setStage("teacher")}
            onOpenStudentPortal={() => setStage("student_portal")}
          />
        )}

        {stage === "writing" && (
          <WritingWorkspace
            genre={genre}
            level={level}
            targetLength={targetLength}
            incipit={incipit}
            vocabulary={vocabulary}
            onTutorRequest={handleTutorRequest}
            onGenerateGlossary={handleGenerateGlossary}
            onFinishStory={handleFinishStory}
            onExit={handleRestart}
            initialText={studentText}
            initialGlossary={glossary}
          />
        )}

        {stage === "evaluated" && (
          <EvaluationCertificate
            genre={genre}
            level={level}
            targetLength={targetLength}
            incipit={incipit}
            studentText={studentText}
            vocabulary={vocabulary}
            usedSymbols={usedWords}
            glossary={glossary}
            onRestart={handleRestart}
            teacherEmail="chiarissimoitaliano@gmail.com"
          />
        )}

        {stage === "teacher" && (
          <TeacherDashboard onBack={handleRestart} />
        )}

        {stage === "student_portal" && (
          <StudentPortal onBack={handleRestart} />
        )}
      </main>

      {/* PageFooter */}
      <footer className="no-print mt-12 py-8 border-t border-neutral-200 bg-white text-center text-xs text-neutral-500 font-sans">
        <p>&copy; {new Date().getFullYear()} Scrittura Chiarissima. Tutti i diritti riservati.</p>
        <p className="mt-1 text-[10px] text-neutral-400">Fatto con ♥ da: Letícia Costa</p>
      </footer>

    </div>
  );
}
