# Notion CMS 개인 블로그 개발 로드맵

Notion을 Headless CMS로 활용하여 맛집, 여행, 기술 등 다양한 주제의 개인 블로그를 구축하는 프로젝트입니다.

---

## 개요

**Notion CMS 개인 블로그**는 Notion 데이터베이스를 콘텐츠 관리 시스템으로 활용하여 다음 기능을 제공합니다:

- **블로그 글 목록 조회**: Notion에서 발행된 글을 카드 형태로 표시
- **글 상세 페이지**: Notion 블록을 HTML로 렌더링하여 콘텐츠 표시
- **카테고리별 필터링**: 맛집, 여행, 기술 등 주제별 글 분류
- **검색 기능**: 키워드 기반 글 검색
- **SEO 최적화**: 메타 태그, Open Graph, Sitemap 지원

---

## 개발 워크플로우

### 1. 작업 계획

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

### 2. 작업 생성

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조

### 3. 작업 구현

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 각 단계 완료 후 중단하고 추가 지시를 기다림

### 4. 로드맵 업데이트

- 로드맵에서 완료된 작업을 완료로 표시

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 (예상 소요: 1일)

> **목적**: 전체 애플리케이션의 라우트 구조와 타입 시스템을 먼저 구축하여, 이후 UI와 기능 개발의 기반을 마련합니다.
>
> **왜 이 순서인가?**: 라우트와 타입 정의가 먼저 완성되어야 UI 개발과 API 연동이 병렬로 진행될 수 있습니다.

- **Task 001: 프로젝트 라우트 구조 설정** - 우선순위

  - Next.js App Router 기반 전체 라우트 구조 생성
  - `/posts/[slug]` 동적 라우트 생성 (빈 페이지)
  - `/category/[category]` 동적 라우트 생성 (빈 페이지)
  - 라우트별 loading.tsx, error.tsx 스켈레톤 생성

- **Task 002: TypeScript 타입 및 인터페이스 정의**

  - Notion 데이터베이스 스키마 기반 타입 정의 (`lib/notion/types.ts`)
  - BlogPost, Category, Tag 인터페이스 정의
  - API 응답 타입 정의 (NotionPageResponse, NotionBlockResponse)
  - 컴포넌트 Props 타입 정의

**완료 기준 (Definition of Done)**:
- [ ] 모든 주요 라우트 파일이 생성되어 있음
- [ ] TypeScript 컴파일 오류 없음
- [ ] 각 라우트에 플레이스홀더 컨텐츠가 표시됨

---

### Phase 2: UI/UX 완성 - 더미 데이터 활용 (예상 소요: 3일)

> **목적**: 실제 API 연동 없이 더미 데이터로 전체 UI를 완성하여, 사용자 경험을 먼저 검증합니다.
>
> **왜 이 순서인가?**: UI가 먼저 완성되면 디자인 피드백을 조기에 받을 수 있고, API 개발과 독립적으로 진행할 수 있습니다.

- **Task 003: 더미 데이터 및 Mock 시스템 구축**

  - 샘플 블로그 글 더미 데이터 생성 (`lib/mock/posts.ts`)
  - 카테고리 목록 더미 데이터 생성 (`lib/mock/categories.ts`)
  - 더미 데이터 유틸리티 함수 작성 (랜덤 데이터 생성)

- **Task 004: 블로그 공통 컴포넌트 개발**

  - PostCard 컴포넌트 구현 (커버 이미지, 제목, 설명, 카테고리 뱃지, 태그, 발행일)
  - PostGrid 컴포넌트 구현 (반응형 그리드 레이아웃)
  - CategoryFilter 컴포넌트 구현 (카테고리 목록 및 선택 상태)
  - SearchBar 컴포넌트 구현 (검색 입력 및 결과 필터링)
  - Pagination 컴포넌트 구현 (페이지 네비게이션)

- **Task 005: 홈 페이지 UI 완성**

  - Hero 섹션 구현 (블로그 소개, 검색창)
  - 글 목록 그리드 구현 (PostGrid + 더미 데이터)
  - 카테고리 필터 통합 (CategoryFilter)
  - 페이지네이션 또는 더보기 버튼 구현
  - 반응형 레이아웃 적용 (모바일 1열, 태블릿 2열, 데스크톱 3열)

- **Task 006: 글 상세 페이지 UI 완성**

  - Article Header 구현 (제목, 메타 정보, 커버 이미지)
  - Article Content 영역 레이아웃 (본문 영역 스타일링)
  - Notion 블록 타입별 컴포넌트 스타일 정의 (텍스트, 제목, 이미지, 코드 블록, 인용문, 리스트)
  - 읽기 편한 타이포그래피 적용 (prose 스타일)
  - 관련 글 섹션 레이아웃

- **Task 007: 카테고리 페이지 UI 완성**

  - Category Header 구현 (카테고리 이름, 글 개수)
  - 필터링된 글 목록 그리드 (홈과 동일한 PostGrid 재사용)
  - 빈 상태 UI (해당 카테고리에 글이 없을 때)

