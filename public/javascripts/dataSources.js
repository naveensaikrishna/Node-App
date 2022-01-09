'use strict';

/* global tableau */

try {
   
  const edit = async event => {
    
      const url = `./config`;
  
      let closePayload = await tableau.extensions.ui.displayDialogAsync(url, "OpenPayLoad-1", {width: 600, height: 450});
  
      if (closePayload) {
        alert(closePayload)
      } else {
        alert("Error trying to update request!");
      }
    };

  tableau.extensions.initializeAsync({'configure': edit}).then(() => {
    let worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    let worksheet = worksheets.find(ws => ws.name === "Summary");
    let unregisterHandler = worksheet.addEventListener(
      tableau.TableauEventType.MarkSelectionChanged,
      edit
    );
  });

  
}
catch(e){
  alert(e)
}


/*
let full_data = {}

try {
// Wrap everything in an anonymous function to avoid polluting the global namespace
(async function () {

    $(document).ready(function () {

        try {
            tableau.extensions.initializeAsync({'configure': configure}).then( () =>{
                // To get dataSource info, first get the dashboard.
                const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

                // Then loop through each worksheet and get its dataSources, save promise for later.
                worksheets.forEach( (worksheet,i) => {   
                          
                    worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, updateValue);
                });
                
            }, function (err) {
                // Something went wrong in initialization.
                console.log('Error while Initializing: ' + err.toString());
            });
        } catch (error) {
            alert(error)
        }
    });

    function configure() {
      let popupUrl = './config'
      alert(popupUrl)
        alert(JSON.stringify(Object.keys(tableau.extensions)))
      tableau.extensions.ui.displayDialogAsync(popupUrl, "", { height: 500, width: 500 }).then((closePayload) => {
        alert("Dialog")
        if(closePayload) {
          alert(closePayload)
        }else {
          alert("No closepayload")
        }
        document.write("Dialog to configure")
      }).catch((error) => {
        alert(error)
      });
    }

    let updateValue = async (selectionEvent) => {
      // When the selection changes, reload the data  

        let selectedData= await selectionEvent.getMarksAsync()
         
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
    }

    let createForm= function () {

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
*/