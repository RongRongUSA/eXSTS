/**
 *
 * @type {null}
 */
var CURVE_RELATIONSHIP_DISPLAY_NUMBER = null;
var MINIMUM_ACCEPTABLE_COSINE_SCORE = null;



/**
 * add left-tokens div, right-tokens div into demo div
 */

function curvePreparation(){
    d3.select("#demo").selectAll("*").remove();
    overall = true;
    let demo_div = document.getElementById("demo");

    // let left_div = d3.select("#demo")
    //     .append("div")
    //     .attr("id", "left-tokens")
    //     .attr("width", "6%")
    //     .attr("height", "100%")
    //     .attr("float", "left")
    //     .attr("text-align", "right")
    let left_div = document.createElement("DIV");
    left_div.setAttribute("id","left-tokens");
    left_div.setAttribute("width","" + demo_div.offsetWidth * 0.08);
    demo_div.appendChild(left_div);

    $('#demo')
        .append('<svg id="curve-display" width="' + demo_div.offsetWidth * 0.9 + '" height="100%"></svg>');

    // let svg = d3.select("#demo")
    //     .append("svg")
    //     .attr("id", "curve-display")
    //     .attr("width", "84%")
    //     .attr("height", "100%")

    let right_div = document.createElement("DIV");
    right_div.setAttribute("id","right-tokens");
    right_div.setAttribute("width","" + demo_div.offsetWidth * 0.08);
    demo_div.appendChild(right_div);
    // let right_div = d3.select("#demo")
    //     .append("div")
    //     .attr("id", "right-tokens")
    //     .attr("width", "6%")
    //     .attr("height", "100%")
    //     .attr("float", "right")
    //     .attr("text-align", "left")
}



/**
 * modify the information of range slider
 */
function curveModifyRange(){
    d3.select("#key_sentence_label")
        .html("Top X relevant sentence")
        .attr("title","How many relevant sentences in the NOC group will be displayed when you select a job token on the left side of the curve?")

    d3.select("#key_sentence")
        .attr("max", "6")
        .attr("value", "3")
        .attr("oninput","updateTextInput(this.id, this.value)")
        .attr("onchange", "updateCurve(this.id, this.value)")

    CURVE_RELATIONSHIP_DISPLAY_NUMBER = document.getElementById('key_sentence').value;
    document.getElementById('key_sentence_input').value = document.getElementById('key_sentence').value;

    d3.select("#cosine_score_label")
        .html("Key sentence threshold")
        .attr("title","This threshold will control the number of key job sentences on the left side of the curve.")

    d3.select("#cosine_score")
        .attr("min", "40")
        .attr("max", "100")
        .attr("value", "50")
        .attr("oninput","updateTextInput(this.id, this.value)")
        .attr("onchange", "updateCurve(this.id, this.value)")

    d3.select("#GlobalButton").remove()
    d3.select("#LocalButton").remove()

    document.getElementById('key_sentence').disabled = false;
    document.getElementById('cosine_score').disabled = false;
    MINIMUM_ACCEPTABLE_COSINE_SCORE = document.getElementById('cosine_score').value / 100;
    document.getElementById('cosine_score_input').value = document.getElementById('cosine_score').value / 100;
}



/**
 * start draw Curve visualization
 */
function curveStartUp(reloadData){
    curvePreparation();
    curveModifyRange();
    if(reloadData) {
        requestJsonFile(jobIndex, NOCIndex, false).then(function (cosineData) {
            job_ads_sentences = cosineData['job_ads'];
            NOC_sentences = cosineData['NOC'];
            cosine_score = cosineData['cosine'];

            if((job_ads_sentences != null) && (NOC_sentences != null) && (cosine_score != null)){
                console.log("Data is ready");
                // console.log(job_ads_sentences)
                // console.log(NOC_sentences)
                // console.log(cosine_score)
            }
            else{
                alert("Data is not received in requestJsonFile function");
            }

            updateCurveVisualization();
        });
    }
    else{
        updateCurveVisualization();
    }
}



/**
 * erase all the element in the curve visualization first and redraw it.
 */
