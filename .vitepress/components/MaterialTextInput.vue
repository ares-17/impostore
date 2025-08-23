<template>
  <div class="material-text-input" :class="{ 'input-focused': isFocused, 'input-filled': modelValue, 'has-trailing': hasTrailing, 'dark-mode': isDark }">
    <div class="input-field">
      <label class="input-label" :class="{ 'label-active': isFocused || modelValue }">
        {{ label }}
      </label>
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="isFocused ? placeholder : ''"
        class="input-element"
        :disabled="disabled"
      />
      
      <!-- Slot per il componente trailing -->
      <div v-if="hasTrailing" class="trailing-component">
        <slot name="trailing"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { useData } from 'vitepress'

export default {
  name: 'MaterialTextInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: 'Etichetta'
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'password', 'email', 'number'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  data() {
    return {
      isFocused: false
    }
  },
  computed: {
    hasTrailing() {
      return !!this.$slots.trailing
    }
  }
}
</script>

<style scoped>
.material-text-input {
  position: relative;
  margin: 16px 0;
  font-family: 'Roboto', sans-serif;
  max-width: 100%;
}

.input-field {
  position: relative;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 22px 12px 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.input-field:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.input-focused .input-field {
  border-color: var(--vp-c-brand);
  border-width: 1px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.input-filled .input-field {
  border-color: var(--vp-c-brand);
}

.input-label {
  position: absolute;
  top: 12px;
  left: 12px;
  color: var(--vp-c-text-2);
  font-size: 16px;
  font-weight: 400;
  pointer-events: none;
  transition: all 0.3s ease;
  transform-origin: top left;
  background-color: var(--vp-c-bg-soft);
  padding: 0 4px;
  border-radius: 2px;
}

.label-active {
  transform: translateY(-18px) scale(0.85);
  color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
  font-weight: 500;
}

.input-element {
  font-size: 16px;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  padding: 0;
  margin: 0;
  flex: 1;
}

.input-element:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.trailing-component {
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Stile per dark mode */
.dark-mode .input-field {
  background-color: var(--vp-c-bg-soft-up);
  border-color: var(--vp-c-divider);
}

.dark-mode .input-label {
  background-color: var(--vp-c-bg-soft-up);
}

.dark-mode .label-active {
  background-color: var(--vp-c-bg);
}

/* Supporto per schermi piccoli */
@media (max-width: 480px) {
  .input-label {
    font-size: 14px;
  }
  
  .input-element {
    font-size: 14px;
  }
}
</style>