/**
 * set left margin and the side length of the square
 * @type {number}
 */
var margin_left = 0;
var side_length = 0;
var job_token_start = 0;
var noc_token_start = 0;
var overall = true;



/**
 * remove curve svg(width = 84%) and add new matrix svg with 100% width
 */
function matrixPreparation() {
    d3.select("#demo").selectAll("*").remove();

    let svg = d3.select("#demo")
        .append("svg")
        .attr("id", "matrix-display")
        .attr("width", "100%")
        .attr("height", "100%")

    margin_left = (d3.select("#demo").node().getBoundingClientRect().width) * 0.2;

    if(svg.node().getBoundingClientRect().width <= svg.node().getBoundingClientRect().height){
        side_length = svg.node().getBoundingClientRect().width;
    }
    else{
        side_length = svg.node().getBoundingClientRect().height;
    }

    side_length *= 0.7;

}



/**
 * modify the information of range slider
 */
function matrixModifyRange() {
    d3.select("#key_sentence_label")
        .html("Y-axis start index")
        .attr("title","This range slider allows you to customize the start of the vertical axis.")

    d3.select("#key_sentence")
        .attr("max", "" + (JobSentenceIndex - 10))
        .attr("value", "0")
        .attr("oninput","updateMatrixInput(this.id, this.value)")
        .attr("onchange", "updateMatrix(this.id, this.value)")

    d3.select("#cosine_score_label")
        .html("X-axis start index")
        .attr("title","This range slider allows you to customize the start of the horizontal axis.")

    d3.select("#cosine_score")
        .attr("min", "0")
        .attr("max", "" + (NOCSentenceIndex - 10))
        .attr("value", "0")
        .attr("oninput","updateMatrixInput(this.id, this.value)")
        .attr("onchange", "updateMatrix(this.id, this.value)")

    let ks = document.getElementById('key_sentence');
    job_token_start = parseInt(ks.value);
    document.getElementById('key_sentence_input').value = ks.value;
    ks.disabled = true;

    let cs = document.getElementById('cosine_score');
    noc_token_start = parseInt(cs.value);
    document.getElementById('cosine_score_input').value = cs.value;
    cs.disabled = true;

    $('#visualization_console')
        .append('<input class="btn btn-dark" type="button" id="GlobalButton" value="Entirety" onclick="switchOverall(this)" disabled>',
                '<input class="btn btn-primary" type="button" id="LocalButton" value="Locality" onclick="switchOverall(this)">');
}



/**
 * start draw Curve visualization
 */
function matrixStartUp(isConsoleExist){
    matrixPreparation();
    if(!isConsoleExist){
        matrixModifyRange();
    }

    drawMatrixVisualization();
}

function switchOverall(button){
    let another_button;

    if(button.value === "Entirety"){
        another_button = document.getElementById("LocalButton");
        document.getElementById('key_sentence').disabled = true;
        document.getElementById('cosine_score').disabled = true;
        overall = true;
    }
    else if(button.value === "Locality"){
        another_button = document.getElementById("GlobalButton");
        document.getElementById('key_sentence').disabled = false;
        document.getElementById('cosine_score').disabled = false;
        overall = false;
    }
    else{
        another_button = null
        alert("button class contains error in switchOverall function");
    }

    button.disabled = true;
    button.classList.remove("btn-primary");
    button.classList.add("btn-dark");

    another_button.disabled = false;
    another_button.classList.remove("btn-dark");
    another_button.classList.add("btn-primary");

    matrixRemoveAndRedraw(true);
}


/**
 *
 * @param id
 * @param val
 */
function updateMatrixInput(id, val) {
    document.getElementById(id + '_input').value = val;

}

function updateMatrix(id, val) {
    if(id === "cosine_score"){
        noc_token_start = parseInt(val);
    }
    else{
        job_token_start = parseInt(val);
    }

    matrixRemoveAndRedraw(true);
}


/**
 * Load data from backend and save it into the global variable.
 * initial the curve visualization
 */

