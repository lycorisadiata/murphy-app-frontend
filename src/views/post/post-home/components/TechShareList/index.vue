<script setup lang="ts">
import { type PropType } from "vue";
import type { Article } from "@/api/post/type";
import TechShareCard from "../TechShareCard/index.vue";

const props = defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true
  }
});
</script>

<template>
  <div class="tech-share-list">
    <div
      v-for="(article, index) in articles"
      :key="article.id"
      class="tech-share-list-item"
      :style="{ '--animation-order': index }"
    >
      <TechShareCard :article="article" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tech-share-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  @media (width <= 768px) {
    gap: 1rem;
  }
}

.tech-share-list-item {
  width: 100%;
}
</style>
