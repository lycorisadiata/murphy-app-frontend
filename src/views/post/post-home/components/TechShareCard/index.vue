<script setup lang="ts">
import { computed, type PropType } from "vue";
import type { Article } from "@/api/post/type";
import { useRouter } from "vue-router";
import { useArticleStore } from "@/store/modules/articleStore";
import { formatRelativeTime } from "@/utils/format";

const articleStore = useArticleStore();
const router = useRouter();

const props = defineProps({
  article: {
    type: Object as PropType<Article>,
    required: true
  }
});

const coverUrl = computed(() => {
  return props.article.cover_url || articleStore.defaultCover;
});

const goToTechShare = (id: string) => {
  router.push({ path: `/posts/${id}` });
};

const goToCategoryPage = (categoryName: string) => {
  router.push(`/categories/${categoryName}/`);
};

const goToTagPage = (tagName: string) => {
  router.push(`/tags/${tagName}/`);
};
</script>

<template>
  <div class="tech-share-card" @click="goToTechShare(article.id)">
    <!-- 左侧内容区域 - 突出内容可读性 -->
    <div class="tech-share-content">
      <div class="tech-share-header">
        <!-- 技术分类标签 -->
        <div class="tech-share-categories">
          <span
            v-for="category in article.post_categories"
            :key="category.id"
            class="tech-share-category"
            @click.stop="goToCategoryPage(category.name)"
          >
            <i class="anzhiyufont anzhiyu-icon-book" />
            {{ category.name }}
          </span>
        </div>
        
        <!-- 标题 -->
        <h3 class="tech-share-title" :title="article.title">
          {{ article.title }}
        </h3>
        
        <!-- 摘要 -->
        <div v-if="article.summaries && article.summaries.length > 0" class="tech-share-summary">
          {{ article.summaries[0] }}
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="tech-share-footer">
        <!-- 元数据 -->
        <div class="tech-share-meta">
          <span class="tech-share-date">
            <i class="anzhiyufont anzhiyu-icon-clock" />
            <time :datetime="article.created_at">{{
              formatRelativeTime(article.created_at)
            }}</time>
          </span>
          <span class="tech-share-views">
            <i class="anzhiyufont anzhiyu-icon-eye" />
            {{ article.view_count }}
          </span>
          <span v-if="article.comment_count > 0" class="tech-share-comments">
            <i class="anzhiyufont anzhiyu-icon-comment" />
            {{ article.comment_count }}
          </span>
        </div>
        
        <!-- 技术标签 - 突出技术关键词 -->
        <div class="tech-share-tags-wrapper">
          <div class="tech-share-tags">
            <span
              v-for="tag in article.post_tags"
              :key="tag.id"
              class="tech-share-tag"
              @click.stop="goToTagPage(tag.name)"
            >
              <i class="anzhiyufont anzhiyu-icon-hashtag" />
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧封面图 - 较小，不抢夺内容焦点 -->
    <div class="tech-share-cover">
      <img
        class="tech-share-cover-img lazy-loading"
        :data-src="coverUrl"
        :alt="article.title"
      />
      <!-- 技术分享标识 -->
      <div class="tech-share-badge">
        <i class="anzhiyufont anzhiyu-icon-code" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tech-share-card {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  cursor: pointer;
  background: var(--anzhiyu-card-bg);
  border: 1.5px solid var(--anzhiyu-card-border);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 淡入动画
  opacity: 0;
  animation: fadeInCard 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);

  @keyframes fadeInCard {
    from {
      opacity: 0;
      transform: translateX(-15px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (width <= 768px) {
    flex-direction: column;
  }

  &:hover {
    border-color: var(--anzhiyu-main-op);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);

    .tech-share-cover-img {
      transform: scale(1.08);
    }

    .tech-share-title {
      color: var(--anzhiyu-main);
    }

    .tech-share-tag {
      background: var(--anzhiyu-main-op-light);
      color: var(--anzhiyu-main);
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.99);
  }
}

.tech-share-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem;
  gap: 1.25rem;
  justify-content: space-between;
  min-width: 0; // 防止内容溢出

  @media (width <= 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }
}

.tech-share-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tech-share-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-share-category {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--anzhiyu-main);
  background: linear-gradient(135deg, var(--anzhiyu-main-op-light) 0%, rgba(var(--anzhiyu-main-rgb), 0.08) 100%);
  border: 1px solid var(--anzhiyu-main-op);
  border-radius: 20px;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  i {
    font-size: 0.75rem;
  }

  &:hover {
    background: var(--anzhiyu-main-op);
    color: var(--anzhiyu-white);
    border-color: var(--anzhiyu-main);
    transform: translateY(-1px);
  }
}

.tech-share-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.4;
  color: var(--anzhiyu-fontcolor);
  transition: color 0.3s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;

  @media (width <= 768px) {
    font-size: 1.3rem;
  }
}

.tech-share-summary {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--anzhiyu-secondtext);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

.tech-share-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--anzhiyu-card-border);
}

.tech-share-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--anzhiyu-secondtext);
  flex-wrap: wrap;
  font-weight: 500;
}

.tech-share-date,
.tech-share-views,
.tech-share-comments {
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    font-size: 0.875rem;
    opacity: 0.7;
  }
}

.tech-share-tags-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tech-share-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-share-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--anzhiyu-secondtext);
  background: var(--anzhiyu-secondbg);
  border: 1px solid var(--anzhiyu-card-border);
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  i {
    font-size: 0.75rem;
    opacity: 0.6;
  }

  &:hover {
    color: var(--anzhiyu-main);
    background: var(--anzhiyu-main-op-light);
    border-color: var(--anzhiyu-main-op);
    transform: translateY(-1px);
  }
}

.tech-share-cover {
  position: relative;
  flex-shrink: 0;
  width: 280px;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-left: 1px solid var(--anzhiyu-card-border);

  @media (width <= 768px) {
    width: 100%;
    height: 220px;
    border-left: none;
    border-top: 1px solid var(--anzhiyu-card-border);
  }
}

.tech-share-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.9;
}

.tech-share-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: var(--anzhiyu-main);
  font-size: 1.5rem;
  transition: all 0.3s;

  i {
    font-size: 1.25rem;
  }

  .tech-share-card:hover & {
    transform: scale(1.1) rotate(5deg);
    background: var(--anzhiyu-main);
    color: var(--anzhiyu-white);
  }
}
</style>
