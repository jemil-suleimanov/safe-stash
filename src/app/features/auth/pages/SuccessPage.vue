<!-- src/app/pages/WelcomePage.vue -->
<template>
    <div
        class="welcome-screen flex flex-col items-center justify-center h-full text-white text-center transition-opacity duration-500 ease-in-out"
        :class="isVisible ? 'opacity-100' : 'opacity-0'"
        :style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
    >
        <!-- Optional: Subtle Logo -->
        <!-- <img src="/path/to/your-logo-white.svg" alt="SafeStash" class="w-20 h-20 mb-8 opacity-80" /> -->

        <transition name="fade-greeting" appear>
            <h1 v-if="greetingMessage" class="text-4xl sm:text-5xl font-light mb-4">
                {{ greetingMessage.greeting }}
            </h1>
        </transition>
        <transition name="fade-name" appear>
            <p v-if="greetingMessage && greetingMessage.name" class="text-2xl sm:text-3xl font-semibold">
                {{ greetingMessage.name }}
            </p>
        </transition>
        <transition name="fade-appname" appear>
            <p v-if="!greetingMessage.name" class="text-xl sm:text-2xl mt-2">
                to SafeStash!
            </p>
        </transition>

        <!-- Optional: Loading spinner or subtle animation if needed -->
        <!-- <n-spin size="large" class="mt-8" stroke="#ffffff" v-if="!isVisible" /> -->
    </div>
</template>

  <script setup lang="ts">
import { useAuthStore } from '@app/features/auth';
import { computed, onBeforeUnmount,onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// import { NSpin } from 'naive-ui'; // If you want a Naive UI spinner

const router = useRouter();
const authStore = useAuthStore();

const isVisible = ref(false); // For fade-in effect of the whole screen
const greetingMessage = ref<{ greeting: string; name?: string }>({ greeting: 'Welcome' });
let navigationTimeoutId: number | undefined = undefined;

const WELCOME_SCREEN_DURATION = 2000; // 2 seconds

// --- Greeting Logic ---
function getTimeOfDayGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good Evening'; // Late night / early morning
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
}

const friendlyGreetings = [
    'Welcome Back',
    'Hello',
    'Hi there',
    'Good to see you',
    'Hey',
];

function getRandomFriendlyGreeting(): string {
    return friendlyGreetings[Math.floor(Math.random() * friendlyGreetings.length)];
}

const personalizedGreeting = computed(() => {
    const currentUser = authStore.currentUser;
    const timeGreeting = getTimeOfDayGreeting();
    const randomGreeting = getRandomFriendlyGreeting(); // For variety

    let nameToDisplay: string | undefined = undefined;
    let chosenGreeting = `${timeGreeting}`; // Start with time-based

    // Prioritize more varied friendly greeting for subsequent logins
    // This is a simple heuristic, can be improved
    if (Math.random() > 0.4) { // 60% chance to use a random friendly greeting
        chosenGreeting = randomGreeting;
    }


    if (currentUser) {
        if (currentUser.firstName) {
            nameToDisplay = currentUser.firstName;
        } else if (currentUser.username) {
            // Only use username if no first name, and maybe only if it's not too generic
            nameToDisplay = currentUser.username;
        }
    }

    if (nameToDisplay) {
        return { greeting: `${chosenGreeting},`, name: `${nameToDisplay}!` };
    } else {
        return { greeting: chosenGreeting, name: undefined }; // Will show "to SafeStash!"
    }
});

onMounted(() => {
    if (!authStore.isAuthenticated) {
        // If somehow landed here without being authenticated, redirect to login
        router.replace({ name: 'Login' }); // Use replace to not add to history
        return;
    }

    greetingMessage.value = personalizedGreeting.value;

    // Start fade-in for the screen
    requestAnimationFrame(() => {
        isVisible.value = true;
    });

    navigationTimeoutId = window.setTimeout(() => {
        // TODO: Replace 'Dashboard' with your actual main authenticated route name
        //router.replace({ name: 'Dashboard' }); // Use replace so user can't go "back" to welcome screen
    }, WELCOME_SCREEN_DURATION);
});

onBeforeUnmount(() => {
    if (navigationTimeoutId) {
        clearTimeout(navigationTimeoutId);
    }
});
  </script>

  <style scoped>
  /* Using Tailwind for background, but CSS transitions are easier here */
  .welcome-screen {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  /* Fade-in for the whole screen */
  /* opacity is handled by :class binding */

  /* Fade transitions for text elements */
  .fade-greeting-enter-active,
  .fade-name-enter-active,
  .fade-appname-enter-active {
    transition: opacity 0.8s ease-in-out;
  }
  .fade-greeting-enter-from,
  .fade-name-enter-from,
  .fade-appname-enter-from {
    opacity: 0;
  }

  /* Staggering the appearance of text elements for a nicer effect */
  .fade-name-enter-active {
    transition-delay: 0.3s;
  }
  .fade-appname-enter-active {
    transition-delay: 0.6s; /* If name is not present, this will be the primary text after greeting */
  }

  /* Ensure name also staggers if it's the main text */
  .fade-name-enter-active {
    transition-delay: 0.3s;
  }
  /* If name is NOT present, "to SafeStash!" should appear sooner if it's the only sub-text */
  .fade-appname-enter-active:has(+ :not(.fade-name-enter-active)) { /* Poor man's check, might need JS */
    /* This CSS logic is tricky. Simpler to adjust JS delays if needed. */
  }
  </style>
