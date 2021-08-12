/**
 * @description add an option into drop down list
 * @param {string} itemName: the content of option
 */
function addDropdownItem (itemName){
    let newElement = document.createElement("a");
    newElement.innerText = itemName;
    newElement.className = "dropdown-item";
    document.getElementById("DropdownMenu").appendChild(newElement);
}
// addDropdownItem("2171 - Information systems analysts and consultants");

/**
 * @description Load job ads JSON file from flask URL
 * @returns {json} job ads JSON file
 */
function loadJobAdsJsonFile(){
    return fetch('http://127.0.0.1:5000/jobAdsJsonFile',{
        method: 'POST',
    });
}

/**
 * @description Read JSON file and add content into the web page.
 */
loadJobAdsJsonFile('194').then(
(response) => response.json().then(
    function(data){
        let div = document.getElementById("job_ads_div");
        part = "JOB";
        for (let index in data){
            // console.log(data[0]['title']);
            if(index === "0"){
                div.appendChild(createSection(data[index]['title'], ""));
            }
            else{
                div.appendChild(createSection(data[index]['subtitle'], data[index]['body']));
            }
        }
    }
));

// $('#console')
// .append('<label for="key_sentence" style="text-align: center; width: 100%;" id="key_sentence_label" class="form-label"></label>',
//         '<input type="text" class="textInput" id="key_sentence_input" value="">',
//         '<input type="range" class="form-range" style="width: 100%; margin-bottom: 20px;" min="0" id="key_sentence" >',
//         '<label for="cosine_score" style="text-align: center; width: 100%;" id="cosine_score_label" class="form-label"></label>',
//         '<input type="text" class="textInput" id="cosine_score_input" value="">',
//         '<input type="range" class="form-range" style="width: 100%; margin-bottom: 20px;" id="cosine_score" >'
// );

/**
 * @description Load job ads JSON file from flask URL
 * @returns {json} job ads JSON file
 */
function loadJsonFile(jobIndex, nocIndex){
    let URL = 'http://127.0.0.1:5000/jobAdsJsonFile?job=' + jobIndex;

    return fetch(URL,{
        method: 'GET',
    })
        .then(function(response) {
            return response.json();
        })
        .catch(function(err) {
            console.log(`Error: ${err}`)
        });
}

/**
 * create global variable to save job ads, NOC content and sentence pari cosine score
 */
var job_ads_sentences = null;
var NOC_sentences = null;
var cosine_score = null;


/**
 * options onclick events, update the noc data
 * @param options
 */
function updateData(options){
    let NOCIndex = (options.textContent).split(" ")[0]

    // hard code NOCIndex to 2171 - requestCosineScoreData('194', NOCIndex)
    requestJsonFile('194', NOCIndex).then(function (data) {
    // requestJsonFile('194', '2171').then(function (data) {
        job_ads_sentences = data['job_ads'];
        NOC_sentences = data['NOC'];
        cosine_score = data['cosine'];
    })
    waitForRequest();
}

/**
 * website start from the comparison between 194 job ads and 2171 NOC
 */
if((job_ads_sentences == null) && (NOC_sentences == null) && (cosine_score == null)){
    requestJsonFile('194', '2171', false).then(function (data) {
        job_ads_sentences = data['job_ads'];
        NOC_sentences = data['NOC'];
        cosine_score = data['cosine'];
    })
    waitForRequest();
}


/**
 * wait 6 seconds and make sure data have been saved into global variable
 */
function waitForRequest(){
    setTimeout(() => {
        if((job_ads_sentences != null) && (NOC_sentences != null) && (cosine_score != null)){
            console.log("Data is ready");
        }
        else{
            alert("Data is not received in requestJsonFile function");
        }
    }, 6000);
}