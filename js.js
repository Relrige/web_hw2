let itemsList = [];
let namesListSet = new Set();
window.addEventListener('beforeunload', function (){
    localStorage.setItem("data", JSON.stringify(itemsList));
});

window.addEventListener('load', function (){
    //localStorage.clear();
    const storedData = localStorage.getItem('data');
    if (storedData) itemsList = JSON.parse(storedData);
    else itemsList = [{name: "Помідори", amount: 2, bought: true},
                      {name: "Печиво", amount: 2, bought: false},
                      {name: "Сир", amount: 1, bought: false}];

    //itemsList.forEach(item => namesListSet.add(item.name));
    for (let i = 0; i < itemsList.length; i++)
        addItem(itemsList[i]);
});

const addButton = document.getElementsByClassName("add-button")[0];
addButton.addEventListener('click', add);

function add() {
    const addInput = document.getElementById("input");
    const itemName = addInput.value;
    if (namesListSet.has(itemName.trim())) {
        window.alert("These goods are already added!");
    } else if (itemName === '') {
        window.alert("Enter the name of the goods!");
    }else if (itemName.length>20) {
        window.alert("Enter smaller item name!");
    } else {
        const newItem = {
            name: itemName,
            amount: 1,
            bought: false
        };
        addItem(newItem);
        namesListSet.add(itemName);
        itemsList.push(newItem);
    }

    addInput.value = "";
    addInput.focus();
}

function addItem(item){
    let button ="Куплено";
    let datatool="Купити всі товари";
    if(item.bought){
        button ="Не куплено";
        datatool="Повернутися до покуплення";
    }
    let newItem = document.createElement("section");
    let newItem2 = document.createElement("div");
    newItem2.className="product-item";
    if(item.bought===false){
        newItem.innerHTML = `		
        <section class="product-manage">
        <div class="left"><span class="goods-name">${item.name}</span></div>
    
        <div class="center">
            <button class="subtract" type="button" data-tooltip="Відняти">-</button>
            <span class="product-counter">${item.amount}</span>
            <button class="add" type="button" data-tooltip="Додати">+</button>
        </div>
        <div class="right">
            <button class="bought" data-tooltip="Купити всі товари">${button}</button>
            <button class="delete" data-tooltip="Відняти елемент">x</button>
        </div>
        </section>`
        newItem2.innerHTML = `		
                    <span class="title">${item.name}</span>
                    <div class="number-bg">
                        <span class="amount">${item.amount}</span>
                    </div>
                    `
        newItem.getElementsByClassName("bought")[0].addEventListener("click", boughtItem);
        document.getElementsByClassName('basket-second')[0].appendChild(newItem2);
    }
    else{
        newItem.innerHTML = `		
        <section class="product-manage">
        <div class="left"><span class="goods-name crossed">${item.name}</span></div>
    
        <div class="center">
            <button class="subtract" style="display:none;" type="button" data-tooltip="Відняти">-</button>
            <span class="product-counter">${item.amount}</span>
            <button class="add" style="display:none;" type="button" data-tooltip="Додати">+</button>
        </div>
        <div class="right">
            <button class="bought" data-tooltip="Купити всі товари">${button}</button>
            <button class="delete" style="display:none;" data-tooltip="Відняти елемент">x</button>
        </div>
        </section>`
        newItem2.innerHTML = `		
                    <span class="title crossed">${item.name}</span>
                    <div class="number-bg">
                        <span class="amount crossed">${item.amount}</span>
                    </div>
                    `
        newItem.getElementsByClassName("bought")[0].addEventListener("click", notBoughtItem);
        document.getElementsByClassName('basket-fourth')[0].appendChild(newItem2);
    }
   
    
    newItem.getElementsByClassName("delete")[0].addEventListener("click", deleteItem);
    newItem.getElementsByClassName("subtract")[0].addEventListener("click", subtract);
    if(item.amount===1){
       newItem.getElementsByClassName("subtract")[0].disabled = true;
        newItem.getElementsByClassName("subtract")[0].style.opacity="50%";
    }
    newItem.getElementsByClassName("add")[0].addEventListener("click", increaseItem);
    newItem.getElementsByClassName("goods-name")[0].addEventListener("click", changeName);
    if(item.bought) newItem.getElementsByClassName("goods-name")[0].disabled = true;
    document.getElementById('products').appendChild(newItem);
};

function deleteItem(event) {
    const item = event.target.parentNode.parentNode;
    item.parentNode.removeChild(item);

    const itemName = item.getElementsByClassName("goods-name")[0].textContent;
    const deleted = findProduct(itemName);
    deleted.parentNode.removeChild(deleted);

    namesListSet.delete(itemName);

    itemsList = itemsList.filter(function(item) {
        return item.name !== itemName;
    });
}

