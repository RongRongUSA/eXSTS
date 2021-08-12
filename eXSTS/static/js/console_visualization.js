/**
 *  add two button in the console
 *  button can switch visualization
 *  add two range slider and text in the console
 */
function addButtons() {
    $('#visualization_button')
        .append('<input class="btn btn-dark" type="button" id="CurveButton" value="Relationship" onclick="switchVisualization(this)" disabled>',
                '<input class="btn btn-primary" type="submit" id="MatrixButton" value="Matrix" onclick="switchVisualization(this)">'
        );

    $('#visualization_console')
        .append('<label for="key_sentence" style="text-align: center; width: 100%;" id="key_sentence_label" class="form-label"></label>',
                '<input type="text" class="textInput" id="key_sentence_input" value="">',
                '<input type="range" class="form-range" style="width: 100%; margin-bottom: 20px;" min="0" id="key_sentence">',
                '<label for="cosine_score" style="text-align: center; width: 100%;" id="cosine_score_label" class="form-label"></label>',
                '<input type="text" class="textInput" id="cosine_score_input" value="">',
                '<input type="range" class="form-range" style="width: 100%; margin-bottom: 20px;" id="cosine_score">'
        );
}


/**
 * button onclick function, modify button disabled and color
 * @param button: mouse click button
 */
function switchVisualization(button){

    let another_button;

    if(button.value === "Relationship"){
        another_button = document.getElementById("MatrixButton");
        curveRemoveAndRedraw(false, false);
    }
    else if(button.value === "Matrix"){
        another_button = document.getElementById("CurveButton");
        matrixStartUp();
    }
    else{
        another_button = null
        alert("visualization button function error!!!")
    }

    button.disabled = true;
    button.classList.remove("btn-primary");
    button.classList.add("btn-dark");

    another_button.disabled = false;
    another_button.classList.remove("btn-dark");
    another_button.classList.add("btn-primary");
}

function initializeButton(){
    let curveButton = document.getElementById("CurveButton");
    let MatrixButton = document.getElementById("MatrixButton");

    curveButton.disabled = true;
    curveButton.classList.remove("btn-primary");
    curveButton.classList.add("btn-dark");

    MatrixButton.disabled = false;
    MatrixButton.classList.remove("btn-dark");
    MatrixButton.classList.add("btn-primary");
}

function consoleRemoveAndRedraw(){
    d3.select("#visualization_button").selectAll("*").remove();
    d3.select("#visualization_console").selectAll("*").remove();
    addButtons();
}
