'use strict';

try {
// Wrap everything in an anonymous function to avoid polluting the global namespace
(async function () {
/*
    try {

        tableau.extensions.initializeDialogAsync().then(async function (openPayload) { 
         const url = "http://localhost:8081/input";

            try {
              let closePayload = await tableau.extensions.ui.displayDialogAsync(url, null, {width: 600, height: 450});

              if (closePayload) {
                alert("closed")
              } 
              else {
                alert("Error trying to update request!");
              }

            } catch (error) {
              alert(error)              
            } 
                       
        });
      
    } catch(error) {
      alert(error)
    }
*/

    let full_data = {}

    $(document).ready(function () {

        try {
            tableau.extensions.initializeAsync().then(function () {
          
                let dataSourceFetchPromises = [];
          
                // Maps dataSource id to dataSource so we can keep track of unique dataSources.
                let dashboardDataSources = {};
          
                // To get dataSource info, first get the dashboard.
                const dashboard = tableau.extensions.dashboardContent.dashboard;
      
                // Then loop through each worksheet and get its dataSources, save promise for later.
                dashboard.worksheets.forEach(function (worksheet,i) {

                  const markSelection = tableau.TableauEventType.MarkSelectionChanged;
                  //
                  let unregisterEventHandlerFunction = worksheet.addEventListener(markSelection, function (selectionEvent) {
                  // When the selection changes, reload the data                 

                    selectionEvent.getMarksAsync().then(function(selectedData){
                     
                      let columns = selectedData.data[0]._columns
                      let dataset = []
                      selectedData.data[0]._data.forEach( (rows,i)=> {
    
                        let arr = []
                        rows.forEach( (d,j)=> {
                            arr = [...arr,columns[j]._fieldName=='Measure Names'?d._formattedValue:d._value]
                        }) 
                        dataset = [...dataset,arr]
                      })

                      full_data['dataset'] = dataset;
                      full_data['columns'] = columns

                      createForm() 
                    })
                  });

                  // remove the event listener when done
                  //unregisterEventHandlerFunction();
                  dataSourceFetchPromises.push(worksheet.getDataSourcesAsync());
                });
          
                return
            }, function (err) {
                // Something went wrong in initialization.
                console.log('Error while Initializing: ' + err.toString());
            });
        } catch (error) {
            alert("ERROR")
        }
    });
  

    function createForm() {


      if (full_data['dataset'].length == 0 ) {

        $("#submit-btn").addClass('hide')    
      }
    

      let dataset = full_data['dataset']
      let columns = full_data['columns']
      let table = "<table> <thead> "

      let tr = "<tr> "
      columns.forEach( (d,i) => {
        tr =  tr + " <th>" + d._fieldName + "</th> "
      })

      tr = tr + "</tr>"
      table = table + tr + " </thead> <tbody> "
    
      dataset.forEach((row,k) => {

        let tr = "<tr> "
        row.forEach((d,i)=> {          
          
           //let input = (columns[i] == 'Measure Values'? input :d)
            let input = "<input type='text' class='validate' data-row='"+k+"' value ="+d+" onchange='updateValue()'>"

            input = (columns[i]._fieldName == 'Measure Values')? input :d
            tr =  tr + " <td data-row='"+k+"'>" + input + "</td> "
        })

        tr = tr + " </tr>"
        table = table + tr
      })

      table = table + "</tbody> </html>"

      $("#table-container").html(table)
      $("#submit-btn").removeClass('hide')    
    }

    $("#table-container").on("change","input", (e)=>{  
      
      
      let row=$(e.target).attr('data-row')
      
      let columns= full_data['columns'].map( d => d._fieldName)
      
      let k = columns.indexOf('Measure Values')

      full_data['dataset'][row][k] = $(e.target).val()

    })

    
    $("#submit-btn").on("click", (e)=>{  
      
      let row=$(e.target).attr('data-row')     
      let columns= full_data['columns'].map( d => d._fieldName)
      
      let obj = {}
          obj['dataset'] = full_data['dataset']
          obj['columns'] = columns

      var settings = {
        "url": "/savedata",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(obj)
      };

      $.ajax(settings).done(function (response) {
        alert(response)
      });

    })
   
  })();

  
}catch(e){
  alert(e)
}