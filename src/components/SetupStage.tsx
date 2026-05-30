import React, { useState } from "react";
import { getApiUrl } from "../utils/api";
import { starters } from "../data/starters";
import { 
  Compass, 
  HelpCircle, 
  Heart, 
  Sparkles, 
  Smile, 
  User, 
  GraduationCap, 
  BookOpen, 
  PenTool, 
  ArrowRight,
  FlameKindling,
  KeyRound,
  Eye,
  Award
} from "lucide-react";

interface SetupStageProps {
  onStart: (config: {
    genre: string;
    level: string;
    targetLength: number;
    incipit: string;
    vocabulary: { word: string; translation: string }[];
    isCustom: boolean;
    customTopic?: string;
  }) => void;
  onOpenTeacher: () => void;
  onOpenStudentPortal: () => void;
}

const GENRE_DETAILS = [
  { id: "Avventura", name: "Avventura", icon: Compass, desc: "Eroi, percorsi misteriosi e grandi scoperte.", color: "border-amber-500/20 hover:border-amber-500/50 text-amber-600 bg-amber-50/50" },
  { id: "Mistero", name: "Mistero", icon: HelpCircle, desc: "Investigazioni, silenzi carichi di suspense ed enigmi.", color: "border-purple-500/20 hover:border-purple-500/50 text-purple-600 bg-purple-50/50" },
  { id: "Romantico", name: "Romantico", icon: Heart, desc: "Incontri speciali, sentimenti e coincidenze della sorte.", color: "border-pink-500/20 hover:border-pink-500/50 text-pink-600 bg-pink-50/50" },
  { id: "Fantasy", name: "Fantasy", icon: FlameKindling, desc: "Magia, creature alate, antiche rune e reliquie arcaniche.", color: "border-cyan-500/20 hover:border-cyan-500/50 text-cyan-600 bg-cyan-50/50" },
  { id: "Commedia", name: "Commedia", icon: Smile, desc: "Equivoci esilaranti, ricette andate a male e goffi imprevisti.", color: "border-emerald-500/20 hover:border-emerald-500/50 text-emerald-600 bg-emerald-50/50" }
];

const CEFR_LEVELS = [
  { id: "A1", title: "A1 (Principiante)", summary: "Frasi semplici, presente indicativo, vocabolario quotidiano." },
  { id: "A2", title: "A2 (Elementare)", summary: "Passato prossimo, descrizioni di luoghi, piccole avventures." },
  { id: "B1", title: "B1 (Intermedio)", summary: "Uso del congiuntivo semplice, riflessioni personali e desideri." },
  { id: "B2", title: "B2 (Intermedio Superiore)", summary: "Strutture complesse, stile fluido, vocabolario ricco di sfumature." },
  { id: "C1", title: "C1 (Avanzato)", summary: "Stile espressivo e accademico, metafore e costrutti formali." }
];

