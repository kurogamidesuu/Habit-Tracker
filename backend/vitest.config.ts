import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['dist/**', 'node_modules/**'],
    env: {
      GOOGLE_CLIENT_ID: 'mock-google-client-id-for-testing',
      GOOGLE_CLIENT_SECRET: 'mock-google-client-secret-for-testing',
      JWT_SECRET: 'mock-jwt-secret-for-testing',
    },
  }
})