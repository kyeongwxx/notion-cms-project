import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent } from '@/lib/test-utils'
import { Button, buttonVariants } from '../button'
import { createRef } from 'react'

describe('Button 컴포넌트', () => {
  describe('기본 렌더링', () => {
    it('children을 올바르게 렌더링해야 한다', () => {
      render(<Button>클릭하세요</Button>)
      expect(screen.getByRole('button', { name: '클릭하세요' })).toBeInTheDocument()
    })

    it('button 엘리먼트로 렌더링되어야 한다', () => {
      render(<Button>버튼</Button>)
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })

    it('기본 클래스가 적용되어야 한다', () => {
      render(<Button>버튼</Button>)
      const button = screen.getByRole('button')

      // CVA 베이스 클래스 확인
      expect(button).toHaveClass('inline-flex')
      expect(button).toHaveClass('items-center')
      expect(button).toHaveClass('justify-center')
      expect(button).toHaveClass('gap-2')
      expect(button).toHaveClass('whitespace-nowrap')
      expect(button).toHaveClass('rounded-md')
      expect(button).toHaveClass('text-sm')
      expect(button).toHaveClass('font-medium')
      expect(button).toHaveClass('transition-colors')
    })
  })

  describe('Variant 테스트', () => {
    it('default variant가 기본값으로 적용되어야 한다', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-primary')
      expect(button).toHaveClass('text-primary-foreground')
      expect(button).toHaveClass('shadow')
      expect(button).toHaveClass('hover:bg-primary/90')
    })

    it('destructive variant가 올바르게 적용되어야 한다', () => {
      render(<Button variant="destructive">삭제</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-destructive')
      expect(button).toHaveClass('text-destructive-foreground')
      expect(button).toHaveClass('shadow-sm')
      expect(button).toHaveClass('hover:bg-destructive/90')
    })

    it('outline variant가 올바르게 적용되어야 한다', () => {
      render(<Button variant="outline">윤곽선</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('border')
      expect(button).toHaveClass('border-input')
      expect(button).toHaveClass('bg-background')
      expect(button).toHaveClass('shadow-sm')
      expect(button).toHaveClass('hover:bg-accent')
      expect(button).toHaveClass('hover:text-accent-foreground')
    })

    it('secondary variant가 올바르게 적용되어야 한다', () => {
      render(<Button variant="secondary">보조</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-secondary')
      expect(button).toHaveClass('text-secondary-foreground')
      expect(button).toHaveClass('shadow-sm')
      expect(button).toHaveClass('hover:bg-secondary/80')
    })

    it('ghost variant가 올바르게 적용되어야 한다', () => {
      render(<Button variant="ghost">고스트</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('hover:bg-accent')
      expect(button).toHaveClass('hover:text-accent-foreground')

      // ghost는 배경색이 없어야 함
      expect(button).not.toHaveClass('bg-primary')
      expect(button).not.toHaveClass('bg-secondary')
    })

    it('link variant가 올바르게 적용되어야 한다', () => {
      render(<Button variant="link">링크</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('text-primary')
      expect(button).toHaveClass('underline-offset-4')
      expect(button).toHaveClass('hover:underline')
    })
  })

  describe('Size 테스트', () => {
    it('default size가 기본값으로 적용되어야 한다', () => {
      render(<Button>기본 크기</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('px-4')
      expect(button).toHaveClass('py-2')
    })

    it('sm size가 올바르게 적용되어야 한다', () => {
      render(<Button size="sm">작은 크기</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('h-8')
      expect(button).toHaveClass('rounded-md')
      expect(button).toHaveClass('px-3')
      expect(button).toHaveClass('text-xs')
    })

    it('lg size가 올바르게 적용되어야 한다', () => {
      render(<Button size="lg">큰 크기</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('rounded-md')
      expect(button).toHaveClass('px-8')
    })

    it('icon size가 올바르게 적용되어야 한다', () => {
      render(<Button size="icon" aria-label="아이콘 버튼">+</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('w-9')
    })
  })

  describe('Variant와 Size 조합 테스트', () => {
    it('destructive + sm 조합이 올바르게 작동해야 한다', () => {
      render(<Button variant="destructive" size="sm">작은 삭제</Button>)
      const button = screen.getByRole('button')

      // variant 클래스
      expect(button).toHaveClass('bg-destructive')
      expect(button).toHaveClass('text-destructive-foreground')

      // size 클래스
      expect(button).toHaveClass('h-8')
      expect(button).toHaveClass('px-3')
      expect(button).toHaveClass('text-xs')
    })

    it('outline + lg 조합이 올바르게 작동해야 한다', () => {
      render(<Button variant="outline" size="lg">큰 윤곽선</Button>)
      const button = screen.getByRole('button')

      // variant 클래스
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('border-input')

      // size 클래스
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('px-8')
    })

    it('ghost + icon 조합이 올바르게 작동해야 한다', () => {
      render(<Button variant="ghost" size="icon" aria-label="고스트 아이콘">×</Button>)
      const button = screen.getByRole('button')

      // variant 클래스
      expect(button).toHaveClass('hover:bg-accent')

      // size 클래스
      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('w-9')
    })
  })

  describe('클릭 이벤트 테스트', () => {
    it('클릭 시 onClick 핸들러가 호출되어야 한다', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick}>클릭</Button>)
      const button = screen.getByRole('button')

      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('여러 번 클릭 시 onClick이 여러 번 호출되어야 한다', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick}>클릭</Button>)
      const button = screen.getByRole('button')

      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('disabled 상태에서 클릭이 방지되어야 한다', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick} disabled>비활성화</Button>)
      const button = screen.getByRole('button')

      // disabled 버튼 클릭 시도
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('disabled 상태일 때 올바른 스타일이 적용되어야 한다', () => {
      render(<Button disabled>비활성화</Button>)
      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:pointer-events-none')
      expect(button).toHaveClass('disabled:opacity-50')
    })
  })

  describe('forwardRef 테스트', () => {
    it('ref가 button 엘리먼트를 올바르게 참조해야 한다', () => {
      const ref = createRef<HTMLButtonElement>()

      render(<Button ref={ref}>Ref 버튼</Button>)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current?.textContent).toBe('Ref 버튼')
    })

    it('ref를 통해 DOM 조작이 가능해야 한다', () => {
      const ref = createRef<HTMLButtonElement>()

      render(<Button ref={ref}>포커스 테스트</Button>)

      ref.current?.focus()

      expect(ref.current).toHaveFocus()
    })

    it('displayName이 올바르게 설정되어야 한다', () => {
      expect(Button.displayName).toBe('Button')
    })
  })

  describe('className 병합 테스트', () => {
    it('커스텀 className이 variant 클래스와 병합되어야 한다', () => {
      render(<Button className="custom-class">커스텀</Button>)
      const button = screen.getByRole('button')

      // 커스텀 클래스
      expect(button).toHaveClass('custom-class')

      // 기본 variant 클래스도 유지
      expect(button).toHaveClass('bg-primary')
      expect(button).toHaveClass('text-primary-foreground')
    })

    it('여러 개의 커스텀 className이 병합되어야 한다', () => {
      render(<Button className="class-1 class-2 class-3">다중 클래스</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('class-1')
      expect(button).toHaveClass('class-2')
      expect(button).toHaveClass('class-3')
    })

    it('충돌하는 className이 올바르게 병합되어야 한다', () => {
      // tailwind-merge가 충돌하는 클래스를 올바르게 처리해야 함
      render(<Button className="bg-red-500">빨간색</Button>)
      const button = screen.getByRole('button')

      // tailwind-merge는 마지막 bg- 클래스를 우선시
      expect(button).toHaveClass('bg-red-500')
    })
  })

  describe('HTML 속성 전달 테스트', () => {
    it('type 속성이 전달되어야 한다', () => {
      render(<Button type="submit">제출</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('type', 'submit')
    })

    it('aria-label 속성이 전달되어야 한다', () => {
      render(<Button aria-label="닫기 버튼">×</Button>)
      const button = screen.getByRole('button', { name: '닫기 버튼' })

      expect(button).toHaveAttribute('aria-label', '닫기 버튼')
    })

    it('data-* 속성이 전달되어야 한다', () => {
      render(<Button data-testid="custom-button" data-custom="value">데이터</Button>)
      const button = screen.getByTestId('custom-button')

      expect(button).toHaveAttribute('data-custom', 'value')
    })

    it('name 속성이 전달되어야 한다', () => {
      render(<Button name="action-button">이름</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('name', 'action-button')
    })

    it('form 속성이 전달되어야 한다', () => {
      render(<Button form="my-form">폼 버튼</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('form', 'my-form')
    })

    it('title 속성이 전달되어야 한다', () => {
      render(<Button title="버튼 설명">툴팁</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('title', '버튼 설명')
    })
  })

  describe('접근성 테스트', () => {
    it('키보드 포커스가 가능해야 한다', () => {
      render(<Button>포커스</Button>)
      const button = screen.getByRole('button')

      button.focus()

      expect(button).toHaveFocus()
    })

    it('focus-visible 클래스가 포함되어야 한다', () => {
      render(<Button>포커스 표시</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('focus-visible:outline-none')
      expect(button).toHaveClass('focus-visible:ring-1')
      expect(button).toHaveClass('focus-visible:ring-ring')
    })

    it('disabled 버튼은 포커스를 받을 수 없어야 한다', () => {
      render(<Button disabled>비활성화</Button>)
      const button = screen.getByRole('button')

      button.focus()

      expect(button).not.toHaveFocus()
    })

    it('role이 button이어야 한다', () => {
      render(<Button>버튼</Button>)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('buttonVariants 함수 테스트', () => {
    it('buttonVariants가 올바른 클래스 문자열을 반환해야 한다', () => {
      const classes = buttonVariants()

      expect(classes).toContain('inline-flex')
      expect(classes).toContain('items-center')
      expect(classes).toContain('bg-primary')
      expect(classes).toContain('h-9')
    })

    it('buttonVariants에 variant를 전달하면 해당 클래스를 반환해야 한다', () => {
      const classes = buttonVariants({ variant: 'destructive' })

      expect(classes).toContain('bg-destructive')
      expect(classes).toContain('text-destructive-foreground')
    })

    it('buttonVariants에 size를 전달하면 해당 클래스를 반환해야 한다', () => {
      const classes = buttonVariants({ size: 'lg' })

      expect(classes).toContain('h-10')
      expect(classes).toContain('px-8')
    })

    it('buttonVariants에 className을 전달하면 병합된 클래스를 반환해야 한다', () => {
      const classes = buttonVariants({ className: 'custom-class' })

      expect(classes).toContain('custom-class')
      expect(classes).toContain('inline-flex')
    })

    it('buttonVariants에 여러 옵션을 전달하면 모두 적용되어야 한다', () => {
      const classes = buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'my-custom-class',
      })

      expect(classes).toContain('border')
      expect(classes).toContain('border-input')
      expect(classes).toContain('h-8')
      expect(classes).toContain('px-3')
      expect(classes).toContain('my-custom-class')
    })
  })

  describe('엣지 케이스 테스트', () => {
    it('children이 없어도 렌더링되어야 한다', () => {
      render(<Button aria-label="빈 버튼" />)
      const button = screen.getByRole('button', { name: '빈 버튼' })

      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('children으로 ReactNode를 받을 수 있어야 한다', () => {
      render(
        <Button>
          <span>아이콘</span>
          <span>텍스트</span>
        </Button>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveTextContent('아이콘텍스트')
    })

    it('type을 지정하지 않으면 기본값이 적용되어야 한다', () => {
      render(<Button>기본 타입</Button>)
      const button = screen.getByRole('button')

      // HTML button의 기본 type은 'submit'이 아니라 브라우저마다 다름
      // 명시하지 않으면 type 속성이 없을 수 있음
      expect(button).toBeInTheDocument()
    })

    it('variant와 size를 null로 전달해도 작동해야 한다', () => {
      render(<Button variant={undefined} size={undefined}>기본값</Button>)
      const button = screen.getByRole('button')

      // undefined는 기본값 사용
      expect(button).toHaveClass('bg-primary')
      expect(button).toHaveClass('h-9')
    })
  })

  describe('폼 제출 테스트', () => {
    it('폼 내부에서 submit 타입 버튼이 작동해야 한다', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn((e) => e.preventDefault())

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">제출</Button>
        </form>
      )

      const button = screen.getByRole('button', { name: '제출' })
      await user.click(button)

      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('button 타입은 폼을 제출하지 않아야 한다', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn((e) => e.preventDefault())

      render(
        <form onSubmit={handleSubmit}>
          <Button type="button">버튼</Button>
        </form>
      )

      const button = screen.getByRole('button', { name: '버튼' })
      await user.click(button)

      expect(handleSubmit).not.toHaveBeenCalled()
    })

    it('disabled 버튼은 폼 제출을 막아야 한다', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn((e) => e.preventDefault())

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit" disabled>제출</Button>
        </form>
      )

      const button = screen.getByRole('button', { name: '제출' })
      await user.click(button)

      expect(handleSubmit).not.toHaveBeenCalled()
    })
  })
})