function updateCurveVisualization(){
    d3.select("svg").selectAll("*").remove();
    d3.select("#left-tokens").selectAll("*").remove();
    d3.select("#right-tokens").selectAll("*").remove();

    let important_sentence_index = getImportantSentencePair(cosine_score);
    addTokens(important_sentence_index);
    drawCurve(important_sentence_index);
}



/**
 * Find all the sentence pair whose cosine score is larger than the minimum cosine score
 *
 * @param cosine_score - 2d array include all the sentence pair's cosine score
 * @return [{}, {}, ...] - the index of sentences pair
 */
function getImportantSentencePair(cosine_score){
    let index = [];
    for(let i = 0; i < cosine_score.length; i++){
        for(let j = 0; j < cosine_score[0].length; j++){
            if(cosine_score[i][j] >= MINIMUM_ACCEPTABLE_COSINE_SCORE){
                index.push(getRelatedSentence(i,cosine_score));
            }
        }
    }
    return index;
}



/**
 * Given a row index, I want to find top x(based on the global variable: CURVE_RELATIONSHIP_DISPLAY_NUMBER) cosine score in this whole row
 *
 * @param i_index - the row index
 * @param cosine_score - 2d array list
 * @return [{}, {} ....] - column index and score
 */
function getRelatedSentence(i_index, cosine_score){
    let sorted_array = [];
    for (let i = 0; i < cosine_score[i_index].length; i++) {
        sorted_array[i] = cosine_score[i_index][i];
    }

    let topValues = sorted_array.sort((a,b) => b-a).slice(0,CURVE_RELATIONSHIP_DISPLAY_NUMBER);

    let index_value = [];
    let temp = cosine_score[i_index];

    for(let element of topValues){
        let j_index = temp.indexOf(element);
        index_value.push({"i": i_index, "j": j_index, "value": element});
    }

    return index_value;
}

function tooltipOrder(unsort, side){

    let tooltip = "";
    unsort.sort((a, b) => b.value - a.value);

    if(side === "left"){

        let sortList = [];
        let sentence_spans = document.getElementById("JOB_" +  unsort[0]["i"] );
        tooltip += "JOB_" +  unsort[0]["i"] + "\t---\t" + sentence_spans.textContent + "\n\n";

        unsort.forEach(function(element){
            if(sortList.some(e => e.j == element.j)){}
            else{                
                tooltip += "NOC_" +  element.j + " & JOB_" + element.i + "\t---\t" + element.value.toFixed(2);
                sentence_spans = document.getElementById("NOC_" +  element.j );

                tooltip += "\n\t\tNOC_" +  element.j + "\t---\t" + sentence_spans.textContent + "\n\n";
                sortList.push(element);
            }
        });

        // console.log(sortList)
    }
    else if(side === "right"){

        let sortList = [];
        let sentence_spans = document.getElementById("NOC_" +  unsort[0]["j"] );
        tooltip += "NOC_" +  unsort[0]["j"] + "\t---\t" + sentence_spans.textContent + "\n\n";

        unsort.forEach(function(element){
            if(sortList.some(e => e.i == element.i)){}
            else{
                tooltip += "JOB_" +  element.i + " & NOC_" + element.j + "\t---\t" + element.value.toFixed(2);
                let sentence_spans = document.getElementById("JOB_" +  element.i );
                tooltip += "\n\t\tJOB_" +  element.i +  "\t---\t" + sentence_spans.textContent + "\n\n";
                sortList.push(element);
            }            
        });
    }
    else{
        alert("Read token error in tooltipOrder function!");
    }

    return tooltip;
}



/**
 * Given several related sentence pair, create div and add it into the website
 *
 * @param top10Token - include several sentence pairs
 */
