<template>
  <div class="join-party-admin-page" :class="{ 'dark-mode': isDark }">
    <div class="page-container">
      <h1 class="page-title">Divertiti con i tuoi amici!</h1>
      
      <!-- Sezione Giocatori -->
      <div>
        <h2 class="section-title">Giocatori presenti</h2>
        
        <!-- Lista degli avatar dei giocatori -->
        <div class="avatars-grid">
          <MaterialUserAvatar
            v-for="(user, index) in players"
            :key="index"
            :nickname="user"
            :size="60"
            :clickable="isAvatarClickable(user)"
            :deletable="false"
            @avatar-click="handleAvatarClick(user)"
          />
        </div>
      </div>
      
      <!-- Bottone per cambiare stato -->
      <div class="action-button-section">
        <MaterialTextButton
          v-if="state === 'revealing'"
          text="Tutti hanno visto 🎮"
          color-scheme="primary"
          :disabled="!allPlayersRevealed"
          @click="startCheckingPhase"
        />
        <MaterialTextButton
          v-else
          :text="gameFinished ? 'Nuova Partita' : 'Termina Partita'"
          :color-scheme="gameFinished ? 'primary' : 'danger'"
          @click="handleEndGame"
        />
      </div>
    </div>
    
    <!-- Modale per la rivelazione del ruolo -->
    <MaterialModal
      v-model:show="showRevealModal"
      :title="`Ruolo di ${selectedPlayer}`"
      @confirm="closeRevealModal"
      :show-cancel="false"
    >
      <div class="reveal-content">
        <div v-if="isImpostor(selectedPlayer)" class="impostor-reveal">
          <h3>Sei un Impostore! 👤</h3>
          <p>Non farti scoprire dagli altri giocatori.</p>
        </div>
        <div v-else class="player-reveal">
          <h3>La parola è:</h3>
          <p class="secret-word">{{ secretWord }}</p>
          <p>Non rivelarla agli impostori!</p>
        </div>
      </div>
    </MaterialModal>
    
    <!-- Modale per la verifica del ruolo -->
    <MaterialModal
      v-model:show="showCheckModal"
      :title="`Verifica ${selectedPlayer}`"
      @confirm="confirmRoleCheck"
      @close="closeCheckModal"
    >
      <div class="check-content">
        <p>Sei sicuro di voler verificare il ruolo di <strong>{{ selectedPlayer }}</strong>?</p>
        <p>Questa azione non può essere annullata.</p>
      </div>
      
      <template v-if="roleCheckConfirmed" #footer>
        <div class="role-result">
          <div v-if="isImpostor(selectedPlayer)" class="impostor-result">
            <h3>👤 IMPOSTORE</h3>
            <p>{{ selectedPlayer }} è un impostore!</p>
          </div>
          <div v-else class="innocent-result">
            <h3>👍 INNOCENTE</h3>
            <p>{{ selectedPlayer }} non è un impostore.</p>
          </div>
        </div>
      </template>
    </MaterialModal>
    
    <!-- Toast di notifica -->
    <MaterialToast
      v-model:show="showToast"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script>
import { useData } from 'vitepress'
import MaterialUserAvatar from '../components/MaterialUserAvatar.vue'
import MaterialTextButton from '../components/MaterialTextButton.vue'
import MaterialModal from '../components/MaterialModal.vue'
import MaterialToast from '../components/MaterialToast.vue'

