let url = "https://mocki.io/v1/ea3eff21-44a9-4b15-aa77-ccffcbaadac9";
let assetsPromise = loadData(url);
assetsPromise.then(details => fillData(details));

let filterType;
let currTagFile;

let assetsData = {
    "assets":[
        {
            filename: "Rakesh Firoda",
            username: "raki",
            filetype: "video/msvideo",
            dateuploaded: 1652964243,
            tag: "Production- release 101"+" Dev- release 103 ",
        }
    ]
};

let assetsType = ["video/msvideo"];

let tags = {
    " ":"",
    pro101:"Production- release 101 ",
    pro102:"Production- release 102 ",
    pro103:"Production- release 103 ",
    dev101:"Dev- release 101 ",
    dev102:"Dev- release 102 ",
    dev103:"Dev- release 103 ",
    qa101:"QA- release 101 ",
    qa102:"QA- release 102 ",
    qa103:"QA- release 103 ",
}

async function loadData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data.assets;
    // data.then(details => fillData(details));
}

function fillData(details) {
    for(let asset in details){
        assetsData.assets.push(details[asset]);
        if(!(assetsType.includes(details[asset].filetype))){
            assetsType.push(details[asset].filetype);
        }
    }
    showType()
    showAssets(assetsData.assets);
}


function addAssetManually() {
    let filename;
    let username;
    let filetype;
    let dateuploaded;
    filename = prompt("enter filename:");
    username = prompt("enter username:");
    filetype = prompt("enter filetype:");
    dateuploaded = prompt("enter dateuploaded:");
    
    let newAsset = {
        filename,
        username,
        filetype,
        dateuploaded,
    }

    assetsData.assets.push(newAsset);
    if(!(assetsType.includes(newAsset.filetype))){
        assetsType.push(newAsset.filetype);
    }
    showType()
    showAssets(assetsData.assets);
}


function addAssetByFile(input) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
        let filename;
        let username;
        let filetype;
        let dateuploaded;
        let getUsername;

        let indexOfSpace = file.name.indexOf(' ');
        let indexOfDot = file.name.indexOf('.');
        // console.log(indexOfDot,indexOfSpace);

        if(indexOfDot === -1 || indexOfSpace === -1) {
            getUsername = file.name.substring(0,Math.max(indexOfDot,indexOfSpace));
        }else{
            getUsername = file.name.substring(0,Math.min(indexOfDot,indexOfSpace));
        }

        let modifiedDate = file.lastModified;

        let newAsset = {
            filename : file.name,
            username : getUsername,
            filetype : file.type,
            dateuploaded : modifiedDate,
        } 
        
        assetsData.assets.push(newAsset);
        if(!(assetsType.includes(newAsset.filetype))){
            assetsType.push(newAsset.filetype);
        }
        showType()
        showAssets(assetsData.assets);

    };

    reader.onerror = function() {
        alert(reader.error);
    };

}

function showAssets(assets) {

    let assetData = document.getElementById("assetData");

    assetData.innerHTML = "";
    for(let ass in assets){
        let eachAsset = assets[ass];

        let modifiedDate = eachAsset['dateuploaded'];
        let currDate = new Date();
        currDate = currDate.getTime();
        modifiedDate = modifiedDate*1000;
        let diffTime = Math.abs(currDate-modifiedDate);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " Days ago.";
        let tag = assets[ass].tag;


        let li = document.createElement("li");
        let li1 = document.createElement("li");
        let li2 = document.createElement("li");
        let li3 = document.createElement("li");
        let li4 = document.createElement("li");
        let ul = document.createElement("ul");
        let i = document.createElement("i");


        li.setAttribute("class", "oneAsset");
        li2.setAttribute("class", "assetType");
        // ul.setAttribute("class", "oneAsset");
        let button = document.createElement("button");
        button.innerHTML = "delete";
        button.setAttribute("class", "delete");
        button.setAttribute("onclick", "deleteAsset(event.currentTarget);showAssets(assetsData.assets)");

        let buttonTag = document.createElement("button");
        buttonTag.innerHTML = "add tag";
        buttonTag.setAttribute("class", "addTag");
        buttonTag.setAttribute("onclick", "togglePopUp(event.currentTarget)");

        li.appendChild(document.createTextNode("File Name: "+eachAsset['filename']));
        assetData.appendChild(li);

        li1.appendChild(document.createTextNode("Username: "+eachAsset['username']));
        ul.appendChild(li1);

        li2.appendChild(document.createTextNode("Filetype: "+eachAsset['filetype']));
        ul.appendChild(li2);

        li3.appendChild(document.createTextNode("Last Modified: "+diffDays));
        ul.appendChild(li3);

        li4.appendChild(document.createTextNode("Tags: "+tag));
        ul.appendChild(li4);

        li.appendChild(button);
        li.appendChild(buttonTag);
        
        assetData.appendChild(ul);
    }
}

function deleteAsset(file) {
    // console.log(file);
    let assetList = assetsData.assets;
    let index = -1;
    let currFile = file.parentElement.textContent.substring(11,file.parentElement.textContent.length-13);

    for(let asset in assetList){
        if(assetList[asset].filename === currFile){
            index = index + 1;
            break
        }
        index = index + 1;
    }

    let assetType = assetsData.assets[index].filetype;
    for (let i = 0; i < assetsType.length; i++) {
        if (assetsType[i] === assetType) {
            assetsType.splice(i, 1);
        }
    }
    assetsData.assets.splice(index, 1);
    showType()
}


