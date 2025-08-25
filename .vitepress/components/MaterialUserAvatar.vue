<template>
  <div class="material-user-avatar" :class="{ 'dark-mode': isDark }">
    <div class="avatar-container">
      <div 
        v-if="!withFace" 
        class="avatar-circle" 
        :style="circleStyle"
        @click="handleClick"
        :class="{ disabled: !clickable }"
      >
        <span class="avatar-initials" :style="textStyle">
          {{ initials }}
        </span>
      </div>

      <div 
        v-else 
        class="avatar-circle avatar-face" 
        :style="faceStyle"
        @click="handleClick"
        :class="{ disabled: !clickable }"
      >
        <img :src="avatarUrl" alt="avatar" class="avatar-img" />
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
  '#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5',
  '#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50',
  '#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800',
  '#FF5722','#795548','#9E9E9E','#607D8B'
]

export default {
  name: 'MaterialUserAvatar',
  components: { MaterialButton },
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
    },
    withFace: {   // 👈 nuova prop
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
      let hash = 0
      for (let i = 0; i < this.nickname.length; i++) {
        hash = this.nickname.charCodeAt(i) + ((hash << 5) - hash)
      }
      const index = Math.abs(hash) % MATERIAL_COLORS.length
      return MATERIAL_COLORS[index]
    },
    textColor() {
      const hex = this.backgroundColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
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
    },
    avatarUrl() {
      const seed = encodeURIComponent(`${this.nickname}`);
      return `https://api.dicebear.com/7.x/big-smile/svg?seed=${seed}`
    },
    faceStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        cursor: this.clickable ? 'pointer' : 'default',
        backgroundColor: '#fff',
        overflow: 'hidden'
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
      event && event.stopPropagation()
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
  margin-top: 16px;
  margin-bottom: 16px;
  font-family: 'Roboto', sans-serif;
  position: relative;
}
.avatar-container {
  position: relative;
  display: inline-block;
  -webkit-box-shadow: 0px 9px 24px 1px rgba(170, 171, 186, 1);
  -moz-box-shadow: 0px 9px 24px 1px rgba(170, 171, 186, 1);
  box-shadow: 0px 9px 24px 1px rgba(170, 171, 186, 1);
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand-soft);
}

.dark-mode .avatar-container {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
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
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
/* Dark mode */
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
