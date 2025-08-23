<template>
  <div class="material-dropdown-filled" :class="{ 'dropdown-open': isOpen, 'dark-mode': isDark }">
    <!-- Label fisso sopra -->
    <label class="dropdown-label-fixed">{{ label }}</label>

    <!-- Campo selezione -->
    <div class="dropdown-field" @click="toggleDropdown">
      <div class="selected-value">{{ selectedLabel || placeholder }}</div>
      <div class="dropdown-arrow" :class="{ 'arrow-active': isOpen }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Menu opzioni -->
    <transition name="dropdown-transition">
      <div v-if="isOpen && filteredOptions.length > 0" class="dropdown-menu">
        <div class="menu-content">
          <div 
            v-for="option in filteredOptions" 
            :key="option.value" 
            class="menu-item"
            :class="{ 'menu-item-active': option.value === selectedValue }"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </transition>

    <!-- Nessuna opzione -->
    <transition name="dropdown-transition">
      <div v-if="isOpen && filteredOptions.length === 0" class="dropdown-menu">
        <div class="menu-content">
          <div class="menu-item menu-item-empty">
            Nessuna opzione disponibile
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useData } from 'vitepress'

export default {
  name: 'MaterialDropdownFilled',
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
      validator: (value) => {
        return Array.isArray(value) && value.every(opt => 
          opt && typeof opt === 'object' && 'label' in opt && 'value' in opt
        )
      }
    },
    placeholder: {
      type: String,
      default: 'Seleziona un\'opzione'
    },
    label: {
      type: String,
      default: 'Etichetta'
    },
    modelValue: {
      type: [String, Number, Object],
      default: null
    }
  },
  emits: ['update:modelValue'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  data() {
    return {
      isOpen: false,
      selectedValue: this.modelValue
    }
  },
  computed: {
    selectedLabel() {
      if (!this.selectedValue) return null
      const selectedOption = this.filteredOptions.find(opt => opt.value === this.selectedValue)
      return selectedOption ? selectedOption.label : null
    },
    filteredOptions() {
      return this.options
        .filter(opt => opt && typeof opt === 'object' && opt.label && opt.value !== undefined)
        .filter((opt, index, self) => 
          self.findIndex(o => o.value === opt.value) === index
        )
    }
  },
  watch: {
    modelValue(newValue) {
      this.selectedValue = newValue
    },
    options: {
      immediate: true,
      handler(newOptions) {
        if (this.selectedValue && newOptions.length > 0) {
          const optionExists = newOptions.some(opt => opt.value === this.selectedValue)
          if (!optionExists) {
            this.selectedValue = null
            this.$emit('update:modelValue', null)
          }
        }
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    toggleDropdown(event) {
      event.stopPropagation()
      if (this.filteredOptions.length > 0) {
        this.isOpen = !this.isOpen
      }
    },
    selectOption(option) {
      if (!option || !option.value) return
      this.selectedValue = option.value
      this.$emit('update:modelValue', option.value)
      this.isOpen = false
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false
      }
    },
    handleResize() {
      if (window.innerWidth < 768 && this.isOpen) {
        this.isOpen = false
      }
    }
  }
}
</script>

<style scoped>
.material-dropdown-filled {
  position: relative;
  margin: 16px 0;
  font-family: 'Roboto', sans-serif;
  max-width: 100%;
}

/* Label fisso */
.dropdown-label-fixed {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.dropdown-field {
  position: relative;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--vp-c-bg-soft);
  min-height: 48px;
  display: flex;
  align-items: center;
}

.dropdown-field:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.dropdown-open .dropdown-field {
  border-color: var(--vp-c-brand);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.selected-value {
  font-size: 16px;
  color: var(--vp-c-text-1);
  padding-right: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.dropdown-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-2);
  transition: transform 0.3s ease;
  pointer-events: none;
}

.arrow-active {
  transform: translateY(-50%) rotate(180deg);
  color: var(--vp-c-brand);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.menu-content {
  padding: 8px 0;
}

.menu-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.menu-item:hover {
  background-color: var(--vp-c-default-soft);
}

.menu-item-active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.menu-item-empty {
  cursor: default;
  color: var(--vp-c-text-2);
  font-style: italic;
  text-align: center;
}

/* Transizioni */
.dropdown-transition-enter-active,
.dropdown-transition-leave-active {
  transition: all 0.3s ease;
  transform-origin: top center;
}

.dropdown-transition-enter-from,
.dropdown-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .dropdown-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 300px;
    max-height: 60vh;
    z-index: 1001;
  }
}

@media (max-width: 480px) {
  .selected-value {
    font-size: 14px;
  }
  .menu-item {
    padding: 10px 14px;
    font-size: 14px;
  }
}

/* Dark mode */
.dark-mode .dropdown-field {
  background-color: var(--vp-c-bg-soft-up);
  border-color: var(--vp-c-divider);
}
</style>
