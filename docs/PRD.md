# PRD: Notion CMS 기반 개인 블로그

## 1. 프로젝트 개요

### 1.1 프로젝트명
**개인 블로그** (맛집, 여행, 기술 등 다양한 주제를 다루는 퍼스널 블로그)

### 1.2 프로젝트 목적
Notion을 Headless CMS로 활용하여 개인 블로그를 구축합니다. Notion에서 콘텐츠를 작성하면 자동으로 웹사이트에 반영되어, 별도의 관리자 페이지 없이도 쉽고 빠르게 블로그를 운영할 수 있습니다.

### 1.3 핵심 가치 제안
- ✍️ **편리한 콘텐츠 관리**: 익숙한 Notion 인터페이스로 글 작성
- 🚀 **자동 배포**: Notion에서 발행하면 즉시 웹사이트 반영
- 🎨 **세련된 UI**: 현대적인 디자인과 반응형 레이아웃
- 💰 **비용 효율적**: 무료 Notion API + Vercel 무료 플랜 활용

---

## 2. 배경 및 동기

### 2.1 문제 정의
기존 블로그 플랫폼의 한계:
- **WordPress/Tistory**: 복잡한 관리자 페이지, 느린 에디터
- **Medium/Velog**: 커스터마이징 제약, 플랫폼 종속성
- **Static Site Generator**: 마크다운 작성 및 Git 커밋이 번거로움

### 2.2 솔루션
Notion을 CMS로 활용하여:
- Notion의 강력한 에디터로 콘텐츠 작성
- Next.js로 빠르고 SEO 친화적인 웹사이트 구축
- API를 통해 실시간으로 콘텐츠 동기화

### 2.3 타겟 사용자
- 개인 블로거 (1인 운영자)
- 기술 블로그, 여행 블로그, 맛집 리뷰 등 다양한 주제의 콘텐츠 크리에이터
- Notion을 이미 사용 중인 사용자

---

## 3. 주요 기능 (Features)

### 3.1 Core Features (MVP)

#### F1. 블로그 글 목록 조회
- **설명**: Notion 데이터베이스에서 발행된 글 목록을 가져와 카드 형태로 표시
- **User Story**:
  > 방문자로서 최신 블로그 글 목록을 한눈에 보고 싶습니다.
- **Acceptance Criteria**:
  - [ ] Notion API를 통해 Status가 "발행됨"인 글만 가져오기
  - [ ] 발행일 기준 최신순으로 정렬
  - [ ] 제목, 카테고리, 태그, 발행일이 카드에 표시됨
  - [ ] 페이지네이션 또는 무한 스크롤 지원

#### F2. 글 상세 페이지
- **설명**: 개별 글의 전체 내용을 보기 좋게 렌더링
- **User Story**:
  > 방문자로서 블로그 글을 클릭하여 전체 내용을 읽고 싶습니다.
- **Acceptance Criteria**:
  - [ ] Notion 페이지 콘텐츠를 HTML/React로 변환하여 표시
  - [ ] 이미지, 코드 블록, 인용문 등 다양한 블록 타입 지원
  - [ ] 제목, 발행일, 카테고리, 태그 메타정보 표시
  - [ ] 읽기 편한 타이포그래피 적용

#### F3. 카테고리별 필터링
- **설명**: 카테고리를 선택하여 해당 카테고리의 글만 필터링
- **User Story**:
  > 방문자로서 특정 주제(예: 맛집, 여행)의 글만 모아보고 싶습니다.
- **Acceptance Criteria**:
  - [ ] 카테고리 목록을 네비게이션 또는 사이드바에 표시
  - [ ] 카테고리 클릭 시 해당 카테고리 글만 필터링
  - [ ] 카테고리별 글 개수 표시

#### F4. 검색 기능
- **설명**: 키워드로 블로그 글 검색
- **User Story**:
  > 방문자로서 특정 키워드가 포함된 글을 빠르게 찾고 싶습니다.
- **Acceptance Criteria**:
  - [ ] 검색창에 키워드 입력 시 제목 및 태그에서 검색
  - [ ] 검색 결과를 글 목록 형태로 표시
  - [ ] 검색어 하이라이팅 (선택 사항)

