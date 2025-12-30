# Task 002: TypeScript 타입 및 인터페이스 정의

## 상태: ✅ 완료

**완료일:** 2025-12-30
**담당자:** Claude Code
**관련 Phase:** Phase 1 - 애플리케이션 골격 구축

---

## 목표

Notion CMS 블로그 프로젝트의 전체 타입 시스템을 구축하여, Notion API부터 React 컴포넌트까지 타입 안전성을 보장합니다.

---

## 완료된 작업

### 1. 실제 Notion 데이터베이스 스키마 분석 ✅

**분석한 데이터:**
- `/Users/gongsaero/Downloads/places.zip` - Places 데이터베이스 CSV 내보내기
- `/Users/gongsaero/Downloads/posts.zip` - Posts 데이터베이스 CSV 내보내기

**발견된 스키마:**

**Posts Database:**
```
- title (Title)
- Places (Relation) → 장소 DB와 관계
- category (Multi-select) → "🍽️ 맛집", "📚 일상"
- cover (Files)
- description (Text)
- published (Date)
- slug (Text)
- status (Select) → "📝 초안", "✅ 발행됨"
- tags (Multi-select)
```

**Places Database:**
```
- name (Title)
- visited-date (Date)
- Posts (Relation) → 포스트 DB와 관계
- district (Text)
- naver-maps (URL)
- notes (Text)
- rating (Number)
- type (Select) → "🍽️ 식당", "🏨 숙소"
```

**PRD와의 차이점:**
- PRD에 없던 `Places` Relation 속성 발견
- 카테고리와 타입에 이모지 접두사 사용 (🍽️, 📝 등)
- `district`, `naver-maps`, `notes`, `rating` 등 장소 관련 속성 추가

### 2. 타입 시스템 아키텍처 설계 ✅

**5계층 아키텍처 구축:**

```
Layer 5: Component Props (types/components.ts)
    ↓
Layer 4: Domain Models (lib/notion/types.ts)
    ↓
Layer 3: Database Schemas (lib/notion/types.ts)
    ↓
Layer 2: Notion Properties (lib/notion/types.ts)
    ↓
Layer 1: Notion API Base (lib/notion/types.ts)
```

### 3. 파일 생성 ✅

#### `lib/notion/types.ts` (730 lines)
- **Layer 1:** Notion API 기본 타입 (임시 정의)
  - `PageObjectResponse`, `BlockObjectResponse`, `RichTextItemResponse` 등
  - ⚠️ @notionhq/client 설치 후 실제 타입으로 교체 필요 (Task 009)

- **Layer 2:** Notion 속성 타입
  - `TitleProperty`, `SelectProperty`, `MultiSelectProperty`
  - `DateProperty`, `URLProperty`, `FilesProperty`, `RelationProperty` 등

- **Layer 3:** 데이터베이스 스키마
  - `PostsDatabaseSchema` - Posts DB 스키마
  - `PlacesDatabaseSchema` - Places DB 스키마
  - 타입 가드: `PostsPageResponse`, `PlacesPageResponse`

- **Layer 4:** 도메인 모델
  - `BlogPost` - 블로그 포스트 (변환된 모델)
  - `Place` - 장소 정보 (변환된 모델)
  - `CategoryInfo`, `TagInfo` - 메타 정보
  - Union 타입: `PostStatus`, `PlaceType`, `Category`

- **추가 타입:**
  - API 응답 래퍼: `NotionDatabaseQueryResponse`, `NotionPageDetailResponse`
  - 쿼리 옵션: `PostsFilterOptions`, `SortOptions`, `PaginationOptions`
  - 타입 가드 함수: `isFullPage()`, `isPostsPage()`, `isPlacesPage()`, `isFullBlock()`
  - 에러 타입: `NotionAPIError`, `DataTransformError`

#### `types/components.ts` (619 lines)
- **포스트 컴포넌트:** `PostCardProps`, `PostGridProps`, `PostListProps`
- **필터 컴포넌트:** `CategoryFilterProps`, `TagFilterProps`, `FilterBarProps`
- **검색 컴포넌트:** `SearchBarProps`, `SearchResultsProps`
- **페이지네이션:** `PaginationProps`, `LoadMoreProps`
- **장소 컴포넌트:** `PlaceCardProps`, `PlaceListProps`
- **콘텐츠 렌더링:** `NotionRendererProps`, `TableOfContentsProps`
- **레이아웃:** `BlogLayoutProps`, `PostHeaderProps`, `RelatedPostsProps`
- **상태 컴포넌트:** `LoadingSkeletonProps`, `EmptyStateProps`, `ErrorStateProps`

#### `types/index.ts` (92 lines)
- 모든 타입을 중앙에서 재정의 (Barrel export)
- 타입 가드 함수도 함께 export
- `@/types`로 간편하게 임포트 가능