export default function SetupStage({ onStart, onOpenTeacher, onOpenStudentPortal }: SetupStageProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("Avventura");
  const [selectedLevel, setSelectedLevel] = useState<string>("A2");
  const [targetLength, setTargetLength] = useState<number>(3);
  
  // Custom IA starter configurations
  const [isAICustomMode, setIsAICustomMode] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [isLoadingCustom, setIsLoadingCustom] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Passcode Lock Modal state
  const [isPasscodeOpen, setIsPasscodeOpen] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const handleStartDefault = () => {
    const data = starters[selectedGenre]?.[selectedLevel];
    if (!data) {
      alert("Configurazione non trovata. Per favore prova un'altra combinazione.");
      return;
    }
    onStart({
      genre: selectedGenre,
      level: selectedLevel,
      targetLength,
      incipit: data.incipit,
      vocabulary: data.vocabulary,
      isCustom: false
    });
  };

  const handleStartCustomAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) {
      setApiError("Per favore, inserisci un argomento di partenza!");
      return;
    }

    setIsLoadingCustom(true);
    setApiError(null);

    try {
      const response = await fetch(getApiUrl("/api/tutor/custom-starter"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic,
          level: selectedLevel,
          genre: selectedGenre
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Errore di risposta del server.");
      }

      const outcome = await response.json();
      onStart({
        genre: selectedGenre,
        level: selectedLevel,
        targetLength,
        incipit: outcome.incipit,
        vocabulary: outcome.vocabulary,
        isCustom: true,
        customTopic
      });
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Impossibile collegarsi al server dei segreti. Utilizza l'incipit standard.");
    } finally {
      setIsLoadingCustom(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret passcode for teacher verification (case insensitive)
    if (passcodeInput.trim().toLowerCase() === "duda3001") {
      setIsPasscodeOpen(false);
      setPasscodeInput("");
      setPasscodeError(null);
      onOpenTeacher();
    } else {
      setPasscodeError("Codice errato. Riprova.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4" id="setup-stage-container">
      
      {/* Top Header Navigation Hooks */}
      <div className="no-print flex justify-end gap-2.5 mb-5 font-sans">
        <button
          onClick={onOpenStudentPortal}
          className="text-xs font-semibold px-4 py-2 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-neutral-700"
        >
          🎒 I miei compiti
        </button>
        <button
          onClick={() => {
            setIsPasscodeOpen(true);
            setPasscodeError(null);
          }}
          className="text-xs font-bold px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-250/50 hover:bg-emerald-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          🏫 Area Docente
        </button>
      </div>

      {/* Passcode Lock Modal */}
      {isPasscodeOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in no-print font-sans">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 max-w-sm w-full space-y-4 shadow-xl select-none">
            <div className="text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-neutral-900 text-base">Area Docente Protetta</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Inserisci il codice d&apos;accesso per visualizzare il registro storico dei compiti degli alunni.
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="Codice d'accesso"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full text-center border border-neutral-300 rounded-lg py-2.5 text-sm font-bold text-neutral-800 bg-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-center text-[11px] text-red-600 font-medium mt-1.5">
                    ⚠️ {passcodeError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasscodeOpen(false);
                    setPasscodeInput("");
                    setPasscodeError(null);
                  }}
                  className="w-1/2 border border-neutral-250 hover:bg-neutral-50 py-2 rounded-lg font-semibold cursor-pointer text-center text-neutral-600"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold cursor-pointer text-center shadow-xs"
                >
                  Accedi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Title & Introduction */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-emerald-50 rounded-full text-emerald-600 mb-3 border border-emerald-100">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight select-none">
          Scrittura <span className="text-emerald-600 font-serif italic">Chiarissima</span>
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl mx-auto text-sm md:text-base">
          Benvenuto nel laboratorio di scrittura creativa in italiano. Scegli il genere letterario, configura il tuo livello CEFR e inizia a comporre la tua storia guidato da un tutor intelligente.
        </p>
      </div>

      {/* Quick Info Box - Come funziona */}
      <div className="mb-8 p-5 bg-amber-50/55 rounded-2xl border border-amber-500/10 text-neutral-700 text-xs sm:text-sm leading-relaxed space-y-3">
        <h2 className="font-bold text-amber-900 text-sm flex items-center gap-1.5 uppercase tracking-wider font-mono">
          <HelpCircle className="w-4 h-4" />
          Come funziona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <div className="bg-white/60 p-3.5 rounded-xl border border-amber-200/30">
            <span className="text-amber-950 font-bold block mb-1 text-xs uppercase font-mono">Fase 1: Configurazione</span>
            <span className="text-xs text-neutral-600">Scegli il genere letterario, il tuo livello e l&apos;estensione desiderata della storia.</span>
          </div>
          <div className="bg-white/60 p-3.5 rounded-xl border border-amber-200/30">
            <span className="text-amber-950 font-bold block mb-1 text-xs uppercase font-mono">Fase 2: Scrittura Attiva</span>
            <span className="text-xs text-neutral-600">Leggi l&apos;incipit di partenza e continua la narrazione usando i termini tematici consigliati.</span>
          </div>
          <div className="bg-white/60 p-3.5 rounded-xl border border-amber-200/30">
            <span className="text-amber-950 font-bold block mb-1 text-xs uppercase font-mono">Fase 3: Tutor linguistico</span>
            <span className="text-xs text-neutral-600">Richiedi correzioni morfologiche in tempo reale e genera il glossario della tua storia.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Genre & Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Genre Card Selection */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-emerald-600" />
              1. Scegli il Genere Letterario
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GENRE_DETAILS.map((gen) => {
                const IconComponent = gen.icon;
                const isSelected = selectedGenre === gen.id;
                return (
                  <button
                    key={gen.id}
                    onClick={() => { setSelectedGenre(gen.id); setApiError(null); }}
                    id={`genre-btn-${gen.id}`}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                      isSelected 
                        ? `bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-600/10` 
                        : "bg-white border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-500"}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-sm">{gen.name}</h3>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{gen.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Selector */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              2. Seleziona il tuo Livello d'Italiano
            </h2>
            <div className="space-y-2">
              {CEFR_LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => { setSelectedLevel(lvl.id); setApiError(null); }}
                    id={`level-btn-${lvl.id}`}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-150 ${
                      isSelected 
                        ? "bg-emerald-50/50 border-emerald-600 ring-1 ring-emerald-600/10" 
                        : "bg-white border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center font-mono font-bold text-xs w-8 h-8 rounded-full ${
                        isSelected ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-700"
                      }`}>
                        {lvl.id}
                      </span>
                      <div>
                        <h4 className="font-semibold text-neutral-800 text-sm">{lvl.title}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">{lvl.summary}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-emerald-600 bg-emerald-600" : "border-neutral-300 bg-white"
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Flow options & Length */}
        <div className="space-y-6">
          {/* Target Length Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
            <h2 className="text-base font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Dimensione Storia
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              L'estensione desiderata per questa storia. Il tutor la userà per valutare la coesione finale.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((num) => {
                const isSelected = targetLength === num;
                return (
                  <button
                    key={num}
                    onClick={() => setTargetLength(num)}
                    id={`length-btn-${num}`}
                    className={`py-3 text-center rounded-xl font-semibold text-sm border transition-all duration-150 ${
                      isSelected 
                        ? "bg-emerald-600 border-emerald-600 text-white" 
                        : "bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700"
                    }`}
                  >
                    {num} <span className="block text-[9px] font-normal uppercase mt-0.5">paragrafi</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selector Toggle: Default Predefined vs Custom Topic */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Incipit personalizzato
              </h2>
              <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md">IA</span>
            </div>
            
            <p className="text-xs text-neutral-500 mb-4">
              Vuoi scegliere l'inizio consigliato o preferisci impostare tu stessa l'argomento?
            </p>

            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg mb-4">
              <button
                type="button"
                onClick={() => setIsAICustomMode(false)}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  !isAICustomMode ? "bg-white text-neutral-800 shadow" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Incipit Pronto
              </button>
              <button
                type="button"
                onClick={() => setIsAICustomMode(true)}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                  isAICustomMode ? "bg-white text-neutral-800 shadow" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                Argomento IA
              </button>
            </div>

            {isAICustomMode ? (
              <form onSubmit={handleStartCustomAI} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Su cosa deve iniziare la storia?
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => { setCustomTopic(e.target.value); setApiError(null); }}
                    placeholder="Es: Uma cafeteria em Florença, uma viagem espacial..."
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-neutral-50"
                  />
                </div>

                {apiError && (
                  <p className="text-xs text-red-600 font-medium leading-relaxed">
                    ⚠️ {apiError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoadingCustom}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingCustom ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      In generazione...
                    </>
                  ) : (
                    <>
                      Genera Incipit IA
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-neutral-700 font-medium bg-neutral-50 p-3 rounded-lg border border-neutral-100 italic">
                  &quot;{starters[selectedGenre]?.[selectedLevel]?.incipit.substring(0, 80)}...&quot;
                </p>
                <button
                  onClick={handleStartDefault}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  Comincia Storia
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
