<template>
  <div class="view-word-page" :class="{ 'dark-mode': isDark }">
    <div class="page-container">
      <h1 class="page-title">Visualizza la Parola 🔍</h1>

      <!-- Input codice/token -->
      <div class="token-section">
        <MaterialTextInput v-model="gameToken" label="Inserisci il tuo token" placeholder="IMPO1_..." />
        <MaterialTextButton text="Carica Partita" color-scheme="primary" :disabled="!gameToken" @click="loadGame" />
      </div>

      <!-- Selezione nickname -->
      <div v-if="players.length > 0" class="select-section">
        <MaterialDropdownFilled v-model="selectedPlayer" :options="players.map(p => ({ label: p, value: p }))"
          label="Seleziona il tuo nickname" placeholder="Scegli il tuo nome" :disabled="playerRevealed" />
        <MaterialTextButton text="Mostra la Parola" color-scheme="primary" :disabled="!selectedPlayer || playerRevealed"
          @click="revealRole" />
      </div>

      <!-- Modale per parola/ruolo -->
      <MaterialModal v-model:show="showRevealModal" :title="`Ruolo di ${selectedPlayer}`" @confirm="closeRevealModal"
        :show-cancel="false">
        <div class="reveal-content">
          <div class="role-text" :class="{ show: roleVisible }">
            <template v-if="isImpostor(selectedPlayer)">
              IMPOSTORE 👀
            </template>
            <template v-else>
              {{ parola.toUpperCase() }}
            </template>
          </div>
        </div>
      </MaterialModal>

      <!-- Toast -->
      <MaterialToast v-model:show="showToast" :message="toastMessage" :type="toastType" />
    </div>
  </div>
</template>

<script>
import { useData } from 'vitepress'
import MaterialTextInput from '../components/MaterialTextInput.vue'
import MaterialDropdownFilled from '../components/MaterialDropdownFilled.vue'
import MaterialTextButton from '../components/MaterialTextButton.vue'
import MaterialModal from '../components/MaterialModal.vue'
import MaterialToast from '../components/MaterialToast.vue'
import { decodeGameConfig } from '../utils/gameCode'

export default {
  name: 'ViewWordPage',
  components: {
    MaterialTextInput,
    MaterialDropdownFilled,
    MaterialTextButton,
    MaterialModal,
    MaterialToast
  },
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  data() {
    return {
      gameToken: '',
      selectedPlayer: '',
      players: [],
      impostors: [],
      parola: '',
      showRevealModal: false,
      roleVisible: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      playerRevealed: false  // ← nuovo flag
    }
  },
  methods: {
    loadGame() {
      try {
        const config = decodeGameConfig(this.gameToken)
        this.players = config.giocatori
        this.impostors = config.impostori
        this.parola = config.parola
        this.showToastMessage('Partita caricata correttamente!', 'success')
      } catch (e) {
        this.showToastMessage(`Errore: ${e.message}`, 'error')
      }
    },
    isImpostor(player) {
      return this.impostors.includes(player)
    },
    revealRole() {
      if (!this.selectedPlayer) return
      this.roleVisible = false
      this.showRevealModal = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.roleVisible = true
        }, 50)
      })
    },
    closeRevealModal() {
      this.showRevealModal = false
      this.roleVisible = false
      this.playerRevealed = true   // ← l’utente ha visto il ruolo
    },
    showToastMessage(msg, type = 'success') {
      this.toastMessage = msg
      this.toastType = type
      this.showToast = true
    }
  }
}
</script>

<style scoped>
.material-button {
  width: 100%;
}

.page-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 32px;
}

.token-section,
.select-section {
  margin-bottom: 24px;
  width: 100%;
}

.reveal-content {
  text-align: center;
  padding: 16px 0;
}

.role-text {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 28px;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease, transform 1s ease;
}

.role-text.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
