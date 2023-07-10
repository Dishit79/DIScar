
// make a list of all the boxes
let boxes = [];

document.getElementById('sidebar').addEventListener('change', onDataChange);

function createBox() {
    const container = document.getElementById('canvas');

    // generate a random number id
    let id = Math.floor(Math.random() * 1000000);
    
    const box = document.createElement('div');
    box.className = 'preTextBox';
    box.id = id;
    box.style.top = (container.clientHeight / 2 - 75) + 'px';
    box.style.left = (container.clientWidth / 2 - 75) + 'px';
    box.style.postion = 'absolute';
    box.dataset.isResizable = false;


    box.addEventListener('mousedown', dragStart);
    box.addEventListener('dblclick', toggleResize);
    box.addEventListener('click', openFunction );
    container.addEventListener('mousemove', drag);
    container.addEventListener('mouseup', dragEnd);

    container.appendChild(box);

    boxData = {
        id: id,
        typeof: 'text',
        enableEdit: false,
        text: '',
        oscarVar: '',
    }

    boxes.push(boxData);
}

let currentBox = null;
let initialX, initialY, offsetX, offsetY;

function openFunction(e) {
    console.log("open function called");
    // get the sidebar
    const sidebar = document.getElementById('sidebar');
    // get box data from the boxes array
    const box = boxes.find(box => box.id == e.target.id);
    let code = '';
    
    draw(box.id);
}




function dragStart(e) {
    const box = e.target;
    const isResizable = box.dataset.isResizable === 'true';
    if (!isResizable) {
        currentBox = e.target;
        initialX = e.clientX;
        initialY = e.clientY;
        offsetX = parseFloat(currentBox.style.left) || 0;
        offsetY = parseFloat(currentBox.style.top) || 0;

        currentBox.style.cursor = 'grabbing';
    }
}

function drag(e) {
    if (!currentBox) return;

    const newX = offsetX + e.clientX - initialX;
    const newY = offsetY + e.clientY - initialY;

    currentBox.style.left = newX + 'px';
    currentBox.style.top = newY + 'px';
    
    console.log(currentBox.style.left);
    console.log(currentBox.style.top);
}

function dragEnd() {
    if (!currentBox) return;

    currentBox.style.cursor = 'move';
    currentBox.style.postion = 'absolute';
    currentBox = null;
}


function toggleResize(e) {
    const box = e.target;
    let isResizable = box.dataset.isResizable === 'true';
    box.dataset.isResizable = !isResizable;
        
    if (!isResizable) {
        box.classList.add('resizable');
        box.style.resize = 'both';
        box.style.overflow = 'auto';
    } else {
        box.classList.remove('resizable');
        box.style.resize = 'none';
        box.style.overflow = 'visible';
    }
}

function onDataChange(e){

    console.log("onDataChange called");
   // get text from the p1 tag 
    const id = document.getElementById('idHolder').innerText;
    
    // get the the ifLabel or ifOSCARVar radio button
    const ifLabel = document.getElementById('ifLabel');
    const ifOSCARVar = document.getElementById('ifOSCARVar');
    const box = boxes.find(box => box.id == id);
    console.log(box);

    if (ifLabel.checked && box.typeof != 'text') {
        // set the box type to text
        box.typeof = 'text';
        boxes.push(box);
        draw(id);

    } else if (ifOSCARVar.checked && box.typeof != 'OSCARVar') {
        // set the box type to text
        box.typeof = 'OSCARVar';
        console.log("OSCARVar checked");
        boxes.push(box);
        draw(id);
        // get the options value from the dropdown menu
    }

    if(box.typeof == 'text') {
        // get the text from the boxText input
        const boxText = document.getElementById('boxText').value;
        const isEnableEdit = document.getElementById('isEnableEdit').checked;
        // set the box text to the boxText
        box.text = boxText;
        box.enableEdit = isEnableEdit;
    } else if (box.typeof == 'OSCARVar') {
        // get the options value from the dropdown menu
        const OSCARVar = document.getElementById('OSCARVar').value;
        // set the box text to the boxText
        box.oscarVar = OSCARVar;
    }

    //push the box data to the boxes array
    boxes.push(box);

}

function draw(id) {

    const sidebar = document.getElementById('sidebar');
    // get box data from the boxes array
    const box = boxes.find(box => box.id == id);
    let code = '';

    console.log("text" + box.text);

    if (box.typeof == 'text') {
        code = `
        <H1> Text Box Info:</H1>
        <p1>Box ID: <p1 id="idHolder">${box.id}</p1>
        </p1>
        <br>
        
        
        <!-- two radio boxes -->
        <input type="radio" id="ifLabel" name="boxType" value="text" checked>
        <label for="text">Text Label</label><br>
        
        <input type="radio" id="ifOSCARVar" name="boxType" value="checkbox">
        <label for="checkbox">Oscar Variable</label><br>
        
        <hr>
        <br>
        
        <!-- Options -->
        <label for="isEnableEdit">Multiline Input:</label>
        <input type="checkbox" id="isMultiline Input" value="true"><br>
        <label for="isEnableEdit">Enable Editing:</label>
        <input type="checkbox" id="isEnableEdit" value="true"><br>
        <label for="boxText">Box Text:</label><br>
        <input type="text" id="boxText" value="${box.text}"><br>
        <br>
        <button onclick="convert(${box.id})">Convert</button>

        
        `
    } else if (box.typeof == 'checkbox') {
        code = ``
    } else {
        code = `
    <H1> Text Box Info:</H1>
    <p1>Box ID: <p1 id="idHolder">${box.id}</p1></p1>
    <br>

    <!-- two radio boxes -->
    <input type="radio" id="ifLabel" name="boxType" value="text">
    <label for="text">Text Label</label><br>

    <input type="radio" id="ifOSCARVar" name="boxType" value="checkbox" checked>
    <label for="checkbox">Oscar Variable</label><br>
    <hr>
    <br>
    <!-- Searchable dropdown menu -->
    <label for="OSCARVar">Oscar Varible:</label><br>
    <select id="OSCARVar">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="xlarge">X-Large</option>
    </select>
    `
    }

    // display the content of the box in the sidebar
    sidebar.innerHTML = code;
}


function convert(id) {

    // get box data from the boxes array
    const box = boxes.find(box => box.id == id);
    // get the box index from the boxes array
    const boxIndex = boxes.findIndex(box => box.id == id);


    // get the box by element id
    const boxElement = document.getElementById(id);

    // create a new input element under the div canvas
    const input = document.createElement('input');
    // copy the style from the boxElement to the input
    for (let i = 0; i < boxElement.style.length; i++) {
        const property = boxElement.style[i];
        const value = boxElement.style.getPropertyValue(property);
        input.style.setProperty(property, value);
    }
    input.style.position = 'absolute';
    // set the input type to text
    input.type = 'text';
    // set the input value to the box text
    input.value = box.text;
    //check if the box is editable
    console.log(box.enableEdit);
    if (!box.enableEdit) {
        // set the input to readonly attribute
        input.setAttribute('readonly', true);
    }
    // get the canvas element
    const canvas = document.getElementById('canvas');
    // append the input to the canvas
    canvas.appendChild(input);
    // remove the boxElement from the canvas
    canvas.removeChild(boxElement);
    // remove the box from the boxes array
    boxes.splice(boxIndex, 1);


}
    