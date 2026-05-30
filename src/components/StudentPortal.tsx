import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Printer, 
  Star,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { GlossaryTerm, TeacherEvaluation } from "../types";

interface Submission {
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

interface StudentPortalProps {
  onBack: () => void;
}

export default function StudentPortal({ onBack }: StudentPortalProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  // Fetch student work
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const response = await fetch("/api/stories");
        if (!response.ok) {
          throw new Error("Errore durante il recupero dei compiti.");
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Impossibile scaricare l'archivio.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const matchedSubmissions = submissions.filter(sub => {
    if (!searchName.trim()) return true; // Show all or default
    return sub.studentName.toLowerCase().includes(searchName.trim().toLowerCase());
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 font-sans text-neutral-800" id="student-portal">
      
      {/* Top bar navigation */}
      <div className="no-print flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
        <button 
          onClick={onBack}
          className="text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-all border border-neutral-200 hover:border-neutral-300 p-2 rounded-lg flex items-center gap-1.5 cursor-pointer bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Torna alla Home
        </button>
        <div className="text-right">
          <h1 className="text-base font-extrabold text-neutral-900 flex items-center justify-end gap-1.5 leading-none">
            🎒 I miei compiti consegnati
          </h1>
          <p className="text-[10px] text-neutral-550 mt-0.5">
            Cerca la tua storia per verificare lo stato di correzione della professoressa.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-neutral-500">Ricerca dell&apos;archivio...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-900 text-xs">
          ⚠️ Si è verificato un errore durate la sincronizzazione: {errorMsg}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Left search drawer */}
          <div className="md:col-span-1 space-y-4 no-print">
            <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 space-y-3 shadow-xs">
              <h3 className="font-extrabold text-xs text-neutral-800 uppercase tracking-widest font-mono">Chi sei?</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Scrivi il tuo nome..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-neutral-300 rounded-lg text-xs text-neutral-800 bg-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal">
                Digita il tuo nome per restringere l&apos;elenco e trovare la tua storia.
              </p>
            </div>

            {/* List entries */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-3 bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Le tue consegne ({matchedSubmissions.length})
              </div>
              <div className="divide-y divide-neutral-100 max-h-[350px] overflow-y-auto">
                {matchedSubmissions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400 italic">
                    Nessuna consegna trovata.
                  </div>
                ) : (
                  matchedSubmissions.map((sub) => {
                    const isSelected = selectedSub?.id === sub.id;
                    const isGraded = sub.status === "evaluated";
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSub(sub)}
                        className={`w-full p-3 text-left transition-all ${
                          isSelected ? "bg-emerald-50/40 border-l-4 border-emerald-600" : "hover:bg-neutral-50 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-neutral-850 text-xs sm:text-sm">{sub.studentName}</span>
                          <span className={`text-[8px] font-bold px-1 py-0.2 rounded ${
                            isGraded ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 font-sans"
                          }`}>
                            {isGraded ? "✓ Valutato" : "⏳ In attesa"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-neutral-500 font-mono">
                          <span className="uppercase font-sans font-bold">{sub.genre} ({sub.level})</span>
                          <span>{sub.createdAt.split(",")[0]}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right detailed sheet */}
          <div className="md:col-span-2">
            {selectedSub ? (
              <div className="space-y-6">
                
                {/* 1. Status overview */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between no-print mb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-neutral-400">Stato del Compito</span>
                    <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                      {selectedSub.status === "pending" ? (
                        <>
                          <Clock className="w-4 h-4 text-amber-500 animate-spin" />
                          In attesa della correzione della professoressa...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Storia corretta e valutata! 🎉
                        </>
                      )}
                    </h3>
                  </div>

                  {selectedSub.status === "evaluated" && (
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition-all flex items-center gap-1 cursor-pointer font-sans"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Stampa Certificato
                    </button>
                  )}
                </div>

                {/* 2. Render student composition */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
                  <div>
                    <h4 className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">La tua composizione:</h4>
                    <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 font-serif leading-relaxed text-sm md:text-base text-neutral-800 space-y-3 mt-2 select-text">
                      <p className="text-neutral-400 italic">
                        &quot;{selectedSub.incipit}&quot;
                      </p>
                      <p className="whitespace-pre-wrap font-medium text-neutral-900 border-t border-neutral-250 pt-3">
                        {selectedSub.studentText}
                      </p>
                    </div>
                  </div>

                  {/* Vocabulary used */}
                  <div>
                    <span className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Termini attivati nel testo ({selectedSub.vocabularyUsed.length}):</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedSub.vocabularyUsed.length === 0 ? (
                        <span className="text-xs text-neutral-400 italic">Nessun vocabolo tematico inserito.</span>
                      ) : (
                        selectedSub.vocabularyUsed.map((w, index) => (
                          <span key={index} className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-250">
                            ✓ {w}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Render teacher stars and comments if evaluated */}
                {selectedSub.status === "evaluated" ? (
                  <div className="bg-white border-[6px] border-double border-neutral-300 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm relative overflow-hidden">
                    <div className="absolute right-5 top-5 opacity-[0.02]">
                      <Award className="w-48 h-48 text-emerald-600" />
                    </div>

                    <div className="text-center space-y-1 mb-2">
                      <h5 className="font-mono text-[9px] font-bold text-emerald-800 uppercase tracking-widest leading-none">
                        CRIVELLI DI SCRITTURA CHIARISSIMA
                      </h5>
                      <h3 className="text-lg font-extrabold text-neutral-950 tracking-tight leading-none pt-0.5">
                        Certificato di Eccellenza
                      </h3>
                      <div className="w-12 h-0.5 bg-emerald-600 mx-auto my-1.5" />
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed text-center max-w-lg mx-auto font-sans">
                      Assegnato con lode a <strong className="text-neutral-900">{selectedSub.studentName}</strong> per aver completato con successo la stesura in lingua italiana di un componimento di genere <strong className="text-neutral-800 uppercase">{selectedSub.genre}</strong> (livello CEFR <strong className="text-emerald-700">{selectedSub.level}</strong>) di complessive {selectedSub.wordCount} parole.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs font-sans">
                      <div className="space-y-1.5">
                        <h4 className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider font-mono flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          Commento Finale della Docente:
                        </h4>
                        <p className="text-[11.5px] italic font-serif leading-relaxed text-neutral-700 pr-1">
                          &quot;{selectedSub.evaluation?.feedback}&quot;
                        </p>
                      </div>

                      <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l sm:pl-4 border-neutral-200 pt-2 sm:pt-0">
                        <h4 className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider font-mono mb-0.5">La tua scheda voti</h4>
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Correttezza Grammaticale</span>
                          <span className="font-bold flex text-amber-400 font-sans">★{selectedSub.evaluation?.gradeGrammar}/5</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Uso Lessicale Tematico</span>
                          <span className="font-bold flex text-amber-400 font-sans">★{selectedSub.evaluation?.gradeVocabulary}/5</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Sviluppo Trama / Coerenza</span>
                          <span className="font-bold flex text-amber-400 font-sans">★{selectedSub.evaluation?.gradeContent}/5</span>
                        </div>
                        <div className="pt-2 text-[9px] text-neutral-450 text-right uppercase italic leading-none font-semibold text-emerald-850 font-mono">
                          Firma: {selectedSub.evaluation?.teacherName} • {selectedSub.evaluation?.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white border border-neutral-200 rounded-2xl shadow-xs text-neutral-500 space-y-1.5 no-print">
                    <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
                    <h4 className="font-bold text-neutral-800 text-xs">Arriva presto il tuo certificato!</h4>
                    <p className="text-[11px] max-w-xs mx-auto text-neutral-450 leading-relaxed">
                      La tua storia è conservata al sicuro nel registro docente. Non appena la professoressa Letícia avrà salvato la correzione, troverai qui tutti i dettagli e il certificato stampabile.
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl p-16 text-center text-neutral-500 space-y-2.5 shadow-xs">
                <div className="p-3 w-11 h-11 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-800 text-xs">Seleziona e verifica</h3>
                <p className="text-[11px] max-w-xs mx-auto leading-normal">
                  Fai clic su un compito trovato nel menu a sinistra per caricare la storia, conoscerne lo stato ed eventualmente stamparne il certificato finale.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
