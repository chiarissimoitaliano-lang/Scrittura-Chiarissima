import React, { useState, useEffect } from "react";
import { GlossaryTerm, VocabularyTerm, TeacherEvaluation } from "../types";
import { 
  apiSubmitStory, 
  apiGetStories, 
  exportSubmissionToCode, 
  importSubmissionFromCode, 
  apiAddOrUpdateStoryDirectly 
} from "../utils/api";
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Printer, 
  Star, 
  MessageSquare, 
  Bookmark, 
  Heart, 
  Edit3, 
  Download,
  Share2,
  Calendar,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
  Clock,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface EvaluationCertificateProps {
  genre: string;
  level: string;
  targetLength: number;
  incipit: string;
  studentText: string;
  vocabulary: VocabularyTerm[];
  usedSymbols: Record<string, boolean>;
  glossary: GlossaryTerm[];
  onRestart: () => void;
  teacherEmail: string;
}

interface SubmittedStory {
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

export default function EvaluationCertificate({
  genre,
  level,
  targetLength,
  incipit,
  studentText,
  vocabulary,
  usedSymbols,
  glossary,
  onRestart,
  teacherEmail
}: EvaluationCertificateProps) {
  
  // Submission process state
  const [studentName, setStudentName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // Tracked submission state from backend
  const [submission, setSubmission] = useState<SubmittedStory | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);

  const matchedWordsCount = Object.keys(usedSymbols).length;
  const wordCount = studentText.trim().split(/\s+/).filter(Boolean).length;

  // Retrieve exact vocabulary words used in their raw format
  const vocabularyUsedList = Object.keys(usedSymbols);

  // Handle student submit composition to database
  const handleDeliverToTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || studentName.trim().length < 2) {
      setSubmissionError("Per favore, inserisci un nome valido ed identificativo.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const savedData = await apiSubmitStory({
        studentName: studentName.trim(),
        genre,
        level,
        targetLength,
        incipit,
        studentText,
        wordCount,
        vocabularyUsed: vocabularyUsedList,
        glossary
      });
      setSubmission(savedData);
    } catch (err: any) {
      console.error(err);
      setSubmissionError(err.message || "Impossibile salvare il compito. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Re-check correction status from DB
  const handleCheckCorrectionStatus = async () => {
    if (!submission) return;
    setIsCheckingStatus(true);
    try {
      const list = await apiGetStories();
      const current = list.find((s: any) => s.id === submission.id);
      if (current) {
        setSubmission(current);
      }
    } catch (err) {
      console.error("Si è verificato un errore durante la sincronizzazione della correzione:", err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // STATE 1: Not submitted yet - Student Hand-in form
  if (!submission) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4 font-sans select-none" id="submission-handin-desk">
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          
          {/* Header */}
          <div className="text-center pb-4 border-b border-neutral-100">
            <span className="p-2 py-1 bg-emerald-50 rounded-full text-emerald-700 text-[10px] font-extrabold border border-emerald-100 uppercase font-mono">
              COMPILAZIONE COMPLETATA
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight mt-3">
              Consegna il Componimento
            </h2>
            <p className="text-neutral-500 text-xs mt-1.5 max-w-md mx-auto">
              Complimenti! Hai concluso la tua stesura. Inserisci il tuo nome qui sotto per inviare il lavoro nel registro digitale della docente per la correzione.
            </p>
          </div>

          {/* Core Stats overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-xl text-center border border-neutral-100">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-mono">Genere</span>
              <span className="text-neutral-800 font-extrabold text-xs sm:text-sm">{genre}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-mono">Livello</span>
              <span className="text-emerald-600 font-extrabold text-xs sm:text-sm">{level}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-mono">Vocaboli usati</span>
              <span className="text-neutral-800 font-extrabold text-xs sm:text-sm">{matchedWordsCount} / 12</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase font-mono">Totale Parole</span>
              <span className="text-neutral-800 font-extrabold text-xs sm:text-sm">{wordCount} parole</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleDeliverToTeacher} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 uppercase">
                Inserisci il tuo nome completo:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setSubmissionError(null);
                }}
                className="w-full text-sm font-semibold text-neutral-800 bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                placeholder="Es: Maria Silva, Joao Santos..."
                required
              />
              {submissionError && (
                <p className="text-xs text-red-600 font-medium leading-relaxed">
                  ⚠️ {submissionError}
                </p>
              )}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onRestart}
                className="w-1/3 border border-neutral-300 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-600 transition-all font-sans cursor-pointer py-3.5 text-center"
              >
                Modifica ancora
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 py-3.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    In consegna...
                  </>
                ) : (
                  <>
                    Invia compito alla professoressa
                    <Award className="w-4 h-4 text-emerald-300" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // STATE 2: Submitted - Tracking correction status or viewing teacher comment
  const isEvaluated = submission.status === "evaluated";

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 select-text font-sans" id="student-live-dashboard">
      
      {/* Upper Status Panel */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 bg-white border border-neutral-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isEvaluated ? "bg-emerald-50 text-emerald-600" : "bg-amber-100 text-amber-800 animate-pulse"}`}>
            {isEvaluated ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-neutral-900 leading-none">
              {isEvaluated ? "✓ Compito Valutato!" : "⏳ Compito Consegnato con Successo!"}
            </h1>
            <p className="text-[10px] text-neutral-500 mt-1">
              {isEvaluated 
                ? `La professoressa ${submission.evaluation?.teacherName} ha corretto il tuo compito.` 
                : "In attesa della correzione da parte della docente. Conserva questa pagina aperta o controlla gli aggiornamenti."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEvaluated ? (
            <button
              onClick={handleCheckCorrectionStatus}
              disabled={isCheckingStatus}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? "animate-spin" : ""}`} />
              Aggiorna Stato della correzione
            </button>
          ) : (
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <Printer className="w-4 h-4" />
              Stampa Certificato
            </button>
          )}

          <button
            onClick={onRestart}
            className="px-4 py-2 border border-neutral-300 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-600 transition-all cursor-pointer bg-white"
          >
            Nuova Storia
          </button>
        </div>
      </div>

      {/* Manual homework share box for Netlify / local backup */}
      {!isEvaluated && (
        <div className="bg-amber-50/45 border border-amber-200 rounded-2xl p-5 space-y-3.5 shadow-xs no-print">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="font-bold text-neutral-850 text-xs sm:text-sm">
              Sincronizzazione Manuale per la Docente (Canale Netlify / Offline)
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed max-w-3xl">
            Poiché l&apos;applicazione è ospitata su un server statico (Netlify) e potrebbe non essere in grado di comunicare in tempo reale con il database, <strong>copia il codice compito criptato qui sotto</strong> e invialo direttamente alla professoressa via WhatsApp o Email per la correzione.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <input
              type="text"
              readOnly
              value={exportSubmissionToCode(submission)}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 p-2 text-[10px] bg-white border border-neutral-300 rounded-lg text-neutral-800 font-mono focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(exportSubmissionToCode(submission));
                alert("Codice compito copiato negli appunti! Invialo alla professoressa.");
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              📋 Copia Codice Compito
            </button>
          </div>
          
          <div className="pt-3 border-t border-amber-100/80 space-y-2.5">
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
              Hai già ricevuto il codice di valutazione della Docente? Sbloccalo qui:
            </span>
            <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
              <input
                type="text"
                placeholder="Incolla qui il codice di valutazione ricevuto SC_..."
                id="pasted-valutazione-direct"
                className="flex-1 p-2 text-[10px] bg-white border border-neutral-250 rounded-lg text-neutral-850 font-mono focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  const val = (document.getElementById("pasted-valutazione-direct") as HTMLInputElement)?.value;
                  if (!val || !val.trim()) return;
                  const imported = importSubmissionFromCode(val);
                  if (imported && imported.id === submission.id) {
                    apiAddOrUpdateStoryDirectly(imported);
                    setSubmission(imported);
                    alert("🎉 Fantastico! Valutazione caricata correttamente. Il tuo certificato di eccellenza è sbloccato!");
                  } else {
                    alert("❌ Codice non valido o non associato a questo specifico compito!");
                  }
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                Sblocca Certificato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER THE ACTIVE CERTIFICATE IF EVALUATED */}
      {isEvaluated ? (
        <div className="bg-white border-[10px] border-double border-neutral-300 rounded-3xl p-6 md:p-12 shadow-sm relative overflow-hidden print:border-neutral-800">
          
          {/* Logo Watermark */}
          <div className="absolute right-6 top-6 opacity-[0.03] select-none pointer-events-none no-print">
            <Award className="w-96 h-96 text-emerald-600" />
          </div>

          <div className="border border-neutral-100 rounded-2xl p-4 md:p-8 space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <h3 className="font-mono text-[10px] font-bold text-emerald-800 tracking-widest uppercase">
                UNIVERSITÀ DELLA SCRITTURA CREATIVA
              </h3>
              <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-none">
                Certificato di Eccellenza
              </h1>
              <p className="text-xs text-neutral-550 font-serif italic max-w-xl mx-auto">
                Attestato di abilità linguistica e produzione letteraria originale per la lingua italiana
              </p>
              <div className="w-24 h-0.5 bg-emerald-600 mx-auto my-3" />
            </div>

            {/* Main body */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Si certifica che l&apos;alunno di italiano <strong className="text-neutral-950 underline underline-offset-4">{submission.studentName}</strong> ha composto e completato con successo una composizione narrativa originale di genere <strong className="text-neutral-900 uppercase">{submission.genre}</strong> calata sul livello <strong className="text-emerald-700 font-bold">{submission.level}</strong> del Quadro Comune Europeo di Riferimento per le Lingue (QCER).
              </p>
            </div>

            {/* Gold Seal representation */}
            <div className="flex justify-center my-4 select-none">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-amber-500 animate-spin-slow opacity-80" />
                <div className="absolute w-12 h-12 rounded-full bg-linear-to-br from-amber-300 via-amber-400 to-yellow-500 border border-amber-600 flex flex-col items-center justify-center shadow-xs">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-neutral-200" />

            {/* The Text Block */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Testo Consolidato ed Elevato della Storia
              </h3>
              <div className="p-5 md:p-7 rounded-2xl bg-neutral-50 border border-neutral-200 font-serif text-sm md:text-base leading-relaxed text-neutral-800 space-y-4 shadow-inner">
                <p className="text-neutral-400 italic">
                  &quot;{submission.incipit}&quot;
                </p>
                <p className="whitespace-pre-wrap font-medium text-neutral-900 border-t border-neutral-200/50 pt-4">
                  {submission.studentText}
                </p>
              </div>
            </div>

            {/* The Dictionary of terms */}
            {submission.glossary.length > 0 && (
              <div className="space-y-4 pt-4 page-break-before">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-emerald-600" />
                  Glossario Personale dei Termini Appresi ({submission.glossary.length})
                </h3>

                <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-neutral-600 font-sans border-collapse">
                    <thead className="bg-neutral-50 text-[9px] text-neutral-500 uppercase font-mono border-b border-neutral-200">
                      <tr>
                        <th className="p-3 font-bold border-r border-neutral-200">Termine</th>
                        <th className="p-3 font-bold border-r border-neutral-200">Grammatica</th>
                        <th className="p-3 font-bold border-r border-neutral-200">Definizione IT</th>
                        <th className="p-3 font-bold">Traduzione PT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {submission.glossary.map((g, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/50 bg-white">
                          <td className="p-3 font-bold text-neutral-900 border-r border-neutral-200 font-serif text-sm">{g.term}</td>
                          <td className="p-3 border-r border-neutral-200 font-mono text-[9px] text-neutral-500">{g.partOfSpeech}</td>
                          <td className="p-3 border-r border-neutral-200 leading-relaxed font-serif text-[11px]">{g.definition}</td>
                          <td className="p-3 italic text-neutral-500 font-medium text-[11px]">{g.translation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Assessment and Marks Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200 font-sans">
              
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
                  Valutazione Docente
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-700 font-semibold font-sans">Correttezza Grammaticale</span>
                    <div className="flex gap-0.5 text-amber-500 font-sans">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < (submission.evaluation?.gradeGrammar || 5) ? "fill-current text-amber-400" : "text-neutral-200"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-sans">
                    <span className="text-xs text-neutral-700 font-semibold font-sans">Uso della Nomenclatura Consigliata</span>
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < (submission.evaluation?.gradeVocabulary || 5) ? "fill-current text-amber-400" : "text-neutral-200"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-sans">
                    <span className="text-xs text-neutral-700 font-semibold font-sans">Sviluppo Trama / Coesione</span>
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < (submission.evaluation?.gradeContent || 5) ? "fill-current text-amber-400" : "text-neutral-200"}`} />
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-neutral-500 text-[10px] flex justify-between border-t border-neutral-200/50 font-mono">
                    <span>Vocaboli attivati: <strong>{submission.vocabularyUsed.length} su 12</strong></span>
                    <span>Lunghezza: <strong>{submission.wordCount} parole</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border bg-emerald-50/5 border-emerald-500/10 space-y-3">
                <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Commento della Professoressa
                </h4>
                <p className="text-xs text-neutral-800 leading-relaxed italic pr-2 font-serif select-text rounded p-0.5">
                  &quot;{submission.evaluation?.feedback}&quot;
                </p>
                <div className="flex justify-between items-end pt-3 text-xs">
                  <div>
                    <span className="text-[8px] text-neutral-400 block uppercase font-mono leading-none">Insegnante</span>
                    <span className="text-xs font-bold text-neutral-900 font-serif italic pt-0.5 block leading-none">{submission.evaluation?.teacherName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-neutral-400 block uppercase font-mono leading-none">Data emissione</span>
                    <span className="text-[10px] text-neutral-650 font-mono flex items-center gap-1 justify-end pt-0.5 leading-none">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      {submission.evaluation?.createdAt}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Signature/Watermark */}
            <div className="text-center text-[10px] text-neutral-450 pt-8 border-t border-neutral-100 flex items-center justify-center gap-2 font-mono">
              <span>SCRITTURA CHIARISSIMA ACADEMY</span>
              <span>•</span>
              <span>COESIONE LINGUISTICA ITALIANA</span>
            </div>

          </div>

        </div>
      ) : (
        /* WAITING PORTAL INSTEAD OF CERTIFICATE */
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-12 text-center space-y-6 shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-neutral-900 text-lg">La tua storia è nel registro digitale! ✏️</h3>
            <p className="text-xs text-neutral-550 leading-relaxed max-w-sm mx-auto">
              Ottimo lavoro, <strong>{submission.studentName}</strong>! La tua storia di genere <strong className="uppercase">{submission.genre}</strong> è stata consegnata ed è in coda per essere letta e corretta dalla professoressa.
            </p>
          </div>

          <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-500/10 text-xs text-neutral-700 leading-normal max-w-md mx-auto flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-left space-y-1">
              <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px] font-mono">Consiglio utile per dopo</span>
              <span>Non appena la professoressa Letícia avrà salvato la valutazione da remoto, vedrai comparire qui sotto i tuoi voti stellati, la recensione grammaticale e il certificato ufficiale stampabile! Fai clic sul pulsante in alto per aggiornare lo stato quando vuoi.</span>
            </div>
          </div>

          {/* Student draft copy preview */}
          <div className="pt-2 text-left space-y-2 no-print">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">La tua bozza:</span>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/50 max-h-40 overflow-y-auto text-xs font-serif leading-relaxed text-neutral-600 whitespace-pre-wrap select-text">
              {submission.studentText}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
