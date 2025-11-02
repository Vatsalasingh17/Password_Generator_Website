// Selecting all necessary DOM elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// ---------------- INITIAL SETUP ----------------
let password = "";            // stores the final generated password
let passwordLength = 10;      // default password length
let checkCount = 0;           // tracks how many checkboxes are selected

handleSlider(); // set the initial slider position and length display

// ---------------- SLIDER HANDLING ----------------
function handleSlider() {
    // Update slider UI and text showing password length
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

// ---------------- INDICATOR HANDLING ----------------
function setIndicator(color) {
    // Change color of strength indicator (circle)
    indicator.style.backgroundColor = color;
    // You can also add box-shadow or transition here (optional enhancement)
}

// ---------------- RANDOM GENERATION FUNCTIONS ----------------
// Generate a random integer between min (inclusive) and max (exclusive)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generate a random number (0–9)
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

// Generate a random lowercase letter
function generateLowerCase() {  
    return String.fromCharCode(getRndInteger(97, 123)); // ASCII a-z
}

// Generate a random uppercase letter
function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65, 91)); // ASCII A-Z
}

// Generate a random symbol from the symbols string
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// ---------------- PASSWORD STRENGTH CHECK ----------------
function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;
  
    // Simple strength logic based on selected options and length
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); // strong (green)
    } else if (
        (hasLower || hasUpper) && 
        (hasNum || hasSym) && 
        passwordLength >= 6
    ) {
        setIndicator("#ff0"); // medium (yellow)
    } else {
        setIndicator("#f00"); // weak (red)
    }
}

// ---------------- COPY PASSWORD FUNCTION ----------------
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (e) {
        copyMsg.innerText = "Failed!";
    }

    // Show "copied" message for 2 seconds
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// ---------------- SHUFFLING FUNCTION ----------------
// Shuffle password characters using Fisher-Yates algorithm
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

// ---------------- CHECKBOX HANDLING ----------------
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    // Ensure password length is at least equal to the number of checked boxes
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Add event listener to each checkbox to handle change
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// ---------------- SLIDER EVENT ----------------
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// ---------------- COPY BUTTON EVENT ----------------
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

// ---------------- GENERATE BUTTON EVENT ----------------
generateBtn.addEventListener('click', () => {

    // If no checkbox is selected, stop execution
    if (checkCount == 0) return;

    // Adjust password length if needed
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Start password generation
    password = "";

    // Create an array of generator functions based on selected options
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    // Compulsory addition — ensure each selected type appears at least once
    funcArr.forEach(func => password += func());

    // Fill remaining length with random selections
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle to remove predictability
    password = shufflePassword(Array.from(password));

    // Display password in UI
    passwordDisplay.value = password;

    // Update password strength indicator
    calcStrength();
});