#### `lib/notion/TYPE_SYSTEM.md` (문서)
- 전체 타입 시스템 아키텍처 설명
- 각 계층별 상세 설명 및 사용 예시
- 타입 가드 활용 가이드
- API 응답 래퍼 사용법
- Task 009 준비 사항

---

## 기술적 세부사항

### TypeScript Strict 모드 준수 ✅
- `any` 타입 최소화 (Notion API 응답의 일부 필드만 사용)
- 모든 옵션 필드에 `?` 명시
- null 가능 필드에 `| null` 명시
- 타입 가드 함수로 런타임 타입 안전성 보장

### JSDoc 주석 ✅
- 모든 인터페이스와 타입에 한국어 JSDoc 주석 추가
- 실제 데이터 예시 포함
- 각 필드의 용도 명확히 설명

### Path Aliases 사용 ✅
```typescript
import type { BlogPost, CategoryInfo } from '@/types'
import type { PostCardProps } from '@/types/components'
import type { PostsDatabaseSchema } from '@/lib/notion/types'
```

### 타입 가드 패턴 ✅
```typescript
// 런타임 타입 체크
if (isFullPage(page)) {
  if (isPostsPage(page)) {
    // PostsPageResponse로 타입 좁히기
    const title = page.properties.title.title[0].plain_text
  }
}
```

---

## 검증 결과

### TypeScript 컴파일 ✅
```bash
$ npx tsc --noEmit
# ✅ 에러 없음
```

### 파일 통계 ✅
```
lib/notion/types.ts        730 lines
types/components.ts         619 lines
types/index.ts               92 lines
────────────────────────────────────
Total                      1,441 lines
```

### 타입 커버리지 ✅
- ✅ Notion API 기본 타입 (임시)
- ✅ Posts 데이터베이스 스키마
- ✅ Places 데이터베이스 스키마
- ✅ 도메인 모델 (BlogPost, Place)
- ✅ API 응답 래퍼
- ✅ 컴포넌트 Props (15개 컴포넌트)
- ✅ 타입 가드 함수 (4개)
- ✅ 에러 타입

---

## Acceptance Criteria

- [x] `lib/notion/types.ts` 생성 완료
- [x] 모든 타입이 실제 Notion 데이터베이스 스키마와 일치
- [x] TypeScript 컴파일 에러 없음
- [x] 모든 타입이 export되어 다른 파일에서 임포트 가능
- [x] JSDoc 주석 추가로 IntelliSense 지원
- [x] 컴포넌트 Props 타입 정의 완료

---

## 다음 단계 (Task 009)

1. **@notionhq/client 설치**
   ```bash
   npm install @notionhq/client
   ```

2. **타입 임포트 교체**
   - `lib/notion/types.ts` 파일 상단 주석 해제
   - 임시 인터페이스 정의 삭제
   - 실제 Notion SDK 타입 사용

3. **환경 변수 설정**
   - `.env.local` 생성
   - Notion API 키 추가
   - 데이터베이스 ID 추가

---

## 파일 구조

```
notion-cms-project/
├── lib/
│   └── notion/
│       ├── types.ts              # ✅ Notion 타입 정의 (730 lines)
│       └── TYPE_SYSTEM.md        # ✅ 타입 시스템 문서
│
├── types/
│   ├── components.ts             # ✅ 컴포넌트 Props (619 lines)
│   └── index.ts                  # ✅ 통합 export (92 lines)
│
└── docs/
    └── tasks/
        └── 002-typescript-types.md  # ✅ 이 문서
```

---

## 학습 포인트

### 1. 실제 데이터 우선 접근법
- PRD보다 실제 Notion DB 구조를 우선 분석
- CSV 내보내기로 정확한 스키마 파악
- 이모지 접두사, Relation 속성 등 발견

### 2. 계층적 타입 설계
- 5계층 아키텍처로 관심사 분리
- Layer 1-3: Notion API 계층
- Layer 4: 애플리케이션 도메인 계층
- Layer 5: UI 계층

### 3. 타입 안전성 보장
- 타입 가드 함수로 런타임 체크
- Union 타입으로 명확한 값 제한
- Strict 모드 준수

### 4. 개발자 경험 향상
- JSDoc으로 IntelliSense 지원
- Barrel export로 간편한 임포트
- 상세한 문서화

---

## 참고 자료

- [Notion API 문서](https://developers.notion.com/reference/property-value-object)
- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [프로젝트 PRD](../PRD.md)
- [타입 시스템 문서](../../lib/notion/TYPE_SYSTEM.md)

---

**작성일:** 2025-12-30
**마지막 수정:** 2025-12-30
**상태:** ✅ 완료
**다음 Task:** Task 009 - Notion API 환경 설정
