import { validate as emailValidator } from 'deep-email-validator'

export default defineEventHandler(async (event) => {
  const { emailList } = await readBody(event)
  const results = await validateEmails(emailList)
  return results
})

async function validateEmails(emailList: string[]) {
  const results = []

  for (const email of emailList) {
    const result = await emailValidator(email)
    results.push(result)
  }

  return results
}
