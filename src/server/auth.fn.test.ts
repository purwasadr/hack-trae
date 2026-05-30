import { describe, expect, it } from 'vitest'

import { ServerFnError } from '@/lib/server-fn-error'

import { assertSession } from './auth.server'

describe('assertSession', () => {
  it('throws an unauthorized server error when the session is missing', () => {
    expect(() => assertSession(null)).toThrow(ServerFnError)
  })

  it('returns the session when it exists', () => {
    expect(assertSession({ user: { id: 'user-1' } })).toEqual({
      user: { id: 'user-1' },
    })
  })
})
