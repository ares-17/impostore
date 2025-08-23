<template>
  <transition name="toast-slide">
    <div v-if="show" class="toast-container" :class="[type, { 'dark-mode': isDark }]">
      <div class="toast-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path v-if="type === 'success'" d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path v-if="type === 'warning'" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path v-if="type === 'error'" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="toast-content">
        <p class="toast-message">{{ message }}</p>
      </div>
      <button class="toast-close" @click="closeToast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
import { useData } from 'vitepress'

export default {
  name: 'MaterialToast',
  props: {
    message: {
      type: String,
      default: 'Toast message'
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'warning', 'error'].includes(value)
    },
    show: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 4000
    }
  },
  emits: ['update:show', 'close'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  watch: {
    show(newVal) {
      if (newVal && this.duration > 0) {
        setTimeout(() => {
          this.closeToast()
        }, this.duration)
      }
    }
  },
  methods: {
    closeToast() {
      this.$emit('update:show', false)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 500px;
  z-index: 1001;
  animation: toast-in-right 0.3s ease;
}

.toast-container.success {
  background-color: #4caf50;
  color: white;
}

.toast-container.warning {
  background-color: #ff9800;
  color: white;
}

.toast-container.error {
  background-color: #f44336;
  color: white;
}

.toast-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.toast-content {
  flex-grow: 1;
}

.toast-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  margin-left: 12px;
  padding: 4px;
  border-radius: 4px;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
}

/* Animation */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes toast-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Dark mode adjustments */
.dark-mode.toast-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>