#### F5. 반응형 디자인
- **설명**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 레이아웃
- **User Story**:
  > 방문자로서 모바일에서도 편하게 블로그를 읽고 싶습니다.
- **Acceptance Criteria**:
  - [ ] 모바일 (< 768px): 단일 컬럼 레이아웃
  - [ ] 태블릿 (768px ~ 1024px): 2컬럼 레이아웃
  - [ ] 데스크톱 (> 1024px): 3컬럼 또는 사이드바 레이아웃
  - [ ] 터치 인터랙션 지원

### 3.2 Future Enhancements (Post-MVP)

- **댓글 시스템**: Giscus 또는 Utterances 연동
- **다크 모드**: next-themes를 활용한 테마 전환
- **RSS 피드**: 구독자를 위한 RSS 제공
- **조회수 트래킹**: 글별 조회수 표시
- **관련 글 추천**: 태그 기반 유사 글 추천
- **소셜 공유 버튼**: 트위터, 페이스북 공유 기능

---

## 4. 기술 스택

### 4.1 Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.x | React 프레임워크, SSG/ISR |
| **React** | 19.x | UI 라이브러리 |
| **TypeScript** | 5.x | 타입 안전성 |
| **Tailwind CSS** | 4.x | 유틸리티 기반 스타일링 |
| **shadcn/ui** | latest | 재사용 가능한 UI 컴포넌트 |
| **Lucide React** | latest | 아이콘 라이브러리 |

### 4.2 CMS & API
| 기술 | 버전 | 용도 |
|------|------|------|
| **Notion API** | @notionhq/client | Notion 데이터베이스 연동 |
| **react-notion-x** | (선택 사항) | Notion 블록 렌더링 |

### 4.3 Deployment & Infrastructure
- **Vercel**: 자동 배포 및 호스팅
- **Vercel Analytics**: 트래픽 분석
- **Environment Variables**: Notion API 키 관리

### 4.4 개발 도구
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Vitest**: 단위 테스트
- **Git**: 버전 관리

---

## 5. Notion 데이터베이스 구조

### 5.1 Database Schema

Notion 데이터베이스에 다음 속성(Properties)을 설정합니다:

| 속성명 | 타입 | 설명 | 필수 여부 |
|--------|------|------|-----------|
| **Title** | Title | 글 제목 | ✅ Required |
| **Category** | Select | 카테고리 (맛집, 여행, 기술 등) | ✅ Required |
| **Tags** | Multi-select | 태그 (복수 선택 가능) | ⚪ Optional |
| **Published** | Date | 발행일 | ✅ Required |
| **Status** | Select | 상태 (초안, 발행됨) | ✅ Required |
| **Slug** | Text | URL 슬러그 (자동 생성 또는 수동 입력) | ⚪ Optional |
| **Description** | Text | 글 요약 (SEO 메타 설명) | ⚪ Optional |
| **Cover** | Files & media | 커버 이미지 | ⚪ Optional |

### 5.2 Sample Data

```
Title: 서울 성수동 맛집 베스트 5
Category: 맛집
Tags: 서울, 성수동, 카페
Published: 2025-01-15
Status: 발행됨
Slug: seoul-seongsu-restaurants
Description: 성수동에서 꼭 가봐야 할 맛집 5곳을 소개합니다.
Cover: [이미지 URL]
```

### 5.3 Data Flow

```
Notion Database (CMS)
         ↓
   Notion API (@notionhq/client)
         ↓
   Next.js API Routes / Server Components
         ↓
   React Components (UI)
         ↓
    User's Browser
```

---

## 6. 화면 구성 (Wireframes)

