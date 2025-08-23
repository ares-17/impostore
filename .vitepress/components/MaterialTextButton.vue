<template>
  <button
    class="material-button"
    :class="[colorScheme, { 'dark-mode': isDark, 'button-disabled': disabled }]"
    @click="handleClick"
    :disabled="disabled"
  >
    <span class="button-text">{{ text }}</span>
  </button>
</template>

<script>
import { useData } from 'vitepress'

export default {
  name: 'MaterialTextButton',
  props: {
    text: {
      type: String,
      default: 'Button'
    },
    colorScheme: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style scoped>
.material-button {
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Roboto', sans-serif;
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.material-button.primary {
  background-color: var(--vp-c-brand);
  color: white;
}

.material-button.primary:hover:not(.button-disabled) {
  background-color: var(--vp-c-brand-dark);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.material-button.secondary {
  background-color: var(--vp-c-gray-2);
  color: var(--vp-c-text-1);
}

.material-button.secondary:hover:not(.button-disabled) {
  background-color: var(--vp-c-gray-3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.material-button.outline {
  background-color: transparent;
  color: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand);
}

.material-button.outline:hover:not(.button-disabled) {
  background-color: var(--vp-c-brand-soft);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.button-text {
  letter-spacing: 0.5px;
}

/* Dark mode adjustments */
.dark-mode .material-button.secondary {
  background-color: var(--vp-c-bg-soft-up);
  color: var(--vp-c-text-2);
}

.dark-mode .material-button.secondary:hover:not(.button-disabled) {
  background-color: var(--vp-c-bg-soft);
}

.dark-mode .material-button.outline {
  color: var(--vp-c-brand-light);
  border-color: var(--vp-c-brand-light);
}

.dark-mode .material-button.outline:hover:not(.button-disabled) {
  background-color: var(--vp-c-brand-soft-up);
}
</style>