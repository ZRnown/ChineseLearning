<template>
  <div>
    <TranslationModule 
      @language-selected="updateLanguage"
    />
    <AIGuide 
      ref="aiGuide" 
      :language="selectedLanguage"
      :isLoggedIn="$store.state.isAuthenticated"
      @language-updated="generateGuide" 
    />
  </div>
</template>

<script>
import TranslationModule from './components/TranslationModule.vue';
import AIGuide from './components/AIGuide.vue';

export default {
  components: {
    TranslationModule,
    AIGuide,
  },
  data() {
    return {
      selectedLanguage: 'en',
    };
  },
  methods: {
    updateLanguage(language) {
      this.selectedLanguage = language;
      if (this.$refs.aiGuide && this.$refs.aiGuide.updateLanguage) {
        this.$refs.aiGuide.updateLanguage(language);
      }
    },
    generateGuide() {
      if (this.$refs.aiGuide && this.$refs.aiGuide.generateGuide) {
        this.$refs.aiGuide.generateGuide();
      }
    },
  },
};
</script>