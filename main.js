$(document).ready(function() {

         var t0 = performance.now();

  var notification = document.querySelector('.mdl-js-snackbar');

  //slider
  $("#slider").mousemove(function() {
    var val = $(this).val();
    $('.card').css({
      'height': val + 'px',
      'width': val + 'px'
    });
  })

  function addTable(category) {
    var result = $('<table id="' + category + '" class="mdl-data-table mdl-js-data-table"><thead><tr><th class="mdl-data-table__cell--non-numeric sort" data-sort=' + category + '>' + category + '</th><th class="mdl-data-table__cell--non-numeric sort" data-sort="cost"">Cost</th></tr></thead><tbody class="list"></tbody></table>').appendTo('#tablecontainer');

  }

  function addRow(table, row) {
    var rowArr = row.split(',');
    var newRow = $('#' + table + ' tbody').append('<tr><td class="mdl-data-table__cell--non-numeric ' + table + '">' + rowArr[0] + '</td><td class="mdl-data-table__cell--non-numeric cost">$'+rowArr[1]+'<td></tr>');

  }

  //the meat and potatoes

  paper.install(window);
  var canvas = document.getElementById('myCanvas');
  paper.setup(canvas);

  function everythingFunc(svgID) {
    project.clear();
    $('.generatedcard').remove();
    $('table').remove();
    var pasteText = document.getElementById(svgID);
    var importedSVG;
    var tester = svgID;
    if (!(tester == 'mySVG')) {
      importedSVG = project.importSVG(pasteText);
    } else {
      importedSVG = project.importSVG(pasteText.value);
    }
    //importedSVG = project.importSVG(pasteText);

    importedSVG.fitBounds(view.bounds);
    pasteText.value = '';
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

    $('.generatedcard').click(function() {
      //$(this).toggleClass("active");
      $(this).toggleClass('selected');
      notification.MaterialSnackbar.showSnackbar({
        message: $(".selected").size() + ' choices selected',
        timeout: 1000
      });

    });
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

    //DO STUFF JUST FOR SVG CARDS
    //  $(document).mouseup(function(e) {
    //    if ($(e.target).is('div') || $(e.target).is('svg') || $(e.target).is('rect') || $(e.target).is('path') || $(e.target).is('circle')) {
    //        console.log(e);
    //      } else {
    //        $('.active').removeClass('active');
    //      }
    //    });
  };

  everythingFunc('defaultSVG');
  
  $('#mySVG').on('input propertychange', function() {
    everythingFunc('mySVG');
  });

  function createCombos(svg, comboArray) {
    var thecombos = [];
    for (var combo in comboArray) {
      var turnedOn = [];
      var totalCost = 0;
      var costRemovedArr = [];
      var infoList = [];
      for (var item in comboArray[combo]) {
        thecombos.push(comboArray[combo][item]);
        svg.children[comboArray[combo][item][0]].children[comboArray[combo][item][1]].visible = true;
        turnedOn.push(svg.children[comboArray[combo][item][0]].children[comboArray[combo][item][1]]);


       
        
        
        var nameAndCost = comboArray[combo][item][1].split(",");
        var nameAndCategory = comboArray[combo][item][0]+ ','+ nameAndCost[0];
        var category = comboArray[combo][item][0];
        var name = nameAndCost[0];
        var cost = nameAndCost[1];
         infoList.push('<li class="mdl-list__item mdl-list__item--two-line"><span class="mdl-list__item-primary-content"><span>'+category+'</span><span class="mdl-list__item-sub-title">'+name + ' $' + cost + '</span></li>');
        costRemovedArr.push(nameAndCategory);
        //cost = nameArray[1];
        totalCost = totalCost+parseFloat(cost);
      }
      
      var idArray =costRemovedArr.join(" ");
      var regex = new RegExp(',', 'g');
      idArray = idArray.replace(regex, '-');
      //alert(comboArray[combo].join("-").join("."));
      var newdiv = $('<div id="' + item + '" class="card card-1 generatedcard ' + idArray + '" style="display:none;">' + project.exportSVG({
        asString: true
      }) +'<div class="rightfloat"><div class="totalcost"><h6>$' + totalCost +'</h6></div></div>'+'<div id="inner-box" class="info"><ul class="mdl-list">'+infoList.join("")+'</ul></div>' +'</div>').appendTo('.page-content');
      newdiv.fadeIn(100);
      for (var option in turnedOn) {
        turnedOn[option].visible = false;
      }

    }
    //var thatresult = unique(thecombos);
    var theSVGs = document.getElementsByTagName('svg');
    for (var i = 0; i < theSVGs.length; i++) {
      theSVGs[i].removeAttribute("height");
      theSVGs[i].removeAttribute("width");
      theSVGs[i].setAttribute("viewBox", "-5 0 315 315");
    }
  }

  function getAllCombinations(arraysToCombine) {
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
      combinations.push(getPermutation(i, arraysToCombine));
    }
    return combinations;
  }

  function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  }

      var t1 = performance.now();
console.log("took " + (t1 - t0) + " milliseconds.") 
});