### 6.1 홈 페이지 (/)
```
┌─────────────────────────────────────┐
│         Header (Logo + Nav)        │
├─────────────────────────────────────┤
│                                     │
│   Hero Section (선택 사항)          │
│   - 블로그 소개 문구                │
│   - 검색창                          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   최근 글 목록 (Card Grid)          │
│   ┌──────┐ ┌──────┐ ┌──────┐       │
│   │ Card │ │ Card │ │ Card │       │
│   │  #1  │ │  #2  │ │  #3  │       │
│   └──────┘ └──────┘ └──────┘       │
│                                     │
│   ┌──────┐ ┌──────┐ ┌──────┐       │
│   │ Card │ │ Card │ │ Card │       │
│   │  #4  │ │  #5  │ │  #6  │       │
│   └──────┘ └──────┘ └──────┘       │
│                                     │
│   [Load More 버튼]                  │
│                                     │
├─────────────────────────────────────┤
│         Footer (Copyright)         │
└─────────────────────────────────────┘
```

**Card 구성 요소**:
- 커버 이미지
- 카테고리 뱃지
- 제목
- 요약 (짧은 설명)
- 발행일
- 태그 목록

### 6.2 글 상세 페이지 (/posts/[slug])
```
┌─────────────────────────────────────┐
│         Header (Logo + Nav)        │
├─────────────────────────────────────┤
│                                     │
│   Article Header                   │
│   - 제목                            │
│   - 카테고리, 태그                  │
│   - 발행일                          │
│   - 커버 이미지                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   Article Content                  │
│   (Notion 블록 렌더링)              │
│   - 텍스트, 이미지                  │
│   - 코드 블록                       │
│   - 인용문                          │
│   - 리스트                          │
│                                     │
├─────────────────────────────────────┤
│   관련 글 (선택 사항)               │
│   ┌──────┐ ┌──────┐ ┌──────┐       │
│   │ Card │ │ Card │ │ Card │       │
│   └──────┘ └──────┘ └──────┘       │
├─────────────────────────────────────┤
│         Footer                     │
└─────────────────────────────────────┘
```

### 6.3 카테고리 페이지 (/category/[category])
```
┌─────────────────────────────────────┐
│         Header (Logo + Nav)        │
├─────────────────────────────────────┤
│                                     │
│   Category Header                  │
│   - 카테고리 이름                   │
│   - 글 개수                         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   필터링된 글 목록 (Card Grid)      │
│   (홈과 동일한 레이아웃)            │
│                                     │
├─────────────────────────────────────┤
│         Footer                     │
└─────────────────────────────────────┘
```

---

## 7. MVP 범위 (Minimum Viable Product)

### 7.1 포함되는 기능 (In Scope)
- ✅ Notion API 연동 및 환경 설정
- ✅ 글 목록 페이지 (홈)
- ✅ 글 상세 페이지
- ✅ 카테고리별 필터링
- ✅ 검색 기능 (클라이언트 사이드)
- ✅ 기본 스타일링 (Tailwind CSS + shadcn/ui)
- ✅ 반응형 디자인 (모바일/데스크톱)
- ✅ SEO 최적화 (메타 태그, Open Graph)

### 7.2 포함되지 않는 기능 (Out of Scope)
- ❌ 댓글 시스템
- ❌ 다크 모드
- ❌ RSS 피드
- ❌ 조회수 트래킹
- ❌ 관련 글 추천 알고리즘
- ❌ 소셜 로그인
- ❌ 관리자 대시보드 (Notion을 CMS로 사용)

---

## 8. 구현 로드맵 (Implementation Roadmap)

### Phase 1: 환경 설정 (1일)
- [ ] Next.js 프로젝트 초기화
- [ ] TypeScript, Tailwind CSS, shadcn/ui 설정
- [ ] Notion API 패키지 설치 (`@notionhq/client`)
- [ ] Notion 데이터베이스 생성 및 샘플 데이터 입력
- [ ] Notion API 키 발급 및 환경 변수 설정 (`.env.local`)

### Phase 2: API 연동 (2일)
- [ ] Notion API 클라이언트 초기화
- [ ] 글 목록 조회 함수 구현 (`getPublishedPosts()`)
- [ ] 글 상세 조회 함수 구현 (`getPostBySlug()`)
- [ ] 카테고리 목록 조회 함수 구현 (`getCategories()`)
- [ ] API 응답 데이터 TypeScript 타입 정의

