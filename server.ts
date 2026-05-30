import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON scanning
app.use(express.json());

// Enable CORS for external hosting such as Netlify
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Persistent submissions database config
const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions.json");

function getSubmissions(): any[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Errore nella lettura dei compiti salvati:", err);
    return [];
  }
}

function saveSubmissions(submissions: any[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (err) {
    console.error("Errore nella scrittura dei compiti:", err);
  }
}

// Lazy-initialization function for Google Gen AI client
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables. Please set it up in the Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// REST API Endpoints

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Scrittura Chiarissima API is working perfectly." });
});

// 1b. Get all student submissions
app.get("/api/stories", (req, res) => {
  res.json(getSubmissions());
});

// 1c. Submit a new story from a student
app.post("/api/stories", (req, res): any => {
  const { studentName, genre, level, targetLength, incipit, studentText, wordCount, vocabularyUsed, glossary } = req.body;
  if (!studentName || !studentText) {
    return res.status(400).json({ error: "Sia il nome che la storia dell'alunno sono obbligatori per inviare il compito." });
  }

  const submissions = getSubmissions();
  const newSubmission = {
    id: "sub_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now(),
    studentName: studentName.trim(),
    genre,
    level,
    targetLength,
    incipit,
    studentText,
    wordCount: Number(wordCount) || 0,
    vocabularyUsed: Array.isArray(vocabularyUsed) ? vocabularyUsed : [],
    glossary: Array.isArray(glossary) ? glossary : [],
    status: "pending",
    createdAt: new Date().toLocaleString("it-IT"),
  };

  submissions.push(newSubmission);
  saveSubmissions(submissions);
  res.status(201).json(newSubmission);
});

// 1d. Submit/update a teacher evaluation for a story
app.put("/api/stories/:id/evaluate", (req, res): any => {
  const { id } = req.params;
  const { teacherName, gradeGrammar, gradeVocabulary, gradeContent, feedback } = req.body;

  const submissions = getSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Compito non trovato nel registro docente." });
  }

  submissions[index].evaluation = {
    teacherName: (teacherName || "Professore").trim(),
    gradeGrammar: Number(gradeGrammar) || 5,
    gradeVocabulary: Number(gradeVocabulary) || 5,
    gradeContent: Number(gradeContent) || 5,
    feedback: (feedback || "Ottimo lavoro! Continua così.").trim(),
    createdAt: new Date().toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  };
  submissions[index].status = "evaluated";
  
  saveSubmissions(submissions);
  res.json(submissions[index]);
});

// 1e. Delete a story submission (for cleanups)
app.delete("/api/stories/:id", (req, res): any => {
  const { id } = req.params;
  let submissions = getSubmissions();
  const originalLength = submissions.length;
  submissions = submissions.filter(s => s.id !== id);
  
  if (submissions.length === originalLength) {
    return res.status(404).json({ error: "Compito non rintracciato." });
  }

  saveSubmissions(submissions);
  res.json({ message: "Compito cancellato correttamente." });
});

