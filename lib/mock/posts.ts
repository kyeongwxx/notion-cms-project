/**
 * 블로그 글 더미 데이터
 *
 * UI/UX 개발을 위한 샘플 블로그 글 목록 및 조회 함수를 제공합니다.
 * Phase 3에서 실제 Notion API로 교체됩니다.
 */

import type { BlogPost } from '@/lib/notion/types'

/**
 * 블로그 글 더미 데이터
 *
 * 카테고리별로 최소 3개씩, 총 12개의 샘플 글을 포함합니다.
 * Notion 데이터베이스의 Posts 테이블 구조를 모방합니다.
 */
export const mockPosts: BlogPost[] = [
  // ========================================
  // 🍽️ 맛집 카테고리 (3개)
  // ========================================
  {
    id: 'post-001',
    title: '서울 성수동 맛집 베스트 5',
    slug: 'seoul-seongsu-restaurants',
    description:
      '힙한 성수동에서 꼭 가봐야 할 맛집 5곳을 소개합니다. 브런치 카페부터 분위기 좋은 레스토랑까지!',
    category: ['🍽️ 맛집'],
    tags: ['서울', '성수동', '카페', '브런치', '레스토랑'],
    status: '✅ 발행됨',
    published: new Date('2025-12-15T10:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    createdAt: new Date('2025-12-10T08:00:00.000Z'),
    updatedAt: new Date('2025-12-15T10:00:00.000Z'),
  },
  {
    id: 'post-002',
    title: '제주도 애월 카페 투어',
    slug: 'jeju-aewol-cafe-tour',
    description:
      '제주도 애월해안도로를 따라 위치한 감성 넘치는 카페 6곳을 다녀왔습니다. 오션뷰와 맛있는 디저트를 동시에!',
    category: ['🍽️ 맛집'],
    tags: ['제주도', '애월', '카페', '오션뷰', '디저트'],
    status: '✅ 발행됨',
    published: new Date('2025-12-08T14:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
    createdAt: new Date('2025-12-05T09:00:00.000Z'),
    updatedAt: new Date('2025-12-08T14:00:00.000Z'),
  },
  {
    id: 'post-003',
    title: '부산 자갈치시장 해산물 맛집',
    slug: 'busan-jagalchi-seafood',
    description:
      '부산 자갈치시장에서 직접 고른 싱싱한 해산물로 즐기는 회와 구이. 현지인 추천 맛집 정보까지!',
    category: ['🍽️ 맛집'],
    tags: ['부산', '자갈치', '해산물', '회', '구이'],
    status: '✅ 발행됨',
    published: new Date('2025-11-20T11:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369',
    createdAt: new Date('2025-11-18T10:00:00.000Z'),
    updatedAt: new Date('2025-11-20T11:00:00.000Z'),
  },

  // ========================================
  // ✈️ 여행 카테고리 (3개)
  // ========================================
  {
    id: 'post-004',
    title: '강릉 겨울여행 2박 3일 코스',
    slug: 'gangneung-winter-trip',
    description:
      '강릉의 아름다운 겨울 바다와 커피거리를 즐기는 2박 3일 여행 코스. 추천 숙소와 맛집 정보 포함!',
    category: ['✈️ 여행'],
    tags: ['강릉', '겨울여행', '바다', '커피', '2박3일'],
    status: '✅ 발행됨',
    published: new Date('2025-12-22T09:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
    createdAt: new Date('2025-12-20T08:00:00.000Z'),
    updatedAt: new Date('2025-12-22T09:00:00.000Z'),
  },
  {
    id: 'post-005',
    title: '경주 역사 문화 유적지 탐방',
    slug: 'gyeongju-historical-sites',
    description:
      '천년 고도 경주의 불국사, 석굴암, 첨성대 등 유네스코 세계문화유산을 돌아보는 1박 2일 여행기.',
    category: ['✈️ 여행'],
    tags: ['경주', '문화유산', '불국사', '석굴암', '역사'],
    status: '✅ 발행됨',
    published: new Date('2025-11-12T15:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1528127269322-539801943592',
    createdAt: new Date('2025-11-10T12:00:00.000Z'),
    updatedAt: new Date('2025-11-12T15:00:00.000Z'),
  },
  {
    id: 'post-006',
    title: '제주 올레길 7코스 완주 후기',
    slug: 'jeju-olle-trail-7',
    description:
      '제주 올레길 7코스(외돌개-월평포구)를 걸으며 느낀 제주의 자연. 트레킹 준비물과 소요 시간 정보 공유!',
    category: ['✈️ 여행'],
    tags: ['제주도', '올레길', '트레킹', '외돌개', '하이킹'],
    status: '✅ 발행됨',
    published: new Date('2025-10-28T10:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    createdAt: new Date('2025-10-25T09:00:00.000Z'),
    updatedAt: new Date('2025-10-28T10:00:00.000Z'),
  },

  // ========================================
  // 💻 기술 카테고리 (3개)
  // ========================================
  {
    id: 'post-007',
    title: 'Next.js 15 App Router 완벽 가이드',
    slug: 'nextjs-15-app-router-guide',
    description:
      'Next.js 15의 새로운 App Router를 활용한 풀스택 애플리케이션 개발. Server Components와 Client Components 활용법까지!',
    category: ['💻 기술'],
    tags: ['Next.js', 'React', 'App Router', 'Server Components', 'Web'],
    status: '✅ 발행됨',
    published: new Date('2025-12-25T08:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    createdAt: new Date('2025-12-23T10:00:00.000Z'),
    updatedAt: new Date('2025-12-25T08:00:00.000Z'),
  },
  {
    id: 'post-008',
    title: 'TypeScript 5 신기능 총정리',
    slug: 'typescript-5-new-features',
    description:
      'TypeScript 5에서 추가된 Decorators, const Type Parameters, 향상된 타입 추론 등 주요 신기능을 예제와 함께 설명합니다.',
    category: ['💻 기술'],
    tags: ['TypeScript', 'JavaScript', 'Type Safety', '개발', 'Frontend'],
    status: '✅ 발행됨',
    published: new Date('2025-11-18T13:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
    createdAt: new Date('2025-11-16T11:00:00.000Z'),
    updatedAt: new Date('2025-11-18T13:00:00.000Z'),
  },
  {
    id: 'post-009',
    title: 'React 19 새로운 Hooks 활용법',
    slug: 'react-19-new-hooks',
    description:
      'React 19에서 도입된 use() Hook, useFormStatus(), useOptimistic() 등 새로운 Hooks를 실전 예제로 알아봅니다.',
    category: ['💻 기술'],
    tags: ['React', 'Hooks', 'React 19', 'Frontend', 'UI'],
    status: '✅ 발행됨',
    published: new Date('2025-10-15T09:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    createdAt: new Date('2025-10-12T08:00:00.000Z'),
    updatedAt: new Date('2025-10-15T09:00:00.000Z'),
  },

  // ========================================
  // 📚 일상 카테고리 (3개)
  // ========================================
  {
    id: 'post-010',
    title: '북한산 백운대 등산 후기',
    slug: 'bukhansan-hiking',
    description:
      '서울 근교 등산 명소 북한산 백운대 코스. 왕복 5시간 소요, 초보자도 도전 가능한 등산로 정보 공유!',
    category: ['📚 일상'],
    tags: ['등산', '북한산', '백운대', '서울', '운동'],
    status: '✅ 발행됨',
    published: new Date('2025-12-20T07:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    createdAt: new Date('2025-12-18T09:00:00.000Z'),
    updatedAt: new Date('2025-12-20T07:00:00.000Z'),
  },
  {
    id: 'post-011',
    title: '2025년 꼭 읽어야 할 책 10권',
    slug: '2025-must-read-books',
    description:
      '자기계발부터 소설, 에세이까지 2025년에 읽으면 좋을 추천 도서 10권. 간단한 리뷰와 함께 소개합니다.',
    category: ['📚 일상'],
    tags: ['책', '독서', '추천', '자기계발', '소설'],
    status: '✅ 발행됨',
    published: new Date('2025-11-05T16:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
    createdAt: new Date('2025-11-03T14:00:00.000Z'),
    updatedAt: new Date('2025-11-05T16:00:00.000Z'),
  },
  {
    id: 'post-012',
    title: '주말 서울 카페 투어 루트',
    slug: 'seoul-weekend-cafe-tour',
    description:
      '주말에 친구들과 함께 돌아본 서울 핫플 카페 5곳. 연남동부터 이태원까지 카페 호핑 코스 공유!',
    category: ['📚 일상'],
    tags: ['카페', '서울', '주말', '연남동', '이태원'],
    status: '✅ 발행됨',
    published: new Date('2025-10-22T12:00:00.000Z'),
    cover: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    createdAt: new Date('2025-10-20T10:00:00.000Z'),
    updatedAt: new Date('2025-10-22T12:00:00.000Z'),
  },
]

// ============================================================================
// 글 조회 헬퍼 함수
// ============================================================================

/**
 * 발행된 글 목록 조회
 *
 * status가 "✅ 발행됨"인 글만 반환하며, 발행일 기준 최신순으로 정렬됩니다.
 *
 * @returns 발행된 블로그 글 배열 (발행일 내림차순)
 *
 * @example
 * ```typescript
 * const posts = getPublishedPosts()
 * console.log(posts.length) // 12
 * console.log(posts[0].title) // 가장 최근 글
 * ```
 */
export function getPublishedPosts(): BlogPost[] {
  return mockPosts
    .filter((post) => post.status === '✅ 발행됨')
    .sort((a, b) => {
      const dateA = a.published?.getTime() ?? 0
      const dateB = b.published?.getTime() ?? 0
      return dateB - dateA // 최신순 정렬
    })
}

/**
 * 슬러그로 특정 글 조회
 *
 * @param slug - 글 슬러그 (예: "seoul-seongsu-restaurants")
 * @returns 블로그 글 또는 undefined
 *
 * @example
 * ```typescript
 * const post = getPostBySlug('seoul-seongsu-restaurants')
 * console.log(post?.title) // "서울 성수동 맛집 베스트 5"
 * ```
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find((post) => post.slug === slug)
}

/**
 * 카테고리별 글 목록 조회
 *
 * @param categoryName - 카테고리 이름 (이모지 포함, 예: "🍽️ 맛집")
 * @returns 해당 카테고리의 발행된 글 배열 (발행일 내림차순)
 *
 * @example
 * ```typescript
 * const foodPosts = getPostsByCategory('🍽️ 맛집')
 * console.log(foodPosts.length) // 3
 * ```
 */
export function getPostsByCategory(categoryName: string): BlogPost[] {
  return getPublishedPosts().filter((post) =>
    post.category.includes(categoryName)
  )
}

/**
 * 검색 키워드로 글 목록 조회
 *
 * 제목, 설명, 태그에서 대소문자 구분 없이 검색합니다.
 *
 * @param query - 검색 키워드
 * @returns 검색 결과 글 배열 (발행일 내림차순)
 *
 * @example
 * ```typescript
 * const results = searchPosts('제주')
 * console.log(results.length) // 2 (제주 관련 글)
 * ```
 */
export function searchPosts(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) {
    return getPublishedPosts()
  }

  return getPublishedPosts().filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(lowerQuery)
    const descriptionMatch =
      post.description?.toLowerCase().includes(lowerQuery) ?? false
    const tagsMatch = post.tags.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    )

    return titleMatch || descriptionMatch || tagsMatch
  })
}

/**
 * 태그로 글 목록 조회
 *
 * @param tag - 태그 이름
 * @returns 해당 태그를 포함한 발행된 글 배열 (발행일 내림차순)
 *
 * @example
 * ```typescript
 * const cafePost = getPostsByTag('카페')
 * console.log(cafePosts.length) // 3
 * ```
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return getPublishedPosts().filter((post) => post.tags.includes(tag))
}

/**
 * ID로 특정 글 조회
 *
 * @param id - 글 ID (예: "post-001")
 * @returns 블로그 글 또는 undefined
 *
 * @example
 * ```typescript
 * const post = getPostById('post-001')
 * console.log(post?.title)
 * ```
 */
export function getPostById(id: string): BlogPost | undefined {
  return mockPosts.find((post) => post.id === id)
}

/**
 * 모든 글 목록 조회 (초안 포함)
 *
 * @returns 전체 블로그 글 배열 (발행일 내림차순)
 *
 * @example
 * ```typescript
 * const allPosts = getAllPosts()
 * console.log(allPosts.length) // 12
 * ```
 */
export function getAllPosts(): BlogPost[] {
  return [...mockPosts].sort((a, b) => {
    const dateA = a.published?.getTime() ?? 0
    const dateB = b.published?.getTime() ?? 0
    return dateB - dateA
  })
}
