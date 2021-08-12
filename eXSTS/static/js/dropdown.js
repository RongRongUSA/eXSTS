/**
 * Get dropdown options list from backend system
 * using the dropdown options list to create options in html
 * @return ["...", "..." ,"..."] - string array, options name
 */
fetch('http://selene.research.cs.dal.ca:8060/DropdownList')
    .then(response => response.json())
    .then(function(data){
        data.forEach(function (element){
            let index = element.split("-")[0];
            $('#DropdownMenu')
                // .append('<a class="dropdown-item" href="?noc=' + index + '">' + element +'</a>');
                .append('<a class="dropdown-item" href="#" onclick="updateJobNocIndex(this)">' + element +'</a>');

        });
    });



/**
 * options onclick events, update job and noc index, redraw the whole page
 * @param options - selected options in dropdown list
 */
function updateJobNocIndex(options){
    if(options.textContent == "Demo"){
        jobIndex = '194'
        NOCIndex = '2283'
    }
    else{
        NOCIndex = (options.textContent).split(" ")[0]

        switch(NOCIndex){
            case '2171':
                jobIndex = '26';
                break
            case '2172':
                jobIndex = '103';
                break
            case '2173':
                jobIndex = '100';
                break
            case '2174':
                jobIndex = '105';
                break
            case '2283':
                jobIndex = '194';
                break
            case '9222':
                jobIndex = '33';
                break
            default:
                alert("get noc index error in function updateJobNocIndex(options)")
        }
    }

    // remove top 5 list
    top5ListRemoveAndRedraw();

    // remove content
    contentRemoveAndRedraw();

    // remove console
    consoleRemoveAndRedraw();

    // remove visualization and redraw it
    curveRemoveAndRedraw(true, true);
}
