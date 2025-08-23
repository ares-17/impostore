// Utility per la codifica/decodifica del codice partita
import { v4 as uuidv4 } from 'uuid';

// Struttura dati della partita
export interface GameConfig {
  v: number;
  id: string;
  name?: string;
  createdAt: string;
  parola: string;
  giocatori: string[];
  impostori: string[];
  sig?: string;
}

// Parole italiane per il fallback
const ITALIAN_WORDS = [
  'pizza', 'spaghetti', 'gelato', 'caffè', 'macchina', 'sole', 'mare', 'montagna',
  'libro', 'musica', 'arte', 'cinema', 'viaggio', 'amico', 'famiglia', 'lavoro',
  'scuola', 'università', 'tecnologia', 'natura', 'animali', 'città', 'campagna',
  'storia', 'geografia', 'matematica', 'scienza', 'medicina', 'economia', 'politica'
];

// Calcola CRC32 per l'integrità del codice
function crc32(str: string): string {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ char) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF).toString(16).padStart(8, '0');
}

// Tabella CRC32 precalcolata
const CRC_TABLE = (() => {
  const table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

// Normalizza i nickname (trim, lowercase, rimuovi duplicati)
function normalizePlayers(players: string[]): string[] {
  return players
    .map(p => p.trim())
    .filter(p => p.length > 0 && p.length <= 24)
    .map(p => p.toLowerCase())
    .filter((p, i, arr) => arr.indexOf(p) === i); // Rimuovi duplicati
}

// Serializzazione canonica del JSON (ordine chiavi fisso)
function canonicalStringify(obj: any): string {
  const orderedObj = Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as any);
  
  return JSON.stringify(orderedObj, null, 0);
}

// Codifica Base64 URL-safe
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Decodifica Base64 URL-safe
function base64UrlDecode(str: string): string {
  str = str
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Aggiungi padding se necessario
  const pad = str.length % 4;
  if (pad) {
    str += '='.repeat(4 - pad);
  }
  
  return atob(str);
}

// Genera una parola casuale dal dizionario
export function generateRandomWord(): string {
  return ITALIAN_WORDS[Math.floor(Math.random() * ITALIAN_WORDS.length)];
}

// Seleziona gli impostori casualmente
export function selectImpostors(players: string[], count: number): string[] {
  const shuffled = [...players].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Valida i dati della partita
function validateGameConfig(config: GameConfig): string[] {
  const errors: string[] = [];
  
  // Validazione versione
  if (config.v !== 1) {
    errors.push(`Versione non supportata: ${config.v}`);
  }
  
  // Validazione giocatori
  if (!Array.isArray(config.giocatori) || config.giocatori.length < 3) {
    errors.push('Deve esserci almeno 3 giocatori');
  }
  
  // Validazione impostori
  if (!Array.isArray(config.impostori) || config.impostori.length < 1) {
    errors.push('Deve esserci almeno 1 impostore');
  }
  
  if (config.impostori.length >= config.giocatori.length) {
    errors.push('Troppi impostori rispetto ai giocatori');
  }
  
  // Verifica che tutti gli impostori siano presenti nei giocatori
  const normalizedPlayers = normalizePlayers(config.giocatori);
  const normalizedImpostors = normalizePlayers(config.impostori);
  
  for (const impostore of normalizedImpostors) {
    if (!normalizedPlayers.includes(impostore)) {
      errors.push(`Impostore "${impostore}" non presente nella lista giocatori`);
    }
  }
  
  // Validazione parola
  if (!config.parola || config.parola.trim().length === 0) {
    errors.push('Parola non valida');
  }
  
  return errors;
}

// Codifica la configurazione della partita
export function encodeGameConfig(config: Omit<GameConfig, 'v' | 'id' | 'createdAt' | 'sig'>): string {
  // Crea il payload completo
  const fullConfig: GameConfig = {
    v: 1,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...config
  };
  
  // Rimuovi il campo sig per il calcolo della firma
  const { sig, ...configWithoutSig } = fullConfig;
  
  // Calcola la firma
  const canonicalJson = canonicalStringify(configWithoutSig);
  const signature = crc32(canonicalJson);
  
  // Aggiungi la firma al config
  fullConfig.sig = signature;
  
  // Converti in JSON e codifica in Base64 URL-safe
  const jsonStr = canonicalStringify(fullConfig);
  const base64Str = base64UrlEncode(jsonStr);
  
  // Aggiungi il prefisso
  return `IMPO1_${base64Str}`;
}

// Decodifica il codice partita
export function decodeGameConfig(code: string): GameConfig {
  // Verifica il prefisso
  if (!code.startsWith('IMPO1_')) {
    throw new Error('Formato codice non riconosciuto');
  }
  
  // Rimuovi il prefisso e decodifica
  const base64Str = code.substring(6);
  const jsonStr = base64UrlDecode(base64Str);
  
  // Parsa il JSON
  let config: GameConfig;
  try {
    config = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Codice non valido: formato JSON errato');
  }
  
  // Verifica la firma
  const { sig, ...configWithoutSig } = config;
  const canonicalJson = canonicalStringify(configWithoutSig);
  const expectedSig = crc32(canonicalJson);
  
  if (sig !== expectedSig) {
    throw new Error('Codice manomesso o corrotto');
  }
  
  // Valida la configurazione
  const errors = validateGameConfig(config);
  if (errors.length > 0) {
    throw new Error(`Configurazione non valida: ${errors.join(', ')}`);
  }
  
  return config;
}

// Genera un codice partita completo
export function generateGameCode(
  players: string[],
  impostorsCount: number,
  name?: string
): { code: string; config: GameConfig } {
  // Normalizza i giocatori
  const normalizedPlayers = normalizePlayers(players);
  
  // Validazioni di base
  if (normalizedPlayers.length < 3) {
    throw new Error('Almeno 3 giocatori sono necessari');
  }
  
  if (impostorsCount < 1 || impostorsCount >= normalizedPlayers.length) {
    throw new Error('Numero di impostori non valido');
  }
  
  // Seleziona gli impostori
  const impostori = selectImpostors(normalizedPlayers, impostorsCount);
  
  // Genera la parola
  const parola = generateRandomWord();
  
  // Crea la configurazione
  const config: Omit<GameConfig, 'v' | 'id' | 'createdAt' | 'sig'> = {
    name: name || '',
    giocatori: normalizedPlayers,
    impostori,
    parola
  };
  
  // Codifica
  const code = encodeGameConfig(config);
  const fullConfig = decodeGameConfig(code); // Verifica che sia valido
  
  return { code, config: fullConfig };
}