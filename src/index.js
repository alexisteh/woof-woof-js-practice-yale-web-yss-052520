 document.addEventListener('DOMContentLoaded', function(){
    function qs(identifier){
        return document.querySelector(identifier) 
    }

    function ce(element){
        return document.createElement(element) 
    }

    const dogBar = qs("div#dog-bar")
    const dogShowInfo = qs("div#dog-info") 
    const toggleMorality = qs('button#good-dog-filter')

    function fetchDogs(spec){ 
        if (spec == 'all'){ 
        fetch("http://localhost:3000/pups")
            .then(res => res.json())
            .then(dogs => {
                showDogs(dogs) 
            })
        } else {
            fetch("http://localhost:3000/pups?isGoodDog=true")
            .then(res => res.json())
            .then(dogs => {
                showDogs(dogs) 
            })
        }
    }

    function showDogs(dogs){ 
        dogBar.innerHTML = "" 
        dogs.forEach(dog => {
            addDog(dog) 
        })
    }

    function addDog(dog){
        const dogSpan = ce('span')
        dogSpan.innerText = dog.name 

        dogSpan.addEventListener('click', function(){
            dogShowInfo.innerHTML = "" 
            const infoCard = ce('div') 
            infoCard.id = "dog" + dog.id 
            const dogImage = ce('img')
            dogImage.src = dog.image 
            const dogName = ce('h2')
            dogName.innerText = dog.name 
            const goodBadButton = ce('button') 
            if (dog.isGoodDog == true){
                goodBadButton.innerText = "Good Dog!" 
            } else {
                goodBadButton.innerText = "Bad Dog!" 
            } 

            goodBadButton.addEventListener('click', function(){
                let newMorality = true 
                if (goodBadButton.innerText == "Good Dog!") {
                    newMorality = false 
                }
                console.log(newMorality)
                const configObj = {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' 
                    },
                    body: JSON.stringify({
                        isGoodDog: newMorality
                    })
                }
                fetch('http://localhost:3000/pups/' + dog.id, configObj) 
                    .then(res => res.json())
                    .then(updatedDog => {
                        if (newMorality == true){
                            goodBadButton.innerText = "Good Dog!"
                        } else{
                            goodBadButton.innerText = "Bad Dog!"
                        }
                    }) 
            })

            infoCard.append(dogImage, dogName, goodBadButton) 
            dogShowInfo.append(infoCard)
        })
        
        dogBar.append(dogSpan) 
    }

    toggleMorality.addEventListener('click', function(){
        if (toggleMorality.innerText == 'Filter good dogs: OFF') {
            fetchDogs('good') 
            toggleMorality.innerText = 'Filter good dogs: ON' 
        }else{
            fetchDogs('all')  
            toggleMorality.innerText = 'Filter good dogs: OFF' 
        }
    })

    fetchDogs('all') 
 }) 