export default {
  name: 'JoinPartyAdmin',
  components: {
    MaterialUserAvatar,
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
      state: 'revealing', // 'revealing' or 'checking'
      players: [],
      impostors: [],
      secretWord: '',
      revealedPlayers: [],
      checkedPlayers: [],
      selectedPlayer: '',
      showRevealModal: false,
      showCheckModal: false,
      roleCheckConfirmed: false,
      gameFinished: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success'
    }
  },
  computed: {
    allPlayersRevealed() {
      return this.players.every(player => this.revealedPlayers.includes(player))
    }
  },
  mounted() {
    this.loadGameData()
  },
  methods: {
    loadGameData() {
      try {
        // Carica i dati della partita dal sessionStorage
        const partyData = sessionStorage.getItem('currentParty')
        const gameCode = sessionStorage.getItem('currentGameCode')
        
        if (!partyData || !gameCode) {
          this.showError('Nessuna partita trovata. Creane una nuova.')
          return
        }
        
        const config = JSON.parse(partyData)
        this.players = config.giocatori || []
        this.impostors = config.impostori || []
        this.secretWord = config.parola || ''
        
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error)
        this.showError('Errore nel caricamento della partita.')
      }
    },
    
    isImpostor(player) {
      return this.impostors.includes(player)
    },
    
    isAvatarClickable(player) {
      if (this.state === 'revealing') {
        return !this.revealedPlayers.includes(player)
      } else {
        return !this.checkedPlayers.includes(player) && !this.gameFinished
      }
    },
    
    handleAvatarClick(player) {
      this.selectedPlayer = player
      
      if (this.state === 'revealing') {
        this.showRevealModal = true
      } else {
        this.roleCheckConfirmed = false
        this.showCheckModal = true
      }
    },
    
    closeRevealModal() {
      if (!this.revealedPlayers.includes(this.selectedPlayer)) {
        this.revealedPlayers.push(this.selectedPlayer)
      }
      this.showRevealModal = false
    },
    
    closeCheckModal() {
      this.showCheckModal = false
      this.roleCheckConfirmed = false
    },
    
    confirmRoleCheck() {
      if (!this.roleCheckConfirmed) {
        this.roleCheckConfirmed = true
        return false // Non chiudere la modale
      }
      
      // Aggiungi il giocatore alla lista dei controllati
      if (!this.checkedPlayers.includes(this.selectedPlayer)) {
        this.checkedPlayers.push(this.selectedPlayer)
      }
      
      this.showCheckModal = false
      this.roleCheckConfirmed = false
      
      // Verifica se tutti i giocatori sono stati controllati
      if (this.checkedPlayers.length === this.players.length) {
        this.gameFinished = true
        this.showToastMessage('Partita completata! Tutti i giocatori sono stati verificati.', 'success')
      }
    },
    
    startCheckingPhase() {
      this.state = 'checking'
      this.showToastMessage('Fase di verifica iniziata! Clicca sui giocatori per scoprire se sono impostori.', 'success')
    },
    
    handleEndGame() {
      if (this.gameFinished) {
        // Crea una nuova partita
        sessionStorage.removeItem('currentParty')
        sessionStorage.removeItem('currentGameCode')
        this.$router.push('/create-party')
      } else {
        // Termina la partita corrente
        this.gameFinished = true
        sessionStorage.removeItem('currentParty')
        sessionStorage.removeItem('currentGameCode')
        this.showToastMessage('Partita terminata.', 'success')
      }
    },
    
    showToastMessage(message, type) {
      this.toastMessage = message
      this.toastType = type
      this.showToast = true
    },
    
    showError(message) {
      this.showToastMessage(message, 'error')
    }
  }
}
</script>

<style scoped>
.material-button {
  width: 100%;
}

.join-party-admin-page {
  min-height: 100vh;
  padding: 24px;
  background-color: var(--vp-c-bg);
  transition: background-color 0.3s ease;
}

.page-container {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  text-align: center;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.action-button-section {
  margin-top: 32px;
  text-align: center;
}

.reveal-content {
  text-align: center;
  padding: 16px 0;
}

.impostor-reveal {
  color: var(--vp-c-red);
}

.player-reveal {
  color: var(--vp-c-green);
}

.secret-word {
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0;
  color: var(--vp-c-brand);
}

.check-content {
  text-align: center;
  padding: 16px 0;
}

.role-result {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.impostor-result {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--vp-c-red);
  border: 1px solid var(--vp-c-red);
}

.innocent-result {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--vp-c-green);
  border: 1px solid var(--vp-c-green);
}

/* Dark mode adjustments */
.dark-mode .join-party-admin-page {
  background-color: var(--vp-c-bg-soft-up);
}

/* Responsive */
@media (max-width: 640px) {
  .join-party-admin-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .avatars-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
  }
}
</style>