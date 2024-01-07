async function fetchDogBreeds() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const jsonData = await response.json();
        return jsonData.message; // 품종 데이터를 반환
    } catch (error) {
        console.error('Error fetching data:', error);
        return {Object:{}}; // 에러 발생 시 빈 객체 반환
    }
}

async function populateBreedSelect() {
    const breedSelect = document.getElementById('breedSelect');

    try {
        const breeds = await fetchDogBreeds();

        Object.keys(breeds).forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            option.text = breed;
            breedSelect.appendChild(option);
        });

        imagePrinter(breedSelect.options[0].value);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function populateSubBreedSelect(breed) {
    const subBreedSelect = document.getElementById('subBreedSelect');
    subBreedSelect.innerHTML = ''; // 이전에 추가된 옵션을 제거

    try {
        const breeds = await fetchDogBreeds();
        const subBreeds = breeds[breed];

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

        subBreedSelect.addEventListener('change', function(e) {
            const selectedSubBreed = e.target.value;
            imagePrinter(breed, selectedSubBreed);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

async function imagePrinter(selectedBreed, selectedSubBreed = '') {
    try {
        let url = `https://dog.ceo/api/breed/${selectedBreed}/images`;

        if (selectedSubBreed !== 'all' && selectedSubBreed !== '') {
            url = `https://dog.ceo/api/breed/${selectedBreed}/${selectedSubBreed}/images`;
        }

        const response = await fetch(url);
        const { message: dogImages } = await response.json();
   
        const imagePrinter = document.getElementById('imagearea');
        imagePrinter.innerHTML = '';

        if (Array.isArray(dogImages) && dogImages.length > 0) {
            dogImages.forEach(dog => {
                const printImage = document.createElement('img');
                printImage.src = dog;
                printImage.alt = 'Dog Image';
                printImage.width = 200;
                printImage.height = 200;
                imagePrinter.appendChild(printImage);
            });
        } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No images available';
            imagePrinter.appendChild(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


document.getElementById('breedSelect').addEventListener('change', function(e) {
    const selectedBreed = e.target.value;
    populateSubBreedSelect(selectedBreed);
    imagePrinter(selectedBreed);
});

populateBreedSelect();
populateSubBreedSelect();