- **Task 008: 검색 결과 페이지 UI 완성**

  - 검색 결과 헤더 (검색어, 결과 개수)
  - 검색 결과 글 목록
  - 검색어 하이라이팅 (선택 사항)
  - 검색 결과 없음 UI

**완료 기준 (Definition of Done)**:
- [ ] 모든 페이지가 더미 데이터로 정상 렌더링됨
- [ ] 반응형 디자인이 모바일/태블릿/데스크톱에서 정상 작동
- [ ] 컴포넌트 단위 테스트 작성 완료
- [ ] 접근성 테스트 통과 (jest-axe)

---

### Phase 3: 핵심 기능 구현 - Notion API 연동 (예상 소요: 4일)

> **목적**: Notion API를 연동하여 실제 데이터로 블로그를 동작시킵니다.
>
> **왜 이 순서인가?**: UI가 완성된 상태에서 API를 연동하면, 데이터 구조 변경에 따른 UI 수정을 최소화할 수 있습니다.

- **Task 009: Notion API 환경 설정** - 우선순위

  - `@notionhq/client` 패키지 설치
  - `.env.local` 및 `.env.example` 파일 생성
  - Notion API 키 및 데이터베이스 ID 환경 변수 설정
  - 환경 변수 유효성 검사 유틸리티 작성

- **Task 010: Notion API 클라이언트 및 기본 함수 구현**

  - Notion API 클라이언트 초기화 (`lib/notion/client.ts`)
  - 발행된 글 목록 조회 함수 (`getPublishedPosts()`)
  - 글 상세 조회 함수 (`getPostBySlug()`)
  - 카테고리 목록 조회 함수 (`getCategories()`)
  - 페이지 블록 콘텐츠 조회 함수 (`getPageBlocks()`)
  - API 에러 핸들링 및 재시도 로직

  **테스트 체크리스트**:
  - [ ] Playwright MCP로 Notion API 응답 검증
  - [ ] 에러 케이스 테스트 (잘못된 API 키, 존재하지 않는 페이지)
  - [ ] Rate Limit 처리 테스트

- **Task 011: Notion 블록 렌더러 구현**

  - Notion 블록을 React 컴포넌트로 변환하는 렌더러 작성 (`lib/notion/renderer.tsx`)
  - 지원 블록 타입: paragraph, heading_1/2/3, bulleted_list, numbered_list, code, quote, image, callout, divider, toggle
  - 코드 블록 구문 강조 (Prism.js 또는 Shiki)
  - 이미지 최적화 (Next.js Image 컴포넌트 활용)

  **테스트 체크리스트**:
  - [ ] 각 블록 타입별 렌더링 테스트
  - [ ] 중첩 블록 렌더링 테스트
  - [ ] 누락된 블록 타입 graceful degradation 테스트

- **Task 012: 페이지별 API 통합**

  - 홈 페이지: 더미 데이터를 실제 API 호출로 교체
  - 글 상세 페이지: 동적 라우트 파라미터로 글 조회
  - 카테고리 페이지: 카테고리별 글 필터링
  - ISR(Incremental Static Regeneration) 설정 (revalidate: 60)

  **테스트 체크리스트**:
  - [ ] Playwright MCP로 전체 사용자 플로우 E2E 테스트
  - [ ] 홈 -> 글 상세 -> 홈 네비게이션 테스트
  - [ ] 카테고리 필터링 동작 테스트
  - [ ] 로딩 상태 및 에러 상태 UI 테스트

- **Task 013: 검색 기능 구현**

  - 클라이언트 사이드 검색 로직 구현
  - 제목 및 태그 기반 필터링
  - 디바운스 처리로 성능 최적화
  - 검색 결과 상태 관리

  **테스트 체크리스트**:
  - [ ] 검색어 입력 시 결과 필터링 테스트
  - [ ] 빈 검색 결과 처리 테스트
  - [ ] 디바운스 동작 테스트

**완료 기준 (Definition of Done)**:
- [ ] Notion 데이터베이스의 글이 웹사이트에 정상 표시됨
- [ ] Notion에서 글 발행 후 60초 내 웹사이트 반영 확인
- [ ] 모든 Notion 블록 타입이 정상 렌더링됨
- [ ] 검색 기능이 정상 동작함
- [ ] Playwright MCP E2E 테스트 통과

---

### Phase 4: 스타일링 및 UX 최적화 (예상 소요: 2일)

> **목적**: 전체 사용자 경험을 개선하고 성능을 최적화합니다.
>
> **왜 이 순서인가?**: 핵심 기능이 완성된 후 사용자 피드백을 반영하여 UX를 개선합니다.

- **Task 014: 로딩 및 에러 상태 UI 구현**

  - 페이지별 로딩 스켈레톤 UI 구현 (loading.tsx)
  - 글 카드 스켈레톤 컴포넌트
  - 에러 페이지 UI 구현 (error.tsx, not-found.tsx)
  - 글로벌 에러 바운더리 설정

