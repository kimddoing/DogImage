async function logJSONData() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const jsonData = await response.json();
        return jsonData; // JSON 데이터를 반환
    } catch (error) {
        console.error('Error fetching data:', error);
        return {message:{}}; // 에러 발생 시 null 반환
    }
}

async function populateBreedSelect() {
    const breedSelect = document.getElementById('breedSelect');

    try {
        const dataFromAPI = await logJSONData();

        const breeds = dataFromAPI.message;

        Object.keys(breeds).forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            option.text = breed;
            breedSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function populateSubBreedSelect(breed) {
    const subBreedSelect = document.getElementById('subBreedSelect');
    subBreedSelect.innerHTML = ''; // 이전에 추가된 옵션을 제거

    try {
        const dataFromAPI = await logJSONData();

        const subBreeds = dataFromAPI.message[breed];

        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.text = 'All';
        subBreedSelect.appendChild(allOption); // "All" 옵션을 기본값으로 추가

        if (subBreeds && subBreeds.length > 0) {
            subBreeds.forEach(subBreed => {
                const option = document.createElement('option');
                option.value = subBreed;
                option.text = subBreed;
                subBreedSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function imageprinter(selectedBreed) {
    const response2 = await fetch('https://dog.ceo/api/breed/'+selectedBreed+'/images');
    const imageData = await response2.json();
   
    const dogimage = imageData.message;
    const imageprinter = document.getElementById('imagearea');
    imageprinter.innerHTML = '';
    

    dogimage.forEach(dog => {
        const printimage = document.createElement('img');
        printimage.src = dog;
        printimage.alt = 'dog image';
        printimage.width = 200;
        printimage.height = 200;
        imageprinter.appendChild(printimage)
    });

}

populateBreedSelect();

// 브리드가 선택되었을 때 서브브리드 셀렉트 박스에 해당하는 데이터 추가
document.getElementById('breedSelect').addEventListener('change', function(e) {
    const selectedBreed = e.target.value;
    populateSubBreedSelect(selectedBreed);
    imageprinter(selectedBreed);
});

