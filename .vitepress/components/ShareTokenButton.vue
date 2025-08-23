<template>
  <div>
    <MaterialTextButton
      text="Condividi Token"
      color-scheme="outline"
      :disabled="!token"
      @click="shareToken"
    />
    <MaterialToast
      v-model:show="showToast"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script>
import MaterialTextButton from './MaterialTextButton.vue'
import MaterialToast from './MaterialToast.vue'

export default {
  name: 'ShareTokenButton',
  components: { MaterialTextButton, MaterialToast },
  props: {
    token: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showToast: false,
      toastMessage: '',
      toastType: 'success'
    }
  },
  methods: {
    async shareToken() {
      if (!this.token) return

      const shareData = {
        title: 'Partecipa al gioco!',
        text: `Unisciti alla partita con questo token: ${this.token}`,
        url: window.location.origin
      }

      if (navigator.share) {
        try {
          await navigator.share(shareData)
        } catch (err) {
          this.showToastMessage('Condivisione annullata o fallita', 'error')
        }
      } else {
        // fallback: copia negli appunti
        try {
          await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
          this.showToastMessage('Token copiato negli appunti!', 'success')
        } catch (err) {
          this.showToastMessage('Impossibile copiare il token', 'error')
        }
      }
    },
    showToastMessage(msg, type='success') {
      this.toastMessage = msg
      this.toastType = type
      this.showToast = true
    }
  }
}
</script>
