<script setup lang="ts">
import { ref, computed, onMounted, type PropType } from "vue";
import { ElTooltip } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import { storeToRefs } from "pinia";
import { IconifyIconOnline } from "@/components/ReIcon";

interface AuthorConfig {
  description: string;
  statusImg: string;
  skills: string[];
  social: Record<string, { icon: string; link: string }>;
  userAvatar: string;
  ownerName: string;
  subTitle: string;
}

const props = defineProps({
  config: {
    type: Object as PropType<AuthorConfig>,
    required: true
  }
});

const userStore = useUserStoreHook();
const { nickname, id } = storeToRefs(userStore);

const greetings = ref<string[]>([]);
const currentGreetingIndex = ref(0);
const showSkill = ref(false); // 控制是否显示技能标签

// 用户问候语（仅登录用户）
const userGreeting = computed(() => {
  // 如果没有用户昵称，返回空（不应该被调用）
  if (!nickname.value || nickname.value.trim() === "") {
    return "";
  }

  // 检查上次问候时间
  const lastGreetingTime = localStorage.getItem(`lastGreeting_${id.value}`);
  const now = Date.now();

  if (lastGreetingTime) {
    const timeDiff = now - parseInt(lastGreetingTime);
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // 如果距离上次问候超过24小时，显示"好久不见"
    if (hoursDiff > 24) {
      return `好久不见，${nickname.value}`;
    } else {
      // 24小时内，显示"欢迎再次回来"
      return `欢迎再次回来，${nickname.value}`;
    }
  } else {
    // 第一次访问，显示"欢迎光临"
    return `欢迎光临，${nickname.value}`;
  }
});

const currentGreeting = computed(() => {
  if (greetings.value.length === 0) return "集中精力，攻克难关";
  return greetings.value[currentGreetingIndex.value];
});

// 显示的内容：有昵称时默认显示问候语，无昵称直接显示技能标签
const displayGreeting = computed(() => {
  // 如果没有昵称，直接显示技能标签
  if (!nickname.value || nickname.value.trim() === "") {
    return currentGreeting.value;
  }

  // 有昵称时，根据 showSkill 状态决定显示问候语还是技能标签
  if (!showSkill.value) {
    return userGreeting.value;
  }
  return currentGreeting.value;
});

const changeSayHelloText = () => {
  if (!showSkill.value) {
    // 第一次点击，切换到显示技能
    showSkill.value = true;
    return;
  }

  // 已经在显示技能，切换到下一个技能
  const totalGreetings = greetings.value.length;
  if (totalGreetings <= 1) return;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * totalGreetings);
  } while (newIndex === currentGreetingIndex.value);
  currentGreetingIndex.value = newIndex;
};

onMounted(() => {
  if (props.config.skills && props.config.skills.length > 0) {
    greetings.value = props.config.skills;
    currentGreetingIndex.value = Math.floor(
      Math.random() * props.config.skills.length
    );
  }

  // 更新用户的最后问候时间
  if (id.value) {
    localStorage.setItem(`lastGreeting_${id.value}`, Date.now().toString());
  }
});
</script>

<template>
  <div class="card-widget card-info">
    <div class="card-content">
      <div id="author-info__sayhi" @click="changeSayHelloText">
        {{ displayGreeting }}
      </div>
      <div class="author-info-avatar">
        <img
          class="avatar-img"
          :src="config.userAvatar"
          alt="avatar"
          width="118"
          height="118"
          loading="lazy"
        />
        <div class="author-status">
          <img
            class="g-status"
            :src="config.statusImg"
            alt="status"
            width="26"
            height="26"
            loading="lazy"
          />
        </div>
      </div>
      <div class="author-info__description" v-html="config.description" />
      <div class="author-info__bottom-group">
        <router-link class="author-info__bottom-group-left" to="/about">
          <h1 class="author-info__name">{{ config.ownerName }}</h1>
          <div class="author-info__desc">{{ config.subTitle }}</div>
        </router-link>
        <div class="card-info-social-icons">
          <el-tooltip
            v-for="(social, name) in config.social"
            :key="name"
            :content="name"
            placement="top"
            :show-arrow="false"
          >
            <a
              class="social-icon"
              :href="social.link"
              :aria-label="String(name)"
              rel="external nofollow noreferrer"
              target="_blank"
            >
              <!-- 图片 URL -->
              <img
                v-if="
                  social.icon &&
                  (social.icon.startsWith('http://') ||
                    social.icon.startsWith('https://'))
                "
                :src="social.icon"
                :alt="name"
                class="social-icon-img"
              />
              <!-- Iconify 图标 -->
              <IconifyIconOnline
                v-else-if="social.icon && social.icon.includes(':')"
                :icon="social.icon"
                width="20"
                height="20"
                class="social-iconify"
              />
              <!-- anzhiyu 图标 -->
              <i
                v-else-if="social.icon"
                class="anzhiyufont"
                :class="social.icon"
              />
            </a>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 玻璃效果混入 */
@mixin glass-effect($bg-light, $bg-dark, $border-light, $border-dark) {
  background: $bg-light;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid $border-light;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);

  html.dark & {
    background: $bg-dark;
    border: 1px solid $border-dark;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
}

