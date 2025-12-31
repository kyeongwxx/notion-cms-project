/**
 * Notion API 에러 핸들링 유틸리티
 *
 * Notion API 호출 시 발생하는 에러를 명확하고 개발자 친화적인
 * 메시지로 변환하고, 재시도 로직을 제공합니다.
 *
 * @module lib/notion/errors
 */

import {
  APIResponseError,
  UnknownHTTPResponseError,
  isNotionClientError,
} from '@notionhq/client'

// ============================================================================
// 커스텀 에러 클래스
// ============================================================================

/**
 * Notion API 에러 래퍼
 *
 * Notion API 에러를 애플리케이션에서 사용하기 쉬운 형태로 래핑합니다.
 */
export class NotionError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
    public readonly context?: string
  ) {
    super(message)
    this.name = 'NotionError'
  }
}

/**
 * 데이터 변환 에러
 *
 * Notion API 응답을 BlogPost로 변환하는 과정에서 발생하는 에러
 */
export class DataTransformError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly rawData?: unknown
  ) {
    super(message)
    this.name = 'DataTransformError'
  }
}

// ============================================================================
// 에러 핸들링 유틸리티
// ============================================================================

/**
 * Notion API 호출을 안전하게 래핑
 *
 * Notion API 에러를 잡아서 명확한 메시지로 변환합니다.
 * 모든 Notion API 호출은 이 함수로 래핑되어야 합니다.
 *
 * @param fn - Notion API 호출 함수
 * @param context - 에러 발생 시 표시할 컨텍스트 (예: "글 목록 조회")
 * @returns API 호출 결과
 * @throws {NotionError} 명확한 에러 메시지를 포함한 NotionError
 *
 * @example
 * ```typescript
 * const posts = await safeNotionCall(
 *   () => notion.databases.query({ database_id: 'xxx' }),
 *   '글 목록 조회'
 * )
 * ```
 */
export async function safeNotionCall<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    // APIResponseError: API 응답 에러 (400, 401, 404 등)
    if (error instanceof APIResponseError) {
      const status = error.status
      const code = error.code

      // 에러 코드별 명확한 메시지
      let message = `Notion API 에러 [${context}]`

      switch (code) {
        case 'unauthorized':
          message = `❌ Notion API 인증 실패 [${context}]: API 키가 올바르지 않거나 만료되었습니다.`
          break
        case 'restricted_resource':
          message = `❌ Notion 리소스 접근 거부 [${context}]: 데이터베이스에 대한 권한이 없습니다. Integration이 데이터베이스에 연결되었는지 확인하세요.`
          break
        case 'object_not_found':
          message = `❌ Notion 리소스를 찾을 수 없음 [${context}]: 데이터베이스 또는 페이지가 존재하지 않거나 삭제되었습니다.`
          break
        case 'rate_limited':
          message = `⚠️  Notion API Rate Limit 초과 [${context}]: 요청 속도를 줄여주세요. (3 requests/second)`
          break
        case 'invalid_request':
          message = `❌ 잘못된 Notion API 요청 [${context}]: ${error.message}`
          break
        case 'conflict_error':
          message = `⚠️  Notion API 충돌 에러 [${context}]: 동시 수정이 발생했습니다.`
          break
        case 'service_unavailable':
          message = `⚠️  Notion 서비스 일시 불가 [${context}]: 잠시 후 다시 시도해주세요.`
          break
        default:
          message = `❌ Notion API 에러 [${context}]: ${error.message} (코드: ${code})`
      }

      throw new NotionError(message, code, status, context)
    }

    // isNotionClientError로 클라이언트 에러 확인
    if (isNotionClientError(error)) {
      throw new NotionError(
        `❌ Notion 클라이언트 에러 [${context}]: ${error instanceof Error ? error.message : String(error)}. 환경 변수(NOTION_API_KEY, NOTION_DATABASE_ID)를 확인하세요.`,
        'client_error',
        undefined,
        context
      )
    }

    // UnknownHTTPResponseError: 알 수 없는 HTTP 에러
    if (error instanceof UnknownHTTPResponseError) {
      throw new NotionError(
        `❌ 알 수 없는 HTTP 에러 [${context}]: ${error.message}`,
        'unknown_http_error',
        undefined,
        context
      )
    }

    // 기타 에러
    throw new NotionError(
      `❌ 예상치 못한 에러 [${context}]: ${error instanceof Error ? error.message : String(error)}`,
      'unknown_error',
      undefined,
      context
    )
  }
}