- **Task 015: 반응형 디자인 최적화**

  - 모바일 (< 768px): 단일 컬럼, 터치 최적화
  - 태블릿 (768px ~ 1024px): 2컬럼 레이아웃
  - 데스크톱 (> 1024px): 3컬럼 + 사이드바 레이아웃
  - 반응형 네비게이션 개선
  - 이미지 반응형 처리

- **Task 016: 성능 최적화**

  - 이미지 최적화 (next/image, lazy loading)
  - 폰트 최적화 (next/font/google)
  - 번들 사이즈 분석 및 최적화
  - Lighthouse 성능 점수 90+ 달성

**완료 기준 (Definition of Done)**:
- [ ] Lighthouse Performance 점수 90+
- [ ] 모든 반응형 브레이크포인트에서 UI 정상 작동
- [ ] 로딩 상태가 사용자에게 명확히 표시됨
- [ ] Core Web Vitals 기준 충족 (LCP, FID, CLS)

---

### Phase 5: SEO 및 배포 (예상 소요: 1일)

> **목적**: 검색 엔진 최적화를 적용하고 프로덕션 배포를 완료합니다.
>
> **왜 이 순서인가?**: 모든 기능과 UI가 완성된 후 SEO 메타데이터를 적용하고 배포합니다.

- **Task 017: SEO 최적화**

  - 메타데이터 API 활용 (generateMetadata)
  - 페이지별 동적 메타 태그 설정 (title, description)
  - Open Graph 이미지 설정
  - 구조화된 데이터 (JSON-LD) 추가

- **Task 018: Sitemap 및 robots.txt 설정**

  - 동적 Sitemap 생성 (`app/sitemap.ts`)
  - robots.txt 설정 (`app/robots.ts`)
  - RSS 피드 생성 (선택 사항)

- **Task 019: Vercel 배포 설정**

  - Vercel 프로젝트 생성 및 연결
  - 환경 변수 설정 (Vercel Dashboard)
  - 배포 프리뷰 및 프로덕션 배포
  - 도메인 연결 (선택 사항)
  - Vercel Analytics 설정 (선택 사항)

**완료 기준 (Definition of Done)**:
- [ ] Lighthouse SEO 점수 95+
- [ ] Lighthouse Accessibility 점수 90+
- [ ] Sitemap이 정상 생성되어 접근 가능
- [ ] 프로덕션 배포 완료 및 정상 동작 확인
- [ ] Notion에서 글 작성 후 5분 내 웹사이트 반영

---

### Phase 6: 향후 확장 기능 (Post-MVP)

> **목적**: MVP 이후 사용자 피드백을 반영한 추가 기능을 구현합니다.

- **Task 020: 다크 모드 구현**

  - next-themes 활용한 테마 전환
  - 시스템 테마 자동 감지
  - 테마 토글 버튼 UI 개선

- **Task 021: 댓글 시스템 연동**

  - Giscus 또는 Utterances 연동
  - GitHub 저장소 연결
  - 댓글 스타일링

- **Task 022: 추가 기능**

  - 조회수 트래킹
  - 관련 글 추천 (태그 기반)
  - 소셜 공유 버튼

**완료 기준 (Definition of Done)**:
- [ ] 다크 모드 전환이 부드럽게 동작
- [ ] 댓글 시스템이 정상 작동
- [ ] 추가 기능들이 기존 기능과 충돌 없이 동작

---

## 전체 타임라인 요약

| Phase | 설명 | 예상 소요 | Task 수 |
|-------|------|----------|---------|
| Phase 1 | 애플리케이션 골격 구축 | 1일 | 2 |
| Phase 2 | UI/UX 완성 (더미 데이터) | 3일 | 6 |
| Phase 3 | 핵심 기능 구현 (Notion API) | 4일 | 5 |
| Phase 4 | 스타일링 및 UX 최적화 | 2일 | 3 |
| Phase 5 | SEO 및 배포 | 1일 | 3 |
| Phase 6 | 향후 확장 기능 (Post-MVP) | - | 3 |
| **총합** | **MVP 완료** | **11일** | **19 + 3** |

---

## 기술 스택 요약

| 분류 | 기술 | 용도 |
|------|------|------|
| Framework | Next.js 16, React 19 | SSG/ISR, UI |
| Language | TypeScript 5 | 타입 안전성 |
| Styling | Tailwind CSS v4, shadcn/ui | 유틸리티 CSS, 컴포넌트 |
| CMS | Notion API (@notionhq/client) | 콘텐츠 관리 |
| Testing | Vitest, React Testing Library, Playwright | 단위/통합/E2E 테스트 |
| Deployment | Vercel | 자동 배포, 호스팅 |

---

## 상태 범례

- **- 우선순위**: 즉시 시작해야 할 작업
- **상태 없음**: 대기 중인 작업
- **완료**: 완료된 작업 (See: `/tasks/XXX-xxx.md` 참조 추가)

---

**문서 작성일**: 2025-12-30
**최종 수정일**: 2025-12-30
**문서 버전**: 1.0
