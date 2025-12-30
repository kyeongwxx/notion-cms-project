/**
 * 더미 데이터 유효성 검증 테스트
 *
 * Task 003에서 생성한 더미 데이터가 요구사항을 충족하는지 검증합니다.
 */

import { describe, it, expect } from "vitest";
import {
  mockPosts,
  mockCategories,
  getPublishedPosts,
  getPostsByCategory,
  validateMockData,
  updateCategoryCounts,
} from "@/lib/mock";

describe("더미 데이터 품질 검증", () => {
  it("최소 12개의 샘플 글이 있어야 함", () => {
    expect(mockPosts.length).toBeGreaterThanOrEqual(12);
  });

  it("모든 글이 발행됨 상태여야 함", () => {
    const publishedPosts = getPublishedPosts();
    expect(publishedPosts.length).toBe(mockPosts.length);
  });

  it("각 카테고리마다 최소 3개의 글이 있어야 함", () => {
    mockCategories.forEach((category) => {
      const posts = getPostsByCategory(category.name);
      expect(posts.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("모든 글이 필수 필드를 포함해야 함", () => {
    mockPosts.forEach((post) => {
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.slug).toBeTruthy();
      expect(post.category.length).toBeGreaterThan(0);
      expect(post.status).toBe("✅ 발행됨");
      expect(post.published).toBeInstanceOf(Date);
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
    });
  });

  it("모든 글이 2~5개의 태그를 가져야 함", () => {
    mockPosts.forEach((post) => {
      expect(post.tags.length).toBeGreaterThanOrEqual(2);
      expect(post.tags.length).toBeLessThanOrEqual(5);
    });
  });

  it("슬러그가 중복되지 않아야 함", () => {
    const slugs = mockPosts.map((post) => post.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it("모든 글에 커버 이미지가 있어야 함", () => {
    mockPosts.forEach((post) => {
      expect(post.cover).toBeTruthy();
      expect(post.cover).toMatch(/^https:\/\/images\.unsplash\.com/);
    });
  });

  it("발행일이 최근 3개월 이내여야 함", () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    mockPosts.forEach((post) => {
      expect(post.published).toBeInstanceOf(Date);
      expect(post.published!.getTime()).toBeGreaterThan(
        threeMonthsAgo.getTime()
      );
    });
  });

  it("설명이 50~200자 사이여야 함", () => {
    mockPosts.forEach((post) => {
      expect(post.description).toBeTruthy();
      const length = post.description?.length ?? 0;
      expect(length).toBeGreaterThanOrEqual(50);
      expect(length).toBeLessThanOrEqual(200);
    });
  });

  it("validateMockData()가 통과해야 함", () => {
    const result = validateMockData();
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("카테고리 개수 업데이트가 정확해야 함", () => {
    const updatedCategories = updateCategoryCounts(mockPosts, mockCategories);

    updatedCategories.forEach((category) => {
      const expectedCount = mockPosts.filter((post) =>
        post.category.includes(category.name)
      ).length;
      expect(category.count).toBe(expectedCount);
    });
  });

  it("발행일 기준 정렬이 정확해야 함", () => {
    const posts = getPublishedPosts();

    for (let i = 0; i < posts.length - 1; i++) {
      const current = posts[i]!.published!.getTime();
      const next = posts[i + 1]!.published!.getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});
