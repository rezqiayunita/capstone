const main = () => {
    const submitButton = document.querySelector('input[type=submit]') 
    const fileUpload = document.querySelector('input[type=file]')
    const file = document.querySelector('.preview')

    let model;
    async function loadModel() {
      console.log("model loading..");
      let modelName = "mobilenet";
	    model = undefined;
      model = await tf.loadLayersModel('https://raw.githubusercontent.com/rezqiayunita/capstone/main/predict/model.json');
      console.log("model loaded..");
    }

    loadModel()

    async function predButton() {
      console.log("model loading..");

      if (model == undefined) {
        alert("Please load the model first..")
      }
      // if (document.getElementById("predict-box").style.display == "none") {
      //   alert("Please load an image using 'Demo Image' or 'Upload Image' button..")
      // }
      console.log(model);
      let tensor = preprocessImage(file, "mobilenet");

      let predictions = await model.predict(tensor).data();
      let results = Array.from(predictions)
        .map(function (p, i) {
          return {
            probability: p,
            className: IMAGENET_CLASSES[i]
          };
        }).sort(function (a, b) {
          return b.probability - a.probability;
        }).slice(0, 5);

      document.querySelector('.result').innerHTML += "MobileNet prediction <br><b>" + results[0].className + "</b>";
    }

    function preprocessImage(image, modelName) {
      let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat();

      if (modelName === undefined) {
        return tensor.expandDims();
      } else if (modelName === "mobilenet") {
        let offset = tf.scalar(127.5);
        return tensor.sub(offset)
          .div(offset)
          .expandDims();
      } else {
        alert("Unknown model name..")
      }
    }

    // function loadDemoImage() {
    //   document.getElementById("predict-box").style.display = "table-cell";
    //   document.getElementById("prediction").innerHTML = "Click predict to find my label!";
    //   document.getElementById("select-file-box").style.display = "table-cell";
    //   document.getElementById("predict-list").innerHTML = "";

    //   base_path = "dataset/test/tennis.jpeg"
    //   // maximum = 4;
    //   // minimum = 1;
    //   // var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    //   // img_path = base_path + randomnumber + ".jpeg"
    //   img_path = base_path
    //   document.getElementById("test-image").src = img_path;
    // }

    function submitData() {
        const inputName = document.querySelector('#name').value
        const inputAge = document.querySelector('#age').value
        const inputGender = document.querySelector('#gender').value
        const inputImage = document.querySelector('#image').value[0]
        const errorMessage = document.getElementsByClassName('error')
        const result = document.querySelector('.result')

        if(!inputName || !inputAge || !inputImage){
            if(!inputName) {errorMessage[0].style.display = 'block'}
            if(!inputAge) {errorMessage[1].style.display = 'block'}
            if(!inputImage) {errorMessage[2].style.display = 'block'}
        }
        else if(inputName && inputAge && inputImage && inputGender){
            result.innerHTML = `
            <h4>Nama          : ${inputName}</h4>
            <h4>Umur          : ${inputAge}</h4>
            <h4>Jenis Kelamin : ${inputGender}</h4>
            <h4>Hasil Scan    : </h4>
            <img src="${file.src}" width="200px" alt="">`

            predButton()
        }
    }

    const previewFile = () => {
        const preview = document.querySelector('.preview');
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();
      
        reader.addEventListener("load", () => {
          // convert image file to base64 string
          preview.removeAttribute('hidden')
          preview.src = reader.result;
        }, false);
      
        if (file) {
          reader.readAsDataURL(file);
        }
      }
      
    fileUpload.addEventListener('change', previewFile)
    submitButton.addEventListener('click', submitData)
      
}    
export default main