function boughtItem(event) {
    const button = event.target;
    button.textContent = "Не куплено";
    button.removeEventListener("click", boughtItem);
    button.addEventListener("click", notBoughtItem);
    button.setAttribute("data-tooltip", "Повернутися до покупки");
    const item = button.parentNode.parentNode;
    const itemName = item.childNodes[1].firstChild.innerText;
    const amount = item.childNodes[3].childNodes[3].innerText;

    item.getElementsByClassName("goods-name")[0].disabled = true;

    const subtract = item.getElementsByClassName("subtract")[0];
    subtract.style.display = "none";
    const plus = item.getElementsByClassName("add")[0];
    plus.style.display = "none";
    const deleteButt = item.getElementsByClassName("delete")[0];
    deleteButt.style.display = "none";
    const item2= event.target.parentNode.parentNode.childNodes[1].firstChild;
    item2.className="goods-name crossed";

    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].bought = true;

    const deleted = findProduct(itemName);
    deleted.parentNode.removeChild(deleted);
    let newItem2 = document.createElement("div");
    newItem2.className="product-item";
    newItem2.innerHTML = `		
                <span class="title crossed">${itemName}</span>
                <div class="number-bg">
                    <span class="amount crossed">${amount}</span>
                </div>
                `
    document.getElementsByClassName('basket-fourth')[0].appendChild(newItem2);
}
function notBoughtItem(event) {
    const button = event.target;
    button.textContent = "Куплено";
    button.addEventListener("click", boughtItem);
    button.setAttribute("data-tooltip", "Купити всі товари");
    const item = button.parentNode.parentNode;
    const itemName = item.childNodes[1].firstChild.innerText;
    const amount = item.childNodes[3].childNodes[3].innerText;
    item.getElementsByClassName("goods-name")[0].disabled = false;

    const subtract = item.getElementsByClassName("subtract")[0];
    subtract.style.display = "unset";
    const plus = item.getElementsByClassName("add")[0];
    plus.style.display = "unset";
    const deleteButt = item.getElementsByClassName("delete")[0];
    deleteButt.style.display = "unset";
    const item2= event.target.parentNode.parentNode.childNodes[1].firstChild;
    item2.className="goods-name";

    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].bought = false;

    const deleted = findProduct(itemName);
    deleted.parentNode.removeChild(deleted);
    let newItem2 = document.createElement("div");
    newItem2.className="product-item";
    newItem2.innerHTML = `		
                <span class="title">${itemName}</span>
                <div class="number-bg">
                    <span class="amount">${amount}</span>
                </div>
                `
    document.getElementsByClassName('basket-second')[0].appendChild(newItem2);
}

function subtract(event) {
    const button = event.target;
    const newValue = parseInt(button.nextElementSibling.textContent);
    if(newValue!==1) {
        button.disabled = false;
        button.nextElementSibling.textContent = newValue.toString()-1;
        if(newValue.toString()-1===1)
        {
                button.disabled = true;
                button.style.opacity="50%";
        }
        else{
            button.style.opacity="100%";
        }
    }
    else {
        button.disabled = true;
        button.style.opacity="50%";
    }


    const amountBlock = button.parentNode;
    const itemName = amountBlock.previousElementSibling.textContent;
    const changed = findProduct(itemName).getElementsByClassName("amount")[0];
    changed.textContent = newValue.toString();
    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].amount = newValue-1;
}
function increaseItem(event) {
    const button = event.target;
    const newValue = parseInt(button.previousElementSibling.textContent) + 1;
    button.previousElementSibling.textContent = newValue.toString();
    button.previousElementSibling.previousElementSibling.disabled = false;

    const amountBlock = button.parentNode;
    amountBlock.childNodes[1].style.opacity="100%";
    const itemName = amountBlock.previousElementSibling.textContent;
    const changed = findProduct(itemName).getElementsByClassName("amount")[0];
    changed.textContent = newValue.toString();
    const index = itemsList.findIndex(item => item.name === itemName);
    itemsList[index].amount = newValue;
}

function changeName(event) {
    const spam = event.target;
    const previousName = spam.textContent;
    if(!spam.disabled) { 
        const input = document.createElement('input');
        input.type = 'text';
        input.value = previousName;
        input.className = "goods-input";
        spam.parentNode.replaceChild(input, spam);
        input.focus();
        
        namesListSet.delete(previousName);
        input.addEventListener('blur', function () {
            let newName = input.value;
            if (namesListSet.has(newName)) {
                window.alert("This name is already taken!");
            } else if (newName === '') {
                window.alert("You haven't entered any text!");
            }else if (newName.length> 20) {
                window.alert("Enter smaler name!");
            } else {
                spam.textContent = newName;
                
                const changed = findProduct(previousName).getElementsByClassName("title")[0];
                changed.textContent = newName;
                
                const index = itemsList.findIndex(item => item.name === previousName);
                itemsList[index].name = newName;
            }
            
            namesListSet.add(spam.textContent);
            input.parentNode.replaceChild(spam, input);
        });
    }
}
function findProduct(name) {
    const spans = document.getElementsByClassName("title");

    for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        const text = span.textContent.trim();

        if (name === text)
            return span.parentElement;
    }
}
