var suggestions;
var searchBar;
var suggestionCount;
var User;

$.fn.styleSubtext = function(opts) {
  //http://stackoverflow.com/questions/9794851/find-text-string-in-jquery-and-make-it-bold
  var tag = opts.tag || 'span'
    , subtext = opts.subtext || []
    , regex = RegExp(subtext.join('|'), 'i') // case insensitive
    , style = opts.style || 'color:red'
    , replacement = '<'+ tag +' style="' + style + '">$&</'+ tag +'>';

  return this.html(function() {
    return $(this).text().replace(regex, replacement);
  });
};

function parsePath() {
  var pathBits = nsData.request.path.split('/');
  return pathBits[0] + ' > ' + pathBits[1];
}     

//http://stackoverflow.com/questions/20073618/using-bootstrap-3-0-modals-to-load-dynamic-remote-content-within-an-ifram
function parseSearchText() {
  var path = nsData.request.url;
  return path + '/nutshell/' + searchBar.val().replace(' > ', '/');
}

function toggleSuggestions(forceHide) {  
  if (searchBar.val() === '' || forceHide) {
    suggestions.hide();
  } else {
    suggestions.show();
  }
}

function isValidRequest() {
  var result = false;

  //FIX! check if nsData.roles exist!
  //if (searchBar.val() is valid) {
    result = true;
  //}
  return result;
}

function generateSuggestions() {
  var searchBarVal = searchBar.val();
  var matches = [];

  if (searchBarVal === '' || !userRoles || !userRoles.resources) {
    console.log('problem');
    toggleSuggestions();
    return;
  }
}

function initNavbar() {
  
  //setup fb
  User = new Firebase('https://nutshell.firebaseio.com/user/123321');
  User.on('value', function(data) {

    //setup roles //FIX! dont think we use this...
    userRoles = data.val() ? data.val().roles : [];

    //identify suggested matches
    userRoles.resources.forEach(function(item, ctr) {

      if (!item.ops.includes('c') && !item.ops.includes('r') && !item.ops.includes('u') && !item.ops.includes('d') ) {
        return false;
      }

      var suggestionText = item.path.replace('/', ' > ');
      if (suggestionText.includes(searchBar.val())) {
        matches.push(suggestionText);
      } else {
        return false;
      }

      generateSuggestions();
    });
  });
}

function setupNavbar(options, next) {

  //add the navbar
  $('body').append($('<div id="nsNav"></div>'));

  //load up the html
  $('#nsNav').load('../../assets/navbar.html', function() {
    console.log('loaded the view... hookup logic!');
    initNavbar();
    console.log('navbar initialised!');

    //default view logic starts here...
    suggestions = $('#suggestions');
    searchBar = $('#searchBar');
    suggestionCount = 0;

    console.log('setup current searchbar'); //, this.parsePath());
    //setup ui
    
    //searchBar.val(parsePath());
    //searchBar.attr('placeholder', request.service + ' > ' + request.resource);
    searchBar.attr('placeholder', 'service > resource');
    //searchBar.focus(function() { $(this).select(); }).focus();
    searchBar.focus();
  });
}
        

//         suggestionCount = matches.length;

//         var suggestionText = (suggestionCount === 0) ? 'no suggestions' : 'suggestions';
//         var suggestionMarkup = '<li class="dropdown-header">' + suggestionText + '</li>';

//         matches.forEach(function(item, ctr) {
//           var matchingService = item.split(' > ')[0];
//           var matchingResource = item.split(' > ')[1];

//           suggestionMarkup += '<li><a href="#" class="suggestion" style="color: #c0c0c0">' + matchingService + ' > ' + matchingResource + '</a></li>';
//         });

//         suggestionMarkup += '<li class="divider"></li><li><a href="#"><strong>help me</strong></a></li>';

//         suggestions.html($(suggestionMarkup)).find('li>a').styleSubtext({
//             subtext: [searchBarVal],
//             style: 'font-weight: bold; color: #000' //' font-size: 28px; color: #020202'
//         });
      
//         function setPath(path) {
//           var url = nsData.request.url + '/nutshell/' + path + '.view?educateme=1';
          
//           window.location = url;
//         }

//         function showHelp() {
//           console.log('display help');

//           var searchBarVal = searchBar.val();
//           var path = parseSearchText(searchBarVal);

//           if (path) {
//             if (!educateMe.hasOwnProperty(searchBarVal)) {
//               //get it and cache
//               $.get(path + '?educateme=1', function(data) {
//                 if (data && data.education) {
//                   //cache it!
//                   educateMe[searchBarVal] = data.education;
//                   setupEducation();
//                 } else {
//                   console.log('failed to get education!!!')
//                 }
//               });
//             } else {
//               //get from cache
//               console.log('got from cache');
//               setupEducation();
//             }
//           } else {
//             console.log('invalid path [not present in nsData.roles')
//           }
//         }

