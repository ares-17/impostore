<template>
    <div class="flex flex-row sm:flex-row sm:items-end gap-3 w-full items-center">
        <div class="flex-grow sm:w-auto">
            <MaterialTextInput
                v-model="value"
                label="Informazioni giocatore"
                placeholder="Inserisci il nickname del giocatore"
            />
        </div>
        <div class="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
            <MaterialButton
                icon="PLUS"
                color-scheme="PRIMARY"
                size="medium"
                @click="addItem"
            />
        </div>
        <div class="mt-2 sm:mt-0 sm:ml-2 flex-shrink-0">
            <MaterialButton
                icon="MINUS"
                color-scheme="DANGER"
                size="medium"
                @click="removeItem"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue';

// Definizione delle variabili reattive
const value = ref<string>('');

// Definizione degli eventi emessi
const emit = defineEmits<{
    (e: 'add', option: string): void;
    (e: 'remove', option: string): void;
}>();

// Funzione per aggiungere un nuovo giocatore
const addItem = () => {
    if (value.value.trim()) {
        emit('add', value.value);
    }
};

// Funzione per rimuovere un giocatore
const removeItem = () => {
    if (value.value.trim()) {
        emit('remove', value.value);
    }
};
</script>
