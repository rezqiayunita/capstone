const tf = require('@tensorflow/tfjs')
// import * as tf from '@tensorflow/tfjs'

const main = () => {
    const submitButton = document.querySelector('input[type=submit]') 
    const fileUpload = document.querySelector('input[type=file]')
    const file = document.querySelector('.preview')

    const IMAGE_HEIGHT = 50;
    const IMAGE_WIDTH = 50;
    const IMAGE_SIZE = IMAGE_HEIGHT * IMAGE_WIDTH;


/*
 * Load Model
 */

const MODEL_PATH = 'https://raw.githubusercontent.com/rezqiayunita/capstone/main/predict/model.json';

const loadModel = async() => {
    return await tf.loadModel(MODEL_PATH);
}

const predict = (model, imageData) => {
    console.log(imageData);
    const image = tf.fromPixels(imageData);
    const input = image
        // RGBA to grey
        .max(2)
        // Convert to float32. tf.js doesn't do implicit conversion
        .cast('float32')
        // Convert int to float between 0 to 1
        .div(tf.tensor(255.))
        // Prepare input for prediction 
        .reshape([-1, IMAGE_HEIGHT * IMAGE_WIDTH]);
    const prediction = model.predict(input).argMax(1);
    return prediction.dataSync();
}

function classesFromLabels(y) {
    return Array.from(tf.tensor(y).reshape([-1, 10]).argMax(1).dataSync());
}

/*
 * Load data
 */

const MNIST_IMAGES_SPRITE_PATH = '/js/assets/mnist_images.png';
const MNIST_LABELS_PATH = '/js/assets/mnist_labels_uint8';
const NUM_DATASET_ELEMENTS = 1000;

function loadData() {
    loadImg = (img, done) => {
        const canvas = document.createElement('canvas');
        canvas.width = IMAGE_SIZE;
        canvas.height = NUM_DATASET_ELEMENTS;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.naturalWidth, NUM_DATASET_ELEMENTS);
        done(imageData);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = '';
        img.onload = () => loadImg(img, resolve);
        img.src = MNIST_IMAGES_SPRITE_PATH;
    });
}

function loadLabels() {
    return fetch(MNIST_LABELS_PATH);
}

/*
 * Display
 */

// For testing
function drawImageData(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    document.body.appendChild(canvas);
    for (let i = 0; i < imageData.height; ++i) {
        const canvas = document.createElement('canvas');
        draw(canvas, imageData, i, IMAGE_WIDTH, IMAGE_HEIGHT);
        document.body.appendChild(canvas);
    }
}

function draw(canvas, src, start, width, height) {
    canvas.width = width;
    canvas.height = height;
    const size = width * height * 4;
    const p = start * size;

    const imageData = new ImageData(width, height);
    for (let i = 0; i < size; ++i) {
        imageData.data[i] = src.data[p + i];
    }
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

function showResults(image, labels, predictions) {
    for (let i = 0; i < predictions.length; ++i) {
        const title = document.createElement('div')
        title.className = (predictions[i] == labels[i]) ?
            'pred-correct' : 'pred-incorrect';
        title.innerHTML = `pred: ${predictions[i]} label: ${labels[i]}`;

        const canvas = document.createElement('canvas');
        draw(canvas, image, i, IMAGE_WIDTH, IMAGE_HEIGHT);

        const container = document.createElement('div');
        container.className = 'pred-container';
        container.appendChild(title);
        container.appendChild(canvas);
        document.body.appendChild(container);
    }
}


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