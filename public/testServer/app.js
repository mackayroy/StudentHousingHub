Vue.createApp({
  data() {
      return {
        imageUrl: null,
        properties: []
      }
  },
  methods : {
    async postImage() {
      const formData = new FormData();
      formData.append("file", this.$refs.uploadImage.files[0]);
      // name, price
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


    // *** Displaying Images Code ***
    // fetchImage() {
    //   const key = '';
    //   const bucket = 'student-housing-hub'

    //   fetch(`http://localhost:8080/properties/${bucket}/${key}`)
    //   .then(response => response.blob())
    //   .then(blob => {
    //     const imageUrl = URL.createObjectURL(blob);
    //     this.imageUrl = imageUrl;
    //   }).catch(error => {
    //     console.log('Error:', error)
    //   })
    // },
    // fetchImages() {
    //   const key = '';
    //   const bucket = 'student-housing-hub'

    //   fetch(`http://localhost:8080/properties`)
    //   .then(response => response.json())
    //   .then(data => {
    //     for (property of data) {
    //       property.imgData.blob().then(blob => {
    //         const imageUrl = URL.createObjectURL(blob);
    //         this.property.imageUrl = imageUrl;
    //       });
    //     }
    //     this.properties = data;
    //   }).catch(error => {
    //     console.log('Error:', error)
    //   })
    // }



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
