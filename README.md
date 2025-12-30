# Notion CMS 기반 개인 블로그

Next.js 16과 React 19를 기반으로 한 Notion CMS 개인 블로그 프로젝트입니다. Notion을 Headless CMS로 활용하여 쉽고 빠르게 블로그를 운영할 수 있습니다.

## 주요 기능 (계획)

- ✅ **편리한 콘텐츠 관리**: 익숙한 Notion 인터페이스로 글 작성
- 🚀 **자동 배포**: Notion에서 발행하면 즉시 웹사이트 반영
- 🎨 **세련된 UI**: shadcn/ui 기반의 현대적인 디자인
- 📱 **반응형 레이아웃**: 모바일, 태블릿, 데스크톱 최적화
- 🔍 **검색 기능**: 키워드로 블로그 글 검색
- 🏷️ **카테고리 필터링**: 카테고리별 글 분류 및 조회

## 기술 스택

- **Framework**: Next.js 16.1.0 (App Router) + React 19.2.3
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **CMS**: Notion API (@notionhq/client)
- **Testing**: Vitest 3.2.4 + React Testing Library
- **Deployment**: Vercel

## 시작하기

### 1. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인하세요.

### 2. Notion API 설정 (예정)

Phase 1: 환경 설정 단계에서 Notion API 연동 예정

1. Notion Integration 생성
2. Database 생성 및 Integration 연결
3. `.env.local` 파일에 API 키 설정

```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

### 3. 테스트 실행

```bash
npm run test              # 감시 모드
npm run test:ui           # UI 대시보드
npm run test:coverage     # 커버리지 리포트
```

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

## 프로젝트 구조

```
notion-cms-project/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # 블로그 페이지 Route Group
│   │   ├── page.tsx              # 홈 (블로그 글 목록)
│   │   └── layout.tsx            # 블로그 레이아웃
│   ├── layout.tsx                # 루트 레이아웃
│   └── globals.css               # Tailwind v4 전역 스타일
│
├── components/                   # React 컴포넌트
│   ├── ui/                       # 기본 UI (shadcn/ui)
│   ├── layout/                   # 레이아웃 컴포넌트
│   └── theme/                    # 테마 관리
│
├── lib/                          # 유틸리티 함수
│   ├── utils.ts                  # cn() 함수
│   ├── constants.ts              # 사이트 설정
│   └── test-utils.tsx            # 테스트 헬퍼
│
├── docs/                         # 프로젝트 문서
│   └── PRD.md                    # 프로젝트 요구사항 정의서
│
└── .claude/                      # Claude Code 통합
    ├── agents/                   # 커스텀 에이전트
    ├── commands/                 # 커스텀 명령어
    └── hooks/                    # 생명주기 훅
```

## 구현 로드맵

### ✅ Phase 0: 프로젝트 초기화 (완료)
- [x] 마케팅 관련 페이지 제거 (about, contact, feature)
- [x] 마케팅 컴포넌트 제거
- [x] 블로그 구조로 변경
- [x] 홈 페이지를 블로그 글 목록 플레이스홀더로 변경

### 🚧 Phase 1: 환경 설정 (예정)
- [ ] Notion API 패키지 설치 (`@notionhq/client`)
- [ ] Notion 데이터베이스 생성 및 샘플 데이터 입력
- [ ] Notion API 키 발급 및 환경 변수 설정

### 📅 Phase 2: API 연동 (예정)
- [ ] Notion API 클라이언트 초기화
- [ ] 글 목록 조회 함수 구현
- [ ] 글 상세 조회 함수 구현
- [ ] 카테고리 목록 조회 함수 구현

### 📅 Phase 3: UI 컴포넌트 개발 (예정)
- [ ] 글 카드 컴포넌트
- [ ] 글 목록 그리드 컴포넌트
- [ ] 카테고리 필터 컴포넌트
- [ ] 검색창 컴포넌트

### 📅 Phase 4: 페이지 구현 (예정)
- [ ] 홈 페이지 (실제 Notion 데이터 연동)
- [ ] 글 상세 페이지
- [ ] 카테고리 페이지

## 문서

자세한 프로젝트 정보는 다음 문서를 참조하세요:

- [PRD.md](./docs/PRD.md) - 프로젝트 요구사항 정의서
- [CLAUDE.md](./CLAUDE.md) - Claude Code 가이드 (업데이트 예정)

## 배포

Vercel을 통해 간편하게 배포할 수 있습니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/notion-cms-project)

## 라이선스

MIT

---

**최초 작성일**: 2025-12-30
**최종 수정일**: 2025-12-30
**프로젝트 버전**: 0.1.0 (초기화 완료)
