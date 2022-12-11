import label from './label.js'

const main = () => {
    const submitButton = document.querySelector('input[type=submit]') 
    const resetButton = document.querySelector('input[type=reset]')
    const fileUpload = document.querySelector('input[type=file]')
    const file = document.querySelector('.preview')
    
    const IMAGE_HEIGHT = 50
    const IMAGE_WIDTH = 50

    const loadModel = async() => {
        return await tf.loadLayersModel('https://raw.githubusercontent.com/rezqiayunita/capstone/main/src/model/model.json')
    }
    
    const preprocessImage = async (input) => {
        let tensor = await tf.browser.fromPixels(input)
        .resizeNearestNeighbor([IMAGE_HEIGHT, IMAGE_WIDTH])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims()
        // console.log(tensor);

        return tensor
    }
    
    const predicting = async (input) => {
        const model = await loadModel()
        // console.log(model.predict(input));
        let prediction = await model.predict(input).data()
        // console.log(prediction);
        let top = Array.from(prediction)
        .map((p, i) => {
            return {
                probability: parseFloat(p),
                className: label[i]
            }
        })
        return top
    }
    
    const submitData = async () => {
        const inputName = document.querySelector('#name').value
        const inputAge = document.querySelector('#age').value
        const inputGender = document.querySelector('#gender').value
        const inputImage = document.querySelector('#image').value[0]
        const errorMessage = document.getElementsByClassName('error')
        const loading = document.querySelector('.loader')
        const result = document.querySelector('.result')
        
        
        if(result.innerHTML === ``) {loading.style.display = 'block'}

        if(!inputName || !inputAge || !inputImage){
            if(!inputName) {errorMessage[0].style.display = 'block'}
            if(!inputAge) {errorMessage[1].style.display = 'block'}
            if(!inputImage) {errorMessage[2].style.display = 'block'}
        }
        else if(inputName && inputAge && inputImage && inputGender){
            const preprocessed = await preprocessImage(file)
            const predicted = await predicting(preprocessed)
            // console.log(preprocessed);
            console.log(predicted)
            result.innerHTML = `
            <h4>Nama          : ${inputName}</h4>
            <h4>Umur          : ${inputAge}</h4>
            <h4>Jenis Kelamin : ${inputGender}</h4>
            <h4>Hasil Scan    : </h4>
            <img src="${file.src}" width="150px" alt="">
            <p style="margin-top: 10px">${predicted[0].probability < 0.99999999 ? "Selamat, hasil tersebut tidak terindikasi adanya sel kanker" : "Anda terindikasi terkena kanker, silakan konsultasikan ke dokter untuk pencegahan"}</p>
            `
            loading.style.display = 'none'
        }
    }

    const resetData = () => {
        const result = document.querySelector('.result')
        file.src = ''
        // file.setAttribute('hidden')
        result.innerHTML = ``
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
    resetButton.addEventListener('click', resetData)
}    
export default main