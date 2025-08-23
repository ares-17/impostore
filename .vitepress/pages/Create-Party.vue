<template>
  <div class="create-party-page" :class="{ 'dark-mode': isDark }">
    <div class="page-container">
      <h1 class="page-title">Crea Nuova Partita</h1>
      
      <!-- Sezione Giocatori -->
      <div class="section">
        <h2 class="section-title">Giocatori</h2>
        
        <div class="users-list">
          <MaterialUserEdit
            v-for="(user, index) in users"
            :key="index"
            v-model="users[index]"
            :index="index"
            :deletable="users.length > 1"
            @delete-user="deleteUser"
            @update:modelValue="saveToStorage"
          />
        </div>
        
        <div class="add-user-button">
          <MaterialButton
            icon="PLUS"
            color-scheme="PRIMARY"
            size="medium"
            @click="addUser"
          />
          <span class="add-user-label">Aggiungi giocatore</span>
        </div>
      </div>
      
      <!-- Sezione Impostori -->
      <div class="section">
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
      <div class="create-button-section w-full">
        <MaterialTextButton
          class="flex-grow"
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
import MaterialUserEdit from '../components/MaterialUserEdit.vue'
import MaterialNumberInput from '../components/MaterialNumberInput.vue'
import MaterialButton from '../components/MaterialButton.vue'
import MaterialTextButton from '../components/MaterialTextButton.vue'
import MaterialToast from '../components/MaterialToast.vue'

export default {
  name: 'CreatePartyPage',
  components: {
    MaterialUserEdit,
    MaterialNumberInput,
    MaterialButton,
    MaterialTextButton,
    MaterialToast
  },
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  data() {
    return {
      users: [''],
      impostorsCount: 1,
      showSuccessToast: false
    }
  },
  computed: {
    // Calcola il numero massimo di impostori in base al numero di giocatori
    maxImpostors() {
      if (this.users.length < 4) return 1
      if (this.users.length < 7) return 2
      return Math.floor(this.users.length / 3)
    },
    
    // Verifica se il form è valido
    isFormValid() {
      // Almeno 4 giocatori
      if (this.users.length < 4) return false
      
      // Tutti i giocatori devono avere un nickname
      if (this.users.some(user => !user.trim())) return false
      
      // Il numero di impostori deve essere valido
      if (this.impostorsCount < 1 || this.impostorsCount > this.maxImpostors) return false
      
      return true
    },
    
    // Filtra i nicknames validi
    validUsers() {
      return this.users.filter(user => user.trim())
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
    // Aggiunge un nuovo giocatore
    addUser() {
      this.users.push('')
      this.saveToStorage()
    },
    
    // Rimuove un giocatore
    deleteUser(index) {
      if (this.users.length > 1) {
        this.users.splice(index, 1)
        this.saveToStorage()
      }
    },
    
    // Crea la partita
    createParty() {
      if (!this.isFormValid) return
      
      // Salva i dati della partita
      const partyData = {
        users: this.validUsers,
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
      sessionStorage.setItem('savedNicknames', JSON.stringify(this.validUsers))
    },
    
    // Carica i nicknames dalla sessionStorage
    loadFromStorage() {
      try {
        const savedNicknames = sessionStorage.getItem('savedNicknames')
        if (savedNicknames) {
          const nicknames = JSON.parse(savedNicknames)
          if (nicknames.length > 0) {
            this.users = nicknames
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

.users-list {
  margin-bottom: 16px;
}

.add-user-button {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-user-label {
  color: var(--vp-c-text-2);
  font-size: 14px;
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
}
</style>