/**
 * Create global variable to count how many sentence have been added into html
 */
var JobSentenceIndex = 0;
var NOCSentenceIndex = 0;
var part = "";



/**
 * @description Highlight(add background) current tag
 * @param {HTMLParagraphElement} element
 */
function HighlightMouseEnterToken(element){
    element.style.backgroundColor = "#FFF6DA";
}



/**
 * @description remove current tag's background
 * @param {HTMLParagraphElement} element
 */
function HighlightMouseOutToken(element){
    element.style.backgroundColor = "#FFFFFF";
}



/**
 * @description create a html paragraph element, set several attributes and provide given content
 * @param {string} content: the content in the paragraph element
 * @return {HTMLElement} span: HTML section element
 */
function createSpan(content){
    let span =  document.createElement("SPAN");
    // p.setAttribute("class","bg-primary");
    span.setAttribute("onmouseenter","HighlightMouseEnterToken(this)");
    span.setAttribute("onmouseout","HighlightMouseOutToken(this)");
    if(part === "JOB"){
        span.setAttribute("id","JOB_" + JobSentenceIndex);
        span.setAttribute("title","JOB_" + JobSentenceIndex);
        span.setAttribute("class", "left_token");
        JobSentenceIndex++;
    }
    else if(part === "NOC"){
        span.setAttribute("id","NOC_" + NOCSentenceIndex);
        span.setAttribute("title","NOC_" + NOCSentenceIndex);
        span.setAttribute("class", "right_token");
        NOCSentenceIndex++;
    }
    span.textContent = content + " ";

    return span;
}



/**
 * @description create a html paragraph element, set several attributes and provide given content
 * @param {(string|string[])} content - the content in the p tag
 * @return {HTMLParagraphElement} - html p element
 */
function PackageSpan(parentsElement, content){

    let parents = document.createElement(parentsElement);
    parents.setAttribute("class","panel-title");
    if(typeof content === 'string'){
        parents.appendChild(createSpan(content));
    }
    else if(typeof content === 'object'){
        content.forEach(function(element){
            parents.appendChild(createSpan(element));
        });
    }
    else{
        console.log(typeof content);
        // alert("content type error");
    }

    return parents;
}



/**
 * each example title in NOC need a whole line
 * Using <p><span>...</span></p> to make sure one title in one line
 * @param parentsElement - add p into which html elements
 * @param content - 1d array include all the content in span
 * @return {*} - return a div element with all <p><span>...</span></p> element
 * @constructor
 */
function PackageP(parentsElement, content){
    let parents = document.createElement(parentsElement);
    parents.setAttribute("class","panel-title");

    content.forEach(function(element){
        let p = document.createElement("P");
        p.appendChild(createSpan(element));
        p.style.margin = "0px";
        parents.appendChild(p);
    });

    return parents;
}



/**
 * @description Add title, subtitle and body into the section
 * @param {string} headerString: the content of title or subtitle
 * @param {string[]} bodyList: the content of body
 * @returns {HTMLElement}section: HTML section element
 */
function createSection(headerString, bodyList) {
    let section = document.createElement("SECTION");
    section.setAttribute("class","panel panel-default");

    let header = document.createElement("HEADER");
    header.setAttribute("class","panel-heading");

    if(bodyList === ""){
        header.appendChild(PackageSpan("h4", headerString));
        section.appendChild(header);
    }
    else{
        header.appendChild(PackageSpan("h5", headerString));
        section.appendChild(header);
        if(headerString !== "example titles"){
            section.appendChild(PackageSpan("DIV", bodyList));
        }
        else{
            section.appendChild(PackageP("DIV", bodyList));
        }
    }
    return section;
}



/**
 * @description Create main duties' content into the section
 * @param {string} headerString: "main duties"
 * @param {string[]} bodyList: the content of main duties body
 * @returns {HTMLElement} section: HTML section element
 */
function createMainDutiesSection(headerString, bodyList) {
    let section = document.createElement("SECTION");
    section.setAttribute("class","panel panel-default");

    let header = document.createElement("HEADER");
    header.setAttribute("class","panel-heading");

    header.appendChild(PackageSpan("h5", headerString));
    section.appendChild(header);


    let div = document.createElement("DIV");
    div.setAttribute("class","panel-body");

    for(let i = 0 ; i < bodyList.length ; i++){
        div.appendChild(PackageSpan("h6", bodyList[i]["duty_name"]));

        // console.log(bodyList[i]["duty_description"]);

        div.appendChild(PackageSpan("DIV", bodyList[i]["duty_description"]));

        // for(let j = 0 ; j < bodyList[i]["duty_description"].length ; j++){
        //     div.appendChild(createP(bodyList[i]["duty_description"][j]));
        // }
    }
    section.appendChild(div);

    return section;
}



/**
 * Read JSON file and add content into the web page.
 */
function loadJobContent(){
    requestJsonFile(jobIndex, null, false).then(function(jobData){
        let div = document.getElementById("job_ads_div");
        part = "JOB";
        for (let index in jobData){
            // console.log(data[0]['title']);
            if(index === "0"){
                div.appendChild(createSection(jobData[index]['title'], ""));
            }
            else{
                div.appendChild(createSection(jobData[index]['subtitle'], jobData[index]['body']));
            }
        }
    });
}


/**
 * add NOC content into html
 */
function loadNOCContent(){
    requestJsonFile(null, NOCIndex, false).then(function(nocData){
        // let indexOrder = ["id", "name", "lead statement", "example titles", "main duties", "employment requirements", "additional information", "exclusions"];
        // console.log(indexOrder.join(" "));
        part = "NOC";
        for (let index in nocData){
            // console.log(index);
            // console.log(data[index]);
            switch (index) {
                case "id": idBody = nocData[index];
                    break;
                case "name": nameBody = nocData[index];
                    break;
                case "lead statement": leadStatementBody = nocData[index];
                    break;
                case "example titles": exampleTitlesBody = nocData[index];
                    break;
                case "main duties": mainDuitiesBody = nocData[index];
                    break;
                case "employment requirements": employmentRequirementsBody = nocData[index];
                    break;
                case "additional information": addotionalInformationBody = nocData[index];
                    break;
                case "exclusions": exclusionsBody = nocData[index];
                    break;
            }
        }
        let div = document.getElementById("NOC_div");
        div.appendChild(createSection(idBody + " - " + nameBody, ""));
        div.appendChild(createSection("lead statement", leadStatementBody));
        div.appendChild(createSection("example titles", exampleTitlesBody));

        if(typeof mainDuitiesBody[0] === 'string'){
            div.appendChild(createSection("main duties", mainDuitiesBody));
        }
        else if(typeof mainDuitiesBody[0] === 'object') {
            div.appendChild(createMainDutiesSection("main duties", mainDuitiesBody));
        }
        else{
            alert("add main duties content error");
        }

        div.appendChild(createSection("employment requirements", employmentRequirementsBody));
        if(addotionalInformationBody != null){
            div.appendChild(createSection("additional information", addotionalInformationBody));
        }
        // div.appendChild(createSection("exclusions", exclusionsBody));
    });
}



/**
 * clean up all div and reload the content
 */
function contentRemoveAndRedraw(){
    d3.select("#job_ads_div").selectAll("*").remove();
    d3.select("#NOC_div").selectAll("*").remove();
    loadJobContent();
    loadNOCContent();
}
