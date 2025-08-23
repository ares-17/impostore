---
outline: deep
---

# Create Party
## Aggiungi Nuove Opzioni

<MaterialUserEdit />
<MaterialUserEdit />
<MaterialNumberInput
  v-model="quantity"
  label="Numero impostori"
  placeholder=""
  :max="10"
  :min="0"
  :step="1"
  @update:modelValue="handleQuantityChange"
/>

<div class="current-value">
  Valore attuale: {{ quantity }}
</div>

<div class="user-avatars-demo">
  <h2>Avatar Utenti</h2>
  
  <div class="avatars-grid">
    <MaterialUserAvatar
      nickname="Mario Rossi"
      :size="72"
      :clickable="true"
      @avatar-click="handleAvatarClick"
    />
    <MaterialUserAvatar
      nickname="Luigi Verdi"
      :size="72"
    />
    <MaterialUserAvatar
      nickname="Anna Bianchi"
      :size="72"
      :clickable="true"
      @avatar-click="handleAvatarClick"
    />
    <MaterialUserAvatar
      nickname="GP"
      :size="72"
    />
        <MaterialUserAvatar
      nickname="GP"
      :size="72"
    />
  </div>
</div>

<MaterialTextButton
  text="Click me"
  color-scheme="primary"
  @click="showModal = true"
/>

<MaterialModal
  v-model:show="showModal"
  title="Example Modal"
  @confirm="handleConfirm"
  @close="handleClose"
>
  <p>This is the modal content. You can put any components here.</p>
</MaterialModal>

<div class="toast-buttons">
  <MaterialTextButton
    text="Show Success"
    color-scheme="primary"
    @click="showToast('success', 'Operation completed successfully!')"
  />
  <MaterialTextButton
    text="Show Warning"
    color-scheme="secondary"
    @click="showToast('warning', 'This is a warning message.')"
  />
  <MaterialTextButton
    text="Show Error"
    color-scheme="outline"
    @click="showToast('error', 'An error occurred!')"
  />
</div>

<MaterialToast
  v-model:show="toastVisible"
  :message="toastMessage"
  :type="toastType"
/>
<div class="option-creator">

  <div class="current-options">
    <h3>Opzioni attuali:</h3>
    <ul>
      <li v-for="(option, index) in options" :key="index">
        {{ option.label }} ({{ option.value }})
      </li>
    </ul>
  </div>

  <MaterialDropdownFilled 
    :options="options" 
    v-model="selectedOption"
    label="Scegli un'opzione"
    placeholder="Seleziona dal menu"
  />
</div>

<script setup>
import { ref } from 'vue'

const newOptionText = ref('')
const options = ref([
  { label: 'Opzione 1', value: 'option1' },
  { label: 'Opzione 2', value: 'option2' }
])
const selectedOption = ref(null)

const addOption = () => {
  if (newOptionText.value.trim()) {
    const newValue = 'option' + (options.value.length + 1)
    options.value.push({
      label: newOptionText.value.trim(),
      value: newValue
    })
    newOptionText.value = ''
  }
}

const showModal = ref(false)

const handleConfirm = () => {
  console.log('Modal confirmed!')
  showModal.value = false
}

const handleClose = () => {
  console.log('Modal closed!')
}

const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const showToast = (type, message) => {
  toastType.value = type
  toastMessage.value = message
  toastVisible.value = true
}
</script>

<style>
.option-creator {
  max-width: 500px;
  margin: 0 auto;
}

.current-options {
  margin: 24px 0;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.current-options h3 {
  margin-top: 0;
}

.current-options ul {
  margin-bottom: 0;
}

.user-avatars-demo {
  padding: 24px;
  text-align: center;
}

.avatars-grid {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 16px;
}
</style>