<template>
  <label class="material-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="checkmark"></span>
    <span class="label-text">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: 'MaterialCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.material-checkbox {
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  user-select: none;
  margin-bottom: 16px;
}

.material-checkbox input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-border);
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s ease;
  background-color: var(--vp-c-bg-soft);
}

.material-checkbox input:checked + .checkmark {
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.material-checkbox input:checked + .checkmark::after {
  display: block;
}

.label-text {
  font-size: 16px;
  color: var(--vp-c-text-1);
}
</style>
