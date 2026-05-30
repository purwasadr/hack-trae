interface ImportMetaEnv {
  readonly OPENROUTER_API_KEY: string
  readonly OPENROUTER_MODEL: string
  readonly OPENROUTER_APP_URL?: string
  readonly OPENROUTER_APP_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    OPENROUTER_API_KEY: string
    OPENROUTER_MODEL: string
    OPENROUTER_APP_URL?: string
    OPENROUTER_APP_NAME?: string
  }
}

export {}
