/*
 * @Description: 文章过滤工具函数 - 用于排除项目展示和技术分享分类的文章
 * @Author: Murphy
 * @Date: 2025-01-10
 */
import type { Article } from "@/api/post/type";

/**
 * 需要排除的分类名称（只排除项目展示，技术分享和普通文章会显示在首页）
 */
const EXCLUDED_CATEGORIES = ["项目展示"];

/**
 * 需要排除的分类名称（用于归档页面，排除项目展示和技术分享）
 */
const EXCLUDED_CATEGORIES_FOR_ARCHIVE = ["项目展示", "技术分享"];

/**
 * 判断文章是否属于需要排除的分类
 * @param article 文章对象
 * @returns 如果文章属于项目展示分类，返回 true
 */
export function isExcludedArticle(article: Article): boolean {
  if (!article.post_categories || article.post_categories.length === 0) {
    return false;
  }

  return article.post_categories.some(category =>
    EXCLUDED_CATEGORIES.includes(category.name)
  );
}

/**
 * 判断文章是否属于归档页面需要排除的分类
 * @param article 文章对象
 * @returns 如果文章属于项目展示或技术分享分类，返回 true
 */
export function isExcludedArticleForArchive(article: Article): boolean {
  if (!article.post_categories || article.post_categories.length === 0) {
    return false;
  }

  return article.post_categories.some(category =>
    EXCLUDED_CATEGORIES_FOR_ARCHIVE.includes(category.name)
  );
}

/**
 * 过滤掉项目展示分类的文章（保留技术分享和普通文章）
 * @param articles 文章列表
 * @returns 过滤后的文章列表
 */
export function filterExcludedArticles(articles: Article[]): Article[] {
  return articles.filter(article => !isExcludedArticle(article));
}

/**
 * 过滤掉项目展示和技术分享分类的文章（用于归档页面，只保留普通文章）
 * @param articles 文章列表
 * @returns 过滤后的文章列表
 */
export function filterExcludedArticlesForArchive(articles: Article[]): Article[] {
  return articles.filter(article => !isExcludedArticleForArchive(article));
}
