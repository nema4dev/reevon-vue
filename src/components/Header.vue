<template>
  <header class="bg-gray-800 text-white p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img src="../assets/logo.png" alt="Logo" class="h-8 w-8 mr-2" height="151" width="112" />
        <h1 class="text-2xl font-bold">Reevon Secure</h1>
      </div>
      <nav>
        <ul class="flex">
          <li class="mr-4">
            <router-link
                to="/encrypt"
                class="px-4 py-2 rounded-full focus:outline-none hover:bg-blue-700 relative"
                :class="{'bg-blue-400 text-white': isActive('/encrypt'), 'bg-gray-400 text-gray-300 cursor-pointer': !isActive('/encrypt')}"
            >
              <span class="fas fa-lock"></span> Encrypter
            </router-link>
          </li>
          <li>
            <router-link
                to="/decrypt"
                class="px-4 py-2 rounded-full focus:outline-none hover:bg-blue-700 relative"
                :class="{'bg-blue-400 text-white': isActive('/decrypt'), 'bg-gray-400 text-gray-300 cursor-pointer': !isActive('/decrypt')}"
            >
              <span class="fas fa-lock-open"></span> Decrypter
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
const $route = useRoute();
const isActive = (path) => $route.path === path;

</script>
