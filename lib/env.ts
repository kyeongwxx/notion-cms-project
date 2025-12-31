/**
 * 환경 변수 유효성 검사 및 타입 안전 접근
 *
 * 이 모듈은 Notion API 연동에 필요한 환경 변수의 존재 여부를 검증하고,
 * 타입 안전한 방식으로 환경 변수에 접근할 수 있도록 합니다.
 *
 * @module lib/env
 * @requires zod - 환경 변수 스키마 검증
 */

import { z } from 'zod'

/**
 * 환경 변수 스키마 정의
 *
 * Notion API 연동에 필요한 환경 변수를 정의하고 검증합니다.
 * 앱 시작 시점에 자동으로 검증되어, 누락된 환경 변수가 있으면
 * 명확한 에러 메시지를 표시합니다.
 */
const envSchema = z.object({
  /**
   * Notion Integration Token
   *
   * - 형식: ntn_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   * - 발급: https://www.notion.so/my-integrations
   * - 필수: true
   */
  NOTION_API_KEY: z
    .string()
    .min(1, '❌ NOTION_API_KEY 환경 변수가 설정되지 않았습니다.')
    .refine(
      (key) => key.startsWith('ntn_') || key.startsWith('secret_'),
      {
        message:
          '❌ NOTION_API_KEY 형식이 올바르지 않습니다. "ntn_" 또는 "secret_"으로 시작해야 합니다.',
      }
    ),

  /**
   * Notion Database ID
   *
   * - 형식: 32자리 영숫자 (하이픈 없음)
   * - 예시: 2d9f6c096107803ca617dce8b09ec649
   * - 필수: true
   */
  NOTION_DATABASE_ID: z
    .string()
    .min(1, '❌ NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.')
    .regex(
      /^[a-f0-9]{32}$/,
      '❌ NOTION_DATABASE_ID 형식이 올바르지 않습니다. 32자리 영숫자여야 합니다 (하이픈 제거).'
    ),

  /**
   * Notion 캐시 TTL (Time To Live, 초 단위)
   *
   * - 기본값: 60초
   * - 최소: 10초
   * - 최대: 3600초 (1시간)
   * - 선택: true
   */
  NOTION_CACHE_TTL: z.coerce
    .number()
    .min(10, '❌ NOTION_CACHE_TTL은 최소 10초 이상이어야 합니다.')
    .max(3600, '❌ NOTION_CACHE_TTL은 최대 3600초 (1시간) 이하여야 합니다.')
    .default(60)
    .optional(),

  /**
   * Notion API Rate Limit (요청/초)
   *
   * - 기본값: 3 requests/second (Notion 무료 플랜 제한)
   * - 최소: 1
   * - 최대: 10
   * - 선택: true
   */
  NOTION_RATE_LIMIT: z.coerce
    .number()
    .min(1, '❌ NOTION_RATE_LIMIT은 최소 1 이상이어야 합니다.')
    .max(10, '❌ NOTION_RATE_LIMIT은 최대 10 이하여야 합니다.')
    .default(3)
    .optional(),
})

/**
 * 환경 변수 타입 추론
 *
 * zod 스키마로부터 TypeScript 타입을 자동 생성합니다.
 */
export type Env = z.infer<typeof envSchema>

/**
 * 환경 변수 파싱 결과
 *
 * 성공 시 검증된 환경 변수 객체를 반환하고,
 * 실패 시 상세한 에러 정보를 반환합니다.
 */
type ParseEnvResult =
  | { success: true; data: Env }
  | { success: false; error: z.ZodError }

/**
 * 환경 변수 파싱 함수
 *
 * process.env에서 환경 변수를 읽어와 스키마 검증을 수행합니다.
 *
 * @returns ParseEnvResult - 성공 또는 실패 정보
 */
function parseEnv(): ParseEnvResult {
  const result = envSchema.safeParse({
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    NOTION_CACHE_TTL: process.env.NOTION_CACHE_TTL,
    NOTION_RATE_LIMIT: process.env.NOTION_RATE_LIMIT,
  })

  return result
}

/**
 * 검증된 환경 변수 객체
 *
 * 앱 시작 시 자동으로 검증되며, 검증 실패 시 프로세스를 종료합니다.
 * 이후 모든 코드에서 타입 안전하게 환경 변수에 접근할 수 있습니다.
 *
 * @example
 * ```typescript
 * import { env } from '@/lib/env'
 *
 * const notionClient = new Client({ auth: env.NOTION_API_KEY })
 * const databaseId = env.NOTION_DATABASE_ID
 * ```
 */
