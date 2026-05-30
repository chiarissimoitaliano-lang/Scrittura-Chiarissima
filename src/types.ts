export interface VocabularyTerm {
  word: string;
  translation: string;
}

export interface StarterData {
  incipit: string;
  vocabulary: VocabularyTerm[];
}

export interface Correction {
  originalPhrase: string;
  correctedPhrase: string;
  errorType: string;
  explanation: string;
}

export interface StyleSuggestion {
  originalText: string;
  suggestedAlternative: string;
  benefit: string;
}

export interface PlotContinuation {
  title: string;
  suggestion: string;
  triggerQuestions: string[];
}

export interface TutorResponse {
  corrections: Correction[];
  styleAndLexicon: StyleSuggestion[];
  plotContinuations: PlotContinuation[];
  generalFeedback: string;
}

export interface GlossaryTerm {
  term: string;
  partOfSpeech: string;
  definition: string;
  translation: string;
  example: string;
}

export interface TeacherEvaluation {
  teacherName: string;
  gradeGrammar: number; // 1 to 5 stars or scale
  gradeVocabulary: number;
  gradeContent: number;
  feedback: string;
  createdAt: string;
}

export interface SavedHistoryItem {
  timestamp: string;
  textBlock: string;
  feedback: TutorResponse;
}
