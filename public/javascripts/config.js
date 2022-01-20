/* global tableau */

let tableList;
let worksheetsList;
let selectedTable;
let selectedWorksheet;
let selectedWorksheetColumns;
let selectedTableColumns;

let columns = {}
function createDropdown(container, values) {

    let options = ""
    options = values.reduce((str,d) => str+ " <option value = '"+d+"' > " +d+ "</option> ",options)

    $("#"+container).html(options)

}

$(document).ready( function() {

    try { 
        tableau.extensions.initializeDialogAsync().then(async (OpenPayLoad)=> {
    
            let dashboard = tableau.extensions.dashboardContent.dashboard.name;
            
            worksheetsList = tableau.extensions.dashboardContent.dashboard.worksheets.map( (d,i) => d.name);  
            tableList = await getTablesList();
            tableList = JSON.parse(tableList)
            
            createDropdown("selectWorksheet", worksheetsList)
            createDropdown("selectTableName", tableList)

            if(worksheetsList && worksheetsList.length >0)
                selectedWorksheet = worksheetsList[0]

            if(tableList && tableList.length >0)
                selectedTable = tableList[0]

            unregisterSettingsEventListener = tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
                
            });

        });
       
    }catch (error){
        alert(error)
    }
});


function getTablesList(){

        return getDataFromServer("http://localhost:8081/schemas/get-all-schemas");
}

async function getColumnsList(){

    let tableName = $("#selectTableName").val()

    return getDataFromServer("http://localhost:8081/schemas/get-columns?table_name="+tableName)

    try {
        
        let columnsList = await getDataFromServer("http://localhost:8081/schemas/get-columns?table_name="+tableName);

        columnsList = JSON.parse(columnsList)

        populateColumnsSelectionDropdown(columnsList)

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

function populateColumnMapping(){

    
}

async function populatedTableauColumnNames() {
    

    let worksheetObj = tableau.extensions.dashboardContent.dashboard.worksheets.filter( (d,i) => d.name == selectedWorksheet )[0]

    let tabColumnsList = await worksheetObj.getSummaryColumnsInfoAsync();
        tabColumnsList = tabColumnsList.map( d=> d._fieldName)
    
    let p = tabColumnsList.reduce((str,d) => str+ " <p> "+ d +" </p> ","")

    $(".tab-columns-div").html(p)

}

async function populateColumnsSelectionDropdown(columnsList) {


    let selectedWorksheet = $("#select-worksheet").val()
    let worksheetObj = tableau.extensions.dashboardContent.dashboard.worksheets.filter( (d,i) => d.name == selectedWorksheet )[0]

    let tabColumnsList = await worksheetObj.getSummaryColumnsInfoAsync();
        tabColumnsList = tabColumnsList.map( d=> d._fieldName)


    let selects = tabColumnsList.reduce( (str,v) => {

        let options = "<option disabled> Select Data Source Column </option>"
        options = columnsList.reduce((str,d) => str+ " <option value = '"+d.name+"' > " +d.name+ "</option> ",options)
    
        return str + " <select '> "+ options + "</select>"
    },"")

    $(".ds-columns-div").html(selects)

}