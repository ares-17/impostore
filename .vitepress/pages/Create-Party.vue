<template>
  <div class="create-party-page" :class="{ 'dark-mode': isDark }">
    <div class="page-container">
      <h1 class="page-title">Crea Nuova Partita 🎉</h1>
      
      <!-- Sezione Giocatori -->
      <div>
        <h2 class="section-title">Giocatori</h2>
        
        <!-- Lista degli avatar dei giocatori esistenti -->
        <div class="avatars-grid">
          <MaterialUserAvatar
            v-for="(user, index) in avatars"
            :key="index"
            :nickname="user"
            :size="60"
            :clickable="false"
            :deletable="true"
            @delete="removeUser(index)"
          />
        </div>
        
        <!-- Input per aggiungere un nuovo giocatore -->
        <div class="add-user-section">
          <MaterialAddUser
            v-model="newUser"
            :index="avatars.length"
            :deletable="false"
            @add-user="addNewUser"
          />
        </div>
      </div>
      
      <!-- Sezione Impostori -->
      <div>
        <h2 class="section-title">Impostori</h2>
        
        <MaterialNumberInput
          v-model="impostorsCount"
          label="Numero di impostori"
          placeholder="Inserisci numero impostori"
          :max="maxImpostors"
          :min="1"
          :step="1"
        />
      </div>
      
      <!-- Bottone di creazione -->
      <div class="create-button-section">
        <MaterialTextButton
          text="Crea Partita"
          color-scheme="primary"
          :disabled="!isFormValid"
          @click="createParty"
        />
      </div>
    </div>
    
    <!-- Toast di successo -->
    <MaterialToast
      v-model:show="showSuccessToast"
      message="Partita creata con successo!"
      type="success"
    />
  </div>
</template>

<script>
import { useData } from 'vitepress'
import MaterialUserAvatar from '../components/MaterialUserAvatar.vue'
import MaterialAddUser from '../components/MaterialAddUser.vue'
import MaterialNumberInput from '../components/MaterialNumberInput.vue'
import MaterialTextButton from '../components/MaterialTextButton.vue'
import MaterialToast from '../components/MaterialToast.vue'

export default {
  name: 'CreatePartyPage',
  components: {
    MaterialUserAvatar,
    MaterialAddUser,
    MaterialNumberInput,
    MaterialTextButton,
    MaterialToast
  },
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  data() {
    return {
      avatars: [], // Lista dei giocatori già aggiunti
      newUser: '', // Nuovo giocatore da aggiungere
      impostorsCount: 1,
      showSuccessToast: false
    }
  },
  computed: {
    // Calcola il numero massimo di impostori (sempre minore del numero di giocatori)
    maxImpostors() {
      return Math.max(1, this.avatars.length - 1) // Almeno 1, massimo n-1 giocatori
    },
    
    // Verifica se il form è valido
    isFormValid() {
      // Almeno 4 giocatori
      if (this.avatars.length < 4) return false
      
      // Il numero di impostori deve essere valido
      if (this.impostorsCount < 1 || this.impostorsCount >= this.avatars.length) return false
      
      return true
    }
  },
  watch: {
    // Aggiorna il numero di impostori se supera il massimo consentito
    maxImpostors(newMax) {
      if (this.impostorsCount > newMax) {
        this.impostorsCount = newMax
      }
    }
  },
  mounted() {
    // Carica i dati dalla sessionStorage se presenti
    this.loadFromStorage()
  },
  methods: {
    removeUser(index) {
      this.avatars.splice(index, 1)
      this.saveToStorage()
    },
    // Aggiunge un nuovo giocatore dalla input
    addNewUser() {
      if (this.newUser.trim()) {
        this.avatars.push(this.newUser.trim())
        this.newUser = ''
        this.saveToStorage()
      }
    },
    
    // Crea la partita
    createParty() {
      if (!this.isFormValid) return
      
      // Salva i dati della partita
      const partyData = {
        users: this.avatars,
        impostors: this.impostorsCount,
        createdAt: new Date().toISOString()
      }
      
      // Salva nella sessionStorage
      sessionStorage.setItem('currentParty', JSON.stringify(partyData))
      
      // Mostra il toast di successo
      this.showSuccessToast = true
      
      // Reindirizza alla pagina della partita dopo 2 secondi
      setTimeout(() => {
        // Qui puoi reindirizzare alla pagina della partita
        console.log('Reindirizzamento alla partita...', partyData)
      }, 2000)
    },
    
    // Salva i nicknames nella sessionStorage
    saveToStorage() {
      sessionStorage.setItem('savedNicknames', JSON.stringify(this.avatars))
    },
    
    // Carica i nicknames dalla sessionStorage
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
.material-button.primary{
  width: 100%;
}

.create-party-page {
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

.create-button-section {
  margin-top: 32px;
}

/* Dark mode adjustments */
.dark-mode .create-party-page {
  background-color: var(--vp-c-bg-soft-up);
}

.dark-mode .section {
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 640px) {
  .create-party-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .section {
    padding: 16px;
  }
  
  .avatars-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
  }
}
</style>