function addTokens(top10Token){
    // console.log(top10Token);
    let left_index = [];
    let right_index = [];
    top10Token.forEach(function(element){
        left_index.push(element[0]["i"]);

        element.forEach(function(data){
            right_index.push(data["j"]);
        });
    });

    left_index.sort((a,b) => a-b);
    right_index.sort((a,b) => a-b);
    left_index = left_index.filter((value, index) => left_index.indexOf(value) === index);
    right_index = right_index.filter((value, index) => right_index.indexOf(value) === index);

    let left_token = document.getElementById("left-tokens");
    for(let i = 0 ; i < left_index.length ; i++){
        let div = document.createElement("DIV");
        div.setAttribute("class","token left-token");
        div.setAttribute("id","token-" + i);
        div.setAttribute("onmouseenter","BorderMouseEnterToken(this)");
        div.setAttribute("onmouseout","BorderMouseOutToken(this)");
        // div.setAttribute("value", "JOB_" + left_index[i]);
        // div.setAttribute("value", job_ads_sentences[i]);
        div.textContent = "JOB_" + left_index[i];

        let tooltip = "";
        for(let j = 0 ; j < top10Token.length; j++){
            if(top10Token[j][0].i === left_index[i]){
                tooltip = tooltipOrder(top10Token[j], "left");
                break;
            }
        }
        div.setAttribute("title", tooltip);

        left_token.appendChild(div);
    }

    let right_token = document.getElementById("right-tokens");
    for(let i = 0 ; i < right_index.length ; i++){
        let div = document.createElement("DIV");
        div.setAttribute("class","token right-token");
        div.setAttribute("id","token-" + i);
        div.setAttribute("onmouseenter","BorderMouseEnterToken(this)");
        div.setAttribute("onmouseout","BorderMouseOutToken(this)");
        // div.setAttribute("value", NOC_sentences[i]);
        div.textContent = "NOC_" + right_index[i];

        let tooltip = [];
        for(let j = 0 ; j < top10Token.length; j++){
            for(let k = 0 ; k < top10Token[j].length; k++){
                if(top10Token[j][k].j === right_index[i]){
                    tooltip.push(top10Token[j][k]);
                }
            }
        }
        div.setAttribute("title",tooltipOrder(tooltip, "right"));

        right_token.appendChild(div);
    }
}



/**
 * Token mouse enter events - add red border, highlight original sentence, hidden unnecessary curve
 * @param element: the element that user's mouse selected
 */
function BorderMouseEnterToken(element){
    element.style.borderStyle = "solid";
    element.style.borderWidth = "2px";
    element.style.borderColor = "red";

    let index_list = element.textContent.split("_");
    let content = element.getAttribute('value');
    let index = index_list[1];

    let sentence_spans = document.getElementById(element.textContent);
    sentence_spans.style.backgroundColor = "#FFF6DA";

    let svg_paths = document.getElementById("curve-display").getElementsByTagName("path");

    if(sentence_spans.getAttribute('class').includes("left_token")){
        let job_ads_div = document.getElementById("job_ads_div");
        let token_index = sentence_spans.id;
        token_index = token_index.split("_");
        job_ads_div.scrollTop = job_ads_div.scrollHeight / JobSentenceIndex * token_index[1];

        for (let i = 0; i < svg_paths.length; i++) {
          if (("token-" + svg_paths[i].getAttribute('left-idx')) === element.id) {
              svg_paths[i].setAttributeNS(null,'visibility','visible');
          }
          else{
              svg_paths[i].setAttributeNS(null,'visibility','hidden');
          }
        }
    }
    else if(sentence_spans.getAttribute('class').includes("right_token")){
        let NOC_div = document.getElementById("NOC_div");
        let token_index = sentence_spans.id;
        token_index = token_index.split("_");
        NOC_div.scrollTop = NOC_div.scrollHeight * 0.85 / NOCSentenceIndex * token_index[1];

        for (let i = 0; i < svg_paths.length; i++) {
          if (("token-" + svg_paths[i].getAttribute('right-idx')) === element.id) {
              svg_paths[i].setAttributeNS(null,'visibility','visible');
          }
          else{
              svg_paths[i].setAttributeNS(null,'visibility','hidden');
          }
        }
    }
    else{
        alert("read element information error");
    }
}



/**
 * remove token's border, remove sentence highlight, remove hidden curve
 * @param element - the element that user's mouse selected
 */
function BorderMouseOutToken(element){
    element.style.borderStyle = "none";
    element.style.borderWidth = "0px";
    element.style.borderColor = "white";

    let sentence_spans = document.getElementById(element.textContent);
    sentence_spans.style.backgroundColor = "#FFFFFF";

    let svg_paths = document.getElementById("curve-display").getElementsByTagName("path");

    for (let i = 0; i < svg_paths.length; i++) {
        svg_paths[i].setAttributeNS(null,'visibility','visible');
    }
}