/**
 * Exponential Backoff를 사용한 재시도 로직
 *
 * Rate Limit 초과 시 자동으로 재시도합니다.
 * 재시도 간격은 2^n 초로 증가합니다 (1초, 2초, 4초...).
 *
 * @param fn - 재시도할 함수
 * @param maxRetries - 최대 재시도 횟수 (기본값: 3)
 * @param initialDelay - 초기 재시도 지연 시간(ms) (기본값: 1000ms)
 * @returns 함수 실행 결과
 * @throws {NotionError} 최대 재시도 횟수 초과 시
 *
 * @example
 * ```typescript
 * const posts = await retryWithBackoff(
 *   () => notion.databases.query({ database_id: 'xxx' }),
 *   3,
 *   1000
 * )
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Rate Limit 에러인 경우에만 재시도
      if (
        error instanceof NotionError &&
        error.code === 'rate_limited' &&
        attempt < maxRetries - 1
      ) {
        const delay = initialDelay * Math.pow(2, attempt)
        console.warn(
          `⚠️  Rate Limit 초과. ${delay}ms 후 재시도합니다... (${attempt + 1}/${maxRetries})`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // Rate Limit 에러가 아니면 즉시 throw
      throw error
    }
  }

  // 최대 재시도 횟수 초과
  throw new NotionError(
    `❌ 최대 재시도 횟수 초과 (${maxRetries}회): ${lastError?.message}`,
    'max_retries_exceeded'
  )
}

/**
 * 여러 Promise를 병렬로 실행하되, 하나라도 실패하면 전체 실패
 *
 * Rate Limiter를 우회하지 않도록 주의하여 사용해야 합니다.
 * 일반적으로 서로 다른 리소스를 조회할 때만 사용하세요.
 *
 * @param promises - 실행할 Promise 배열
 * @param context - 에러 발생 시 표시할 컨텍스트
 * @returns Promise 결과 배열
 * @throws {NotionError} 하나라도 실패 시
 *
 * @example
 * ```typescript
 * const [posts, categories] = await safeParallelCalls([
 *   getPublishedPosts(),
 *   getCategories()
 * ], '초기 데이터 로드')
 * ```
 */
export async function safeParallelCalls<T extends unknown[]>(
  promises: [...{ [K in keyof T]: Promise<T[K]> }],
  context: string
): Promise<T> {
  try {
    return (await Promise.all(promises)) as T
  } catch (error) {
    if (error instanceof NotionError) {
      throw error
    }

    throw new NotionError(
      `❌ 병렬 호출 실패 [${context}]: ${error instanceof Error ? error.message : String(error)}`,
      'parallel_call_failed',
      undefined,
      context
    )
  }
}

/**
 * 에러가 NotionError인지 확인하는 타입 가드
 *
 * @param error - 확인할 에러
 * @returns NotionError 여부
 */
export function isNotionError(error: unknown): error is NotionError {
  return error instanceof NotionError
}

/**
 * 에러가 DataTransformError인지 확인하는 타입 가드
 *
 * @param error - 확인할 에러
 * @returns DataTransformError 여부
 */
export function isDataTransformError(
  error: unknown
): error is DataTransformError {
  return error instanceof DataTransformError
}

/**
 * 에러 로깅 헬퍼
 *
 * 개발 환경에서는 상세한 에러 정보를 출력하고,
 * 프로덕션에서는 간략한 메시지만 출력합니다.
 *
 * @param error - 로깅할 에러
 * @param context - 에러 발생 컨텍스트
 */
export function logNotionError(error: unknown, context?: string): void {
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isNotionError(error)) {
    console.error(`\n${'='.repeat(70)}`)
    console.error(`❌ Notion API 에러${context ? ` [${context}]` : ''}`)
    console.error('='.repeat(70))
    console.error(`메시지: ${error.message}`)
    if (error.code) console.error(`코드: ${error.code}`)
    if (error.status) console.error(`상태: ${error.status}`)
    if (isDevelopment && error.stack) {
      console.error(`\nStack Trace:\n${error.stack}`)
    }
    console.error('='.repeat(70) + '\n')
  } else if (isDataTransformError(error)) {
    console.error(`\n${'='.repeat(70)}`)
    console.error(`❌ 데이터 변환 에러${context ? ` [${context}]` : ''}`)
    console.error('='.repeat(70))
    console.error(`메시지: ${error.message}`)
    if (error.field) console.error(`필드: ${error.field}`)
    if (isDevelopment && error.rawData) {
      console.error(`\n원본 데이터:\n${JSON.stringify(error.rawData, null, 2)}`)
    }
    if (isDevelopment && error.stack) {
      console.error(`\nStack Trace:\n${error.stack}`)
    }
    console.error('='.repeat(70) + '\n')
  } else {
    console.error(`\n${'='.repeat(70)}`)
    console.error(`❌ 예상치 못한 에러${context ? ` [${context}]` : ''}`)
    console.error('='.repeat(70))
    console.error(error)
    console.error('='.repeat(70) + '\n')
  }
}