// 2. IA Tutoring endpoint
app.post("/api/tutor/analyze", async (req, res): Promise<any> => {
  try {
    const { 
      genre, 
      level, 
      targetLength, 
      incipit, 
      studentText, 
      history = [] 
    } = req.body;

    if (!studentText || studentText.trim().length < 5) {
      return res.status(400).json({ 
        error: "Il testo scritto dall'alunno è troppo breve per essere esaminato dal tutor." 
      });
    }

    const ai = getGenAI();

    // Prepare conversation context or historical edits
    const historyPrompt = history.length > 0 
      ? `Storia passata dei ciclo di revisione antecedenti:\n${JSON.stringify(history)}\n\n`
      : "";

    const prompt = `
Sei un esperto professore e tutor nativo di lingua italiana per stranieri. Il tuo obiettivo è analizzare, correggere e guidare la produzione scritta di un alunno di italiano.

DATI DEL COMPITO:
- Ggnero scelto: ${genre}
- Livello CEFR richiesto: ${level} (Calibra attentamente il livello di complessità grammaticale, di vocabolario e di stile per questo livello!)
- Lunghezza target: da 3 a 6 paragrafi (Lunghezza scelta dall'alunno: ${targetLength} paragrafi).
- Incipit originale (fornito dal sistema): "${incipit}"
- Testo scritto finora dall'alunno (continuazione dell'incipit):
"${studentText}"

${historyPrompt}

ESUGUI ESTREMAMENTE BENE I SEGUENTI TRE COMPITI PRINCIPALI:

1. CORREZIONI GRAMMATICALI (Grammatica, Ortografia, Morfologia, Sintassi, Accenti, Apostrofi):
   Rileva QUALSIASI imperfezione linguistica nel testo scritto dall'alunno. 
   Per ogni errore identificato, indica la stringa di testo originale errata, la forma corretta proposta, la categoria dell'errore (ad es. Preposizioni, Verbi, Accordo di genere/numero, Ortografia) e una spiegazione amichevole e breve (calibrata: se il livello è A1/A2 scrivi la spiegazione in portoghese per far capire meglio l'alunno; se B1/B2/C1, scrivi in un italiano chiaro e proporzionato).
   Se non ci sono errori grammaticali nel testo scritto dall'alunno, la lista deve essere semplicemente vuota.

2. STILE E SCELTE LESSICALI (Stile, Ricchezza del vocabolario, Collocazioni):
   Sostieni lo studente offrendo da 2 a 4 suggerimenti su come rendere le frasi più naturali, fluide o eleganti in italiano (per esempio usando parole più ricche o modi di dire adatti al genere letterario scelto).
   Fornisci la frase originale dell'alunno, la frase migliorata proposta, e il beneficio di questo cambiamento (in portoghese per A1-A2, in italiano per B1-C1).

3. PROPOSTA DI CONTINUAZIONE (Due svolte di trama interessanti):
   Analizza cosa sta accadendo nel testo dell'alunno. Proponi due possibili svolte narrative distinte per continuare la storia, ciascuna con un titolo espressivo in italiano, una breve descrizione (circa 2 frasi in italiano comprensibile per il livello selezionato) e due domande-guida (trigger questions) per motivarlo a scrivere il paragrafo successivo.

4. FEEDBACK GENERALE (Un incoraggiamento finale caloroso):
   Scrivi un paragrafo di 3-4 frasi incoraggianti in italiano. Commenta se sta usando bene i termini tematici o se sta seguendo una trama appassionante.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Sei l'amichevole e rigoroso Tutor linguistico di italiano dell'app 'Scrittura Chiarissima'. Correggi con precisione ma offri incoraggiamento costante. Restituisci sempre risposte conformi allo schema JSON richiesto.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corrections: {
              type: Type.ARRAY,
              description: "Elenco di correzioni formali per errori ortografici, sintattici o morfologici.",
              items: {
                type: Type.OBJECT,
                properties: {
                  originalPhrase: { type: Type.STRING, description: "La parola o frase errata originale dell'alunno." },
                  correctedPhrase: { type: Type.STRING, description: "La parola o frase corretta proposta dal tutor." },
                  errorType: { type: Type.STRING, description: "La categoria dell'errore (Ortografia, Accordo, Tempo verbale, Preposizione, ecc.)" },
                  explanation: { type: Type.STRING, description: "Spiegazione chiara sul perché sia un errore e come evitarlo (in portoghese per A1-A2, altrimenti in italiano)." }
                },
                required: ["originalPhrase", "correctedPhrase", "errorType", "explanation"]
              }
            },
            styleAndLexicon: {
              type: Type.ARRAY,
              description: "Ottimizzazioni opzionali per accrescere la maturità di stile e l'italianità del testo.",
              items: {
                type: Type.OBJECT,
                properties: {
                  originalText: { type: Type.STRING, description: "La frase o porzione scritta originariamente." },
                  suggestedAlternative: { type: Type.STRING, description: "L'alternativa idiomatica o più ricca raccomandata." },
                  benefit: { type: Type.STRING, description: "La spiegazione del perché suoni meglio (in portoghese per A1-A2, altrimenti in italiano)." }
                },
                required: ["originalText", "suggestedAlternative", "benefit"]
              }
            },
            plotContinuations: {
              type: Type.ARRAY,
              description: "Esattamente due percorsi narrativi alternativi e ispiratori per continuare la scrittura.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Un titolo evocativo per la diramazione di trama (es. 'L'incontro misterioso')." },
                  suggestion: { type: Type.STRING, description: "Presentazione del percorso in italiano adatto al livello dell'alunno." },
                  triggerQuestions: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Due domande per stuzzicare la riflessione e facilitare la scrittura." 
                  }
                },
                required: ["title", "suggestion", "triggerQuestions"]
              }
            },
            generalFeedback: {
              type: Type.STRING,
              description: "Frasi calde e stimolanti in lingua italiana calibrate sul livello dell'alunno."
            }
          },
          required: ["corrections", "styleAndLexicon", "plotContinuations", "generalFeedback"]
        }
      }
    });

    const resultText = response.text;
    res.json(JSON.parse(resultText || "{}"));
  } catch (error: any) {
    console.error("Errore nell'analisi del Tutor:", error);
    res.status(500).json({ error: error.message || "Qualcosa è andato storto sulla connessione con il Tutor IA." });
  }
});

// 3. Dynamic Glossary generator
app.post("/api/tutor/glossary", async (req, res): Promise<any> => {
  try {
    const { studentText, incipit, level, genre } = req.body;
    if (!studentText) {
      return res.status(400).json({ error: "Nessun testo fornito per estrarre il glossario." });
    }

    const ai = getGenAI();

    const prompt = `
Genera un glossario personalizzato di parole complesse, espressioni idiomatiche o locuzioni interessanti d'italiano presenti o altamente compatibili con il testo sottostante.
Fornisci parole che uno studente di livello '${level}' che scrive una storia di genere '${genre}' beneficerebbe moltissimo da conoscere a fondo. Offri esattamente tra 5 e 8 voci.

STORIA:
"${incipit} ${studentText}"

SCHEMA RICHIESTO PER CIASCUNA VOCE DEL GLOSSARIO:
1. Termine (italiano)
2. Classe grammaticale (es. "Sostantivo maschile", "Verbo", "Locuzione avverbiale")
3. Definizione concisa e semplice in lingua italiana
4. Traduzione precisa ed elegante in lingua portoghese
5. Un esempio pratico di frase in italiano per mostrare l'uso contestualizzato
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Sei un dizionario intelligente interattivo. Restituisci tabelle lessicali o glossari in formato JSON strutturato.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            glossary: {
              type: Type.ARRAY,
              description: "Insieme organizzato di approfondimenti lessicali.",
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING, description: "La parola o espressione peculiare in italiano." },
                  partOfSpeech: { type: Type.STRING, description: "Classe grammaticale in italiano (es: Verbo, Sostantivo)." },
                  definition: { type: Type.STRING, description: "Definizione chiara in italiano." },
                  translation: { type: Type.STRING, description: "Tradução em português correspondente." },
                  example: { type: Type.STRING, description: "Frase d'esempio originale e costruttiva in italiano." }
                },
                required: ["term", "partOfSpeech", "definition", "translation", "example"]
              }
            }
          },
          required: ["glossary"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Errore nella generazione del glossario:", error);
    res.status(500).json({ error: error.message || "Errore di elaborazione del glossario da parte dell'IA." });
  }
});

