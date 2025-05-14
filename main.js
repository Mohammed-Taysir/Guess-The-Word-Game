const gameName = "Guess The Word";

document.title = gameName;

document.querySelector("h1").innerHTML = gameName;

document.querySelector("footer").innerHTML = `${gameName} Made By <span>Mohammed Taysir</span>`;

const numOfTries = 5;
let numOfHints = 2;
const numOfLetters = 6;
let currentTry = 1;
const checkButton = document.querySelector(".check");

document.querySelector(".hint span").innerHTML = numOfHints;
const hintButton = document.querySelector(".hint");


const words = [
  "planet",
  "silver",
  "battle",
  "jungle",
  "magnet",
  "singer",
  "rocket",
  "circle",
  "marble",
  "castle",
  "modern",
  "flight",
  "danger",
  "hunter",
  "pencil",
  "rabbit",
  "guitar",
  "window",
  "school",
  "jacket"
];;

const randomWord = words[Math.floor(Math.random() * words.length)];

function generateInputs() {
    for(let i = 1; i <= numOfTries; i++) {
        let tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try${i}</span>`;
        if(i !== 1) {
            tryDiv.classList.add("disabled-inputs")
        }
        for(let j = 1; j <= randomWord.length; j++) {
            let input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-input-${j}`;
            input.setAttribute("maxLength", "1");
            tryDiv.appendChild(input);
        }
        document.querySelector(".tries").appendChild(tryDiv);
    }
    document.querySelectorAll("input")[0].focus();
    document.querySelectorAll(".disabled-inputs input").forEach((input) => {
        input.disabled = true;
    });
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase();
            const nextInput = index + 1;
            if(inputs[nextInput]) inputs[nextInput].focus();
        })
        input.addEventListener("keydown", (e) => {
            if(e.key === "ArrowRight") {
                if(index + 1 < inputs.length)
                    inputs[index + 1].focus();
            }

            if(e.key === "ArrowLeft") {
                if(index - 1 >= 0)
                    inputs[index - 1].focus();
            }
        })
    })
}


checkButton.addEventListener("click", () => {
    let success = true;
    for(let i = 1; i <= randomWord.length; i++) {
        const currentInput = document.querySelector(`#guess-${currentTry}-input-${i}`);
        const letter = currentInput.value.toLowerCase();
        if(letter === randomWord[i - 1]) {
            currentInput.classList.add("yes-in-place");
        }else if(randomWord.includes(letter)){
            currentInput.classList.add("not-in-place");
            success = false;
        }else {
            currentInput.classList.add("not-in-word");
            success = false;
        }      
    }
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
    if(success) {
        Swal.fire({
        title: '🎉 You Won!',
        text: 'Do you want to play again?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Play Again',
        cancelButtonText: 'Close',
        allowOutsideClick: false
        }).then((result) => {
        if (result.isConfirmed) {
        location.reload();
        }
    });

        checkButton.disabled = true;
        
    }else {
        currentTry++;
        const currentInput = document.querySelector(`.try-${currentTry}`);
        if(currentInput)
        {
            currentInput.classList.remove("disabled-inputs");
            Array.from(currentInput.children).forEach((input) => input.disabled = false);
            currentInput.children[1].focus();
        }else {
            Swal.fire({
            title: 'Game Over',
            text: 'Do you want to play again?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Play Again',
            cancelButtonText: 'Close',
            allowOutsideClick: false
            }).then((result) => {
            if (result.isConfirmed) {
                 location.reload(); 
            }
        });
        checkButton.disabled = true;
        hintButton.disabled = true;

        }
    }
});

document.addEventListener("keydown", (e) => {
    if(e.key === "Backspace"){
        const enabledInputs = document.querySelectorAll(`.try-${currentTry} input`);
        const indexOfActiveInput = Array.from(enabledInputs).indexOf(document.activeElement);
        if(indexOfActiveInput >= 0) {
            const currentElement = enabledInputs[indexOfActiveInput];
            currentElement.value = "";
        }
        if(indexOfActiveInput > 0) {
            
            enabledInputs[indexOfActiveInput - 1].focus();
        }
        e.preventDefault();
    }
})


hintButton.addEventListener("click", () => {
    if(numOfHints > 0) {
        numOfHints--;
        document.querySelector(".hint span").innerHTML = numOfHints;
    }else {
        hintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll(`.try-${currentTry} input`);
    const emptyInputs = Array.from(enabledInputs).filter((input) => input.value.trim() === "");
    const randomEmptyInput = emptyInputs[Math.floor(Math.random() * emptyInputs.length)];
    const indexInEnabled = Array.from(enabledInputs).indexOf(randomEmptyInput);
    randomEmptyInput.value = randomWord[indexInEnabled];
});

window.onload = function() {
    generateInputs();
}