### Phase 3: UI 컴포넌트 개발 (3일)
- [ ] 레이아웃 컴포넌트 (Header, Footer, Container)
- [ ] 글 카드 컴포넌트 (`PostCard`)
- [ ] 글 목록 그리드 컴포넌트 (`PostGrid`)
- [ ] 카테고리 필터 컴포넌트 (`CategoryFilter`)
- [ ] 검색창 컴포넌트 (`SearchBar`)

### Phase 4: 페이지 구현 (3일)
- [ ] 홈 페이지 (`app/page.tsx`)
- [ ] 글 상세 페이지 (`app/posts/[slug]/page.tsx`)
- [ ] 카테고리 페이지 (`app/category/[category]/page.tsx`)
- [ ] Notion 블록 렌더링 (react-notion-x 또는 직접 구현)

### Phase 5: 스타일링 및 최적화 (2일)
- [ ] 반응형 디자인 구현 (모바일/태블릿/데스크톱)
- [ ] 타이포그래피 및 간격 조정
- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] 코드 블록 구문 강조 (Prism.js 또는 Shiki)
- [ ] 로딩 스켈레톤 UI

### Phase 6: SEO 및 배포 (1일)
- [ ] 메타 태그 설정 (title, description, Open Graph)
- [ ] Sitemap 생성
- [ ] robots.txt 설정
- [ ] Vercel 배포 설정
- [ ] 환경 변수 설정 (Vercel Dashboard)
- [ ] 도메인 연결 (선택 사항)

**총 예상 기간**: 약 12일 (1인 개발 기준)

---

## 9. 성공 지표 (Success Metrics)

### 9.1 정량적 지표
- **페이지 로드 속도**: Lighthouse 스코어 90+ (Performance)
- **SEO 점수**: Lighthouse 스코어 95+ (SEO)
- **접근성 점수**: Lighthouse 스코어 90+ (Accessibility)
- **월간 방문자 수**: 100+ (첫 달 목표)
- **평균 체류 시간**: 2분 이상

### 9.2 정성적 지표
- Notion에서 글 작성 후 5분 내 웹사이트 반영
- 모바일에서 읽기 편한 UI/UX
- 다양한 Notion 블록 타입 정상 렌더링
- 사용자 피드백 수집 (댓글, 설문조사)

---

## 10. 제약사항 및 가정

### 10.1 제약사항
- **Notion API Rate Limit**:
  - 무료 플랜: 3 requests/second
  - ISR을 활용하여 API 호출 최소화 필요
- **Notion 블록 타입**:
  - 일부 고급 블록 타입은 지원하지 않을 수 있음 (Synced blocks, Databases 등)
- **실시간 업데이트**:
  - ISR revalidate 시간에 따라 최대 60초 지연 가능
- **검색 기능**:
  - MVP는 클라이언트 사이드 검색으로 제한 (서버 사이드 검색은 향후 구현)

### 10.2 가정
- 블로그 운영자는 Notion 사용에 익숙함
- 월 평균 글 작성 수: 4~8개 (주 1~2회)
- 초기 방문자는 주로 모바일 사용자
- Vercel 무료 플랜으로 충분한 트래픽 (월 100GB 대역폭)

---

## 11. 참고 자료 (References)

### 11.1 공식 문서
- [Notion API Docs](https://developers.notion.com/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)

### 11.2 관련 라이브러리
- [@notionhq/client](https://github.com/makenotion/notion-sdk-js)
- [react-notion-x](https://github.com/NotionX/react-notion-x)
- [notion-to-md](https://github.com/souvikinator/notion-to-md)

### 11.3 참고 프로젝트
- [Notion Blog Starter](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
- [NextJS Notion Blog](https://github.com/ijjk/notion-blog)

---

## 12. 변경 이력 (Changelog)

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0 | 2025-01-XX | 초안 작성 | - |

---

## 13. 승인 및 피드백

### 프로젝트 승인
- [ ] Product Owner 승인
- [ ] Tech Lead 검토
- [ ] Design Review 완료

### 피드백 및 질문
*(이곳에 프로젝트 관련 질문이나 피드백을 기록합니다)*

---

**문서 작성일**: 2025-12-29
**최종 수정일**: 2025-12-29
**문서 버전**: 1.0
**작성자**: Claude Code
