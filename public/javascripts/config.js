/* global tableau */

let columns = {}
function createDropdown(container, id,values,dropDownName,eventListener) {

    let options = "<option disabled> Select "+dropDownName+" </option>"
    options = values.reduce((str,d) => str+ " <option value = '"+d+"' > " +d+ "</option> ",options)

    alert("<select id ='"+id+"' onchange='"+eventListener+"'> "+ options + "</select>")
    $("#"+container).html("<select id ='"+id+"' onchange='"+eventListener+"'> "+ options + "</select>")

}

$(document).ready( function() {

    try { 
         tableau.extensions.initializeDialogAsync().then(async (OpenPayLoad)=> {
        
            let dashboard = tableau.extensions.dashboardContent.dashboard.name;
            let worksheets = tableau.extensions.dashboardContent.dashboard.worksheets.map( (d,i) => d.name);

            // Alert if zero worksheets
            if(worksheets.length == 0) {
                alert("Please add the worksheets")
                return
            }

            createDropdown("select-worksheet-div","select-worksheet",worksheets,"Worksheet","onChangeWorksheet()")

            if(worksheets.length > 0) {
                onChangeWorksheet()
            }

         });
       
    }catch (error){
        alert(error)
    }
});

function onChangeWorksheet() {
   
    populatedTableauColumnNames()
    getTablesList()
}

async function getTablesList(){

    try {
        
        let tablesList = await getDataFromServer("http://localhost:8081/schemas/get-all-schemas");

        tablesList = JSON.parse(tablesList)

        createDropdown("select-table-name-div","select-table-name",tablesList,"Table Name","getColumnsList()")

        if(tablesList.length == 1)
            getColumnsList();

    } catch (error) {
        alert("____ err _______")
    }
}

async function getColumnsList(){

    let tableName = $("#select-table-name").val()

    try {
        
        let columnsList = await getDataFromServer("http://localhost:8081/schemas/get-columns?table_name="+tableName);

        columnsList = JSON.parse(columnsList)

        alert(JSON.stringify(columnsList))

    } catch (error) {
        alert("____ err _______")
    }

}

function getDataFromServer(url) {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        return fetch(url, requestOptions).then(response => response.text());
}

async function populatedTableauColumnNames() {

    let selectedWorksheet = $("#select-worksheet").val()
    let worksheetObj = tableau.extensions.dashboardContent.dashboard.worksheets.filter( (d,i) => d.name == selectedWorksheet )[0]

    let tabColumnsList = await worksheetObj.getSummaryColumnsInfoAsync();
        tabColumnsList = tabColumnsList.map( d=> d._fieldName)
    
    let p = tabColumnsList.reduce((str,d) => str+ " <p> "+ d +" </p> ","")

    $(".tab-columns-div").html(p)

}

function populateColumnsSelectionDropdown(columnsList) {


    let selectedWorksheet = $("#select-worksheet").val()
    let worksheetObj = tableau.extensions.dashboardContent.dashboard.worksheets.filter( (d,i) => d.name == selectedWorksheet )[0]

    let tabColumnsList = await worksheetObj.getSummaryColumnsInfoAsync();
        tabColumnsList = tabColumnsList.map( d=> d._fieldName)

    $(".ds-columns-div").html()

    let selectDropdown = "";

    
    
}