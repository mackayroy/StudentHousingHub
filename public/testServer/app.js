Vue.createApp({
  data() {
      return {
      }
  },
  methods : {
    async postImage() {
      const formData = new FormData();
      formData.append("file", this.$refs.uploadImage.files[0]);
      try {
        const response = await fetch('http://localhost:8080/images', {
          method: 'POST',
          body: formData,
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      
        const result = await response.json();
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      } 
    },
  },
  created : function() {
    // this.postImage();
  }
}).mount("#app");
