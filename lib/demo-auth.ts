// Demo authentication for testing purposes
// Remove this in production when Supabase is properly configured

export interface DemoUser {
  id: string
  email: string
  password: string
}

const DEMO_USERS: Map<string, DemoUser> = new Map()

export function demoSignUp(email: string, password: string) {
  const id = Math.random().toString(36).substring(2, 15)
  const user: DemoUser = { id, email, password }
  DEMO_USERS.set(email, user)
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}')
    users[email] = user
    localStorage.setItem('demo_users', JSON.stringify(users))
    localStorage.setItem('demo_auth_user', JSON.stringify(user))
  }
  return user
}

export function demoLogin(email: string, password: string): DemoUser | null {
  if (typeof window !== 'undefined') {
    const users = JSON.parse(localStorage.getItem('demo_users') || '{}')
    const user = users[email]
    if (user && user.password === password) {
      localStorage.setItem('demo_auth_user', JSON.stringify(user))
      return user
    }
  }
  return null
}

export function demoGetUser(): DemoUser | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('demo_auth_user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function demoLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_auth_user')
  }
}
