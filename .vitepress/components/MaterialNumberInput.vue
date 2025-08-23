<template>
  <div class="material-number-input flex flex-row sm:flex-row sm:items-end gap-3 w-full items-center"
    :class="{ 'input-focused': isFocused, 'has-buttons': true, 'dark-mode': isDark }">
    
    <div class="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
          <!-- Bottone decremento -->
    <MaterialButton icon="MINUS" color-scheme="SECONDARY" size="small" :disabled="modelValue <= min" @click="decrement"
      class="number-button" />
    </div>


    <div class="flex-grow sm:w-auto">
      <div class="input-field">
        <label class="input-label" :class="{ 'label-active': isFocused || modelValue !== 0 }">
          {{ label }}
        </label>
        <!-- Input numerico -->
        <input type="number" :value="modelValue" @input="handleInput($event)" @focus="isFocused = true"
          @blur="isFocused = false" :min="min" :max="max" :placeholder="isFocused ? placeholder : ''"
          class="number-input" :disabled="disabled" />
      </div>
    </div>

    <div class="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
      <!-- Bottone incremento -->
      <MaterialButton icon="PLUS" color-scheme="PRIMARY" size="small" :disabled="modelValue >= max" @click="increment"
        class="number-button" />
    </div>

  </div>
</template>

<script>
import { useData } from 'vitepress'
import MaterialButton from './MaterialButton.vue'

export default {
  name: 'MaterialNumberInput',
  components: {
    MaterialButton
  },
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: 'Quantità'
    },
    placeholder: {
      type: String,
      default: 'Inserisci un numero'
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: 1
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
  methods: {
    handleInput(event) {
      let value = parseInt(event.target.value)

      // Gestione valori non validi
      if (isNaN(value)) {
        value = this.min
      }

      // Applica vincoli min/max
      value = Math.max(this.min, Math.min(this.max, value))

      this.$emit('update:modelValue', value)
    },

    increment() {
      const newValue = Math.min(this.max, this.modelValue + this.step)
      this.$emit('update:modelValue', newValue)
    },

    decrement() {
      const newValue = Math.max(this.min, this.modelValue - this.step)
      this.$emit('update:modelValue', newValue)
    }
  }
}
</script>

<style scoped>
.material-number-input {
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
  z-index: 1;
}

.label-active {
  transform: translateY(-18px) scale(0.85);
  color: var(--vp-c-brand);
  background-color: var(--vp-c-bg);
  font-weight: 500;
}


.number-input {
  font-size: 16px;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  flex: 1;
  padding: 4px 0;
  min-width: 0;
  -moz-appearance: textfield;
}

/* Rimuove le frecce dagli input number */
.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.number-button {
  flex-shrink: 0;
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

/* Responsive */
@media (max-width: 480px) {
  .input-label {
    font-size: 14px;
  }

  .number-input {
    font-size: 14px;
  }

  .input-content {
    gap: 4px;
  }
}
</style>