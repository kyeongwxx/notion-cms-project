import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    systemTheme: 'light',
    themes: ['light', 'dark'],
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock lucide-react icons (prevents snapshot bloat)
vi.mock('lucide-react', () => {
  const MockIcon = ({ 'data-testid': testId }: { 'data-testid': string }) => (
    <svg data-testid={testId} />
  )

  return {
    Moon: () => MockIcon({ 'data-testid': 'moon-icon' }),
    Sun: () => MockIcon({ 'data-testid': 'sun-icon' }),
    Menu: () => MockIcon({ 'data-testid': 'menu-icon' }),
    MessageSquare: () => MockIcon({ 'data-testid': 'message-icon' }),
    Check: () => MockIcon({ 'data-testid': 'check-icon' }),
    ChevronRight: () => MockIcon({ 'data-testid': 'chevron-icon' }),
    ArrowRight: () => MockIcon({ 'data-testid': 'arrow-right-icon' }),
    Zap: () => MockIcon({ 'data-testid': 'zap-icon' }),
    Shield: () => MockIcon({ 'data-testid': 'shield-icon' }),
    Sparkles: () => MockIcon({ 'data-testid': 'sparkles-icon' }),
    Users: () => MockIcon({ 'data-testid': 'users-icon' }),
    Rocket: () => MockIcon({ 'data-testid': 'rocket-icon' }),
    Mail: () => MockIcon({ 'data-testid': 'mail-icon' }),
    Github: () => MockIcon({ 'data-testid': 'github-icon' }),
  }
})

// Mock IntersectionObserver (for lazy loading tests)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock window.matchMedia (for responsive tests)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
