/**
 * 검색 결과 페이지
 *
 * 키워드 기반 블로그 글 검색 결과를 표시합니다.
 * - URL 쿼리 파라미터 (q) 기반 검색
 * - 제목, 설명, 태그 검색
 * - 반응형 그리드 레이아웃
 * - 페이지네이션
 * - 빈 상태 UI
 *
 * Phase 3에서 실제 Notion API로 교체 예정입니다.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostGrid, Pagination, SearchBar } from "@/components/blog";

// 더미 데이터
import { searchPosts, getPublishedPosts } from "@/lib/mock/posts";

/**
 * 페이지당 글 개수
 */
const POSTS_PER_PAGE = 6;

/**
 * 검색 결과 페이지 컴포넌트
 */
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  // 페이지네이션 상태만 관리 (검색어는 URL에서 직접 사용)
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 결과 계산 (URL의 queryParam 직접 사용)
  const searchResults = useMemo(() => {
    if (!queryParam.trim()) {
      return getPublishedPosts(); // 검색어가 없으면 전체 글 표시
    }
    return searchPosts(queryParam);
  }, [queryParam]);

  // 페이지네이션
  const totalPages = Math.ceil(searchResults.length / POSTS_PER_PAGE);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return searchResults.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [searchResults, currentPage]);

  // 검색어 변경 핸들러 - URL만 업데이트 (useCallback으로 메모이제이션)
  const handleSearchChange = useCallback(
    (query: string) => {
      setCurrentPage(1); // 페이지 초기화

      // URL 쿼리 파라미터 업데이트 (Next.js Router 사용)
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <Section>
      <Container size="lg">
        <div className="py-12">
          {/* 검색 헤더 */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
              검색
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              원하는 글을 빠르게 찾아보세요
            </p>

            {/* 검색창 */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={queryParam}
                onChange={handleSearchChange}
                placeholder="글 제목, 설명, 태그로 검색..."
                autoFocus
              />
            </div>
          </header>

          {/* 검색 결과 헤더 */}
          {queryParam.trim() ? (
            <div className="mb-4">
              <h2 className="text-sm text-muted-foreground">
                <span className="font-semibold">&quot;{queryParam}&quot;</span>{" "}
                검색 결과:{" "}
                <span className="font-semibold">{searchResults.length}개</span>
                의 글
              </h2>
            </div>
          ) : (
            <div className="mb-4 text-sm text-muted-foreground">
              전체 {searchResults.length}개의 글
            </div>
          )}

          {/* 검색 결과 그리드 */}
          <PostGrid
            posts={paginatedResults}
            prioritizeFirstImage
            emptyMessage={
              queryParam.trim()
                ? `"${queryParam}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.`
                : "검색어를 입력하여 글을 찾아보세요."
            }
          />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