.card-info {
  padding: 0;
  border: none;
  contain: layout;
  border-radius: 16px;
  overflow: hidden;
  @include glass-effect(
    rgba(255, 255, 255, 0.5),
    rgba(0, 0, 0, 0.5),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.15)
  );

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: "";
    background: transparent;
  }

  .card-content {
    position: relative;
    z-index: 1;
    min-height: 320px;
    height: 320px;
    padding: 1rem 1.2rem;
  }

  &:hover {
    .author-info-avatar,
    .author-status {
      opacity: 0;
      transform: scale(0);
    }

    .author-info__description {
      opacity: 1;
    }
  }
}

#author-info__sayhi {
  width: fit-content;
  padding: 2px 8px;
  margin: auto;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  user-select: none;
  border-radius: 12px;
  transition: 0.3s;
  color: var(--anzhiyu-fontcolor);
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.8);

  html.dark & {
    color: var(--anzhiyu-white);
    background: rgba(255, 255, 255, 0.15);
  }

  &:hover {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.95);

    html.dark & {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  &:active {
    opacity: 0.8;
    transform: scale(0.8);
  }
}

.author-info-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  width: 118px;
  height: 118px;
  margin: 45px auto;
  user-select: none;
  transition: cubic-bezier(0.69, 0.39, 0, 1.21) 0.3s;
  transform-origin: bottom;

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: var(--style-border-avatar);
    border-radius: 50%;
    /* 图片加载过渡效果 */
    opacity: 0;
    background: var(--anzhiyu-secondbg);
    transition: opacity 0.6s ease;

    /* 图片加载完成后显示 */
    &[src] {
      animation: avatarFadeIn 0.6s ease forwards;
    }
  }

  @keyframes avatarFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .author-status {
    position: absolute;
    right: 2px;
    bottom: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 33px;
    overflow: hidden;
    background-color: var(--anzhiyu-white);
    border-radius: 50%;
    transition: 0.3s 0.2s;
    transform: scale(1);

    .g-status {
      width: 26px;
      height: 26px;
      border-radius: 0;
      /* 图片加载过渡效果 */
      opacity: 0;
      transition: opacity 0.6s ease;

      /* 图片加载完成后显示 */
      &[src] {
        animation: statusFadeIn 0.6s ease 0.2s forwards;
      }
    }

    @keyframes statusFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
}

.author-info__description {
  position: absolute;
  top: 50px;
  left: 0.5rem;
  width: calc(100% - 1rem);
  padding: 1rem 1.2rem;
  opacity: 0;
  z-index: 10;
  border-radius: 8px;
  transition: opacity 0.3s;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  /* 亮色模式：强制使用深色文字确保可见 */
  color: #1a1a1a !important;
  @include glass-effect(
    rgba(255, 255, 255, 0.5),
    rgba(0, 0, 0, 0.5),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.15)
  );

  html.dark & {
    color: #ffffff !important;
  }

  /* 所有子元素在亮色模式下使用深色 */
  :deep(*) {
    color: #1a1a1a !important;
  }

  :deep(div),
  :deep(p) {
    margin: 0.6rem 0;
    line-height: 1.6;
    text-align: justify;
    font-size: 14px;
    color: #1a1a1a !important;
  }

  :deep(b),
  :deep(strong) {
    font-weight: 600;
    color: #000000 !important;
  }

  :deep(span) {
    color: #1a1a1a !important;
  }

  /* 暗色模式下所有子元素使用白色 */
  html.dark & {
    :deep(*) {
      color: #ffffff !important;
    }

    :deep(div),
    :deep(p) {
      color: #ffffff !important;
    }

    :deep(b),
    :deep(strong) {
      color: #ffffff !important;
    }

    :deep(span) {
      color: #ffffff !important;
    }
  }
}

.author-info__bottom-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .author-info__bottom-group-left {
    text-decoration: none;
  }

  .author-info__name {
    margin-top: 0;
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
    text-align: left;
    color: var(--anzhiyu-fontcolor);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    html.dark & {
      color: var(--anzhiyu-white);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

  .author-info__desc {
    font-size: 12px;
    line-height: 1;
    color: var(--anzhiyu-secondtext);
    opacity: 0.8;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    html.dark & {
      color: var(--anzhiyu-white);
      opacity: 0.7;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }
}

.card-info-social-icons {
  display: flex;
  flex-flow: row wrap;
  margin: 0;
  cursor: pointer;
  min-width: 100px;

  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 10px;
    width: 40px;
    height: 40px;
    padding: 8px;
    font-size: 1.4em;
    border-radius: 32px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--anzhiyu-fontcolor);
    backdrop-filter: blur(4px);
    background: rgba(255, 255, 255, 0.8);

    html.dark & {
      color: var(--anzhiyu-white);
      background: rgba(255, 255, 255, 0.15);
    }

    &:hover {
      color: var(--anzhiyu-main);
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      html.dark & {
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      i,
      .social-iconify {
        color: var(--anzhiyu-main);
      }
    }

    i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 1rem;
      color: inherit;
    }

    .social-icon-img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .social-iconify {
      width: 20px;
      height: 20px;
      color: inherit;
    }
  }
}
</style>