export const env = (() => {
  const result = parseEnv()

  if (!result.success) {
    // 에러 메시지 포맷팅
    const errorMessages = result.error.issues.map((err) => {
      const path = err.path.join('.')
      return `  • ${path}: ${err.message}`
    })

    // 개발자 친화적인 에러 메시지 출력
    console.error('\n' + '='.repeat(70))
    console.error('❌ 환경 변수 검증 실패')
    console.error('='.repeat(70))
    console.error('\n필수 환경 변수가 누락되었거나 형식이 올바르지 않습니다:\n')
    console.error(errorMessages.join('\n'))
    console.error('\n' + '='.repeat(70))
    console.error('💡 해결 방법:')
    console.error('='.repeat(70))
    console.error('1. 프로젝트 루트에 .env.local 파일을 생성하세요.')
    console.error('2. .env.example 파일을 참고하여 환경 변수를 설정하세요.')
    console.error('3. Notion API 키 발급: https://www.notion.so/my-integrations')
    console.error('4. Notion 데이터베이스 ID 확인 방법은 .env.example 참조')
    console.error('='.repeat(70) + '\n')

    // 프로세스 종료 (개발 환경에서만)
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('환경 변수 검증 실패. 위 메시지를 확인해주세요.')
    }

    // 프로덕션에서는 기본값으로 폴백 (안전하지 않지만 크래시 방지)
    console.warn('⚠️  프로덕션 환경에서 환경 변수 검증 실패. 기본값 사용 중...')
    return {
      NOTION_API_KEY: process.env.NOTION_API_KEY || '',
      NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || '',
      NOTION_CACHE_TTL: 60,
      NOTION_RATE_LIMIT: 3,
    } as Env
  }

  return result.data
})()

/**
 * 환경 변수 유효성 재검증 함수
 *
 * 런타임에 환경 변수를 다시 검증해야 할 때 사용합니다.
 * (일반적으로 필요 없음, env 객체 초기화 시 이미 검증됨)
 *
 * @returns 검증된 환경 변수 객체
 * @throws {Error} 검증 실패 시 에러 발생
 */
export function validateEnv(): Env {
  const result = parseEnv()

  if (!result.success) {
    throw new Error(
      `환경 변수 검증 실패:\n${result.error.issues.map((e) => `  - ${e.path}: ${e.message}`).join('\n')}`
    )
  }

  return result.data
}

/**
 * 환경 변수 존재 여부 체크 (헬퍼 함수)
 *
 * 특정 환경 변수의 존재 여부만 빠르게 확인할 때 사용합니다.
 *
 * @param key - 확인할 환경 변수 키
 * @returns 환경 변수 존재 여부
 *
 * @example
 * ```typescript
 * if (!hasEnv('NOTION_API_KEY')) {
 *   console.error('Notion API 키가 설정되지 않았습니다.')
 * }
 * ```
 */
export function hasEnv(key: keyof Env): boolean {
  return !!process.env[key]
}

/**
 * 환경 정보 로깅 (개발용)
 *
 * 개발 환경에서 현재 설정된 환경 변수 정보를 확인할 때 사용합니다.
 * API 키는 마스킹하여 출력합니다.
 *
 * @example
 * ```typescript
 * logEnvInfo() // 콘솔에 환경 변수 정보 출력
 * ```
 */
export function logEnvInfo(): void {
  if (process.env.NODE_ENV === 'production') {
    console.log('ℹ️  프로덕션 환경에서는 환경 변수 정보를 출력하지 않습니다.')
    return
  }

  console.log('\n' + '='.repeat(70))
  console.log('📋 환경 변수 정보')
  console.log('='.repeat(70))
  console.log(`NOTION_API_KEY: ${maskApiKey(env.NOTION_API_KEY)}`)
  console.log(`NOTION_DATABASE_ID: ${env.NOTION_DATABASE_ID}`)
  console.log(`NOTION_CACHE_TTL: ${env.NOTION_CACHE_TTL || 60}초`)
  console.log(`NOTION_RATE_LIMIT: ${env.NOTION_RATE_LIMIT || 3} requests/s`)
  console.log('='.repeat(70) + '\n')
}

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

// 개발 환경에서 환경 변수 정보 자동 출력 (선택 사항)
if (process.env.NODE_ENV === 'development' && process.env.LOG_ENV_INFO === 'true') {
  logEnvInfo()
}