function drawMatrixVisualization() {

    let svg = d3.select("#matrix-display")
    let X_scale = ScaleArray("X");
    let Y_scale = ScaleArray("Y");
    // console.log(X_scale)
    // console.log(Y_scale)

    var x = d3.scaleBand()
        .range([margin_left, side_length + margin_left])
        .domain(X_scale)
        .padding(0.1);
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + side_length + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()

    var y = d3.scaleBand()
        .range([side_length, 0])
        .domain(Y_scale)
        .padding(0.1);
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(" + margin_left + ", 0)")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

    // create a tooltip
    var tooltip = d3.select("#demo")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseenter = function (d) {
        d3.select(this)
            .style("stroke-width", 2)
            .style("stroke", "red")
            .style("stroke-opacity", 1)

        let job_token = document.getElementById("JOB_" + d.i);
        job_token.style.backgroundColor = "#FFF6DA";
        let job_ads_div = document.getElementById("job_ads_div");
        job_ads_div.scrollTop = job_ads_div.scrollHeight * 0.8 / JobSentenceIndex * d.i;

        let noc_token = document.getElementById("NOC_" + d.j);
        noc_token.style.backgroundColor = "#FFF6DA";
        let noc_div = document.getElementById("NOC_div");
        noc_div.scrollTop = NOC_div.scrollHeight * 0.85 / NOCSentenceIndex * d.j;

        tooltip
            .html("JOB_" + d.i + " & " + "NOC_" + d.j + "\t---\t"  + d.value.toFixed(2) + "<br>" 
                  + "JOB_" + d.i + "\t---\t" + job_token.textContent + "<br>"
                  + "NOC_" + d.j + "\t---\t" + noc_token.textContent)
            .style("left", (d3.mouse(this)[0] + 100) + "px")
            .style("top", (d3.mouse(this)[1] + 50) + "px")
            .style("opacity", 1)
    }

    var mouseclick = function(d) {
        job_token_start = parseInt(($(this).attr("yValue")).split("_")[1]);
        if(job_token_start > JobSentenceIndex - 10){
            job_token_start = JobSentenceIndex - 10;
        }

        noc_token_start = parseInt(($(this).attr("xValue")).split("_")[1]);
        if(noc_token_start > NOCSentenceIndex - 10){
            noc_token_start = NOCSentenceIndex - 10;
        }

        let globalButton = document.getElementById("GlobalButton");
        let localButton = document.getElementById("LocalButton");
                

        localButton.disabled = true;
        localButton.classList.remove("btn-primary");
        localButton.classList.add("btn-dark");

        globalButton.disabled = false;
        globalButton.classList.remove("btn-dark");
        globalButton.classList.add("btn-primary");

        let ks = document.getElementById('key_sentence');
        ks.value = job_token_start;
        document.getElementById('key_sentence_input').value = ks.value;
        ks.disabled = false;

        let cs = document.getElementById('cosine_score');
        cs.value = noc_token_start;
        document.getElementById('cosine_score_input').value = cs.value;
        cs.disabled = false;

        overall = false;

        matrixRemoveAndRedraw(true);
    }

    var mouseleave = function (d) {
        d3.select(this)
            .style("stroke-width", 0)
            .style("stroke", "none")
            .style("stroke-opacity", 0)

        let job_token = document.getElementById("JOB_" + d.i);
        job_token.style.backgroundColor = "#FFFFFF";
        let noc_token = document.getElementById("NOC_" + d.j);
        noc_token.style.backgroundColor = "#FFFFFF";

        tooltip
            .html("")
            .style("left", "0px")
            .style("top", "0px")
            .style("opacity", 0)
    }

    let important_sentence_data = getNeededSentencePair(cosine_score)

    // add the squares
    svg.selectAll()
        .data(important_sentence_data, function (d) {
            return 'NOC_' + d.j + ':' + 'JOB_' + d.i;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x('NOC_' + d.j)
        })
        .attr("y", function (d) {
            return y('JOB_' + d.i)
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("xValue", function (d) {
            return 'NOC_' + d.j
        })
        .attr("yValue", function (d) {
            return 'JOB_' + d.i
        })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", "purple")
        .style("stroke-width", 0)
        .style("stroke", "none")
        .style("stroke-opacity", 0)
        .style("fill-opacity", function (d) {
            return d.value
        })
        .on("mouseenter", mouseenter)
        .on("mouseleave", mouseleave)
        .on("click", mouseclick)

    if(overall){
        svg.selectAll("text").each(function(d, i) {
            let scale = d3.select(this);
            let tokenType = (scale.text().split("_"))[0];
            let scaleNumber = parseInt((scale.text().split("_"))[1]);

            if((tokenType === "JOB") && (scaleNumber < JobSentenceIndex - 1) && (scaleNumber % 10 !== 0)){
                scale.text("");
            }

            if((tokenType === "NOC") && (scaleNumber < NOCSentenceIndex - 1)){
                let tens = parseInt(NOCSentenceIndex / 10);
                let remainder = parseInt(NOCSentenceIndex % 10);
                if((parseInt(scaleNumber / 10) == tens) && (remainder < 5)){
                    scale.text("");
                }
                if(scaleNumber % 10 !== 0){
                    scale.text("");
                }
            }
        });
    }
}


/**
 * create X_scale 1d array
 */
function ScaleArray(axis){
    let console_start;
    let label;
    let size = 10;
    let array = [];

    if(overall){
        let console_end;
        if(axis === "X"){
            console_end = NOCSentenceIndex;
            label = "NOC_";
        }
        else if(axis === "Y"){
            console_end = JobSentenceIndex;
            label = "JOB_";
        }

        for (let i = 0; i < console_end; i++) {
            array.push(label + i);
        }
    }
    else{
        if(axis === "X"){
            console_start = noc_token_start;
            label = "NOC_";
        }
        else if(axis === "Y"){
            console_start = job_token_start;
            label = "JOB_";
        }
        else{
            alert("Get parameter error!!!");
        }

        for (let i = console_start; i < console_start + size; i++) {
            array.push(label + i);
        }
    }
    return array;
}



/**
 * Extract data from cosine score list and reorder the data
 */
function getNeededSentencePair(original_data){
    let Y_start = job_token_start;
    let X_start = noc_token_start;
    let size = 10;
    let extracted_data = [];

    // console.log(original_data)
    if(overall){
        for (let j = 0; j < NOCSentenceIndex; j++) {
            for (let i = 0; i < JobSentenceIndex; i++) {
                // console.log(i + " - " + j + " - " + original_data[i][j])
                extracted_data.push({"i": i, "j": j, "value": original_data[i][j]});
            }
        }
    }
    else{
        for (let j = X_start; j < X_start + size; j++) {
            for (let i = Y_start; i < Y_start + size; i++) {
                // console.log(i + " - " + j + " - " + original_data[i][j])
                extracted_data.push({"i": i, "j": j, "value": original_data[i][j]});
            }
        }
    }

    return extracted_data;
}

function matrixRemoveAndRedraw(isConsoleExist){
    d3.select("#matrix-display").remove();
    matrixStartUp(isConsoleExist);
}