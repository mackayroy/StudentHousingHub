Vue.createApp({
  data() {
      return {
        imageUrl: null
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

    fetchImage() {
      const key = '144b333569cdc843e4ee57f55bf0a947';
      const bucket = 'student-housing-hub'

      fetch(`http://localhost:8080/images/${bucket}/${key}`)
      .then(response => response.blob())
      .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        this.imageUrl = imageUrl;
      }).catch(error => {
        console.log('Error:', error)
      })
    }



    // downloadImage() {
    //   fetch("http://localhost:8080/images").then(response => response.text())
    //   .then(data => {
    //     console.log(data);
    //     this.displayImageSrc = data;
    //   });
    // }
  },
  created : function() {
    // this.downloadImage();
  }
}).mount("#app");
