$(document).ready(function() {

    
//MAIN
    
//initialize the hidden canvas    
paper.install(window);
var canvas = document.getElementById('myCanvas');
paper.setup(canvas);
    
//process the embedded SVG
everythingFunc('defaultSVG');
    
    
    
    
    




//FUNCTIONS
    
//Table Functions
function addTable(category) {
    var result = $('<table id="' + category + '" class="mdl-data-table mdl-js-data-table"><thead><tr><th class="mdl-data-table__cell--non-numeric sort" data-sort=' + category + '>' + category + '</th><th class="mdl-data-table__cell--non-numeric sort" data-sort="cost"">Cost</th></tr></thead><tbody class="list"></tbody></table>').appendTo('#tablecontainer');

  }

function addRow(table, row) {
    var rowArr = row.split(',');
    var newRow = $('#' + table + ' tbody').append('<tr><td class="mdl-data-table__cell--non-numeric ' + table + '">' + rowArr[0] + '</td><td class="mdl-data-table__cell--non-numeric cost">$'+rowArr[1]+'<td></tr>');

  }    

    
//Upload or Paste In SVG Functions
    
function clearSite() {
    project.clear();
    $('.generatedcard').remove();
    $('table').remove();
}
    
function importFromPaste(pasteField) {
    //clear the site
    clearSite();
    
    //import content from the textfield
    importedSVG = project.importSVG(pasteField.value);
    pasteText.value = '';
}
 
function everythingFunc(svgID) {
    

    //store the SVG element
    var svgElement = document.getElementById(svgID);
    
    //import the SVG element into the paper canvas
    var importedSVG = project.importSVG(svgElement);

    //fit the SVG to the size of the canvas
    importedSVG.fitBounds(view.bounds);
    
    var numLayers = importedSVG.children.length;
    var masterList = [];
    for (var i = 0; i < numLayers; i++) {
      addTable(importedSVG.children[i].name);
      var childNames = [];
      for (var j = 0; j < importedSVG.children[i].children.length; j++) {
        var thechild = importedSVG.children[i].children[j];
        addRow(importedSVG.children[i].name, thechild.name);
        thechild.visible = false;
        childNames.push([
          importedSVG.children[i].name,
          thechild.name
        ]);
        var options = {
          valueNames: [importedSVG.children[i].name]
        };
        new List(importedSVG.children[i].name, options);

      }
      masterList.push(childNames);
    }
    var arraysToCombine = masterList;
    var result = getAllCombinations(arraysToCombine);

    createCombos(importedSVG, result);


  };
    
    
    
    
//EVENTS
  
    
//When you move the slider, change the size of all of the combination divs    
$("#slider").mousemove(function() {
    var val = $(this).val();
    $('.card').css({
      'height': val + 'px',
      'width': val + 'px'
    });
  })
    
    
//setup snackbar
var notification = document.querySelector('.mdl-js-snackbar');

//When clicking a card, select the card and display the number of selected choices
$('.generatedcard').click(function() {
  $(this).toggleClass('selected');
  notification.MaterialSnackbar.showSnackbar({
    message: $(".selected").size() + ' choices selected',
    timeout: 1000
  });
});

//When clicking a cell in the table, filter the visible combinations based on the table
$("tr td:not(.cost)").click(function() { // function_td
  $(this).toggleClass("inactive");
  $('div').removeClass("filtered")
    //alert($(this).html());
  var filterList = [];
  //get a list of all tables
  $("table").each(function() {
    var curTable = $(this);
    var curTableID = $(curTable).attr('id');
    var cell = $(this).find("td:not(.cost)").each(function() {
      //alert($(this).attr('class'));
      if ($(this).hasClass("inactive")) {
        filterList.push(curTableID + "-" + $(this).html());
      }

    });

  });
  for (var item in filterList) {
    $(('.' + filterList[item])).addClass('filtered');
  }
  notification.MaterialSnackbar.showSnackbar({
    message: $(".generatedcard").filter(":visible").size() + ' combinations left',
    timeout: 1000
  });
});
    
    
    
    
    
    

    
    
    
    
    
}