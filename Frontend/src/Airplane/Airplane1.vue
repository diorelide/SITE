<template>
  <v-text-field
    v-model="text"
    label="Введите текст"
    variant="outlined"
  ></v-text-field>
</template>

<script>
export default {
  data() {
    return {
      text: '',
    };
  },
};
</script>
