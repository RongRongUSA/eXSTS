/**
 * request cosine score array between job ads and noc
 * @param jobIndex - JOB ads' json file name, like 194.json
 * @param nocIndex - NOC json file name, like 2171.json
 * @param isTop5List
 */
function requestJsonFile(jobIndex, nocIndex, isTop5List){
    let URL = '';

    if((jobIndex != null) && (nocIndex) != null && !isTop5List){
        URL += 'http://selene.research.cs.dal.ca:8060/CosineScore?job=' + jobIndex + '&noc=' + nocIndex;
    }
    else if((jobIndex == null) && (nocIndex) != null && !isTop5List){
        URL += 'http://selene.research.cs.dal.ca:8060/NOCJsonFile?noc=' + nocIndex;
    }
    else if((jobIndex != null) && (nocIndex) == null && !isTop5List){
        URL += 'http://selene.research.cs.dal.ca:8060/jobAdsJsonFile?job=' + jobIndex;
    }
    else if((jobIndex != null) && (nocIndex) == null && isTop5List){
        URL += 'http://selene.research.cs.dal.ca:8060/Top5List?job=' + jobIndex;
    }
    else{
        alert("Read parameter error in requestJsonFile function")
    }

    return fetch(URL, { method: 'GET' })
        .then(function(response) {
            return response.json();
        })
        .catch(function(err) {
            alert(`Error: ${err}` + ' in requestJsonFile function');
        });
}



/**
 * Read Top 5 List JSON file and add content into the web page.
 */
function loadTop5List(){
    requestJsonFile(jobIndex, null, true).then(function(top5ListData){
        console.log()
        for (let i = 0; i < top5ListData['name'].length; i++) {
            $('#TOP5_list_tbody')
                .append('<tr><th scope="row"><a href="#" onclick="updateNocIndex(this)">' + top5ListData['name'][i] + '</a></th><td>' + top5ListData['score'][i] + '</td></tr>');
        }
    });
}



/**
 * options onclick events, update noc index, redraw the whole page
 * @param options - selected options in top 5 list
 */
function updateNocIndex(options){
    NOCIndex = (options.textContent).split(" ")[0]

    contentRemoveAndRedraw()

    // remove visualization and redraw it
    initializeButton();
    curveRemoveAndRedraw(true, true);

}

function top5ListRemoveAndRedraw(){
    d3.select("#TOP5_list_tbody").selectAll("*").remove();
    loadTop5List();
}