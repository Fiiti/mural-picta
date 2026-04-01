/**
 * API-Wrapper fuer alle Backend-Endpunkte des WallPanel-Servers.
 */

export async function getConfig() {
  const res = await fetch('/api/config')
  if (!res.ok) throw new Error('Fehler beim Laden der Konfiguration')
  return res.json()
}

export async function saveConfig(data) {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Fehler beim Speichern der Konfiguration')
  return res.json()
}

export async function getStatus() {
  const res = await fetch('/api/status')
  if (!res.ok) throw new Error('Fehler beim Laden des Status')
  return res.json()
}

export async function restartServer() {
  const res = await fetch('/api/restart', { method: 'POST' })
  if (!res.ok) throw new Error('Fehler beim Neustart')
  return res.json()
}

export async function getAuthStatus() {
  const res = await fetch('/api/auth-status')
  if (!res.ok) return { requiresPin: false, pinSet: false }
  return res.json()
}

export async function login(pin) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  })
  return res.ok
}

export async function logout() {
  const res = await fetch('/api/logout', { method: 'POST' })
  return res.ok
}

export async function setPin(pin) {
  const res = await fetch('/api/set-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  })
  return res.ok
}

export async function removePin() {
  const res = await fetch('/api/remove-pin', { method: 'POST' })
  return res.ok
}
