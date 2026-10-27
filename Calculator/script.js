
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let completed = false;

function updateDisplay() {
    expressionDisplay.textContent = currentInput;
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

function formatNumber(number) {
    return Number.parseFloat(number.toPrecision(12)).toString();
}

function inputNumber(number) {
    if (completed) {
        currentInput = number;
        completed = false;
        resultDisplay.textContent = "Ready";
    } else if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (completed) {
        currentInput = "0.";
        completed = false;
        resultDisplay.textContent = "Ready";
    } else if (waitingForSecondOperand) {
        currentInput = "0.";
        waitingForSecondOperand = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}


function chooseOperator(nextOperator) {
    if (operator !== null && !waitingForSecondOperand) {
        calculate();

        if (operator !== null ||
            resultDisplay.textContent.startsWith("Cannot") ||
            resultDisplay.textContent.startsWith("Result is")) {
            return;
        }

        firstOperand = Number(currentInput);
    } else if (firstOperand === null) {
        firstOperand = Number(currentInput);
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
    completed = false;
    resultDisplay.textContent = "Selected: " + nextOperator;
}


function calculate() {
    if (operator === null || firstOperand === null ||
        waitingForSecondOperand) {
        return;
    }

    const secondOperand = Number(currentInput);
    let answer;

    try {
        switch (operator) {
            case "+":
                answer = add(firstOperand, secondOperand);
                break;
            case "-":
                answer = subtract(firstOperand, secondOperand);
                break;
            case "*":
                answer = multiply(firstOperand, secondOperand);
                break;
            case "/":
                answer = divide(firstOperand, secondOperand);
                break;
            default:
                return;
        }
    } catch (error) {
        currentInput = "0";
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        completed = true;
        updateDisplay();
        resultDisplay.textContent = error.message;
        return;
    }

    if (!Number.isFinite(answer)) {
        clearCalculator();
        resultDisplay.textContent = "Result is too large";
        return;
    }

    currentInput = formatNumber(answer);
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    completed = true;

    updateDisplay();
    resultDisplay.textContent = "Result: " + currentInput;
}

function clearCalculator() {
    currentInput = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    completed = false;

    updateDisplay();
    resultDisplay.textContent = "Ready";
}

function backspace() {
    if (completed) {
        clearCalculator();
        return;
    }

    if (waitingForSecondOperand) {
        return;
    }

    currentInput = currentInput.length > 1
        ? currentInput.slice(0, -1)
        : "0";

    if (currentInput === "-") {
        currentInput = "0";
    }

    updateDisplay();
}

function handleAction(action) {
    if (action === "clear") {
        clearCalculator();
    } else if (action === "equals") {
        calculate();
    } else if (action === "decimal") {
        inputDecimal();
    } else if (action === "backspace") {
        backspace();
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else if (button.dataset.action) {
        handleAction(button.dataset.action);
    }
});

document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "Backspace") {
        backspace();
    }
});
