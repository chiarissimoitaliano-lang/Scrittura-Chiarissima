import React, { useState } from "react";
import { TutorResponse, Correction, StyleSuggestion, PlotContinuation } from "../types";
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Compass, 
  Lightbulb, 
  MessageSquare, 
  Copy, 
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";

interface TutorPanelProps {
  feedback: TutorResponse | null;
  isLoading: boolean;
  onApplyPlotSuggestion: (suggestionText: string) => void;
  level: string;
}

export default function TutorPanel({ 
  feedback, 
  isLoading, 
  onApplyPlotSuggestion,
  level 
}: TutorPanelProps) {
  const [activeTab, setActiveTab] = useState<"corrections" | "style" | "plot">("corrections");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <Sparkles className="w-6 h-6 text-emerald-600 absolute animate-pulse" />
        </div>
        <h3 className="font-semibold text-neutral-800 text-base mt-6 animate-pulse">
          Il tuo Tutor sta correggendo...
        </h3>
        <p className="text-neutral-500 text-xs text-center max-w-sm mt-2 leading-relaxed">
          Sto analizzando attentamente la morfologia, la grammatica e lo stile del tuo testo in base al livello <span className="font-bold text-emerald-600">{level}</span>.
        </p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
        <div className="p-3 bg-neutral-100 rounded-full text-neutral-400 mb-3">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-neutral-700 text-sm">Pronto a correggere!</h3>
        <p className="text-neutral-500 text-xs max-w-xs mt-1 leading-relaxed">
          Scrivi la continuazione della tua storia ed inviala al Tutor premendo il pulsante <strong>&quot;Chiedi aiuto al tutor&quot;</strong> per correzioni immediate.
        </p>
      </div>
    );
  }

  const correctionsCount = feedback.corrections?.length || 0;
  const styleCount = feedback.styleAndLexicon?.length || 0;
  const plotCount = feedback.plotContinuations?.length || 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-full" id="tutor-analysis-panel">
      {/* Header Feedback */}
      <div className="p-5 border-b border-neutral-100 bg-emerald-50/40">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 px-2.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
            TUTOR IA {level}
          </div>
          <span className="text-neutral-400 text-xs">|</span>
          <span className="text-xs text-neutral-600 flex items-center gap-1 font-semibold">
            {correctionsCount === 0 ? "🎉 Nessun errore critico!" : `⚠️ ${correctionsCount} correzioni trovate`}
          </span>
        </div>
        <div className="text-neutral-700 text-xs italic leading-relaxed font-sans bg-white p-3 rounded-lg border border-neutral-200/50">
          🔑 &quot;{feedback.generalFeedback}&quot;
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-neutral-200 text-xs font-bold text-neutral-600 bg-neutral-50/60 sticky top-0 z-10">
        <button
          onClick={() => setActiveTab("corrections")}
          className={`py-3 px-1 border-b-2 text-center flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "corrections" 
              ? "border-emerald-600 text-emerald-700 bg-white" 
              : "border-transparent hover:text-neutral-900"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Correzioni ({correctionsCount})
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`py-3 px-1 border-b-2 text-center flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "style" 
              ? "border-emerald-600 text-emerald-700 bg-white" 
              : "border-transparent hover:text-neutral-900"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Stile &amp; Lessico ({styleCount})
        </button>
        <button
          onClick={() => setActiveTab("plot")}
          className={`py-3 px-1 border-b-2 text-center flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "plot" 
              ? "border-emerald-600 text-emerald-700 bg-white" 
              : "border-transparent hover:text-neutral-900"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Trama IA ({plotCount})
        </button>
      </div>

      {/* Accordion Views */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[500px]">
        {/* TAB 1: CORRECTIONS */}
        {activeTab === "corrections" && (
          <div className="space-y-3">
            {correctionsCount === 0 ? (
              <div className="text-center p-8 bg-emerald-50/30 rounded-xl border border-dashed border-emerald-500/10 text-neutral-600">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Perfetto! Grammatica eccellente</h4>
                <p className="text-xs text-neutral-500 mt-1">Il tutor non ha rilevato errori ortografici, morfologici o sintattici in questo paragrafo.</p>
              </div>
            ) : (
              feedback.corrections.map((corr, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-red-100 bg-red-50/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded-sm">
                      {corr.errorType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg p-2 bg-red-50 border border-red-100 text-red-900 line-through">
                      <span className="text-[10px] font-bold text-red-500 block uppercase font-sans">Sbagliato:</span>
                      {corr.originalPhrase}
                    </div>
                    <div className="rounded-lg p-2 bg-emerald-50 border border-emerald-100 text-emerald-900 font-medium">
                      <span className="text-[10px] font-bold text-emerald-600 block uppercase font-sans">Corretto:</span>
                      {corr.correctedPhrase}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed pl-1">
                    💡 <span className="font-medium text-neutral-700">{corr.explanation}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: STYLE SUGGESTIONS */}
        {activeTab === "style" && (
          <div className="space-y-4">
            {styleCount === 0 ? (
              <div className="text-center p-8 bg-indigo-50/30 rounded-xl border border-dashed border-indigo-500/10 text-neutral-600">
                <Lightbulb className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Nessuna modifica di stile proposta</h4>
                <p className="text-xs text-neutral-500 mt-1">La fluidità linguistica è eccellente e adatta al tuo livello corrente.</p>
              </div>
            ) : (
              feedback.styleAndLexicon.map((style, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/10 space-y-2">
                  <div className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                    Miglioramento consigliato
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-neutral-500 bg-neutral-50 p-2 rounded border border-neutral-200/50">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">Testo originale:</span>
                      &quot;{style.originalText}&quot;
                    </div>
                    <div className="bg-indigo-50/50 p-2 rounded border border-indigo-100 text-indigo-950 font-medium font-serif italic text-sm">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 block font-sans">Alternativa fluida:</span>
                      &quot;{style.suggestedAlternative}&quot;
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 pl-1 leading-relaxed">
                    ✨ <strong>Perché è meglio:</strong> {style.benefit}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PLOT SUGGESTIONS */}
        {activeTab === "plot" && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-500 italic pl-1 mb-2">
              Direzioni stimolanti consigliate dal Tutor per far avanzare la tua trama. Selezionane una per aggiungerla ai tuoi pensieri!
            </p>
            {feedback.plotContinuations?.map((plot, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">
                      {plot.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed italic bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                  &quot;{plot.suggestion}&quot;
                </p>

                {/* Trigger Questions */}
                <div className="space-y-1 pl-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Domande guida:</span>
                  {plot.triggerQuestions?.map((q, qidx) => (
                    <div key={qidx} className="text-neutral-600 text-xs flex items-start gap-1">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => copyToClipboard(plot.suggestion, idx)}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-all flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedIndex === idx ? "Copiato!" : "Copia idea"}
                  </button>
                  <button
                    onClick={() => onApplyPlotSuggestion(plot.suggestion)}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 hover:shadow-xs text-white cursor-pointer transition-all flex items-center gap-1"
                  >
                    Usa questa svolta
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom status alert */}
      <div className="bg-neutral-50 p-3 px-4 border-t border-neutral-200 text-center text-[10px] text-neutral-500 flex items-center justify-center gap-1 font-mono">
        <Award className="w-3.5 h-3.5 text-amber-500" />
        PRODUZIONE SCRITTA SCRITTURA CHIARISSIMA
      </div>
    </div>
  );
}