// 4. Dynamic custom incipit & vocabulary generator
app.post("/api/tutor/custom-starter", async (req, res): Promise<any> => {
  try {
    const { topic, level, genre } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Per favore, inserisci un argomento o tema per l'incipit personalizzato." });
    }

    const ai = getGenAI();

    const prompt = `
Abbiamo bisogno di cominciare una storia in italiano per un alunno straniero.
- Genere letterario richiesto: ${genre || "Avventura"}
- Livello CEFR richiesto: ${level || "A2"}
- Tema/Argomento specifico inserito dall'alunno o insegnante: "${topic}"

COMPITI:
1. INCIPIT: Crea un incipit favoloso, coinvolgente, letterario di esattamente 3 o 4 frasi corrette in italiano. Deve essere rigorosamente proporzionato al livello CEFR scelto (strutture grammaticali adatte, tempi verbali congrui).
2. VOCABOLARIO: Estrai ed elenca ESATTAMENTE 12 parole-chiave tematiche tratte da questo incipit o strettamente connesse al tema indicato. Per ognuna, indica la parola in italiano e la sua traduzione esatta e comune in lingua portoghese.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Sei un generatore creativo di storie e sussidi didattici per lo studio dell'italiano L2. Generi solo risposte formattate secondo lo schema JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            incipit: { type: Type.STRING, description: "L'inizio letterario della storia adatto al livello." },
            vocabulary: {
              type: Type.ARRAY,
              description: "Un elenco tematico di esattamente 12 voci per l'esercitazione pratica.",
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING, description: "La parola dell'esercizio in italiano." },
                  translation: { type: Type.STRING, description: "Traduzione corrispondente in portoghese." }
                },
                required: ["word", "translation"]
              }
            }
          },
          required: ["incipit", "vocabulary"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Errore nella generazione dell'Incipit su misura:", error);
    res.status(500).json({ error: error.message || "Errore dell'IA nella generazione dell'inizio personalizzato." });
  }
});


// Express server starter and Vite middleware integration
async function boot() {
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist"));

  // Vite integration for asset serving & dev system
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Scrittura Chiarissima Server] running sequentially on port ${PORT}`);
  });
}

boot().catch((err) => {
  console.error("Failed to start server:", err);
});
