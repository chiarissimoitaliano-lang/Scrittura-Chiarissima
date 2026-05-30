export interface VocabularyTerm {
  word: string;
  translation: string;
}

export interface StarterData {
  incipit: string;
  vocabulary: VocabularyTerm[];
}

// Map of [genre][level] -> StarterData
export const starters: Record<string, Record<string, StarterData>> = {
  Avventura: {
    A1: {
      incipit: "Oggi il sole splende nel cielo. Marco prende il suo zaino verde. Nello zaino mette una mela, una bottiglia d'acqua e una vecchia mappa della foresta dei segreti. Dice alla sua amica Giulia: 'Oggi andiamo a cercare la pietra d'oro!' Giulia sorride e dice che è pronta per questo cammino.",
      vocabulary: [
        { word: "zaino", translation: "mochila" },
        { word: "mappa", translation: "mapa" },
        { word: "foresta", translation: "floresta" },
        { word: "cercare", translation: "procurare" },
        { word: "pietra", translation: "pedra" },
        { word: "cammino", translation: "caminho" },
        { word: "amico", translation: "amigo" },
        { word: "sole", translation: "sol" },
        { word: "verde", translation: "verde" },
        { word: "pronto", translation: "pronto" },
        { word: "segreto", translation: "segredo" },
        { word: "prendere", translation: "pegar / levar" }
      ]
    },
    A2: {
      incipit: "Mentre camminavano lungo il vecchio sentiero di montagna, Marco e Giulia hanno sentito un rumore strano dietro gli alberi. Sembrava il verso di un animale misterioso, oppure qualcuno che cercava di nascondersi. Il forte vento muoveva i rami e la mappa che stringevano tra le mani stava quasi per volare via.",
      vocabulary: [
        { word: "sentiero", translation: "trilha / caminho" },
        { word: "montagna", translation: "montanha" },
        { word: "rumore", translation: "barulho" },
        { word: "alberi", translation: "árvores" },
        { word: "nascondersi", translation: "esconder-se" },
        { word: "vento", translation: "vento" },
        { word: "rami", translation: "galhos" },
        { word: "volare via", translation: "voar para longe" },
        { word: "viaggio", translation: "viagem" },
        { word: "esplorare", translation: "explorar" },
        { word: "pericolo", translation: "perigo" },
        { word: "scoprire", translation: "descobrir / avistar" }
      ]
    },
    B1: {
      incipit: "La spedizione procedeva a fatica attraverso la fitta giungla tropicale. Secondo le indicazioni scritte sul diario del vecchio archeologo, l'ingresso della tomba perduta si trovava proprio dietro la grande cascata. L'umidità era soffocante e il gruppo cominciava a temere che le scorte d'acqua non sarebbero bastate per il viaggio di ritorno.",
      vocabulary: [
        { word: "spedizione", translation: "expedição" },
        { word: "giungla", translation: "selva / selva tropical" },
        { word: "archeologo", translation: "arqueólogo" },
        { word: "cascata", translation: "cachoeira" },
        { word: "soffocante", translation: "sufocante" },
        { word: "scorte", translation: "estoques / provisões" },
        { word: "ostacolo", translation: "obstáculo" },
        { word: "bussola", translation: "bússola" },
        { word: "avventurarsi", translation: "aventurar-se" },
        { word: "tesoro", translation: "tesouro" },
        { word: "indizio", translation: "pista / indício" },
        { word: "coraggio", translation: "coragem" }
      ]
    },
    B2: {
      incipit: "Incuranti delle avvertenze meteo che sconsigliavano vivamente di addentrarsi nel canyon, gli esploratori decisero di calarsi lungo la parete rocciosa prima che calasse il buio. Fu proprio allora che un'improvvisa frana ostruì l'unico varco d'uscita praticabile, lasciandoli intrappolati in un labirinto di pietra dalle pareti altissime.",
      vocabulary: [
        { word: "addentrarsi", translation: "adentrar-se" },
        { word: "parete rocciosa", translation: "parede rochosa" },
        { word: "frana", translation: "deslizamento / desmoronamento" },
        { word: "ostruire", translation: "obstruir" },
        { word: "varco", translation: "passagem / fenda" },
        { word: "intrappolato", translation: "encurralado / encurralada" },
        { word: "precipizio", translation: "precipício" },
        { word: "incolume", translation: "ileso" },
        { word: "attrezzatura", translation: "equipamento" },
        { word: "sfida", translation: "desafio" },
        { word: "audace", translation: "audaz / ousado" },
        { word: "sopravvivere", translation: "sobreviver" }
      ]
    },
    C1: {
      incipit: "La traversata della tormentosa cresta montuosa si stava rivelando un'impresa ai limiti della resistenza umana. Con le temperature precipitate sotto lo zero e una visibilità ridotta a pochi palmi per via della tormenta di neve, la fune di sicurezza che legava la cordata rappresentava l'unico ed esile diaframma tra la vita e il baratro sottostante.",
      vocabulary: [
        { word: "tormentosa", translation: "tempestuosa / atormentada" },
        { word: "cordata", translation: "cordada (grupo amarrado por cordas)" },
        { word: "esile diaframma", translation: "fina barreira" },
        { word: "baratro", translation: "abismo" },
        { word: "tormenta", translation: "nevasca / tempestade de neve" },
        { word: "scalata", translation: "escalada" },
        { word: "impervio", translation: "íngreme / inacessível" },
        { word: "avversità", translation: "adversidades" },
        { word: "stremati", translation: "exaustos" },
        { word: "intuito", translation: "intuição" },
        { word: "peripezia", translation: "peripécia / reviravolta" },
        { word: "audacia", translation: "audácia" }
      ]
    }
  },
  Mistero: {
    A1: {
      incipit: "La vecchia casa nera in fondo alla via è sempre chiusa. Nessuno vive lì da molti anni. Stasera, però, c'è una misteriosa luce accesa al primo piano. Luca e la sua amica Anna guardano la finestra dal giardino. All'improvviso, sentono un rumore metallico: la porta principale si apre lentamente.",
      vocabulary: [
        { word: "casa", translation: "casa" },
        { word: "luce", translation: "luz" },
        { word: "finestra", translation: "janela" },
        { word: "porta", translation: "porta" },
        { word: "aprire", translation: "abrir" },
        { word: "nessuno", translation: "ninguém" },
        { word: "giardino", translation: "jardim" },
        { word: "stasera", translation: "esta noite" },
        { word: "strano", translation: "estranho" },
        { word: "paura", translation: "medo" },
        { word: "guardare", translation: "olhar" },
        { word: "chiave", translation: "chave" }
      ]
    },
    A2: {
      incipit: "Il commissario Martini ha ricevuto una lettera anonima alle sei del mattino. All'interno della busta c'era solo un disegno di un orologio antico e un indirizzo scritto in rosso: Via della Biblioteca, numero 13. Quando è arrivato lì, ha scoperto che la porta dell'antica libreria era aperta e sul pavimento c'erano strane impronte di scarpe.",
      vocabulary: [
        { word: "lettera anonima", translation: "carta anônima" },
        { word: "busta", translation: "envelope" },
        { word: "orologio antica", translation: "relógio antigo" },
        { word: "indirizzo", translation: "endereço" },
        { word: "pavimento", translation: "chão / piso" },
        { word: "impronte", translation: "pegadas" },
        { word: "indagare", translation: "investigar" },
        { word: "scomparso", translation: "desaparecido" },
        { word: "sospetto", translation: "suspeito" },
        { word: "scuro", translation: "escuro" },
        { word: "silenzio", translation: "silêncio" },
        { word: "scoprire", translation: "descobrir" }
      ]
    },
    B1: {
      incipit: "La pioggia batteva forte contro i vetri dello studio della contessa. Sul tavolo di mogano giacevano sparsi i documenti relativi al testamento di famiglia, ma il documento principale, che indicava l'erede dell'immenso patrimonio, era inspiegabilmente svanito nel nulla. La cassaforte era intatta e solo tre persone in casa conoscevano la combinazione segreta.",
      vocabulary: [
        { word: "vetri", translation: "vidros / janelas" },
        { word: "testamento", translation: "testamento" },
        { word: "indizio", translation: "pista / indício" },
        { word: "svanito", translation: "desaparecido / evaporado" },
        { word: "cassaforte", translation: "cofre" },
        { word: "intatta", translation: "intacta" },
        { word: "colpevole", translation: "culpado" },
        { word: "alibi", translation: "álibi" },
        { word: "interrogare", translation: "interrogar" },
        { word: "misterioso", translation: "misterioso" },
        { word: "segreto", translation: "segredo" },
        { word: "realtà", translation: "realidade" }
      ]
    },
    B2: {
      incipit: "L'ispettore si tormentava da ore davanti alla lavagna degli indizi nel quartier generale indaffarato. Più analizzava le registrazioni delle telecamere di sicurezza della banca, più si convinceva che la rapina fosse un diversivo per coprire qualcosa di assai più sinistro. La chiave di tutto risiedeva nell'orario esatto del blackout elettrico, insolitamente precoce rispetto al colpo.",
      vocabulary: [
        { word: "quartier generale", translation: "quartel-general" },
        { word: "rapina", translation: "roubo / assalto" },
        { word: "diversivo", translation: "diversionismo / distração" },
        { word: "sinistro", translation: "sinistro" },
        { word: "blackout", translation: "apagão" },
        { word: "enigma", translation: "enigma" },
        { word: "testimone", translation: "testemunha" },
        { word: "prove", translation: "provas / indícios" },
        { word: "inganno", translation: "engano / trapaça" },
        { word: "intercettare", translation: "interceptar" },
        { word: "sospettare", translation: "suspeitar" },
        { word: "enigmatico", translation: "enigmático" }
      ]
    },
    C1: {
      incipit: "Le indagini sul clamoroso furto del trittico rinascimentale si erano impantanate in un ginepraio di false piste sfacciatamente ordite dal mandante. La precisione millimetrica della rimozione della tela e l'assenza totale di tracce biologiche deponevano a favore di un basista interno all'archivio storico, qualcuno dotatato di insospettabile acume scientifico ed eccellente reputazione amministrativa.",
      vocabulary: [
        { word: "ginepraio", translation: "emaranhado / confusão" },
        { word: "tela", translation: "tela (de pintura)" },
        { word: "basista interno", translation: "cúmplice interno" },
        { word: "insospettabile acume", translation: "astúcia insuspeitável" },
        { word: "furto", translation: "furto / roubo" },
        { word: "falsificare", translation: "falsificar" },
        { word: "complotto", translation: "complô" },
        { word: "collocazione", translation: "localização / posicionamento" },
        { word: "discrepanza", translation: "divergência" },
        { word: "enigma insolubile", translation: "enigma insolúvel" },
        { word: "svelare", translation: "revelar / desvendar" },
        { word: "scrupoloso", translation: "meticuloso / escrupuloso" }
      ]
    }
  },
  Romantico: {
    A1: {
      incipit: "È una bellissima giornata di primavera a Firenze. Sofia cammina sul Ponte Vecchio e mangia un gelato alla fragola. All'improvviso, un ragazzo corre veloce e cade vicino a lei. Tutti i libri del ragazzo cadono per terra. Sofia lo aiuta a prenderli. Quando i loro occhi si incontrano, il ragazzo sorride dolcemente.",
      vocabulary: [
        { word: "primavera", translation: "primavera" },
        { word: "gelato", translation: "sorvete" },
        { word: "ragazzo", translation: "rapaz / namorado" },
        { word: "cadere", translation: "cair" },
        { word: "occhi", translation: "olhos" },
        { word: "sorridere", translation: "sorrir" },
        { word: "amore", translation: "amor" },
        { word: "cuore", translation: "coração" },
        { word: "bello", translation: "belo / lindo" },
        { word: "incontrare", translation: "encontrar" },
        { word: "aiutare", translation: "ajudar" },
        { word: "dolce", translation: "doce" }
      ]
    },
    A2: {
      incipit: "Da molti mesi, Giulia prende lo stesso treno regionale ogni mercoledì mattina alle otto. Al binario c'è sempre un giovane uomo con un cappotto blù che legge poesie. Lei non ha mai avuto il coraggio di parlargli, ma oggi fa freddo ed entrambi dimenticano l'ombrello sotto la pioggia sottile.",
      vocabulary: [
        { word: "treno", translation: "trem" },
        { word: "binario", translation: "plataforma (de trem)" },
        { word: "cappotto", translation: "casaco" },
        { word: "coraggio", translation: "coragem" },
        { word: "parlare", translation: "falar" },
        { word: "ombrello", translation: "guarda-chuva" },
        { word: "pioggia", translation: "chuva" },
        { word: "sguardo", translation: "olhar / vislumbre" },
        { word: "timido", translation: "tímido" },
        { word: "emozione", translation: "emoção" },
        { word: "destino", translation: "destino" },
        { word: "sperare", translation: "esperar (ter esperança)" }
      ]
    },
    B1: {
      incipit: "Seduta al tavolino del caffè all'aperto, Beatrice stringeva tra le mani la tazza di tè ormai fredda. Aveva ritrovato per caso, dentro un vecchio dizionario di francese comprato in un mercatino dell'usato, una lettera d'amore datata vent'anni prima, firmata semplicemente con un'iniziale: 'A'. Proprio in quel momento, un forestiero si sedette al tavolo accanto.",
      vocabulary: [
        { word: "mercatino dell'usato", translation: "mercado de pulgas / sebo" },
        { word: "tazza", translation: "xícara" },
        { word: "forestiero", translation: "estrangeiro / forasteiro" },
        { word: "ritrovare", translation: "reencontrar" },
        { word: "nostalgia", translation: "nostalgia" },
        { word: "coincidenza", translation: "coincidência" },
        { word: "sentimentale", translation: "sentimental" },
        { word: "rivelare", translation: "revelar" },
        { word: "gelosia", translation: "ciúme" },
        { word: "ricordo", translation: "lembrança" },
        { word: "innamorarsi", translation: "apaixonar-se" },
        { word: "confessare", translation: "confessar" }
      ]
    },
    B2: {
      incipit: "La mostra fotografica era gremita di persone, ma per Alessandro tutto quel brusio di sottofondo era svanito non appena si era imbattuto nello scatto intitolato 'Sguardi di Vetro'. Riconobbe immediatamente i lineamenti inconfondibili di Elena, la ragazza che aveva dovuto salutare frettolosamente una sera d'estate in stazione, senza mai poterle chiedere il numero di telefono.",
      vocabulary: [
        { word: "gremita", translation: "lotada / apinhada" },
        { word: "brusio", translation: "burburinho" },
        { word: "imbattersi", translation: "deparar-se / esbarrar" },
        { word: "scatto", translation: "foto / clique plástico" },
        { word: "lineamenti", translation: "traços faciais" },
        { word: "frettolosamente", translation: "rapidamente / às pressas" },
        { word: "addio", translation: "adeus" },
        { word: "rimpianto", translation: "arrependimento" },
        { word: "struggente", translation: "pungente / doloroso" },
        { word: "legame", translation: "vínculo / laço" },
        { word: "palpitare", translation: "palpitar" },
        { word: "commozione", translation: "commoção" }
      ]
    },
    C1: {
      incipit: "Sullo sfondo crepuscolare delle colline toscane, l'incontro casuale tra Clara e l'ombroso pittore pareva orchestrato da una bizzarra ironia della sorte. Entrambi reduci da fallimenti sentimentali che ne avevano inaridito l'ispirazione artistica, si ritrovarono a condividere una tregua silenziosa, densa di sottintesi che nessun dizionario umano avrebbe saputo codificare a parole.",
      vocabulary: [
        { word: "crepuscolare", translation: "crepuscular" },
        { word: "ombroso", translation: "esquivo / melancólico" },
        { word: "reduci", translation: "sobreviventes / egressos" },
        { word: "inaridito", translation: "secado / murchado" },
        { word: "sottintesi", translation: "subentendidos / entrelinhas" },
        { word: "affinità", translation: "afinidade" },
        { word: "coinvolgimento", translation: "envolvimento" },
        { word: "malinconia", translation: "melancolia" },
        { word: "disincanto", translation: "desencanto" },
        { word: "complicità", translation: "cumplicidade" },
        { word: "estasi", translation: "êxtase" },
        { word: "anelito", translation: "anseio / aspiração" }
      ]
    }
  },
  Fantasy: {
    A1: {
      incipit: "Nel regno di Solaria vive un piccolo drago rosso di nome Ignis. Ignis non sa fare il fuoco, ma sa fare bellissimi fiori di ghiaccio. Tutti gli altri draghi ridono di lui. Un giorno, il re dei draghi perde la sua corona magica nella grotta oscura e fredda. Ignis decide di andare ad aiutare il re.",
      vocabulary: [
        { word: "regno", translation: "reino" },
        { word: "drago", translation: "dragão" },
        { word: "fuoco", translation: "fogo" },
        { word: "ghiaccio", translation: "gelo" },
        { word: "corona", translation: "coroa" },
        { word: "grotta", translation: "caverna" },
        { word: "magia", translation: "magia" },
        { word: "oscura", translation: "escura / sombria" },
        { word: "volare", translation: "voar" },
        { word: "montagna", translation: "montanha" },
        { word: "castello", translation: "castelo" },
        { word: "aiuto", translation: "ajuda" }
      ]
    },
    A2: {
      incipit: "Elia era un apprendista stregone che lavorava nella biblioteca del castello reale. Il suo maestro gli aveva proibito di toccare i libri coperti di polvere dorata. Ma ieri sera, mentre il maestro dormiva, Elia ha trovato una chiave d'argento antica e ha aperto il libro dei desideri. All'improvviso, un piccolo elfo alato è uscito dalle pagine.",
      vocabulary: [
        { word: "apprendista stregone", translation: "aprendiz de bruxo" },
        { word: "maestro", translation: "mestre / professor" },
        { word: "polvere", translation: "poeira" },
        { word: "dorata", translation: "dourada" },
        { word: "elfo alato", translation: "elfo alado" },
        { word: "chiave d'argento", translation: "chave de prata" },
        { word: "incantesimo", translation: "feitiço" },
        { word: "pericolo", translation: "perigo" },
        { word: "fuggire", translation: "fugir" },
        { word: "foresta incantata", translation: "floresta encantada" },
        { word: "scudo", translation: "escudo" },
        { word: "luccicare", translation: "brilhar / reluzir" }
      ]
    },
    B1: {
      incipit: "La lama della spada ancestrale cominciò a vibrare di una tenue luce azzurrina, segnalando la presenza di creature magiche nelle vicinanze. Il bardo guardò preoccupato il guerriero e l'elfo che lo accompagnavano nella fitta nebbia della Valle dei Giganti. Sapevano tutti che, se l'amuleto di smeraldo si fosse spento, avrebbero perso per sempre la strada di casa.",
      vocabulary: [
        { word: "lama della spada", translation: "lâmina da espada" },
        { word: "nebbia", translation: "nevoeiro / neblina" },
        { word: "bardo", translation: "bardo (poeta/músico)" },
        { word: "guerriero", translation: "guerreiro" },
        { word: "amuleto di smeraldo", translation: "amuleto de esmeralda" },
        { word: "prodigio", translation: "prodígio / milagre" },
        { word: "creatura", translation: "criatura" },
        { word: "alleanza", translation: "aliança" },
        { word: "incastonato", translation: "encastoado / cravado" },
        { word: "incantesimo", translation: "encantamento" },
        { word: "tempesta magica", translation: "tempestade mágica" },
        { word: "maledizione", translation: "maldição" }
      ]
    },
    B2: {
      incipit: "Le antiche rune incise sulla colonna portante del tempio fluttuante risplendevano di energia arcana ad ogni eclissi di luna. L'archeologa stellare sapeva bene che l'attivazione della reliquia avrebbe potuto risvegliare i Guardiani d'Ombra, creature millenarie relegate negli abissi del cosmo. Ma la sete di conoscenza superava di gran lunga il timore per la fine dei tempi.",
      vocabulary: [
        { word: "rune", translation: "runas" },
        { word: "fluttuante", translation: "flutuante" },
        { word: "energia arcana", translation: "energia arcana" },
        { word: "reliquia", translation: "relíquia" },
        { word: "abissi", translation: "abismos" },
        { word: "profezia", translation: "profecia" },
        { word: "evocare", translation: "invocar / evocar" },
        { word: "mitico", translation: "mítico" },
        { word: "portale", translation: "portal" },
        { word: "discendente", translation: "descendente" },
        { word: "distruzione", translation: "destruição" },
        { word: "incantamento", translation: "encantamento" }
      ]
    },
    C1: {
      incipit: "L'allineamento astrale propiziatore stava per compiersi, proiettando un'ombra sardonica sui bastioni d'alabastro della cittadella dei maghi. Siria, erede dei sussurri dei draghi vetusti, impugnò lo scettro di ossidiana conscia del fatto che ogni formula pronunciata avrebbe saldato un tributo letale alla sua stessa linfa vitale, minacciando di ridurla in cenere prima dell'alba.",
      vocabulary: [
        { word: "allineamento astrale", translation: "alinhamento astral" },
        { word: "draghi vetusti", translation: "dragões ancestrais / velhos" },
        { word: "scettro", translation: "cetro" },
        { word: "linfa vitale", translation: "seiva vital / energia vital" },
        { word: "bastione", translation: "bastião / muralha" },
        { word: "incantesimo primordiale", translation: "feitiço primordial" },
        { word: "evanescente", translation: "evanescente / passageiro" },
        { word: "immortalità", translation: "imortalidade" },
        { word: "soggiogare", translation: "subjugar" },
        { word: "trasmutazione", translation: "transmutação" },
        { word: "talelismano", translation: "talismã" },
        { word: "crepuscolo", translation: "crepúsculo" }
      ]
    }
  },
  Commedia: {
    A1: {
      incipit: "Oggi Giovanni vuole cucinare una perfetta pasta alla carbonara per la sua fidanzata Francesca. Ma Giovanni è un cuoco terribile. Sbaglia e compra lo zucchero invece del sale. Poi mette la maionese negli spaghetti! Quando Francesca entra in cucina, vede fumo nero dappertutto e Giovanni con la faccia piena di farina.",
      vocabulary: [
        { word: "cucinare", translation: "cozinhar" },
        { word: "carbonara", translation: "carbonara (prato típico)" },
        { word: "cuoco", translation: "cozinheiro" },
        { word: "sbagliare", translation: "errar" },
        { word: "zucchero", translation: "açúcar" },
        { word: "farina", translation: "farinha" },
        { word: "fumo", translation: "fumaça" },
        { word: "faccia", translation: "rosto / cara" },
        { word: "ridere", translation: "rir" },
        { word: "disastro", translation: "desastre" },
        { word: "spaghettti", translation: "espaguete" },
        { word: "fidanzata", translation: "namorada / noiva" }
      ]
    },
    A2: {
      incipit: "Il gatto Pippo è grasso, pigro e soprattutto molto intelligente. Il suo padrone, il signore Rossi, ha perso gli occhiali da vista ed è in grande ritardo per un colloquio di lavoro importante. Pippo sa esattamente dove sono gli occhiali (nella ciotola del latte), ma vuole prima una scatola di tonno gustoso.",
      vocabulary: [
        { word: "padrone", translation: "dono" },
        { word: "occhiali da vista", translation: "óculos de grau" },
        { word: "colloquio", translation: "entrevista (de emprego)" },
        { word: "ciotola", translation: "tigela / pote" },
        { word: "scatola", translation: "lata / caixa" },
        { word: "tonno", translation: "atum" },
        { word: "ritardo", translation: "atraso" },
        { word: "buffo", translation: "engraçado / cômico" },
        { word: "miagolare", translation: "miar" },
        { word: "nascondere", translation: "esconder" },
        { word: "disperato", translation: "desesperado" },
        { word: "ridicolo", translation: "ridículo" }
      ]
    },
    B1: {
      incipit: "L'esame di guida di Paolo era iniziato sotto i peggiori auspici. Non soltanto l'esaminatore era il colonnello in pensione più severo della provincia, noto per bocciare chiunque al minimo sussulto, ma un gruppo di oche selvatiche aveva deciso di accamparsi sulla corsia di sorpasso della tangenziale proprio mentre Paolo cercava di fare un parcheggio in retromarcia.",
      vocabulary: [
        { word: "esame di guida", translation: "exame de direção" },
        { word: "bocciare", translation: "reprovar" },
        { word: "oche selvatiche", translation: "gansos selvagens" },
        { word: "retromarcia", translation: "marcha ré" },
        { word: "tangenziale", translation: "via expressa / rodoanel" },
        { word: "equivoco", translation: "mal-entendido / equívoco" },
        { word: "pasticcio", translation: "confusão / enrascada" },
        { word: "imbarazzante", translation: "constrangedor" },
        { word: "patente", translation: "carteira de motorista" },
        { word: "clacson", translation: "buzina" },
        { word: "goffo", translation: "desajeitado / pateta" },
        { word: "colonnello", translation: "coronel" }
      ]
    },
    B2: {
      incipit: "Il matrimonio perfetto pianificato da zia Clara stava degenerando in una pochade teatrale di quart'ordine. Il pasticciere aveva scambiato la torta nuziale a cinque piani con quella di un compleanno infantile a forma di dinosauro gigante sputafuoco. Ad aggravare la situazione, lo sposo si era accorto di aver smarrito le fedi nuziali all'interno della gabbia dei pappagalli dello zoo comunale.",
      vocabulary: [
        { word: "matrimonio", translation: "casamento" },
        { word: "nuptial / nuziale", translation: "nupcial / de casamento" },
        { word: "fedi nuziali", translation: "alianças" },
        { word: "pasticciere", translation: "confeiteiro" },
        { word: "compleanno", translation: "aniversário" },
        { word: "zoo comunale", translation: "zoológico municipal" },
        { word: "grottesco", translation: "grotesco" },
        { word: "figuraccia", translation: "papelão / vexame" },
        { word: "catastrofe comica", translation: "catástrofe cômica" },
        { word: "esilarante", translation: "hilário" },
        { word: "scambio", translation: "troca" },
        { word: "sposo", translation: "noivo" }
      ]
    },
    C1: {
      incipit: "La solenne consegna delle chiavi della città al magnatizio locale si tramutò istantaneamente in una farsa farsesca a causa di un banale errore di etichettatura dei flaconcini di ansiolitico. Il sindaco, solitamente compassato e di specchiata sobrietà, salì sul pulpito improvvisando stralunati canti alpini, convincendo i presenti che si trattasse di una bislacca performance d'avanguardia dadaista.",
      vocabulary: [
        { word: "farsa", translation: "farsa / comédia barata" },
        { word: "sindaco", translation: "prefeito" },
        { word: "stralunati", translation: "alucinados / abobados" },
        { word: "bislacca", translation: "esquisita / excêntrica" },
        { word: "compassato", translation: "comedido / formal" },
        { word: "sobrietà", translation: "sobriedade" },
        { word: "malinteso", translation: "mal-entendido" },
        { word: "esilarante gag", translation: "esquete hilária" },
        { word: "spropositato", translation: "despropositado / absurdo" },
        { word: "risate a crepapelle", translation: "gargalhas de morrer" },
        { word: "balbettare", translation: "gaguejar" },
        { word: "stravolgimento", translation: "distorção / reviravolta completa" }
      ]
    }
  }
};