/**
 * Given sentence index (JOB_21 or NOC_62) get token order number (token-0 or token-15)
 * @param array: is a map type with three key(i, j, value)
 *               i is the number(e.g. 21) in left token(e.g. JOB_21)
 *               j is the number(e.g. 62) in right token(e.g. NOC_62)
 *               value is the cosine score value, never used in this function
 * @return {Map<left, right>} is a map type with two key (left, right)
 *               left is the token order number(e.g. token-0) of left token(e.g. JOB_21)
 *               right is the token order number(e.g. token-15) of right token(e.g. NOC_62)
 */
function findTokenIndex(array){
    const left_divs = document.getElementById("left-tokens").getElementsByTagName("div");
    const right_divs = document.getElementById("right-tokens").getElementsByTagName("div");
    let index_map = new Map();

    for (let i = 0; i < left_divs.length; i++) {
      if (left_divs[i].textContent === ("JOB_" + array.i)) {
          index_map['left'] = ((left_divs[i].id).split("-"))[1];
          break;
      }
    }

    for (let i = 0; i < right_divs.length; i++) {
      if (right_divs[i].textContent === ("NOC_" + array.j)) {
          index_map['right'] = ((right_divs[i].id).split("-"))[1];
          break;
      }
    }

    return index_map;
}



/**
 * draw each curve in svg
 * @param important_sentence_index: is a array[{}, {}, ... , {}] and each element include three part(i, j, value).
 *                                  i is the number(e.g. 21) in left token(e.g. JOB_21)
 *                                  j is the number(e.g. 62) in right token(e.g. NOC_62)
 *                                  value is the cosine score value, never used in this function
 */
function drawCurve(important_sentence_index){

    let svg = document.getElementById("curve-display");
    let boxheight = 26;
    let svg_width = svg.width.baseVal.value + 100;
    // console.log(svg_width)

    let leftx = 0, rightx = 0;

    for (let i = 0 ; i < important_sentence_index.length ; i++){
        for (let j = 0 ; j < important_sentence_index[i].length ; j++){
            let token_index = findTokenIndex(important_sentence_index[i][j]);
            leftx = boxheight * (parseInt(token_index["left"]) + 0.5);
            rightx = boxheight * (parseInt(token_index["right"]) + 0.5);

            let d = "M0, " + leftx + " C " + 100 + ", " + leftx + ", " + 100 + ", " + rightx  + ", " + svg_width + ", " + rightx;
            let xmlns = "http://www.w3.org/2000/svg";
            let path = document.createElementNS(xmlns, "path");
            path.setAttributeNS(null, 'd', d);
            path.setAttributeNS(null,'class', "curve");
            path.setAttributeNS(null,'opacity', important_sentence_index[i][j]['value']);
            path.setAttributeNS(null,'stroke-width',"2");
            path.setAttributeNS(null,'left-idx',token_index["left"]);
            path.setAttributeNS(null,'right-idx',token_index["right"]);
            svg.appendChild(path);
        }
    }
}



/**
 * change number when user Slide the slider
 * @param id: slider id in div(curve_console)
 * @param val: the value of the slider
 */
function updateTextInput(id, val) {
    if(id === "cosine_score"){
        document.getElementById(id + '_input').value = val / 100;
    }
    else{
        document.getElementById(id + '_input').value = val;
    }
}



/**
 * update the curve visualization at the end of slide the slider
 * @param id: slider id in div(curve_console)
 * @param val: the value of the slider
 */
function updateCurve(id, val){
    if(id === "cosine_score"){
        MINIMUM_ACCEPTABLE_COSINE_SCORE = val / 100 ;
    }
    else{
        CURVE_RELATIONSHIP_DISPLAY_NUMBER = val;
    }
    updateCurveVisualization();
}

function curveRemoveAndRedraw(cleanUpContent, reloadData){
    d3.select("#curve-display").selectAll("*").remove();
    d3.select("#left-tokens").remove();
    d3.select("#right-tokens").remove();
    if(cleanUpContent){
        JobSentenceIndex = 0;
        NOCSentenceIndex = 0;
        part = "";
    }

    curveStartUp(reloadData);
}