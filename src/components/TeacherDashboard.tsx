import React, { useState, useEffect } from "react";
import { getApiUrl } from "../utils/api";
import { 
  ArrowLeft, 
  Search, 
  Trash2, 
  Star, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award,
  Sparkles,
  MessageSquare,
  BookMarked,
  Printer
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

interface TeacherDashboardProps {
  onBack: () => void;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>("Tutti");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("Tutti");
  const [statusFilter, setStatusFilter] = useState<string>("Tutti");

  // Selected Submission detail
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  // Evaluation Form State
  const [teacherNameInput, setTeacherNameInput] = useState<string>("Prof. Letícia Costa");
  const [gradeGrammar, setGradeGrammar] = useState<number>(5);
  const [gradeVocabulary, setGradeVocabulary] = useState<number>(5);
  const [gradeContent, setGradeContent] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");
  const [isSavingEvaluation, setIsSavingEvaluation] = useState<boolean>(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean>(false);

  // Fetch all submissions
  const fetchSubmissions = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(getApiUrl("/api/stories"));
      if (!response.ok) {
        throw new Error("Impossibile caricare i compiti dagli studenti.");
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Qualcosa è andato storto nel database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Update form values when selected submission changes
  useEffect(() => {
    if (selectedSub) {
      if (selectedSub.evaluation) {
        setTeacherNameInput(selectedSub.evaluation.teacherName);
        setGradeGrammar(selectedSub.evaluation.gradeGrammar);
        setGradeVocabulary(selectedSub.evaluation.gradeVocabulary);
        setGradeContent(selectedSub.evaluation.gradeContent);
        setFeedback(selectedSub.evaluation.feedback);
      } else {
        setTeacherNameInput("Prof. Letícia Costa");
        setGradeGrammar(5);
        setGradeVocabulary(5);
        setGradeContent(5);
        setFeedback("");
      }
      setEvaluationSuccess(false);
    }
  }, [selectedSub]);

  // Handle submit evaluation
  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsSavingEvaluation(true);
    try {
      const response = await fetch(getApiUrl(`/api/stories/${selectedSub.id}/evaluate`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherName: teacherNameInput,
          gradeGrammar,
          gradeVocabulary,
          gradeContent,
          feedback: feedback.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Errore durante il salvataggio della valutazione.");
      }

      const updatedSub = await response.json();
      
      // Update local lists
      setSubmissions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
      setSelectedSub(updatedSub);
      setEvaluationSuccess(true);
      
      // Clear after time
      setTimeout(() => setEvaluationSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Errore nel salvataggio del commento.");
    } finally {
      setIsSavingEvaluation(false);
    }
  };

  // handleDelete Submission
  const handleDeleteSub = async (id: string) => {
    if (!window.confirm("Sei sicura di voler eliminare definitivamente questo compito del registro docente?")) {
      return;
    }

    try {
      const response = await fetch(getApiUrl(`/api/stories/${id}`), {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Impossibile eliminare il compito.");
      }

      // Remove from list
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSub?.id === id) {
        setSelectedSub(null);
      }
    } catch (err: any) {
      alert(err.message || "Errore durante la cancellazione.");
    }
  };

  // Filtered stories
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.studentText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenreFilter === "Tutti" || sub.genre === selectedGenreFilter;
    const matchesLevel = selectedLevelFilter === "Tutti" || sub.level === selectedLevelFilter;
    const matchesStatus = statusFilter === "Tutti" || 
                          (statusFilter === "Da valutare" && sub.status === "pending") ||
                          (statusFilter === "Valutati" && sub.status === "evaluated");

    return matchesSearch && matchesGenre && matchesLevel && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 space-y-6" id="teacher-dashboard">
      
      {/* Upper Navigation Header */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-all border border-neutral-200 hover:border-neutral-300 p-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Torna alla Home
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Area Docente / Registro Storico
            </h1>
            <p className="text-xs text-neutral-500 font-sans mt-0.5">
              Visualizza le storie inviate dai tuoi studenti L2, fornisci giudizi stellati e scrivi i tuoi commenti finali.
            </p>
          </div>
        </div>

        <button
          onClick={fetchSubmissions}
          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg transition-all border border-emerald-200/40"
        >
          🔄 Aggiorna Registro
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-neutral-600">Caricamento del registro dei compiti...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-900 text-sm">
          ⚠️ Si è verificato un errore: {errorMsg}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 5 COLUMNS: Filtering criteria & Stories list */}
          <div className="lg:col-span-5 space-y-4 no-print">
            
            {/* Search and Advanced Filters */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cerca studente o testo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-xl text-xs text-neutral-800 bg-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px]">
                {/* Genre */}
                <div>
                  <label className="block font-bold text-neutral-500 uppercase font-mono mb-1">Genere</label>
                  <select
                    value={selectedGenreFilter}
                    onChange={(e) => setSelectedGenreFilter(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-1.5 bg-neutral-50 font-sans"
                  >
                    <option value="Tutti">Tutti</option>
                    <option value="Avventura">Avventura</option>
                    <option value="Mistero">Mistero</option>
                    <option value="Romantico">Romantico</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Commedia">Commedia</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block font-bold text-neutral-500 uppercase font-mono mb-1">Livello</label>
                  <select
                    value={selectedLevelFilter}
                    onChange={(e) => setSelectedLevelFilter(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-1.5 bg-neutral-50 font-sans"
                  >
                    <option value="Tutti">Tutti</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-bold text-neutral-500 uppercase font-mono mb-1 font-sans">Stato</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-1.5 bg-neutral-50 font-sans"
                  >
                    <option value="Tutti">Tutti</option>
                    <option value="Da valutare">Da valutare</option>
                    <option value="Valutati">Valutati</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List of Student Submissions */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center text-xs text-neutral-500 font-bold">
                <span>COMPITI INVIATI ({filteredSubmissions.length})</span>
                <span className="text-[10px] text-neutral-400 font-mono">Tot: {submissions.length}</span>
              </div>

              <div className="divide-y divide-neutral-100 max-h-[500px] overflow-y-auto">
                {filteredSubmissions.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-xs italic">
                    Nessun compito corrisponde alle ricerche selezionate.
                  </div>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isSelected = selectedSub?.id === sub.id;
                    const hasGraded = sub.status === "evaluated";
                    return (
                      <div
                        key={sub.id}
                        className={`p-3.5 transition-all cursor-pointer text-left ${
                          isSelected 
                            ? "bg-emerald-50/40 border-l-4 border-emerald-600" 
                            : "hover:bg-neutral-50 bg-white"
                        }`}
                        onClick={() => setSelectedSub(sub)}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                            {sub.studentName}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            hasGraded 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}>
                            {hasGraded ? "✓ Valutato" : "● Da valutare"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                          <span className="uppercase text-neutral-700 font-semibold font-sans">{sub.genre}</span>
                          <span>|</span>
                          <span className="text-emerald-700 font-bold font-sans">{sub.level}</span>
                          <span>|</span>
                          <span>{sub.wordCount} parole</span>
                        </div>

                        <div className="mt-2 text-[10px] text-neutral-400 font-mono flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-300" />
                            {sub.createdAt}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSub(sub.id);
                            }}
                            className="text-neutral-450 hover:text-red-600 p-1 rounded hover:bg-red-50/50 transition-all text-xs"
                            title="Elimina compito dal registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* RIGHT 7 COLUMNS: Detailed story view & interactive assessment form */}
          <div className="lg:col-span-7">
            {selectedSub ? (
              <div className="space-y-6">
                
                {/* 1. Student Story Reading Deck */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
                  <div className="no-print flex items-center justify-between pb-3.5 border-b border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono block">Nome dello studente</span>
                      <h2 className="text-lg font-extrabold text-neutral-900">{selectedSub.studentName}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase font-mono block">Ricevuto il</span>
                      <span className="text-xs text-neutral-600 font-mono">{selectedSub.createdAt}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">Testo Consolidato:</h3>
                    
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 font-serif leading-relaxed text-sm md:text-base text-neutral-800 space-y-3">
                      <p className="text-neutral-400 italic">
                        &quot;{selectedSub.incipit}&quot;
                      </p>
                      <p className="whitespace-pre-wrap font-medium text-neutral-900 border-t border-neutral-200/50 pt-3">
                        {selectedSub.studentText}
                      </p>
                    </div>
                  </div>

                  {/* Vocabulary used check inside reader */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase font-mono mb-2">Vocaboli tematici attivati ({selectedSub.vocabularyUsed.length}):</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSub.vocabularyUsed.length === 0 ? (
                        <span className="text-neutral-400 text-xs italic">Nessun vocabolo tematico inserito.</span>
                      ) : (
                        selectedSub.vocabularyUsed.map((w, wi) => (
                          <span key={wi} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/40">
                            ✓ {w}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Glossary items generated */}
                  {selectedSub.glossary && selectedSub.glossary.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <h4 className="text-xs font-bold text-neutral-500 uppercase font-mono flex items-center gap-1">
                        <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
                        Glossario Autonomo Creato ({selectedSub.glossary.length} parole):
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {selectedSub.glossary.map((g, idx) => (
                          <div key={idx} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-250 text-xs">
                            <div className="flex items-center justify-between mb-0.5 font-bold">
                              <span className="text-neutral-900 font-serif">{g.term}</span>
                              <span className="text-[8px] font-mono bg-neutral-200 px-1 py-0.2 rounded uppercase">{g.partOfSpeech}</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 leading-snug">
                              IT: {g.definition} | PT: <span className="italic">{g.translation}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Quick interactive marking console (Teacher Evaluation Form) */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-5 no-print">
                  <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-neutral-800 text-sm">
                      Console di Valutazione dell&apos;Insegnante
                    </h3>
                  </div>

                  <form onSubmit={handleSaveEvaluation} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase font-mono mb-1">
                          Nome Insegnante / Firmatario
                        </label>
                        <input
                          type="text"
                          value={teacherNameInput}
                          onChange={(e) => setTeacherNameInput(e.target.value)}
                          className="w-full text-xs font-bold text-neutral-800 bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500/15"
                          required
                        />
                      </div>
                      <div className="text-right text-[10px] text-neutral-400 font-mono pt-4 flex items-center justify-end gap-1">
                        <span>Compito ID:</span>
                        <strong className="text-neutral-600 font-sans text-xs">{selectedSub.id}</strong>
                      </div>
                    </div>

                    {/* Rubrics Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/50">
                      
                      {/* Grammar rating */}
                      <div className="space-y-1">
                        <span className="text-[11.5px] font-bold text-neutral-700 block">Grammatica</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setGradeGrammar(star)}
                              className={`p-0.5 hover:scale-110 transition-all cursor-pointer ${
                                gradeGrammar >= star ? "text-amber-400" : "text-neutral-200"
                              }`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Vocabulary rating */}
                      <div className="space-y-1">
                        <span className="text-[11.5px] font-bold text-neutral-700 block">Vocabolario L2</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setGradeVocabulary(star)}
                              className={`p-0.5 hover:scale-110 transition-all cursor-pointer ${
                                gradeVocabulary >= star ? "text-amber-400" : "text-neutral-200"
                              }`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cohesion rating */}
                      <div className="space-y-1">
                        <span className="text-[11.5px] font-bold text-neutral-700 block font-sans">Sviluppo Trama</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setGradeContent(star)}
                              className={`p-0.5 hover:scale-110 transition-all cursor-pointer ${
                                gradeContent >= star ? "text-amber-400" : "text-neutral-200"
                              }`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Comment Area */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase font-mono">
                        Commento Finale dell&apos;Insegnante
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                        className="w-full text-xs text-neutral-800 border border-neutral-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500/15"
                        placeholder="Inserisci note didattiche costruttive, consiglia punti di forza, o commenti finali..."
                        required
                      />
                    </div>

                    {/* Form actions row */}
                    <div className="flex items-center justify-between gap-2.5 pt-2">
                      {evaluationSuccess ? (
                        <div className="text-emerald-700 font-semibold text-xs flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-4 h-4" />
                          Valutazione salvata nel registro!
                        </div>
                      ) : (
                        <div className="text-neutral-400 text-[10px]">
                          La valutazione sarà integrata nel certificato dello studente.
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSavingEvaluation}
                        className="px-5 py-2.5 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white shadow transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSavingEvaluation ? "Salvataggio..." : "Salva Commento"}
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* 3. Render official certificate instantly below if it has been graded */}
                {selectedSub.status === "evaluated" && (
                  <div className="bg-white border-[6px] border-double border-neutral-300 rounded-2xl p-5 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute right-5 top-5 opacity-[0.02]">
                      <Award className="w-48 h-48 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-100 no-print">
                      <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Certificato Consolidato Prerenderizzato (Pronto per PDF)
                      </h4>
                      <button
                        onClick={() => window.print()}
                        className="p-1 px-2.5 border border-neutral-200 hover:bg-neutral-50 rounded text-[10px] flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Printer className="w-3 h-3" />
                        Stampa
                      </button>
                    </div>

                    <div className="text-center space-y-1 mb-3">
                      <h5 className="font-mono text-[9px] font-bold text-emerald-800 uppercase tracking-widest leading-none">
                        CRIVELLI DI SCRITTURA CHIARISSIMA
                      </h5>
                      <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight leading-none pt-0.5">
                        Certificato di Eccellenza
                      </h3>
                      <div className="w-12 h-0.5 bg-emerald-600 mx-auto my-1.5" />
                    </div>

                    <p className="text-[11.5px] text-neutral-600 leading-normal text-center max-w-lg mx-auto font-sans">
                      Assegnato con lode a <strong className="text-neutral-900">{selectedSub.studentName}</strong> per aver completato con successo la stesura in lingua italiana di un componimento di genere <strong className="text-neutral-800 uppercase">{selectedSub.genre}</strong> (livello CEFR <strong className="text-emerald-700">{selectedSub.level}</strong>) di complessive {selectedSub.wordCount} parole.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">Feedback Docente</h4>
                        <p className="text-[11.5px] italic font-serif leading-relaxed text-neutral-700">
                          &quot;{selectedSub.evaluation?.feedback}&quot;
                        </p>
                      </div>

                      <div className="space-y-1.5 font-sans border-t sm:border-t-0 sm:border-l sm:pl-4 border-neutral-200 pt-2 sm:pt-0">
                        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono mb-1 bg-neutral-100 p-0.5 px-1.5 rounded w-max">Valutazione della docente</h4>
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
                        <div className="pt-2 text-[9px] text-neutral-450 text-right uppercase italic leading-none font-medium text-emerald-800 font-mono">
                          Emanato il: {selectedSub.evaluation?.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl p-16 text-center text-neutral-500 space-y-3 shadow-xs">
                <div className="p-3 w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-neutral-800 text-sm">Seleziona un compito</h3>
                <p className="text-xs max-w-xs mx-auto">
                  Fai clic su un compito inviato nel menu a sinistra per visualizzare il testo dello studente ed effettuarne la correzione didattica.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
