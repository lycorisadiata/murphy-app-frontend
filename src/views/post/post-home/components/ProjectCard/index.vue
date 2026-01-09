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

const goToProject = (id: string) => {
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
  <div class="project-card" @click="goToProject(article.id)">
    <div class="project-cover">
      <img
        class="project-cover-img lazy-loading"
        :data-src="coverUrl"
        :alt="article.title"
      />
      <div class="project-cover-overlay">
        <div class="project-badges">
          <span
            v-if="article.pin_sort > 0"
            class="project-badge project-badge-pinned"
          >
            <i class="anzhiyufont anzhiyu-icon-thumbtack" />
            置顶
          </span>
          <span
            v-if="article.comment_count > 10"
            class="project-badge project-badge-hot"
          >
            <i class="anzhiyufont anzhiyu-icon-fire" />
            热门
          </span>
        </div>
      </div>
    </div>
    <div class="project-content">
      <div class="project-header">
        <h3 class="project-title" :title="article.title">
          {{ article.title }}
        </h3>
        <div class="project-meta">
          <span class="project-date">
            <i class="anzhiyufont anzhiyu-icon-clock" />
            <time :datetime="article.created_at">{{
              formatRelativeTime(article.created_at)
            }}</time>
          </span>
          <span class="project-views">
            <i class="anzhiyufont anzhiyu-icon-eye" />
            {{ article.view_count }}
          </span>
        </div>
      </div>
      <div v-if="article.summaries && article.summaries.length > 0" class="project-summary">
        {{ article.summaries[0] }}
      </div>
      <div class="project-footer">
        <div class="project-tags">
          <span
            v-for="tag in article.post_tags"
            :key="tag.id"
            class="project-tag"
            @click.stop="goToTagPage(tag.name)"
          >
            <i class="anzhiyufont anzhiyu-icon-hashtag" />
            {{ tag.name }}
          </span>
        </div>
        <div class="project-categories">
          <span
            v-for="category in article.post_categories"
            :key="category.id"
            class="project-category"
            @click.stop="goToCategoryPage(category.name)"
          >
            {{ category.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
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
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    border-color: var(--anzhiyu-main-op);
    box-shadow: var(--anzhiyu-shadow-main);
    transform: translateY(-4px);

    .project-cover-img {
      transform: scale(1.1);
    }

    .project-title {
      color: var(--anzhiyu-main);
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }
}

.project-cover {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: var(--anzhiyu-secondbg);

  @media (width <= 768px) {
    height: 200px;
  }
}

.project-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
}

.project-badges {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.project-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--anzhiyu-white);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  transition: all 0.3s;

  i {
    font-size: 0.7rem;
  }

  &.project-badge-pinned {
    background: rgba(255, 193, 7, 0.9);
  }

  &.project-badge-hot {
    background: rgba(255, 87, 34, 0.9);
  }
}

.project-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;

  @media (width <= 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
}

.project-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-title {
  margin: 0;
  font-size: 1.5rem;
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

.project-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--anzhiyu-secondtext);
}

.project-date,
.project-views {
  display: flex;
  align-items: center;
  gap: 4px;

  i {
    font-size: 0.875rem;
  }
}

.project-summary {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--anzhiyu-secondtext);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--anzhiyu-card-border);
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-tag {
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

.project-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-category {
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
</style>
