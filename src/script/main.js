const main = () => {
    const submitButton = document.querySelector('input[type=submit]') 
    const fileUpload = document.querySelector('input[type=file]')

    const loadModel = async() => {
      const model = await tf.loadGraphModel
    }

    function submitData() {
        const inputName = document.querySelector('#name').value
        const inputAge = document.querySelector('#age').value
        const inputGender = document.querySelector('#gender').value
        const inputImage = document.querySelector('#image').value[0]
        const errorMessage = document.getElementsByClassName('error')
        const result = document.querySelector('.result')
        const file = document.querySelector('.preview');

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