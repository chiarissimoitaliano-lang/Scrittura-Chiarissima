import React, { useState, useEffect, useRef } from "react";
import { StarterData, VocabularyTerm, TutorResponse, GlossaryTerm, SavedHistoryItem } from "../types";
import { 
  Sparkles, 
  BookMarked, 
  HelpCircle, 
  Feather, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Trophy,
  Activity,
  Award,
  ChevronRight,
  BookOpen
} from "lucide-react";

interface WritingWorkspaceProps {
  genre: string;
  level: string;
  targetLength: number;
  incipit: string;
  vocabulary: VocabularyTerm[];
  onTutorRequest: (studentText: string) => Promise<TutorResponse>;
  onGenerateGlossary: (studentText: string) => Promise<GlossaryTerm[]>;
  onFinishStory: (studentText: string, glossary: GlossaryTerm[]) => void;
  onExit: () => void;
  initialText?: string;
  initialGlossary?: GlossaryTerm[];
}

export default function WritingWorkspace({
  genre,
  level,
  targetLength,
  incipit,
  vocabulary,
  onTutorRequest,
  onGenerateGlossary,
  onFinishStory,
  onExit,
  initialText = "",
  initialGlossary = []
}: WritingWorkspaceProps) {
  const [studentText, setStudentText] = useState<string>(initialText);
  const [usedWords, setUsedWords] = useState<Record<string, boolean>>({});
  const [activeGlossary, setActiveGlossary] = useState<GlossaryTerm[]>(initialGlossary);
  const [isGlossaryLoading, setIsGlossaryLoading] = useState<boolean>(false);
  const [tutorFeedback, setTutorFeedback] = useState<TutorResponse | null>(null);
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);
  const [isCycleActive, setIsCycleActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyLogs, setHistoryLogs] = useState<SavedHistoryItem[]>([]);

  // Scanning engine: verifies vocabulary usage
  useEffect(() => {
    const textLower = studentText.toLowerCase();
    const updated: Record<string, boolean> = {};

    vocabulary.forEach((item) => {
      const wordLower = item.word.toLowerCase();
      
      // Basic match for root words (lemmatization approximation for lower learning levels)
      // Checks for substring, boundary or root word triggers
      const wordRoot = wordLower.endsWith("are") || wordLower.endsWith("ere") || wordLower.endsWith("ire")
        ? wordLower.slice(0, -3) // Verbs root
        : wordLower.slice(0, -1); // Singular/plural root

      const isUsed = textLower.includes(wordLower) || (wordRoot.length > 3 && textLower.includes(wordRoot));
      if (isUsed) {
        updated[item.word] = true;
      }
    });

    setUsedWords(updated);
  }, [studentText, vocabulary]);

  // Statistics calculation
  const getWordCount = (text: string) => {
    const trim = text.trim();
    if (!trim) return 0;
    return trim.split(/\s+/).length;
  };

  const getParagraphs = (text: string) => {
    // Splits by double newline or multiple lines
    const blocks = text.split(/\n\s*\n+/).filter(block => block.trim().length > 10);
    return blocks.length;
  };

  const paragraphsCount = getParagraphs(studentText);
  const wordCount = getWordCount(studentText);
  const matchedWordsCount = Object.keys(usedWords).length;
  const progressPercent = Math.min(100, Math.round((paragraphsCount / targetLength) * 100));

  // Handle Tutor Request Trigger (Fase 3)
  const handleQueryTutor = async () => {
    if (!studentText.trim() || studentText.trim().length < 15) {
      setErrorMessage("⚠️ Per il tutor serve un testo d'italiano un po' più ricco (almeno 15 caratteri) per darti buoni consigli!");
      return;
    }

    setErrorMessage(null);
    setIsTutorLoading(true);
    setIsCycleActive(true);

    try {
      const parsedFeedback = await onTutorRequest(studentText);
      setTutorFeedback(parsedFeedback);
      
      // Save history log
      const logItem: SavedHistoryItem = {
        timestamp: new Date().toLocaleTimeString(),
        textBlock: studentText,
        feedback: parsedFeedback
      };
      setHistoryLogs(prev => [logItem, ...prev]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("⚠️ Impossibile contattare il Tutor linguistico. Verifica se hai impostato la chiave API.");
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Generate Glossary Action
  const handleRequestGlossary = async () => {
    if (!studentText.trim()) {
      setErrorMessage("⚠️ Non posso ordinare un glossario su una favola vuota! Scrivi prima qualcosa.");
      return;
    }

    setErrorMessage(null);
    setIsGlossaryLoading(true);

    try {
      const generated = await onGenerateGlossary(studentText);
      setActiveGlossary(generated);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("⚠️ Errore durante la compilazione automatica del glossario.");
    } finally {
      setIsGlossaryLoading(false);
    }
  };

  // Inject a plot suggestion/continuator in the text
  const applyPlotSuggestion = (suggestionText: string) => {
    // Appends the plot suggestion separated by a dual break or inline
    setStudentText(prev => {
      const cleanPrev = prev.trim();
      return cleanPrev ? `${cleanPrev}\n\n${suggestionText}\n` : suggestionText;
    });
    // Scroll editor to end or draw attention
    setErrorMessage(null);
  };

  // Final submit
  const handleFinalSubmit = () => {
    if (paragraphsCount < 1) {
      alert("La storia è vuota. Scrivi almeno un paragrafo prima di concludere con la professoressa!");
      return;
    }
    onFinishStory(studentText, activeGlossary);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 space-y-6" id="writing-workspace">
      
      {/* Top Banner stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onExit}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-all border border-neutral-200 hover:border-neutral-300 p-2 rounded-lg"
          >
            ← Esci / Cambia
          </button>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Feather className="w-4 h-4 text-emerald-600" />
              Scrittura Chiarissima
            </h1>
            <p className="text-xs text-neutral-500 font-mono uppercase mt-0.5">
              Genere: <span className="font-sans font-bold text-neutral-700">{genre}</span> | Livello: <span className="font-sans font-bold text-emerald-600">{level}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-right hidden md:block">
            <span className="text-xs text-neutral-500 font-bold block">Progresso Paragrafi</span>
            <span className="text-xs text-neutral-700 font-mono">{paragraphsCount} / {targetLength} ({progressPercent}%)</span>
          </div>
          <div className="flex-1 sm:w-36 bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200/40">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Editor + Tools / Tutor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Guidelines + Large Editor */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Incipit display */}
          <div className="p-5 rounded-2xl border border-emerald-600/10 bg-emerald-50/20 shadow-xs relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10">
              <BookOpen className="w-16 h-16 text-emerald-600" />
            </div>
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" />
              Inizio della storia (Incipit)
            </div>
            <p className="font-serif italic text-neutral-800 text-sm md:text-base leading-relaxed pl-1.5 border-l-2 border-emerald-500/40">
              &quot;{incipit}&quot;
            </p>
          </div>

          {/* Primary Textarea Editor */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:border-emerald-600 transition-all">
            <div className="p-3.5 px-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-bold uppercase text-[10px] text-neutral-600 font-sans tracking-wide">
                La tua continuazione libera (Fase 2)
              </span>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span>Paragrafi: <strong className="text-neutral-800 font-sans">{paragraphsCount}</strong></span>
                <span>•</span>
                <span>Parole: <strong className="text-neutral-800 font-sans">{wordCount}</strong></span>
              </div>
            </div>

            <textarea
              value={studentText}
              onChange={(e) => { setStudentText(e.target.value); setErrorMessage(null); }}
              id="student-story-editor"
              className="w-full h-80 px-5 py-4 text-neutral-800 placeholder-neutral-400 bg-white border-0 text-sm md:text-base leading-relaxed font-serif focus:ring-0 focus:outline-hidden resize-y min-h-[250px]"
              placeholder="Scrivi qui la tua continuazione continuando la narrazione dell'incipit sovrastante. Usa un vocabolario coerente e separa i paragrafi premendo due volte INVIO..."
            />

            {/* Editor tools row */}
            <div className="p-4 bg-neutral-50/50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleQueryTutor}
                  disabled={isTutorLoading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isTutorLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Elaborazione...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Chiedere aiuto al tutor
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRequestGlossary}
                  disabled={isGlossaryLoading}
                  className="px-3 py-2 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGlossaryLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-neutral-400/30 border-t-neutral-600 rounded-full animate-spin" />
                      Glossario...
                    </>
                  ) : (
                    <>
                      <BookMarked className="w-3.5 h-3.5 text-neutral-500" />
                      Generare Glossario
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm shadow-xs cursor-pointer transition-all flex items-center gap-1"
              >
                Concludi Storia
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-xs text-neutral-800 leading-relaxed font-sans">
              {errorMessage}
            </div>
          )}

          {/* History logs check */}
          {historyLogs.length > 0 && (
            <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-neutral-500 uppercase font-mono">Storico dei feedback dei cicli passati ({historyLogs.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {historyLogs.map((log, lidx) => (
                  <div key={lidx} className="p-2.5 rounded-lg bg-neutral-50 text-xs flex justify-between items-center border border-neutral-100">
                    <span className="text-neutral-600 font-medium">Ciclo di correzione #{historyLogs.length - lidx}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (5 cols): Vocabulary Checklist & Dynamic Tutor Output */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Predefined Thematic Vocabulary checklists */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3 font-mono flex items-center justify-between">
              <span>Vocabolario Tematico ({matchedWordsCount} / 12)</span>
              {matchedWordsCount === 12 && (
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded uppercase font-sans">Superstar ⭐</span>
              )}
            </h2>
            <p className="text-xs text-neutral-500 mb-3.5 italic leading-relaxed">
              Usa questi termini tematici nel tuo testo! L&apos;applicazione li rileva autonomamente marcandoli di verde.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 text-xs">
              {vocabulary.map((v, i) => {
                const used = !!usedWords[v.word];
                return (
                  <div 
                    key={i} 
                    className={`p-2 rounded-lg border transition-all flex items-center justify-between ${
                      used 
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium" 
                        : "bg-neutral-50/50 border-neutral-200/60 text-neutral-600"
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold font-sans block truncate text-neutral-900">{v.word}</span>
                      <span className="text-[9px] text-neutral-500 block truncate italic font-sans">{v.translation}</span>
                    </div>
                    {used ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    ) : (
                      <div className="w-4 h-4 border border-neutral-300 rounded-full shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Glossary Section */}
          {activeGlossary.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
              <h3 className="text-xs font-bold text-neutral-500 uppercase mb-3 font-mono flex items-center gap-1">
                <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
                Glossario Creato ({activeGlossary.length})
              </h3>
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {activeGlossary.map((g, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-900 text-sm font-sans">{g.term}</span>
                      <span className="text-[8px] font-mono text-neutral-500 bg-neutral-200/70 px-1.5 py-0.5 rounded uppercase">
                        {g.partOfSpeech}
                      </span>
                    </div>
                    <div className="text-neutral-500 text-[10px] leading-relaxed mb-1">
                      <strong className="text-neutral-700">IT:</strong> {g.definition} | <strong className="text-neutral-700">PT:</strong> {g.translation}
                    </div>
                    <div className="text-neutral-600 italic text-[11px] border-l-2 border-neutral-200 pl-1.5 font-serif">
                      e.g. &quot;{g.example}&quot;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tutor Panel for Stage 3 Feedback */}
          <div>
            <div className="bg-neutral-800 text-white rounded-t-2xl p-3 px-4 text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                RISCONTRO TUTOR LINGUISTICO
              </span>
              <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            
            {/* The core Tutor Side component */}
            <div className="bg-white border-x border-b border-neutral-200 rounded-b-2xl h-full"> 
              {isCycleActive ? (
                <div className="p-1">
                  {/* Reuse the custom feedback component containing corrections, style, and paths */}
                  <TutorBlock
                    feedback={tutorFeedback}
                    isLoading={isTutorLoading}
                    onApplyPlotSuggestion={applyPlotSuggestion}
                    level={level}
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500 text-xs leading-relaxed space-y-2.5">
                  <div className="p-2 w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-1">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-neutral-800">Pronto per darti assistenza</h4>
                  <p>Invia le tue righe al Tutor premendo <strong>&quot;Chiedere aiuto al tutor&quot;</strong> per ottenere raddrizzamento morfo-sintattico, potenziamenti lirici, e tappe di trama.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Inline Wrapper to host Tutor Feedback logic beautifully inside workspace column
interface TutorBlockProps {
  feedback: TutorResponse | null;
  isLoading: boolean;
  onApplyPlotSuggestion: (suggestionText: string) => void;
  level: string;
}

function TutorBlock({ feedback, isLoading, onApplyPlotSuggestion, level }: TutorBlockProps) {
  const [activeTab, setActiveTab] = useState<"corrections" | "style" | "plot">("corrections");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyText = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="relative w-12 h-12 flex items-center justify-center mb-4">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
        <h4 className="font-bold text-neutral-800 text-xs mb-1">Analisi in corso...</h4>
        <p className="text-neutral-500 text-[11px] leading-relaxed max-w-xs">
          Vaglio ortografico, morfologico, lessicale e sintattico calibrato sul livello <strong>{level}</strong>. Un attimo solo!
        </p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="p-8 text-center text-neutral-500 text-xs italic">
        Qualcosa è andato storto nel parsing del feedback. Per favore riesegui la richiesta.
      </div>
    );
  }

  const correctionsCount = feedback.corrections?.length || 0;
  const styleCount = feedback.styleAndLexicon?.length || 0;
  const plotCount = feedback.plotContinuations?.length || 0;

  return (
    <div className="flex flex-col text-xs">
      {/* Short Summary Alert */}
      <div className="p-3 border-b border-neutral-100 bg-neutral-50/50">
        <p className="text-[11px] text-neutral-700 italic leading-relaxed">
          💡 <strong>Incoraggiamento del Tutor:</strong> &quot;{feedback.generalFeedback}&quot;
        </p>
      </div>

      {/* Mini tabs */}
      <div className="grid grid-cols-3 border-b border-neutral-200 font-bold text-neutral-600 text-center">
        <button
          onClick={() => setActiveTab("corrections")}
          className={`py-2 px-1 border-b-2 text-[11px] transition-all ${
            activeTab === "corrections" 
              ? "border-emerald-600 text-emerald-700 bg-white" 
              : "border-transparent hover:text-neutral-900"
          }`}
        >
          Errore ({correctionsCount})
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`py-2 px-1 border-b-2 text-[11px] transition-all ${
            activeTab === "style" 
              ? "border-emerald-600 text-emerald-700 bg-white" 
              : "border-transparent hover:text-neutral-900"
          }`}
        >
          Stile ({styleCount})
        </button>
        <button
          onClick={() => setActiveTab("plot")}
          className={`py-2 px-1 border-b-2 text-[11px] transition-all ${
            activeTab === "plot" 
              ? "border-emerald-600 text-emerald-700 bg-white" 
              : "border-transparent hover:text-neutral-900"
          }`}
        >
          Trama ({plotCount})
        </button>
      </div>

      {/* Outputs */}
      <div className="p-3 space-y-3 max-h-[340px] overflow-y-auto">
        
        {/* CORRECTIONS */}
        {activeTab === "corrections" && (
          <div className="space-y-2.5">
            {correctionsCount === 0 ? (
              <div className="text-center py-6 text-neutral-500">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1.5" />
                <h5 className="font-semibold text-neutral-800">Grammatica impeccabile!</h5>
                <p className="text-[10px] text-neutral-400 mt-0.5">Nessun errore critico catturato in questa tornata di parole.</p>
              </div>
            ) : (
              feedback.corrections.map((corr, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-red-200/50 bg-red-50/20 space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] uppercase font-bold text-red-700">
                    <span>{corr.errorType}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-red-900 line-through bg-red-50/50 p-1 rounded font-serif text-[11px]">
                      {corr.originalPhrase}
                    </div>
                    <div className="text-emerald-950 font-bold bg-emerald-50/50 p-1 rounded font-serif text-[11.5px]">
                      {corr.correctedPhrase}
                    </div>
                  </div>
                  <p className="text-[10.5px] text-neutral-600 leading-relaxed font-sans italic">
                    💡 {corr.explanation}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* STYLE & LEXICON */}
        {activeTab === "style" && (
          <div className="space-y-2.5">
            {styleCount === 0 ? (
              <div className="text-center py-6 text-neutral-400">
                Nessuna proposta stilistica aggiuntiva per il momento.
              </div>
            ) : (
              feedback.styleAndLexicon.map((style, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-indigo-200/50 bg-indigo-50/20 space-y-1.5">
                  <div className="text-indigo-800 font-extrabold text-[10px] uppercase">
                    Miglioramento consigliato
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-neutral-500">&quot;{style.originalText}&quot;</div>
                    <div className="text-indigo-950 font-bold font-serif italic">&quot;{style.suggestedAlternative}&quot;</div>
                  </div>
                  <p className="text-[10.5px] text-neutral-600 pl-0.5 leading-relaxed">
                    ✨ {style.benefit}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* PLOT CONTINUATIONS */}
        {activeTab === "plot" && (
          <div className="space-y-3">
            {feedback.plotContinuations?.map((plot, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/40 hover:bg-white space-y-2.5 hover:shadow-xs transition-all">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{plot.title}</span>
                </div>
                <p className="text-[11px] text-neutral-700 italic border-l-2 border-emerald-500/30 pl-2 leading-relaxed">
                  &quot;{plot.suggestion}&quot;
                </p>
                <div className="text-[10px] text-neutral-500">
                  <strong>Suggerimenti:</strong> {plot.triggerQuestions?.join(" | ")}
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    onClick={() => copyText(plot.suggestion, idx)}
                    className="p-1 px-2 rounded-md bg-white border border-neutral-200 hover:bg-neutral-50 text-[10px]"
                  >
                    {copiedIdx === idx ? "Copiato!" : "Copia"}
                  </button>
                  <button
                    onClick={() => onApplyPlotSuggestion(plot.suggestion)}
                    className="p-1 px-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                  >
                    Applique via IA
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
