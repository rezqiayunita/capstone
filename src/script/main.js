// const tf = require('@tensorflow/tfjs')
// import * as tf from '@tensorflow/tfjs'

// import { TFHUB_SEARCH_PARAM } from "@tensorflow/tfjs-converter/dist/executor/graph_model"

const main = () => {
    const submitButton = document.querySelector('input[type=submit]') 
    const fileUpload = document.querySelector('input[type=file]')
    const file = document.querySelector('.preview')
    
    // file.addEventListener('load', () => {
    //     // console.log('hai');
    //     // const c = document.getElementById('myCanvas');
    //     // const ctx = c.getContext('2d')
    //     // const img = document.querySelector('.preview')
    //     // ctx.drawImage(img, 0, 0)
    //     // var imgData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
    //     // console.log(imgData.data);
    //     // var input = []
    //     // for (let i = 0; i < imgData.data.length; i += 4) {
    //     //     input.push(imgData.data[i+2] / 255)
    //     //     // imgData.data[i+1] = 255 - imgData.data[i+1];
    //     //     // imgData.data[i+2] = 255 - imgData.data[i+2];
    //     //     // imgData.data[i+3] = 255;
    //     // }
    //     // console.log(input);
    //     // console.log(input);
    //     // ctx.putImageData(new Uint8Array(input), 0, 0)
    // })

    const IMAGE_HEIGHT = 50
    const IMAGE_WIDTH = 50
    const IMAGE_SIZE = IMAGE_HEIGHT * IMAGE_WIDTH


    const loadModel = async()=> {
        const model = await tf.loadLayersModel('/predict/model.json')
        // console.log(model)
        // return model
        window.model = model
        console.log(window.model)
        return window.model
    }

    loadModel()
    // console.log(window.model);
    var predictImage = (input) => {
        const model = loadModel()
        if(window.model){
            model.predict([tf.tensor(input).reshape([1, IMAGE_HEIGHT, IMAGE_WIDTH, 1])]).array().then(scores => {
            scores = scores[0];
            predicted = scores.indexOf(Math.max(...scores));
            console.log(predicted)
            document.querySelector('.result').innerHTML += `${predicted}`
              })
        }
        else {
            // The model takes a bit to load, if we are too fast, wait
            setTimeout(() => predictImage(input), 100);
        }
    }
    

    function submitData() {
        const inputName = document.querySelector('#name').value
        const inputAge = document.querySelector('#age').value
        const inputGender = document.querySelector('#gender').value
        const inputImage = document.querySelector('#image').value[0]
        const errorMessage = document.getElementsByClassName('error')
        const result = document.querySelector('.result')
        const c = document.getElementById('myCanvas');
        const ctx = c.getContext('2d')
        const img = document.querySelector('.preview')
        ctx.drawImage(img, 0, 0)
        var imgData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
        console.log(imgData.data);
        let input = []
        for (let i = 0; i < imgData.data.length; i += 4) {
            input.push(imgData.data[i+2] / 255)
            // imgData.data[i+1] = 255 - imgData.data[i+1];
            // imgData.data[i+2] = 255 - imgData.data[i+2];
            // imgData.data[i+3] = 255;
        }

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
            <img src="${file.src}" width="200px" alt="">
            `
            console.log(input)
            predictImage(input)
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