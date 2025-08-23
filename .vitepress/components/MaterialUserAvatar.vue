<template>
  <div class="material-user-avatar" :class="{ 'dark-mode': isDark }">
    <div class="avatar-container">
      <div 
        class="avatar-circle" 
        :style="circleStyle"
        @click="handleClick"
        :class="{ disabled: !clickable }"
      >
        <span class="avatar-initials" :style="textStyle">
          {{ initials }}
        </span>
      </div>
      
      <!-- Bottone di rimozione -->
      <MaterialButton
        v-if="deletable"
        icon="MINUS"
        color-scheme="DANGER"
        size="small"
        @click="handleDelete"
        class="delete-button"
      />
    </div>
    
    <div class="avatar-nickname">
      {{ nickname }}
    </div>
  </div>
</template>

<script>
import { useData } from 'vitepress'
import MaterialButton from './MaterialButton.vue'

// Palette di colori Material Design (500 series)
const MATERIAL_COLORS = [
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#CDDC39', // Lime
  '#FFEB3B', // Yellow
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#FF5722', // Deep Orange
  '#795548', // Brown
  '#9E9E9E', // Grey
  '#607D8B'  // Blue Grey
]

export default {
  name: 'MaterialUserAvatar',
  components: {
    MaterialButton
  },
  props: {
    nickname: {
      type: String,
      required: true,
      default: 'User'
    },
    size: {
      type: Number,
      default: 64
    },
    clickable: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['avatar-click', 'delete'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  computed: {
    initials() {
      if (!this.nickname || this.nickname.length === 0) return 'US'
      
      const parts = this.nickname.trim().split(/\s+/)
      if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase()
      }
      
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    },
    
    backgroundColor() {
      // Calcola un hash semplice dal nickname per selezionare un colore consistente
      let hash = 0
      for (let i = 0; i < this.nickname.length; i++) {
        hash = this.nickname.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      // Usa il valore assoluto e il modulo per selezionare un colore
      const index = Math.abs(hash) % MATERIAL_COLORS.length
      return MATERIAL_COLORS[index]
    },
    
    textColor() {
      // Calcola se il colore di sfondo è scuro per decidere il colore del testo
      const hex = this.backgroundColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // Formula per la luminosità (percezione umana)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      
      return brightness > 128 ? '#000000' : '#FFFFFF'
    },
    
    circleStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        backgroundColor: this.backgroundColor,
        cursor: this.clickable ? 'pointer' : 'default'
      }
    },
    
    textStyle() {
      return {
        color: this.textColor,
        fontSize: `${this.size / 2.5}px`
      }
    }
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('avatar-click', this.nickname)
      }
    },
    
    handleDelete(event) {
      event && event.stopPropagation() // Previene il bubbling dell'evento
      this.$emit('delete', this.nickname)
    }
  }
}
</script>

<style scoped>
.avatar-circle.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  background-color: grey !important;
}

.avatar-circle.disabled:hover {
  box-shadow: none;
  transform: none;
}


.material-user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 16px;
  font-family: 'Roboto', sans-serif;
  position: relative;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-circle {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.avatar-circle:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.avatar-initials {
  font-weight: 500;
  user-select: none;
}

.delete-button {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
}

.avatar-nickname {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-align: center;
  max-width: 100px;
  word-break: break-word;
}

/* Stile per dark mode */
.dark-mode .avatar-nickname {
  color: var(--vp-c-text-2);
}

/* Responsive */
@media (max-width: 480px) {
  .avatar-nickname {
    font-size: 14px;
    max-width: 80px;
  }
  
  .delete-button {
    top: -6px;
    right: -6px;
  }
}
</style>