function searchAssets(){
    var input, filter, ol, li, ul, i, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ol = document.getElementById("assetData");
    li = ol.getElementsByClassName('oneAsset');
    ul = document.getElementsByTagName("ul");

    for (i = 0; i < li.length; i++) {
        txtValue = li[i].textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            ul[i].style.display = "";
        } else {
            li[i].style.display = "none";
            ul[i].style.display = "none";
        }
    }
}

function showType(){
    let assetType = document.getElementById("assetType");
    assetType.innerHTML = "";

    let radio = document.createElement("input");
    let label = document.createElement("label");
    radio.setAttribute("type","radio");
    radio.setAttribute("name","selectType");
    radio.setAttribute("id","all");
    radio.setAttribute("value","all");
    radio.setAttribute("checked","checked");
    label.setAttribute("for","all");
    label.textContent = "All";

    assetType.appendChild(radio);
    assetType.appendChild(label);

    for(let type of assetsType){
        let radio = document.createElement("input");
        let label = document.createElement("label");
        radio.setAttribute("type","radio");
        radio.setAttribute("name","selectType");
        radio.setAttribute("id",type);
        radio.setAttribute("value",type);
        label.setAttribute("for",type);
        label.textContent = type;

        assetType.appendChild(radio);
        assetType.appendChild(label);
    }

    filterType = document.getElementsByName("selectType");
    addEvent();

}


function filterData(value){
    if(value==="all"){
        showAssets(assetsData.assets);
    }else{
        ol = document.getElementById("assetData");
        liType = ol.getElementsByClassName('assetType');
        ul = document.getElementsByTagName("ul");
        li = ol.getElementsByClassName('oneAsset');

        for (let i = 0; i < li.length; i++) {
            txtValue = liType[i].textContent.substring(10,liType[i].textContent.length);
            if (txtValue === value) {
                li[i].style.display = "";
                ul[i].style.display = "";
            } else {
                li[i].style.display = "none";
                ul[i].style.display = "none";
            }
        }
    }
}


function addEvent(){

    for(let i=0; i<filterType.length; i++){
        filterType[i].addEventListener("change",event => filterData(event.target.value));
    }
}

function addTag(){
    let proValue=" ";
    let pro = document.getElementsByName("pro_tag");
    let devValue=" ";
    let dev = document.getElementsByName("dev_tag");
    let qaValue=" ";
    let qa = document.getElementsByName("qa_tag");
    
    for(let i of pro){
        if(i.checked){
            proValue = i.id;
            break
        }
    } 
    for(let i of dev){
        if(i.checked){
            devValue = i.id;
            break
        }
    } 
    for(let i of qa){
        if(i.checked){
            qaValue = i.id;
            break
        }
    } 

    let assetList = assetsData.assets;
    let index = -1;
    let currFile = currTagFile.parentElement.textContent.substring(11,currTagFile.parentElement.textContent.length-13);

    for(let asset in assetList){
        if(assetList[asset].filename === currFile){
            index = index + 1;
            assetsData.assets[asset]["tag"] = assetsData.assets[asset]["tag"]+tags[proValue]+tags[devValue]+tags[qaValue];
            break
        }
        index = index + 1;
    }


    
    togglePopUp();
    showAssets(assetsData.assets);
}

function togglePopUp(file){
    currTagFile = file;
    let div = document.getElementsByClassName("tag");
    div[0].classList.toggle("displayPopUp");
    
    removeRadio();
}

function sortAssets(list, key) {
    function compare(a, b) {
        a = a[key];
        b = b[key];
        let type = (typeof(a) === 'string' ||
                    typeof(b) === 'string') ? 'string' : 'number';
        let result;
        if (type === 'string') result = a.localeCompare(b);
        else {
            result = b - a;
        }
        return result;
    }
    return list.sort(compare);
}

function sortData(value){
    let obj = JSON.parse(JSON.stringify(assetsData));
    if(value=="default"){
        showAssets(assetsData.assets);
    }
    else if(value=="date"){
        let sortedAssetsByDate = sortAssets(obj.assets,"dateuploaded");
        showAssets(sortedAssetsByDate);
    }
    else{
        let sortedAssetsByUsername = sortAssets(obj.assets,"username");
        showAssets(sortedAssetsByUsername);
    }
}


function addEventSort(sort){

    for(let i=0; i<sort.length; i++){
        sort[i].addEventListener("change",event => sortData(event.target.value));
    }
}

function removeRadio() {

    let radio1 = document.querySelector('input[type=radio][name=pro_tag]:checked');
    try{
        radio1.checked = false;
    }
    catch{}
    let radio2 = document.querySelector('input[type=radio][name=dev_tag]:checked');
    try{
        radio2.checked = false;
    }
    catch{}
    let radio3 = document.querySelector('input[type=radio][name=qa_tag]:checked');
    try{
        radio3.checked = false;
    }
    catch{}

}


let sortType = document.getElementsByName("sort");
addEventSort(sortType);
