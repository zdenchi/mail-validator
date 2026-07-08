<script setup lang="ts">
import type { validate as emailValidator } from 'deep-email-validator'

type ValidationResult = Awaited<ReturnType<typeof emailValidator>>

const emailsInput = ref('')
const submittedEmails = ref<string[]>([])
const results = ref<ValidationResult[]>([])
const loading = ref(false)

const submitEmails = async () => {
  const emailList = emailsInput.value
    .split(',')
    .map(email => email.trim())
    .filter(Boolean)

  if (emailList.length === 0) {
    submittedEmails.value = []
    results.value = []
    return
  }

  submittedEmails.value = emailList
  await validateEmails(emailList)
}

const validateEmails = async (emailList: string[]) => {
  loading.value = true
  try {
    const result = await $fetch('/api/validate', {
      method: 'POST',
      body: { emailList }
    })
    results.value = result
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-4 p-6">
    <h1 class="text-2xl font-semibold">
      Email Validator
    </h1>

    <div class="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
      <form
        class="space-y-4"
        @submit.prevent="submitEmails"
      >
        <UFormField
          label="Список email (через запятую)"
          name="emails"
        >
          <UTextarea
            v-model="emailsInput"
            :rows="10"
            autoresize
            class="w-full"
            placeholder="user1@example.com, user2@example.com"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="loading"
        >
          Проверить
        </UButton>
      </form>

      <USeparator orientation="vertical" class="h-48" />

      <section class="space-y-3">
        <h2 class="text-lg font-medium">
          Результаты
        </h2>

        <div
          v-if="results.length === 0"
          class="rounded-lg border border-default p-4 text-sm text-muted"
        >
          Пока нет результатов. Введи email и нажми "Проверить".
        </div>

        <ul
          v-else
          class="space-y-2"
        >
          <li
            v-for="(result, index) in results"
            :key="`${submittedEmails[index]}-${index}`"
            class="rounded-lg border border-default p-3"
          >
            <p class="font-mono text-sm">
              {{ submittedEmails[index] || 'unknown@email' }}
            </p>
            <p
              class="text-sm"
              :class="result.valid ? 'text-success' : 'text-error'"
            >
              {{ result.valid ? 'Валидный' : 'Невалидный' }}
            </p>
            <p
              v-if="result.reason"
              class="text-xs text-muted"
            >
              Причина: {{ result.reason }}
            </p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
