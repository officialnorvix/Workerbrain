// ==========================================
// 1. DOM Elements Selection
// ==========================================
const passwordDisplay = document.getElementById('password-display');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');

// ==========================================
// 2. Character Dictionary
// ==========================================
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

// ==========================================
// 3. Slider Control Event Listener
// ==========================================
lengthSlider.addEventListener('input', (e) => {
    lengthVal.textContent = e.target.value;
});

// ==========================================
// 4. Core Cryptographic Generator Engine
// ==========================================
function generatePassword() {
    let allowedChars = '';
    let mandatoryChars = [];

    // Evaluate active criteria & inject initial criteria requirements
    if (uppercaseEl.checked) {
        allowedChars += charSets.uppercase;
        mandatoryChars.push(getRandomChar(charSets.uppercase));
    }
    if (lowercaseEl.checked) {
        allowedChars += charSets.lowercase;
        mandatoryChars.push(getRandomChar(charSets.lowercase));
    }
    if (numbersEl.checked) {
        allowedChars += charSets.numbers;
        mandatoryChars.push(getRandomChar(charSets.numbers));
    }
    if (symbolsEl.checked) {
        allowedChars += charSets.symbols;
        mandatoryChars.push(getRandomChar(charSets.symbols));
    }

    // Safety fallback block if nothing is checked
    if (allowedChars === '') {
        passwordDisplay.value = 'SELECT AN OPTION...';
        return;
    }

    const length = parseInt(lengthSlider.value);
    let generatedPassword = [...mandatoryChars];

    // Compute remaining slots via system entropy arrays
    while (generatedPassword.length < length) {
        generatedPassword.push(getRandomChar(allowedChars));
    }

    // High-entropy scramble using the Fisher-Yates shuffle method
    for (let i = generatedPassword.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [generatedPassword[i], generatedPassword[j]] = [generatedPassword[j], generatedPassword[i]];
    }

    // Drop the string back to the terminal UI box
    passwordDisplay.value = generatedPassword.join('');
}

// ==========================================
// 5. Crypto Entropy Helper Function
// ==========================================
function getRandomChar(str) {
    // Generates mathematically secure crypto indices 
    const cryptoArray = new Uint32Array(1);
    window.crypto.getRandomValues(cryptoArray);
    const randomIndex = cryptoArray[0] % str.length;
    return str[randomIndex];
}

// ==========================================
// 6. Clipboard Controller (Async Layout)
// ==========================================
async function copyToClipboard() {
    const password = passwordDisplay.value;
    
    // Boundary check rules
    if (!password || password === 'SELECT AN OPTION...' || password === 'COPIED TO CLIPBOARD!') return;

    try {
        await navigator.clipboard.writeText(password);
        
        // Dynamic visual update sequence
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'DONE';
        passwordDisplay.value = 'COPIED TO CLIPBOARD!';
        
        // Timed revert step
        setTimeout(() => {
            copyBtn.textContent = originalText;
            passwordDisplay.value = password;
        }, 1200);
    } catch (err) {
        console.error('System failed clipboard pipeline transmission: ', err);
    }
}

// ==========================================
// 7. Initialize Application Triggers
// ==========================================
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// Pre-render a random key instantly on load
generatePassword();