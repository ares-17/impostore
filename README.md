Ecco un esempio completo di **README in italiano** per il tuo progetto, che descrive l’applicazione, la struttura, l’uso e il deploy con VitePress, Vue e TypeScript:

---

# Impostore - Gioco Party Online

**Impostore** è un’applicazione web per giocare a un gioco da party simile a "Among Us" con amici, sviluppata con **VitePress**, **Vue 3** e **TypeScript**. Gli utenti possono creare partite, unirsi con un codice/token e scoprire il proprio ruolo (impostore o giocatore) in modo interattivo.

---

## Caratteristiche principali

* Creazione di una nuova partita con:

  * Inserimento dei nickname dei giocatori
  * Selezione del numero di impostori
* Generazione di un **token sicuro** che racchiude tutti i dati della partita
* Accesso alla partita tramite il codice/token
* Visualizzazione del ruolo:

  * Se impostore → avviso per non farsi scoprire
  * Se giocatore → parola segreta da indovinare
* Modalità di verifica ruolo per gli amministratori
* Notifiche via toast e animazioni per rivelazioni e confetti
* Condivisione del token tramite social o app di messaggistica
* Stile moderno con **Material Components** e **TailwindCSS**

---

## Struttura del progetto

```
.
├─ .vitepress/          # Configurazione VitePress, tema, componenti, utilità
│  ├─ components/       # Componenti Vue riutilizzabili (bottoni, dropdown, modali)
│  ├─ utils/            # Funzioni helper (encoding/decoding token, generazione parole)
│  ├─ config.mts        # Configurazione VitePress
│  └─ theme/            # Temi e layout personalizzati
├─ public/              # Risorse statiche
├─ create-party.md      # Pagina per creare una nuova partita
├─ join-party.md        # Pagina per unirsi a una partita
├─ view-word.md         # Pagina per visualizzare la parola/ruolo
├─ package.json
├─ tailwind.config.js
├─ vite.config.mts
└─ README.md
```

---

## Installazione e avvio in locale

Assicurati di avere **Node.js 18+** e **npm** installati.

```bash
# Clona il repository
git clone https://github.com/tuo-username/impostore.git
cd impostore

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L’applicazione sarà accessibile su `http://localhost:4173`.

---

## Comandi principali

| Comando         | Descrizione                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Avvia il server di sviluppo            |
| `npm run build` | Compila il sito statico per produzione |
| `npm run serve` | Serve la versione statica buildata     |
| `npm run lint`  | Controlla la qualità del codice        |

---

## Deploy su GitHub Pages

1. Modifica il `base` in `.vitepress/config.mts`:

```ts
export default {
  base: '/impostore/' // Nome repository GitHub Pages
}
```

2. Build del progetto:

```bash
npm run build
```

3. Copia il contenuto di `.vitepress/dist` nel branch `gh-pages`:

```bash
git add -f .vitepress/dist
git commit -m "Deploy GitHub Pages"
git subtree push --prefix .vitepress/dist origin gh-pages
```

L’applicazione sarà disponibile su:

```
https://tuo-username.github.io/impostore/
```

---

## Componenti principali

* **MaterialTextButton.vue** → Bottone con vari schemi colore
* **MaterialTextInput.vue** → Input testuale
* **MaterialDropdownFilled.vue** → Dropdown con selezione a tema Material
* **MaterialModal.vue** → Modale per rivelazione parole/ruoli
* **MaterialToast.vue** → Notifiche toast
* **MaterialUserAvatar.vue** → Avatar giocatori
* **MaterialCheckbox.vue** → Checkbox per opzioni (es. token già condiviso)

---

## Funzionamento del token

* La partita viene codificata in un token Base64 URL-safe (`IMPO1_...`) contenente:

  * Lista giocatori
  * Lista impostori
  * Parola segreta
  * Firma CRC32 per integrità
* I giocatori inseriscono il token nella pagina di join e possono selezionare il loro nickname per scoprire il ruolo.
* Gli amministratori possono saltare la rivelazione singola se il token è già condiviso.

---

## Tecnologie utilizzate

* [VitePress](https://vitepress.dev/)
* [Vue 3](https://vuejs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## Note

* L’applicazione è completamente **client-side**.
* Tutti i dati della partita vengono salvati temporaneamente in `sessionStorage`.
* L’uso del token garantisce che i giocatori non possano imbrogliare mostrando le parole senza permesso.

---

Se vuoi, posso scrivere anche una **versione abbreviata pronta da inserire come README su GitHub**, ottimizzata per leggibilità e con badge per Build/Versione.

Vuoi che faccia anche quella?