//         searchBar.keyup(function(evt) {

//           //FIX! simplify this muck!!!
//           //regen on change of text
//           //and
//           //dont show if text match path!

//           var searchBar = $('#searchBar');
//           var searchBarVal = searchBar.val();
//           var key = evt.keyCode || evt.which;
//           var generatedPath = request.service + ' > ' + request.resource;

//           if ( (key == 27) && searchBarVal === '') {                  //ESCAPE
//             searchBar.val(generatedPath);
//             searchBar.focus();
//             toggleSuggestions(true);
//           } else if ( (key == 8) && searchBarVal.endsWith(' >')) {          //BACKSPACE=8
//             //remove the ' > ' in one go
//             var pos = searchBarVal.indexOf(' >');
//             if (pos > 0) {
//               searchBar.val(searchBarVal.substring(0, pos));
//             }
//           } else {
//             evt.preventDefault();
//             generateSuggestions();
          
//             if ( (searchBarVal !== '') && (searchBarVal !== generatedPath) ) {

//               if (key === 9 || key === 32 || key === 10 || key === 13) {
//                 if (suggestionCount === 1) {
//                   toggleSuggestions(true);    //force hide
//                 } else {
//                   toggleSuggestions();
//                 }
//               } else {
//                 console.log('regen suggests and show it! [key=' + key + ']')
                
//                 toggleSuggestions();
//               }
//             } else if (searchBarVal !== generatedPath) {
//               console.log('hide the suggg....');
//             }
//           }
//         });

//         //searchBar.keypress(function(evt) {
//         searchBar.parent().on('keydown', '#searchBar', function(evt) {        
//           //check for special keys for autocompletion and submission
//           var key = evt.keyCode || evt.which;

//           // if (key == 10 || key == 13) {          //ENTER=submit form
//           //  evt.preventDefault();
//           //  //if valid path and minimum inputs then...
//           //  //FIX! window.location = ...
//           //  console.log('"redirect" if valid path and minimum inputs then...');
//           // } else 
//           if (key === 27) {           //ESCAPE
//             searchBar.val(request.service + ' > ' + request.resource);
//             searchBar.focus();
//             toggleSuggestions(true);
//               evt.preventDefault();
//               return false;
//             // } else if (key === 62 || key === 46) {     //>=62 and .=46

//             } else if (key === 32 || key === 9 || key === 10 || key === 13 || key === 62 || key === 46) {     //SPACE & TAB & ENTER=autocomplete (AND submit)
//               evt.preventDefault();

//               if (suggestionCount === 0 || searchBar.val() === '') {
//                 console.log('weird exit here... there are no suggestions and the searchBar is empty');
//                 return false;
//               } else if (suggestionCount === 1) { //if only one option then autocomplete
//                 console.log('only one option so autocomplete and exit');
//                 //console.log('we can autocomplete!!!');
//                 searchBar.val(suggestions.find('.suggestion').text());
//                 toggleSuggestions(true);

//                 if (key === 10 || key === 13) {
//                   console.log('now instead of autocomplete we submit!!');

//                   var urlPath = suggestions.find('.suggestion').text().replace(' > ', '/');

//                   if (!nsData.request.path.startsWith(urlPath)) {     //don't submit same request!
//                     console.log('not submitting request... already viewing requested resource');
//                     setPath(urlPath);
//                   }
                  
//                   return false;
//                 }
                
//                 return;
//               } else {
//                 //there are multiple suggestions...

//                 //console.log(suggestions.find('.suggestion').length);
//                 var canAutoCompleteService = true;

//                 suggestions.find('.suggestion').each(function(i, item) {
//                   var $item = $(item);
//                   if (!$item.text().startsWith(searchBar.val())) {    //WHY NOT STARTSWITH!? FIX! to use includes()
//                     console.log('can\'t autocomplete as diferent services...');
//                     canAutoCompleteService = false;
//                     return false;
//                   }
//                 });

//                 if (canAutoCompleteService && !searchBar.val().includes('>')) {
//                   //if we dont check for the ">" we overwrite everything after the ">""
//                   searchBar.val(suggestions.find('.suggestion').first().text().split(' > ')[0] + ' > ');
//                 }
//               }
//             } else {
//               console.log(key);
//             }
//           }
//         }
//       });



//       searchBar.click(function() {
//         generateSuggestions();
//         toggleSuggestions();
//       });
//       searchBar.blur(function() {
//         suggestions.hide();
//       });

//       return next();

//     });
// //setup table heading
// // $('#serviceName').html(request.singularResource);

// // //populate table
// // nsData[request.resource][request.singularResource].forEach(function(item, i) {
// //  var row = $('<tr class="active"><td>' + i + '</td><td>' + item.name + '</td><td><a class="modalSpawner" data-url="' + item.url + '" >Detail</a></td></tr>');
// //  $('#results').append(row);
// // });