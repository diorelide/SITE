<template>
  <v-container class="fill-height" style="min-height: 60vh;">
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-h2 font-weight-bold mb-6">Контакты</h1>
        <v-list class="text-left" style="max-width: 400px; margin: 0 auto;">
          <v-list-item @click="copyToClipboard('+79123456789')" style="cursor: pointer;">
            <v-list-item-icon><v-icon>mdi-phone</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>+7 (912) 345-67-89</v-list-item-title>
              <v-list-item-subtitle>Нажмите, чтобы скопировать номер</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="copyToClipboard('toursveryhipe@kruto.och')" style="cursor: pointer;">
            <v-list-item-icon><v-icon>mdi-email</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>toursveryhipe@kruto.och</v-list-item-title>
              <v-list-item-subtitle>Нажмите, чтобы скопировать email</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="copyToClipboard('г. Париж, ул. Капитана Воронина, д. 6')" style="cursor: pointer;">
            <v-list-item-icon><v-icon>mdi-map-marker</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>г. Париж, ул. Капитана Воронина, д. 6</v-list-item-title>
              <v-list-item-subtitle>Нажмите, чтобы скопировать адрес</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert(`Скопировано: ${text}`);
};
</script>