$(document).ready(function() {

 var t0 = window.performance.now();

//MAIN
    
//initialize the hidden canvas    
paper.install(window);
var canvas = document.getElementById('myCanvas');
paper.setup(canvas);
  
//process the embedded SVG
everythingFunc('defaultSVG');
var t1 = window.performance.now();
console.log("took " + (t1 - t0) + " milliseconds.")       
    
    
    
    




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
    everythingFunc(importedSVG, true);
    pasteField.value = '';
}
 
function everythingFunc(svgID, paste) {
    var everythingT1 = window.performance.now();
    var importedSVG;

    //store the SVG element
    if (paste){
        importedSVG = svgID;
    }
    else{
        var svgElement = document.getElementById(svgID);

        //import the SVG element into the paper canvas
        importedSVG = project.importSVG(svgElement);
    }
    //fit the SVG to the size of the canvas
    importedSVG.fitBounds(view.bounds);
    paper.view.update()
    
    //get the number of layers in the SVG
    var numLayers = importedSVG.children.length;
    
    //this array will contain all of the categories in the SVG
    var categoryList = [];
    
    //each layer will be come a category, for each layer
    for (var i = 0; i < numLayers; i++) {
        
        var categoryName = importedSVG.children[i].name;
        //add a table at the top
        addTable(categoryName);
        //this array will store the names of each child of a layer.  These are the options in a category.
        var optionNames = [];
        
        //for each option in a category
        for (var j = 0; j < importedSVG.children[i].children.length; j++) {
                        
            //store the paper.js object
            var theOption = importedSVG.children[i].children[j];
            var optionName = theOption.name;
            
            //insert it into the table
            addRow(categoryName, optionName);
            
            //turn the visibility off, we'll turn it on later
            theOption.visible = false;
            
            //push an array to the child array containing the category and the option
            optionNames.push([categoryName,optionName]);
            
            //trying to get lists to work
            //var options = {
            //    valueNames: [optionName]
            //};
            //new List(importedSVG.children[i].name, options);

      }
      categoryList.push(optionNames);
    }
    var everythingT2 = window.performance.now();
    console.log(everythingT2-everythingT1 + " to process the SVG");
    
    
    //get all of the combinations
    var comboT1 = window.performance.now();
    var allCombos = getAllCombinations(importedSVG, categoryList);
    fixSVGs();
    var comboT2 = window.performance.now();
    console.log(comboT2-comboT1 + " milliseconds to create all combinations.");

  };
    
    
//Function to get all permutations
function getAllCombinations(importedSVG, arraysToCombine) {
    var divisors = [];
    for (var i = arraysToCombine.length - 1; i >= 0; i--) {
      divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
    }

    function getPermutation(n, arraysToCombine) {
      var result = [],
        curArray;
      for (var i = 0; i < arraysToCombine.length; i++) {
        curArray = arraysToCombine[i];
        result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
      }

      return result;
    }
    var numPerms = arraysToCombine[0].length;
    for (var i = 1; i < arraysToCombine.length; i++) {
      numPerms *= arraysToCombine[i].length;
    }
    var combinations = [];
    for (var i = 0; i < numPerms; i++) {
        var thePerm = getPermutation(i, arraysToCombine);
        
        //putting createcombos stuff in here
        createCombos(importedSVG, thePerm);
    }
    return combinations;
  }
    

    //remove height + width tags, insert viewbox tag into SVG so that it can resize correctly
    function fixSVGs(){
        var theSVGs = document.getElementsByTagName('svg');
        for (var i = 0; i < theSVGs.length; i++) {
          theSVGs[i].removeAttribute("height");
          theSVGs[i].removeAttribute("width");
          theSVGs[i].setAttribute("viewBox", "-5 0 315 315");
        }
    }
   
    
    function imageFromStorage(original) {
  var image,
      dataURI = original.toDataURL();
    image = document.createElement('img');
    image.src = dataURI;
  return image;
}
    
 function createCombos(svg, combo) {

      
        var turnedOn = [];
        var totalCost = 0;
        var costRemovedArr = [];
        var infoList = [];
        for (var item in combo) {
            svg.children[combo[item][0]].children[combo[item][1]].visible = true;
            //svg.children[combo[item][0]].children[combo[item][1]].selected = true;
            turnedOn.push(svg.children[combo[item][0]].children[combo[item][1]]);
            
            var nameAndCost = combo[item][1].split(",");
            var nameAndCategory = combo[item][0]+ ','+ nameAndCost[0];
            var category = combo[item][0];
            var name = nameAndCost[0];
            var cost = nameAndCost[1];
            infoList.push('<li class="mdl-list__item mdl-list__item--two-line"><span class="mdl-list__item-primary-content"><span>'+category+'</span><span class="mdl-list__item-sub-title">'+name + ' $' + cost + '</span></li>');
            costRemovedArr.push(nameAndCategory);
            totalCost = totalCost+parseFloat(cost);
        }
      
        var idArray =costRemovedArr.join(" ");
        var regex = new RegExp(',', 'g');
        idArray = idArray.replace(regex, '-');
        var newdiv = $('<div id="' + item + '" class="card card-1 generatedcard ' + idArray + '" style="display:none;">').appendTo('.page-content');
//     var selectedItems = project.selectedItems;  
  //   var theSVG = '<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg">';
    // for (selectedItem in selectedItems){
    //    theSVG = theSVG + selectedItems[selectedItem].exportSVG({asString: true});
    // }
    // theSVG = theSVG + '</svg>';
     var newCanvas = document.createElement('canvas');

     newCanvas.width = canvas.width;
     newCanvas.height = canvas.height;
         paper.view.update()

     var ctx = newCanvas.getContext("2d");
     ctx.drawImage(canvas, 0,0);
    // var newCanvas = imageFromStorage(canvas);
     $(newCanvas).appendTo(newdiv);
     //var canvasElement = document.getElementById(costRemovedArr.join('-').replace(regex,"-"));
     

     //newdiv.append(theSVG);
                       $('<div class="rightfloat"><div class="totalcost"><h6>$' + totalCost +'</h6></div></div>'+'<div id="inner-box" class="info"><ul class="mdl-list">'+infoList.join("")+'</ul></div>' +'</div>').appendTo(newdiv);
     
        newdiv.fadeIn(10);
        for (var option in turnedOn) {
            turnedOn[option].visible = false;
            //turnedOn[option].selected = false;
        }

  }
    
//EVENTS
  
    
    
//on paste
    $('#mySVG').on('input propertychange', function() {
    importFromPaste(document.getElementById('mySVG'))
    });
    
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
    
    
    
    
    
    

    
    
    
    
    
});