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
    <!-- 项目封面区域 - 大图展示，突出视觉效果 -->
    <div class="project-cover">
      <img
        class="project-cover-img lazy-loading"
        :data-src="coverUrl"
        :alt="article.title"
      />
      <!-- 渐变遮罩层 -->
      <div class="project-cover-overlay">
        <!-- 徽章区域 -->
        <div class="project-badges">
          <span
            v-if="article.pin_sort > 0"
            class="project-badge project-badge-pinned"
          >
            <i class="anzhiyufont anzhiyu-icon-thumbtack" />
            精选项目
          </span>
          <span
            v-if="article.comment_count > 10"
            class="project-badge project-badge-hot"
          >
            <i class="anzhiyufont anzhiyu-icon-fire" />
            热门
          </span>
        </div>
        <!-- 项目标题悬浮显示 -->
        <div class="project-cover-title">
          <h3>{{ article.title }}</h3>
        </div>
      </div>
    </div>
    
    <!-- 项目内容区域 -->
    <div class="project-content">
      <!-- 项目信息头部 -->
      <div class="project-header">
        <div class="project-title-wrapper">
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
      </div>
      
      <!-- 项目描述 -->
      <div v-if="article.summaries && article.summaries.length > 0" class="project-summary">
        {{ article.summaries[0] }}
      </div>
      
      <!-- 项目底部信息 -->
      <div class="project-footer">
        <!-- 技术栈标签 - 突出项目使用的技术 -->
        <div class="project-tech-stack">
          <span class="tech-stack-label">
            <i class="anzhiyufont anzhiyu-icon-code" />
            技术栈
          </span>
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
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  // 淡入动画
  opacity: 0;
  animation: fadeInCard 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: calc(var(--animation-order, 0) * 0.1s);

  @keyframes fadeInCard {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    border-color: var(--anzhiyu-main-op);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-8px);

    .project-cover-img {
      transform: scale(1.15);
    }

    .project-cover-overlay {
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0.6) 100%
      );
    }

    .project-cover-title {
      opacity: 1;
      transform: translateY(0);
    }

    .project-title {
      color: var(--anzhiyu-main);
    }
  }

  &:active {
    transform: translateY(-4px) scale(0.98);
  }
}

.project-cover {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (width <= 768px) {
    height: 240px;
  }
}

.project-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
  transition: background 0.4s ease;
}

.project-badges {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  z-index: 2;
}

.project-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--anzhiyu-white);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  i {
    font-size: 0.7rem;
  }

  &.project-badge-pinned {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
  }

  &.project-badge-hot {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    box-shadow: 0 4px 12px rgba(250, 112, 154, 0.4);
  }
}

.project-cover-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
  z-index: 2;

  h3 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1.2;
    color: var(--anzhiyu-white);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }
}

.project-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem;
  gap: 1.25rem;
  background: var(--anzhiyu-card-bg);

  @media (width <= 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }
}

.project-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--anzhiyu-fontcolor);
  transition: color 0.3s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.02em;

  @media (width <= 768px) {
    font-size: 1.5rem;
  }
}

.project-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--anzhiyu-secondtext);
}

.project-date,
.project-views {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;

  i {
    font-size: 0.875rem;
    opacity: 0.7;
  }
}

.project-summary {
  flex: 1;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--anzhiyu-secondtext);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

.project-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 2px solid var(--anzhiyu-card-border);
}

.project-tech-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tech-stack-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--anzhiyu-main);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  i {
    font-size: 1rem;
  }
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.project-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--anzhiyu-fontcolor);
  background: linear-gradient(135deg, var(--anzhiyu-secondbg) 0%, var(--anzhiyu-card-bg) 100%);
  border: 1.5px solid var(--anzhiyu-card-border);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  i {
    font-size: 0.8rem;
    opacity: 0.6;
  }

  &:hover {
    color: var(--anzhiyu-main);
    background: var(--anzhiyu-main-op-light);
    border-color: var(--anzhiyu-main-op);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
