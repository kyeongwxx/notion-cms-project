/**
 * Notion API 클라이언트 초기화 및 Rate Limiter
 *
 * Notion API는 3 requests/second 제한이 있어, Rate Limiter로
 * 요청 속도를 제어합니다. 싱글톤 패턴으로 Client 인스턴스를 관리합니다.
 *
 * @module lib/notion/client
 */

import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

// ============================================================================
// Rate Limiter 클래스
// ============================================================================

/**
 * Notion API Rate Limiter
 *
 * Notion API는 3 requests/second 제한이 있습니다.
 * 이 클래스는 요청을 큐에 쌓고, 제한 속도에 맞춰 순차적으로 실행합니다.
 *
 * @example
 * ```typescript
 * const limiter = new NotionRateLimiter(3) // 3 requests/second
 * const result = await limiter.execute(() => notion.databases.query(...))
 * ```
 */
export class NotionRateLimiter {
  /** 대기 중인 요청 큐 */
  private queue: Array<{
    fn: () => Promise<unknown>
    resolve: (value: unknown) => void
    reject: (error: unknown) => void
  }> = []

  /** 큐 처리 중 여부 */
  private processing = false

  /** 요청 간 최소 간격 (ms) */
  private readonly interval: number

  /**
   * Rate Limiter 생성자
   *
   * @param requestsPerSecond - 초당 최대 요청 수 (기본값: 3)
   */
  constructor(requestsPerSecond = 3) {
    this.interval = 1000 / requestsPerSecond
  }

  /**
   * Rate Limit을 적용하여 함수 실행
   *
   * 함수를 큐에 추가하고, 순서대로 실행합니다.
   * 각 요청은 최소 interval(ms)만큼의 간격을 두고 실행됩니다.
   *
   * @param fn - 실행할 비동기 함수
   * @returns 함수 실행 결과
   *
   * @example
   * ```typescript
   * const posts = await rateLimiter.execute(() =>
   *   notion.databases.query({ database_id: 'xxx' })
   * )
   * ```
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        fn: fn as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      })

      // 큐 처리 시작
      void this.processQueue()
    })
  }

  /**
   * 큐에 있는 요청을 순차적으로 처리
   *
   * @private
   */
  private async processQueue(): Promise<void> {
    // 이미 처리 중이거나 큐가 비어있으면 종료
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (!task) break

      try {
        // 요청 실행
        const result = await task.fn()
        task.resolve(result)
      } catch (error) {
        task.reject(error)
      }

      // 다음 요청까지 대기 (Rate Limit 준수)
      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.interval))
      }
    }

    this.processing = false
  }

  /**
   * 현재 큐에 대기 중인 요청 개수 반환
   *
   * @returns 대기 중인 요청 개수
   */
  getQueueSize(): number {
    return this.queue.length
  }

  /**
   * 큐 처리 중 여부 반환
   *
   * @returns 처리 중 여부
   */
  isProcessing(): boolean {
    return this.processing
  }
}

// ============================================================================
// Notion Client 싱글톤
// ============================================================================

/**
 * Notion API 클라이언트 인스턴스 (싱글톤)
 *
 * 애플리케이션 전체에서 하나의 클라이언트 인스턴스를 공유합니다.
 */
let notionClientInstance: Client | null = null

/**
 * Rate Limiter 인스턴스 (싱글톤)
 *
 * 애플리케이션 전체에서 하나의 Rate Limiter 인스턴스를 공유합니다.
 */
let rateLimiterInstance: NotionRateLimiter | null = null

/**
 * Notion API 클라이언트 초기화
 *
 * 환경 변수에서 API 키를 읽어와 클라이언트를 생성합니다.
 * 싱글톤 패턴으로 한 번만 생성되며, 이후 호출 시 기존 인스턴스를 반환합니다.
 *
 * @returns Notion Client 인스턴스
 *
 * @example
 * ```typescript
 * const notion = getNotionClient()
 * const response = await notion.databases.query(...)
 * ```
 */
