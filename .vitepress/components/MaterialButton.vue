<template>
  <button 
    class="material-button" 
    :class="{ 'dark-mode': isDark, 'button-disabled': disabled, [size]: true }"
    @click="$emit('click')"
    :disabled="disabled"
    :style="buttonStyles"
  >
    <svg :width="iconSize" :height="iconSize" :viewBox="iconConfig.viewBox" fill="none">
      <path :d="iconConfig.path" stroke="currentColor" :stroke-width="iconConfig.strokeWidth || 2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script>
import { useData } from 'vitepress'
import { ICONS, COLOR_SCHEMES } from '../utils/icons'

export default {
  name: 'MaterialButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'PLUS',
      validator: (value) => Object.keys(ICONS).includes(value)
    },
    colorScheme: {
      type: String,
      default: 'PRIMARY',
      validator: (value) => Object.keys(COLOR_SCHEMES).includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    // Override per i colori (opzionale)
    bgColor: {
      type: String,
      default: null
    },
    hoverBgColor: {
      type: String,
      default: null
    },
    iconColor: {
      type: String,
      default: null
    },
    hoverIconColor: {
      type: String,
      default: null
    }
  },
  emits: ['click'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  computed: {
    iconConfig() {
      return ICONS[this.icon] || ICONS.PLUS
    },
    iconSize() {
      switch (this.size) {
        case 'small': return 20
        case 'large': return 28
        default: return 24
      }
    },
    buttonStyles() {
      const scheme = COLOR_SCHEMES[this.colorScheme]
      
      return {
        '--bg-color': this.bgColor || scheme.bg,
        '--hover-bg-color': this.hoverBgColor || scheme.hoverBg,
        '--icon-color': this.iconColor || scheme.icon,
        '--hover-icon-color': this.hoverIconColor || scheme.hoverIcon
      }
    }
  }
}
</script>

<style scoped>
.material-button {
  border-radius: 50%;
  background-color: var(--bg-color);
  color: var(--icon-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Dimensioni */
.material-button.small {
  width: 32px;
  height: 32px;
}

.material-button.medium {
  width: 40px;
  height: 40px;
}

.material-button.large {
  width: 48px;
  height: 48px;
}

/* Hover effects */
.material-button:hover:not(.button-disabled) {
  background-color: var(--hover-bg-color);
  color: var(--hover-icon-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.material-button:active:not(.button-disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.button-disabled {
  background-color: var(--vp-c-text-3);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Stile per dark mode */
.dark-mode.material-button:not(.button-disabled) {
  /* Eventuali aggiustamenti per dark mode */
}

.dark-mode.material-button:hover:not(.button-disabled) {
  /* Eventuali aggiustamenti per dark mode */
}
</style>