'use client'

import { useEffect, useState } from 'react'

export default function TwoFactorSetupPage() {
  const [secret, setSecret] = useState<string | null>(null)

  useEffect(() => {
    const fetchSecret = async () => {
      const res = await fetch('/api/2fa/setup')
      const data = await res.json()
      setSecret(data.secret)
    }

    fetchSecret()
  }, [])

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Ativar 2FA</h1>

      {secret ? (
        <code
          style={{
            fontSize: 24,
            backgroundColor: '#f0f0f0',
            padding: '12px 24px',
            borderRadius: 8,
            userSelect: 'all',
            cursor: 'pointer',
          }}
          title="Clique e copie o código secreto"
          onClick={() => {
            navigator.clipboard.writeText(secret)
          }}
        >
          {secret}
        </code>
      ) : (
        <p>Gerando código secreto...</p>
      )}

      <p style={{ marginTop: 12, color: '#666' }}>
        Copie este código e cole no seu aplicativo autenticador.
      </p>
    </main>
  )
}