export function getNotionClient(): Client {
  if (!notionClientInstance) {
    notionClientInstance = new Client({
      auth: env.NOTION_API_KEY,
      // Notion API 타임아웃 설정 (10초)
      timeoutMs: 10000,
    })

    // 개발 환경에서 클라이언트 초기화 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Notion API 클라이언트 초기화 완료')
      console.log(`   - API Key: ${maskApiKey(env.NOTION_API_KEY)}`)
      console.log(`   - Database ID: ${env.NOTION_DATABASE_ID}`)
      console.log(
        `   - Rate Limit: ${env.NOTION_RATE_LIMIT || 3} requests/second`
      )
      console.log(`   - Timeout: 10초\n`)
    }
  }

  return notionClientInstance
}

/**
 * Rate Limiter 인스턴스 반환
 *
 * 싱글톤 패턴으로 한 번만 생성되며, 이후 호출 시 기존 인스턴스를 반환합니다.
 *
 * @returns Rate Limiter 인스턴스
 *
 * @example
 * ```typescript
 * const limiter = getRateLimiter()
 * const result = await limiter.execute(() => notion.databases.query(...))
 * ```
 */
export function getRateLimiter(): NotionRateLimiter {
  if (!rateLimiterInstance) {
    const requestsPerSecond = env.NOTION_RATE_LIMIT || 3
    rateLimiterInstance = new NotionRateLimiter(requestsPerSecond)

    // 개발 환경에서 Rate Limiter 초기화 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Notion Rate Limiter 초기화 완료')
      console.log(`   - Rate: ${requestsPerSecond} requests/second`)
      console.log(
        `   - Interval: ${1000 / requestsPerSecond}ms per request\n`
      )
    }
  }

  return rateLimiterInstance
}

/**
 * Rate Limit을 적용한 Notion API 호출
 *
 * Rate Limiter를 통해 요청 속도를 제어하면서 Notion API를 호출합니다.
 * 모든 Notion API 호출은 이 함수를 통해 실행되어야 합니다.
 *
 * @param fn - Notion API 호출 함수
 * @returns API 호출 결과
 *
 * @example
 * ```typescript
 * const response = await notionCall(() =>
 *   getNotionClient().databases.query({ database_id: 'xxx' })
 * )
 * ```
 */
export async function notionCall<T>(fn: () => Promise<T>): Promise<T> {
  const limiter = getRateLimiter()
  return limiter.execute(fn)
}

/**
 * Notion 클라이언트 및 Rate Limiter 리셋
 *
 * 테스트 또는 클라이언트 재초기화 시 사용합니다.
 * 일반적으로 프로덕션에서는 사용하지 않습니다.
 *
 * @example
 * ```typescript
 * resetNotionClient() // 클라이언트 리셋
 * const newClient = getNotionClient() // 새 클라이언트 생성
 * ```
 */
export function resetNotionClient(): void {
  notionClientInstance = null
  rateLimiterInstance = null

  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Notion 클라이언트 및 Rate Limiter 리셋 완료\n')
  }
}

// ============================================================================
// 헬퍼 함수
// ============================================================================

/**
 * API 키 마스킹 헬퍼
 *
 * API 키의 일부를 마스킹하여 안전하게 로그에 출력합니다.
 *
 * @param apiKey - 마스킹할 API 키
 * @returns 마스킹된 API 키 (예: "ntn_66237...CHKzfT5")
 */
function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 10) {
    return '***'
  }

  const prefix = apiKey.slice(0, 9)
  const suffix = apiKey.slice(-7)
  return `${prefix}...${suffix}`
}

/**
 * Notion 클라이언트 상태 정보 반환
 *
 * 개발/디버깅 용도로 현재 클라이언트 상태를 확인합니다.
 *
 * @returns 클라이언트 상태 정보
 */
export function getClientStatus(): {
  initialized: boolean
  queueSize: number
  isProcessing: boolean
  rateLimitPerSecond: number
} {
  return {
    initialized: notionClientInstance !== null,
    queueSize: rateLimiterInstance?.getQueueSize() ?? 0,
    isProcessing: rateLimiterInstance?.isProcessing() ?? false,
    rateLimitPerSecond: env.NOTION_RATE_LIMIT || 3,
  }
}
