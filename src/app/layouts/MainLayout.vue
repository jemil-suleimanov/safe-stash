<template>
    <div class="main-layout flex h-screen antialiased">
        <NavBar class="transition-all duration-300 ease-in-out" />
        <main class="flex-1 flex flex-col overflow-y-auto">
            <TopBar />
            <div class="p-4 sm:p-6 lg:p-8 flex-1">
                <router-view v-slot="{ Component }">
                    <component :is="Component" />
                </router-view>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { NavBar, TopBar } from '@app/features/navigation';
</script>

<style scoped>
  /* Page Transition */
  .fade-page-enter-active,
  .fade-page-leave-active {
    transition: opacity 0.2s ease-out;
  }

  .fade-page-enter-from,
  .fade-page-leave-to {
    opacity: 0;
  }
</style>
