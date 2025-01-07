const calcButtons = document.querySelector("#calcButtons");

const generateCalcNums = function() {
    for (i = 9; i >= 0; i--) {
        let newDiv = document.createElement("div");
        newDiv.classList.add(`calc${i}`);
        newDiv.textContent = `${i}`;
        calcButtons.appendChild(newDiv);
    }
    let decimalDiv = document.createElement("div");
    decimalDiv.classList.add('calcDecimal');
    decimalDiv.textContent = '.';
    calcButtons.appendChild(decimalDiv);
    
    let operatorArray = [
        {
            operator: "+",
            description: "calcAdd"
        },
        {
            operator: "-",
            description: "calcSubtract"
        },
        {
            operator: "*",
            description: "calcMultiply"
        },
        {
            operator: "÷",
            description: "calcDivide"
        },
        {
            operator: "=",
            description: "calcEqual"
        }
    ];
    for (i = 0; i < operatorArray.length; i++) {
        let operatorDiv = document.createElement("div");
        operatorDiv.classList.add(operatorArray[i].description);
        operatorDiv.textContent = operatorArray[i].operator;
        calcButtons.appendChild(operatorDiv);
    }
};

generateCalcNums();