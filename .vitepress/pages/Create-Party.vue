<template>
  <div class="create-party-page" :class="{ 'dark-mode': isDark }">
    <div class="page-container">
      <h1 class="page-title">Crea Nuova Partita 🎉</h1>
      <div class="mt-4">
        <span>Vuoi iniziare una nuova partita? 🎲
          In questa pagina puoi generare un codice unico da condividere con i tuoi amici.
          Copia il codice e invialo agli altri giocatori: chiunque lo inserirà potrà unirsi alla tua partita.</span>
      </div>

      <!-- Sezione Giocatori -->
      <div>
        <h2 class="section-title">Giocatori</h2>

        <!-- Lista degli avatar dei giocatori esistenti -->
        <div class="avatars-grid">
          <MaterialUserAvatar v-for="(user, index) in avatars" :key="index" :nickname="user" :size="60"
            :clickable="true" :deletable="!gameCode" @delete="removeUser(index)" />
        </div>

        <!-- Input per aggiungere un nuovo giocatore -->
        <div class="add-user-section" v-if="!gameCode">
          <MaterialAddUser v-model="newUser" :index="avatars.length" :deletable="false" @add-user="addNewUser" />
        </div>
      </div>

      <!-- Sezione Impostori -->
      <div v-if="!gameCode">
        <h2 class="section-title">Impostori</h2>

        <MaterialNumberInput v-model="impostorsCount" label="Numero di impostori"
          placeholder="Inserisci numero impostori" :max="maxImpostors" :min="1" :step="1" />
      </div>

      <!-- Bottone di creazione -->
      <div v-if="!gameCode" class="create-button-section">
        <MaterialTextButton text="Crea Partita 🎮" color-scheme="primary" :disabled="!isFormValid"
          @click="createParty" />
      </div>

      <div v-if="gameCode" class="game-code-section">
        <h3>Codice Partita</h3>

        <!-- Codice della partita -->
        <div class="code-container">
          <code class="game-code">{{ gameCode }}</code>
        </div>

        <!-- Bottone copia a tutta larghezza -->
        <div class="copy-button-section">
          <MaterialTextButton text="Copia Codice negli Appunti" color-scheme="outline" @click="copyGameCode" />
        </div>

        <p class="hint">Condividi questo codice con i giocatori per farli unire alla partita</p>
      </div>


    </div>

    <!-- Bottone di accesso al gioco -->
    <div v-if="gameCode" class="join-party">
      <MaterialTextButton text="Accedi al party 🎮" color-scheme="primary" :disabled="!isFormValid"
        @click="joinParty" />
    </div>

    <!-- Toast di successo -->
    <MaterialToast v-model:show="showSuccessToast" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script>
import { useData } from 'vitepress'
import MaterialUserAvatar from '../components/MaterialUserAvatar.vue'
import MaterialAddUser from '../components/MaterialAddUser.vue'
import MaterialNumberInput from '../components/MaterialNumberInput.vue'
import MaterialTextButton from '../components/MaterialTextButton.vue'
import MaterialToast from '../components/MaterialToast.vue'
import MaterialButton from '../components/MaterialButton.vue'
import { generateGameCode } from '../utils/gameCode'
import { withBase } from 'vitepress'

export default {
  name: 'CreatePartyPage',
  components: {
    MaterialUserAvatar,
    MaterialAddUser,
    MaterialNumberInput,
    MaterialTextButton,
    MaterialToast,
    MaterialButton
  },
  setup() {
    const { isDark } = useData()

    const joinParty = () => {
      window.location.href = withBase('/join-party');
    };

    return { isDark, joinParty }
  },
  data() {
    return {
      avatars: [],
      newUser: '',
      impostorsCount: 1,
      showSuccessToast: false,
      toastMessage: '',
      toastType: 'success',
      gameCode: null,
    }
  },
  computed: {
    maxImpostors() {
      return Math.max(1, this.avatars.length - 1)
    },
    isFormValid() {
      return this.avatars.length >= 3 &&
        this.impostorsCount >= 1 &&
        this.impostorsCount < this.avatars.length
    }
  },
  mounted() {
    this.loadFromStorage()
  },
  methods: {
    addNewUser() {
      if (this.newUser.trim()) {
        this.avatars.push(this.newUser.trim())
        this.newUser = ''
        this.saveToStorage()
      }
    },
    removeUser(index) {
      this.avatars.splice(index, 1)
      this.saveToStorage()

      // Aggiorna il numero di impostori se necessario
      if (this.impostorsCount >= this.avatars.length) {
        this.impostorsCount = Math.max(1, this.avatars.length - 1)
      }
    },
    async createParty() {
      if (!this.isFormValid) return

      try {
        // Genera il codice partita
        const { code, config } = generateGameCode(
          this.avatars,
          this.impostorsCount,
          `Partita del ${new Date().toLocaleDateString()}`
        )

        // Salva i dati della partita
        sessionStorage.setItem('currentParty', JSON.stringify(config))
        sessionStorage.setItem('currentGameCode', JSON.stringify(code))
        this.gameCode = code

        // Mostra il toast di successo
        this.toastMessage = 'Partita creata con successo!'
        this.toastType = 'success'
        this.showSuccessToast = true

      } catch (error) {
        // Mostra il toast di errore
        this.toastMessage = `Errore: ${error.message}`
        this.toastType = 'error'
        this.showSuccessToast = true
      }
    },
    async copyGameCode() {
      try {
        await navigator.clipboard.writeText(this.gameCode)
        this.toastMessage = 'Codice copiato negli appunti!'
        this.toastType = 'success'
        this.showSuccessToast = true
      } catch (error) {
        this.toastMessage = 'Impossibile copiare il codice'
        this.toastType = 'error'
        this.showSuccessToast = true
      }
    },
    saveToStorage() {
      sessionStorage.setItem('savedNicknames', JSON.stringify(this.avatars))
    },
    loadFromStorage() {
      try {
        const savedNicknames = sessionStorage.getItem('savedNicknames')
        if (savedNicknames) {
          const nicknames = JSON.parse(savedNicknames)
          if (nicknames.length > 0) {
            this.avatars = nicknames
          }
        }
      } catch (e) {
        console.error('Errore nel caricamento dei nicknames:', e)
      }
    }
  }
}
</script>

<style scoped>
.material-button {
  width: 100%;
  margin-top: 2rem;
}

.game-code-section {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  border: 1px solid black;
}

.game-code-section h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
}

.code-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--vp-c-bg);
  padding: 12px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}

.game-code {
  flex-grow: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  word-break: break-all;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.add-user-section {
  margin-top: 16px;
}

.hint {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 8px;
}
</style>