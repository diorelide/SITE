<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h2 mb-2">Турагенство</h1>
        <v-divider class="mb-2"></v-divider>
      </v-col>
    </v-row>

    <!-- Задание 1 -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-2">
          <v-card-title>Задание 1: Текстовое поле</v-card-title>
          <v-card-content>
            <Airplane1 />
          </v-card-content>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Airplane1 from './Airplane1.vue';

export default {
  components: {
    Airplane1,
  },
};
</script>
