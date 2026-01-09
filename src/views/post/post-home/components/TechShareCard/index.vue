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
    <div class="tech-share-cover">
      <img
        class="tech-share-cover-img lazy-loading"
        :data-src="coverUrl"
        :alt="article.title"
      />
    </div>
    <div class="tech-share-content">
      <div class="tech-share-header">
        <div class="tech-share-categories">
          <span
            v-for="category in article.post_categories"
            :key="category.id"
            class="tech-share-category"
            @click.stop="goToCategoryPage(category.name)"
          >
            {{ category.name }}
          </span>
        </div>
        <h3 class="tech-share-title" :title="article.title">
          {{ article.title }}
        </h3>
        <div v-if="article.summaries && article.summaries.length > 0" class="tech-share-summary">
          {{ article.summaries[0] }}
        </div>
      </div>
      <div class="tech-share-footer">
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
  border: var(--style-border);
  border-radius: 16px;
  box-shadow: var(--anzhiyu-shadow-border);
  transition: all 0.3s ease-in-out;

  // 淡入动画
  opacity: 0;
  animation: fadeInCard 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);

  @keyframes fadeInCard {
    from {
      opacity: 0;
      transform: translateX(-10px);
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
    box-shadow: var(--anzhiyu-shadow-main);
    transform: translateY(-2px);

    .tech-share-cover-img {
      transform: scale(1.05);
    }

    .tech-share-title {
      color: var(--anzhiyu-main);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
}

.tech-share-cover {
  position: relative;
  flex-shrink: 0;
  width: 300px;
  height: 200px;
  overflow: hidden;
  background: var(--anzhiyu-secondbg);

  @media (width <= 768px) {
    width: 100%;
    height: 200px;
  }
}

.tech-share-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.tech-share-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
  justify-content: space-between;

  @media (width <= 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
}

.tech-share-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tech-share-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-share-category {
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--anzhiyu-main);
  background: var(--anzhiyu-main-op-light);
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: var(--anzhiyu-main-op);
    color: var(--anzhiyu-white);
  }
}

.tech-share-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--anzhiyu-fontcolor);
  transition: color 0.3s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (width <= 768px) {
    font-size: 1.25rem;
  }
}

.tech-share-summary {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--anzhiyu-secondtext);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tech-share-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--anzhiyu-card-border);
}

.tech-share-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--anzhiyu-secondtext);
  flex-wrap: wrap;
}

.tech-share-date,
.tech-share-views,
.tech-share-comments {
  display: flex;
  align-items: center;
  gap: 4px;

  i {
    font-size: 0.875rem;
  }
}

.tech-share-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-share-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 0.8rem;
  color: var(--anzhiyu-secondtext);
  background: var(--anzhiyu-secondbg);
  border-radius: 12px;
  transition: all 0.3s;

  i {
    font-size: 0.75rem;
  }

  &:hover {
    color: var(--anzhiyu-main);
    background: var(--anzhiyu-main-op-light);
  }
}
</style>
