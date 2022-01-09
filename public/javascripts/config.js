/* global tableau */

$(document).ready( function() {

    try { 
         tableau.extensions.initializeDialogAsync().then((OpenPayLoad)=> {
        
            alert(OpenPayLoad)
            tableau.extensions.ui.closeDialog("updated");
        
         });
       
    }catch (error){
        alert(error)
    }
});

