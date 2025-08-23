<template>
  <div class="material-user-edit" :class="{ 'dark-mode': isDark }">
    <div class="user-edit-content w-full">
      <div class="flex flex-grow sm:flex-row sm:items-end gap-3 w-full items-center">
        <div class="flex-grow sm:w-auto">
            <MaterialTextInput
                class="flex-grow"
                v-model="nickname"
                :label="`Giocatore ${index + 1}`"
                placeholder="Inserisci nickname"
                @update:modelValue="handleNicknameChange"
            />
        </div>
      
      <div class="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
        <MaterialButton
            icon="PLUS"
            color-scheme="PRIMARY"
            size="small"
            :disabled="!nickname.trim()"
            @click="addUser"
            class="add-button"
        />
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useData } from 'vitepress'
import MaterialTextInput from './MaterialTextInput.vue'
import MaterialButton from './MaterialButton.vue'

export default {
  name: 'MaterialUserEdit',
  components: {
    MaterialTextInput,
    MaterialButton
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      required: true
    },
    deletable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'add-user'],
  setup() {
    const { isDark } = useData()
    return { isDark }
  },
  data() {
    return {
      nickname: this.modelValue
    }
  },
  watch: {
    modelValue(newVal) {
      this.nickname = newVal
    }
  },
  methods: {
    handleNicknameChange(newVal) {
      this.$emit('update:modelValue', newVal)
    },
    
    addUser() {
      if (this.nickname.trim()) {
        this.$emit('add-user', this.nickname.trim())
        this.nickname = ''
      }
    }
  }
}
</script>

<style scoped>
.material-user-edit {
  margin-bottom: 16px;
}

.user-edit-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-button {
  flex-shrink: 0;
  margin-bottom: 8px;
}

@media (max-width: 480px) {
  .user-edit-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .add-button {
    align-self: flex-end;
    margin-bottom: 0;
  }
}
</style>