import { render, RenderOptions, screen } from '@testing-library/react'
import { ReactElement } from 'react'
import userEvent from '@testing-library/user-event'

/**
 * Custom render function that can be extended with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    // Add providers here if needed (e.g., ThemeProvider, QueryClientProvider)
    return <>{children}</>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Helper to test all variants of a CVA component
 *
 * @example
 * const variants = ['default', 'destructive', 'outline'] as const
 * testAllVariants(Button, 'variant', variants, { children: 'Click' })
 */
export function testAllVariants<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  variantProp: keyof T,
  variants: Array<T[keyof T]>,
  baseProps: Partial<T> = {}
) {
  return variants.map((variant) => ({
    variant,
    props: { ...baseProps, [variantProp]: variant } as T,
  }))
}

/**
 * Helper to fill and submit a form
 *
 * @example
 * const user = userEvent.setup()
 * await fillAndSubmitForm(user, {
 *   '이름': '홍길동',
 *   '이메일': 'test@example.com'
 * })
 */
export async function fillAndSubmitForm(
  user: ReturnType<typeof userEvent.setup>,
  fields: Record<string, string>,
  submitButtonText: string | RegExp = /전송|제출/i
) {
  for (const [label, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(new RegExp(label, 'i'))
    await user.clear(input)
    await user.type(input, value)
  }

  const submitButton = screen.getByRole('button', { name: submitButtonText })
  await user.click(submitButton)
}

/**
 * Helper to wait for an element to be removed
 */
export { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

/**
 * Re-export commonly used testing utilities
 */
export { render, screen } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
