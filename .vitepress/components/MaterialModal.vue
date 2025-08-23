<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container" :class="{ 'dark-mode': isDark }">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <div class="modal-footer">
          <slot name="footer">
            <MaterialTextButton
              v-if="showCancel"
              text="Cancel"
              color-scheme="outline"
              @click="closeModal"
            />
            <MaterialTextButton
              text="Confirm"
              color-scheme="primary"
              @click="$emit('confirm')"
            />
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useData } from 'vitepress'
import MaterialTextButton from './MaterialTextButton.vue'

export default {
  name: 'MaterialModal',
  components: {
    MaterialTextButton
  },
  props: {
    showCancel: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Modal Title'
    }
  },
  emits: ['update:show', 'confirm', 'close'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  methods: {
    closeModal() {
      this.$emit('update:show', false)
      this.$emit('close')
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-container {
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px 16px;
  border-bottom: 1px solid var(--vp-c-border);
  h2 {
    border: none;
  }
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: var(--vp-c-text-1);

}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding-top: 24px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: var(--vp-c-default-soft);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  padding: 16px 24px;
  border-top: none;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}

/* Dark mode adjustments */
.dark-mode .modal-container {
  background-color: var(--vp-c-bg-soft-up);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
</style>