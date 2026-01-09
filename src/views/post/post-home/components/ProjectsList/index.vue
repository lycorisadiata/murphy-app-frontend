<script setup lang="ts">
import { type PropType } from "vue";
import type { Article } from "@/api/post/type";
import ProjectCard from "../ProjectCard/index.vue";

const props = defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true
  }
});
</script>

<template>
  <div class="projects-list">
    <div
      v-for="(article, index) in articles"
      :key="article.id"
      class="projects-list-item"
      :style="{ '--animation-order': index }"
    >
      <ProjectCard :article="article" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  @media (width <= 768px) {
    gap: 1rem;
  }
}

.projects-list-item {
  width: 100%;
}
</style>
