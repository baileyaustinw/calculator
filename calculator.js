const calcButtons = document.querySelector("#calcButtons");
const calcInput = document.querySelector("#calcInput > p");
const operators = ['x', '-', '+', '÷'];
const notAllowed = ['shift', 'meta', 'enter', 'control', 'alt'];

let initial = 1;
let executed = false;
let firstNumber = '';
let secondNumber = '';
let operator;
let lastResult;

const clearAllInput = () => {
     // clear all
     firstNumber = '';
     secondNumber = '';
     initial = true;
     operator = '';
     setInputText('0');
}

const setInputText = (text) => {
    calcInput.textContent = text;
};

const updateNumber = (number, isPercentage = false) => {
    const numberToChange = isPercentage ? number / 100 : number;
    return numberToChange;
};

const handleFirstNumber = (buttonText) => {
    setInputText('');
    firstNumber += buttonText;
    setInputText(buttonText);
};

const handleOperator = (buttonText) => {
    if (firstNumber != '.') {
        operator = buttonText;
        setInputText(calcInput.textContent + buttonText)
    }
};

const handleSecondNumber = (buttonText) => {
    // clear input so we can build second number
    if (operators.includes((calcInput.textContent.charAt(calcInput.textContent.length-1)))) {
        setInputText('');
    }
    secondNumber += buttonText;
    setInputText(calcInput.textContent + buttonText);
};

const addToCalc = function(calcButton) {
    const buttonText = calcButton.textContent ? calcButton.textContent : calcButton;
    console.log(`firstNumber: ${firstNumber}`);
    console.log(`operator: ${operator}`);
    console.log(`secondNumber: ${secondNumber}`);
    console.log(`lastResult: ${lastResult}`);
    console.log(`executed: ${executed}`);

    switch (buttonText) {
        case '%':
            // do not allow % as first input
            if (initial) {
                return;
            }

            // adjust number to a percentage
            // if there is an operator and secondNumber variable, secondNumber is being changed to a percentage
            if (operator && secondNumber) {
                secondNumber = updateNumber(secondNumber, true);
                setInputText(`${calcInput.textContent}%`);
            // if there is an operator or firstNumber variable, firstNumber is being changed to a percentage
            } else if (operator || firstNumber) {
                firstNumber = updateNumber(firstNumber, true);
                setInputText(`${calcInput.textContent}%`);
            // if there is no operator and no firstNumber or secondNumber variable, firstNumber is being changed to a percentage
            } else {
                firstNumber = updateNumber(calcInput.textContent, true);
                setInputText(`${calcInput.textContent}%`);
            }
            break;
        case '+/-':
            // pos/neg
            // revisit -> doesn't act how it should (-2 + 2 = 4)
            if (calcInput.textContent.includes('-')) {
                setInputText(calcInput.textContent.replace('-', ''));
            } else {
                let oldInput = calcInput.textContent;
                setInputText(`-${calcInput.textContent}`);
            }
            break;
        case 'A/C':
            // clear all
            lastResult = null;
            firstNumber = '';
            secondNumber = '';
            initial = true;
            operator = '';
            setInputText('0');
            break;
        case 'C':
            // backspace
            if (calcInput.textContent.length > 1) {
                setInputText(calcInput.text.slice(0, -1));
            } else {
                initial = true;
                firstNumber = '';
                secondNumber = '';
                operator = null;
                setInputText('0');
            }
            break;
        case '=':
            // perform calculation
            if (!lastResult && operator) {
                setInputText(operate(firstNumber, operator, secondNumber));
            } else if (lastResult && firstNumber && !secondNumber) {
                setInputText(operate(lastResult, operator, firstNumber));
            }  else if (lastResult && secondNumber && !firstNumber) {
                setInputText(operate(lastResult, operator, secondNumber));
            } else if (lastResult && firstNumber && secondNumber) {
                setInputText(operate(firstNumber, operator, secondNumber));
            } else if (!operator) {
                return;
            }
            break;
        default:
            // limit input size to 10 digits
            if (calcInput.textContent.length == 10) return;
            // make sure the input is allowed
            if (notAllowed.includes(buttonText.toLowerCase())) return;
            // do not allow an operator as the first input
            if (initial && operators.includes(buttonText)) return;
            
            // build first number
            if (initial && !operators.includes(buttonText)) {
                handleFirstNumber(buttonText);
                initial = false;
            } else if (firstNumber.toString().includes('.') && buttonText == '.' && !secondNumber) {
                return;
            } else if (!operator && !operators.includes(buttonText)) {
                if (calcInput.textContent !== 0) {

                    firstNumber += buttonText;
                    setInputText(calcInput.textContent + buttonText);
                } else {
                    firstNumber += buttonText;
                    setInputText(calcInput.textContent + buttonText);
                }
            }

            // define operator
            if (operators.includes(buttonText) && !operator) {
                handleOperator(buttonText);
            } else if (operator && operators.includes(buttonText) && !lastResult) {
                setInputText(calcInput.textContent.slice(0, -1) + buttonText);
                operator = buttonText;
            } else if (operators.includes(buttonText) && operator && lastResult) {
                operator = buttonText;
                setInputText(calcInput.textContent + buttonText);
            }

            // build second number
            if (operator && !operators.includes(buttonText) && buttonText !== '.') {
                handleSecondNumber(buttonText);
            } else if (operator && !operators.includes(buttonText) && secondNumber.includes('.')) {
                return;
            } else if (secondNumber && !secondNumber.includes('.') && !operators.includes(buttonText)) {
                handleSecondNumber(buttonText);
            }

            break;
    }
};

const operate = function(firstNum, op, secondNum) {
    const num1 = parseFloat(firstNum);
    const num2 = parseFloat(secondNum);

    switch (op) {
        case '+':
            lastResult = num1 + num2;
            break;
        case '-':
            lastResult = num1 - num2;
            break;
        case '÷':
            lastResult = num1 / num2;
            break;
        case 'x':
            lastResult = num1 * num2;
            break;
    }

    operator = '';
    firstNumber = '';
    secondNumber = '';
    executed = true;
    return parseFloat(lastResult.toFixed(3));
}

const buttons = calcButtons.querySelectorAll('div');
buttons.forEach(element => {
    element.addEventListener('click', function() {
        addToCalc(element);
    });
});

document.addEventListener('keydown', function(e) {
    addToCalc(e.key.toString());
});