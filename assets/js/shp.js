var assetsURL = 'https://fastly.jsdelivr.net/gh/estds/gef-china-shp-cap-website-small-and-green/assets';

const jsonURL = assetsURL + '/data/all-content-v5.json';

let translation = {
  "caseStudy": "案例分析",
  "ton": "吨",
  "installedCap": "总装机",
  "before": "改造前",
  "after": "改造后",
  "kiloWatt": "千瓦",
  "annualOutput": "年发电",
  "GWhx100": "亿度",
  "emmCutAnnual": "年均减排",
  "plantList": "试点电站",
  "clickItemsKnowMore": "请点击列表中的条目了解详情。",
  "readOn": "继续阅读",
  "allItems": "显示所有",
  "noResultFound": "没有检索到结果",
  "typeToSearch": "输入关键词后此处显示搜索结果",
  "knowMore": "了解更多"
};

//***************** Callback for search *****************//
function type2Search(json, searchBox) {
  var searchInput = searchBox.value.toLowerCase();
  var resultBoxID = searchBox.getAttribute('data-result-box');

  let searchResults = [];


  if (searchInput.length > 0) {
    // Loop through each item in the JSON data
    for (let i = 0; i < json.length; i++) {
      const item = json[i];
      const secondElement = item[1].toLowerCase();
      const thirdElement = item[2].toLowerCase();

      // Check if the search input matches the second or third element
      if (secondElement.includes(searchInput) || thirdElement.includes(searchInput)) {
        searchResults.push(item);
      }
    }

  } else {
  	var promptText = ['', '', translation.typeToSearch, 2];
    searchResults.push(promptText);
  }
  // Display search results
  const searchResultsContainer = document.querySelector(resultBoxID);
  searchResultsContainer.innerHTML = '';
  
  let listHTML = ``;

  if (searchResults.length > 0) {
    for (let i = 0; i < searchResults.length; i++) {
      const resultItem = searchResults[i];
      let disabledBtn = resultItem[3] == 2 ? ' disabled' : '';
      listHTML += `<li class="list-group-item border-0${disabledBtn}" data-menuanchor="${resultItem[0]}" data-bs-dismiss="offcanvas"><a href="#${resultItem[0]}" class="d-block${disabledBtn}"><h6 class="text-white text-truncate">${resultItem[1]}</h6><p class="small text-truncate text-light mb-0">${resultItem[2]}</p></a></li>`;
    }
    searchResultsContainer.innerHTML = listHTML;
  } else {
  
  	searchResultsContainer.innerHTML = `<li class="list-group-item disabled"><a href="#" class="d-block disabled"><h6 class="text-white text-truncate"></h6><p class="small text-truncate text-light mb-0">${translation.noResultFound}</p></a></li>`;
  }

}

//***************** Callback for formatting the content JSON *****************//

function createArrarySearch(json) {

  var sortedArray = [];
  
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
      var obj = json[key];
      var sid = obj.id;
      var descInfo = obj.desc ? obj.desc : '';
      sortedArray.push([sid, obj.name, descInfo, 0]);
      if (obj.children) {
        for (const child of obj.children) {
          var childrenArray = getArrayFolder(child, sid);
          sortedArray = sortedArray.concat(childrenArray);
        }
      }
    }
  }
  return sortedArray;
}

function getArraySingle(json, sid) {
  var retArray = [];
  if (json.id && json.name) {
    var jsonDesc = json.desc ? json.desc : '';
    retArray.push([sid, json.name, jsonDesc, 1]);
    return retArray;
  } else {
    return '';
  }
}

function getArrayFolder(json, sid) {
  var retArray = [];

  var singleArray = getArraySingle(json, sid);
  if (singleArray.length > 0) {
  	retArray = retArray.concat(singleArray);
  }

  if (json.children) {
    for (const child of json.children) {
      retArray = retArray.concat(getArrayFolder(child, sid));
    }
  }
  return retArray;
}


//***************** Callback for creating FP menu *****************//

function createNavMenu(json, elementID) {
  var navList = document.getElementById(elementID);
  let listHTML = ``;

  for (const obj of json) {
    if (obj[3] == 0) {
      listHTML += `<li class="list-group-item border-0" data-menuanchor="${obj[0]}" data-bs-dismiss="offcanvas"><a href="#${obj[0]}" class="d-block">${obj[1]}</a></li>`;
    }
  }
  navList.innerHTML = listHTML;
}


//***************** Callback for creating home screen from JSON data *****************//

function createSectionHome(json) {
  var selector = '[data-anchor="' + json.id + '"]';
  var homeElement = document.querySelector(selector);

  var homeHTML = `<video class="bg-video" loop muted data-autoplay playsinline poster="${assetsURL+json.children[1].poster}">
                   <source src="${assetsURL+json.children[1].vid}" type="video/mp4">
                 </video>
                 <div class="logo-wrap">
                   <img src="${assetsURL+json.children[0].img}" alt="${assetsURL+json.children[0].alt}" class="img-fluid">
                 </div>
                 <div class="layer">
                   <div class="container text-white text-center">
                     <h1 class="display-3 fw-bolder">${json.name}</h1>
                     <p>${json.desc}</p>
                   </div>
                 </div>`;

  homeElement.innerHTML = homeHTML;

  var bgVideo = homeElement.querySelector('video');
  bgVideo.play();
}

//***************** Callback for creating project overview from JSON data *****************//

function createSectionProjOverview(json) {

  var sectionSelector = '[data-anchor="' + json.id + '"]';
  var sectionElement = document.querySelector(sectionSelector);
  sectionElement.innerHTML = `<div id="${json.id}-wrap" class="container text-white"><div class="row"><div class="col-12 col-md-6 first-column d-flex"></div><div class="col-12 col-md-6 second-column"></div></div></div>`;
  
  var targetWrapID = json.id + '-wrap';
  let leftColumnHTML = `<div class="mx-4 mx-md-0 w-100 align-self-center">`;
  let righColumnHTML = `<div class="mx-4 mx-md-0"><h2>${json.name}</h2><div class="d-none d-md-block">${json.richDesc}</div><div class="d-block d-md-none"><p class="text-truncate mb-0">${json.desc}<br><a href="#" data-term-expl="${json.desc}" data-bs-toggle="modal" data-bs-target="#kh-term-exp" class="text-white small" title="${json.name}">${translation.readOn}<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a></p></div></div>`;

  for (const obj of json.children) {
    if (obj.type == 'video') {
      leftColumnHTML += `<div id="${obj.name}-wrap" class="video-wrap mb-2 shadow"><video class="video-js vjs-16-9" poster="${assetsURL+obj.poster}" playsinline controls preload="auto" data-setup="{}">`
      for (const src of obj.link) {
        leftColumnHTML += `<source src="${assetsURL+src.src}" type="${src.type}" label="${src.label}" />`;
      }
      leftColumnHTML += `</video></div>`;
    } else if (obj.type == 'button') {
      leftColumnHTML += `<p class="text-center"><a href="${assetsURL + obj.link}" target="_blank" class="btn btn-lg rounded-0 shadow btn-primary btn-unido-orange">${obj.name}</a></p>`;
    }
  }

  leftColumnHTML += `</div>`;

  let leftColumn = document.getElementById(targetWrapID).querySelector('.first-column');
  let rightColumn = document.getElementById(targetWrapID).querySelector('.second-column');
  rightColumn.innerHTML = righColumnHTML;
  leftColumn.innerHTML = leftColumnHTML;
}

//***************** Callback for creating map from JSON data *****************//

function createPlantListItems(data) {
  let listHTML = "";
  for (const obj of data) {
    listHTML += `<li class="list-group-item"><a class="d-block text-truncate text-decoration-none text-dark" ds-mo-toggle="map-popup" ds-mo-target="$ll-popup-${obj.id}" href="#">${obj.name}</a></li>`
  }
  return listHTML;
}

function createSectionDemoPlants(json) {

  var selector = '[data-anchor="' + json.id + '"]';
  var sectionDOM = document.querySelector(selector);
  
  sectionDOM.innerHTML = `<div id="${json.id}-leaflet-map" class="leaflet-map-fullscreen"></div><div class="position-absolute d-flex align-items-start flex-column small map-pin-list"><div class="w-100 d-grid"><button class="accordion-button rounded-0 p-3 text-white demo-plant-list-toggle collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#demo-plant-list-content" aria-expanded="false"><i class="bi bi-caret-down-fill me-2"></i>${translation.plantList}</button></div><div class="collapse demo-plant-list-content bg-white mt-auto w-100 normalScroll" id="demo-plant-list-content"><ul class="list-group list-group-flush"></ul></div></div>`;

  // load map tiles from Autonavi.com
  var mapID = json.id +'-leaflet-map';
  const map = L.map(mapID, {
    scrollWheelZoom: false
  }).setView([30.00, 110.00], 6);
  map.attributionControl.setPrefix('Leaflet.js');
  L.tileLayer('https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    minZoom: 2,
    maxZoom: 16,
    attribution: "Basemap &copy; AutoNavi",
  }).addTo(map);

  // define styles of map pins
  var plantIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHlsZT0iZmlsbDojMDA5Y2RjOyIgZD0iTTEyIDEuMWE2Ljg0NyA2Ljg0NyAwIDAgMC02LjkgNi45MzJjMCAzLjg4MiAzLjc4OSA5LjAxIDYuOSAxNC45NjggMy4xMTEtNS45NTcgNi45LTExLjA4NiA2LjktMTQuOTY4QTYuODQ3IDYuODQ3IDAgMCAwIDEyIDEuMXptMCA5LjlhMyAzIDAgMSAxIDMtMyAzIDMgMCAwIDEtMyAzeiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMHoiLz48L3N2Zz4=',
    //shadowUrl: 'leaf-shadow.png',

    iconSize: [36, 36], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [18, 36], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -36] // point from which the popup should open relative to the iconAnchor
  });

  let demoPlants = json.children;

  var plantMarkers = [];

  // Create a list of markers that could toggle the popups
  var plantMarkerList = document.getElementById('demo-plant-list-content');

  // Loop through the data and create markers
  demoPlants.forEach(function(item) {
    var plantMarker = L.marker([item.plantLat, item.plantLon], {
      icon: plantIcon
    }).bindPopup('<h5>' + item.name + '</h5><p class="my-1">' + item.desc + '<a target="_blank" href="' + assetsURL + item.csReport + '">' + translation.caseStudy + '<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a></p><table cellspacing="0" cellpadding="0" border="0" class="table table-striped table-sm text-end"> <thead> <tr> <th></th> <th>' + translation.before + '</th> <th>' + translation.after + '</th> </tr> </thead> <tbody> <tr> <td class="text-start"><strong>' + translation.installedCap + '</strong> / ' + translation.kiloWatt + '</td> <td>' + item.capBefore.toLocaleString('en') + '</td> <td>' + item.capAfter.toLocaleString('en') + '</td> </tr> <tr> <td class="text-start"><strong>' + translation.annualOutput + '</strong> / ' + translation.GWhx100 + '</td> <td>' + item.outputBefore.toLocaleString('en') + '</td> <td>' + item.outputAfter.toLocaleString('en') + '</td> </tr> <tr> <td colspan="2" class="text-start"><strong>' + item.emNote + translation.emmCutAnnual + '</strong> / ' + translation.ton + '</td> <td>' + item.emCut.toLocaleString('en') + '</td> </tr> </tbody> </table>'); // Use 'desc' as the popup content

    plantMarker.addTo(map);
    plantMarkers.push(plantMarker);

    // Create a list item for each marker
    var listItem = document.createElement('li');
    listItem.innerHTML = `<li class="list-group-item"><a class="d-block text-truncate text-decoration-none text-dark" ds-mo-toggle="map-popup" ds-mo-target="$ll-popup-${item.id}" href="#">${item.name}</a></li>`
    //
    listItem.addEventListener('click', function() {
      // Close any open popups
      plantMarkers.forEach(function(m) {
        m.closePopup();
        var bsCollapse = new bootstrap.Collapse(plantMarkerList, {
          toggle: false
        })
        bsCollapse.hide();
      });
      // Open the popup for the selected marker
      plantMarker.openPopup();
    });

    plantMarkerList.querySelector('.list-group').appendChild(listItem);
  })

}

//***************** Callback for creating tech demo outputs from JSON data *****************//
function createTedemoItems(items) {
  let html = ``;
  for (let i = 0; i < items.length; i++) {
    let activeState = i === 0 ? ' active' : '';
    let i1 = i < items.length - 1 ? i + 1 : 0;

    html += `<div class="carousel-item${activeState}">
               <div class="row g-0">
                 <div class="col-lg-6 carousel-item-ele">
                   <div class="card border-0 rounded-0 bg-transparent">
                     <div class="d-flex">
                       <div class="flex-shrink-0 mt-4 ps-2 pb-4">
                         <img src="${assetsURL + items[i].img}" alt="${items[i].name}" class="shadow" style="max-height: 180px">
                       </div>
                       <div class="flex-grow-1">
                         <div class="card-body">
                           <h5 class="card-title">${items[i].name}</h5>
                           <p class="card-text small">${items[i].desc}<a href="#" class="d-md-none text-unido-orange" data-term-expl="${items[i].desc}" data-know-more-link="${assetsURL + items[i].link}" data-bs-toggle="modal" data-bs-target="#kh-term-exp" title="${items[i].name}">${translation.readOn}<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a></p>
                           <p class="card-text d-none d-md-block"><a href="${assetsURL + items[i].link}" target="_blank" class="btn btn-primary btn-unido-orange rounded-0 shadow">${translation.knowMore}<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a></p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div class="col-lg-6 carousel-item-ele">
                   <div class="card border-0 rounded-0 bg-transparent">
                     <div class="d-flex">
                       <div class="flex-shrink-0 mt-4 ps-2 pb-4">
                         <img src="${assetsURL + items[i1].img}" alt="${items[i1].name}" class="shadow" style="max-height: 180px">
                       </div>
                       <div class="flex-grow-1">
                         <div class="card-body">
                           <h5 class="card-title">${items[i1].name}</h5>
                           <p class="card-text small">${items[i1].desc}<a href="#" class="d-md-none text-unido-orange" data-term-expl="${items[i1].desc}" data-know-more-link="${assetsURL + items[i1].link}" data-bs-toggle="modal" data-bs-target="#kh-term-exp" title="${items[i1].name}">${translation.readOn}<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a></p>
                           <p class="card-text d-none d-md-block"><a href="${assetsURL + items[i1].link}" target="_blank" class="btn btn-primary btn-unido-orange rounded-0 shadow">${translation.knowMore}<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a></p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
`;
  }
  return html;
}

function createSectionTechDemo(json) {

  var sectionSelector = '[data-anchor="' + json.id + '"]';
  var sectionElement = document.querySelector(sectionSelector);
  sectionElement.innerHTML = `<div id="${json.id}-wrap" class="container container-limited"></div>`;
  
  let TedemoHTML = `<div class="d-flex">
                     <h2 class="text-center text-unido-blue">${json.name}</h2>
                     <div class="btn-group btn-group-sm ms-auto" role="group">
                       <button class="btn btn-primary btn-unido-orange" type="button" data-bs-target="#carousel-${json.id}" data-bs-slide="prev"><i class="bi bi-caret-left-fill"></i></button>
                       <button class="btn btn-primary btn-unido-orange" type="button" data-bs-target="#carousel-${json.id}" data-bs-slide="next"><i class="bi bi-caret-right-fill"></i></button>
                     </div>
                   </div>
                   <p>${json.desc}</p>
                   <div id="carousel-${json.id}" class="carousel carousel-item-elex2 slide">
                     <div class="carousel-inner">` + createTedemoItems(json.children) + `</div>
                   </div>`;

  const teDemoObj = document.getElementById('tech-demo-wrap');
  teDemoObj.innerHTML = TedemoHTML;
}

//***************** Callback for creating institutional outputs from JSON data *****************//

function createSectionInsOutputs(json) {

  var sectionSelector = '[data-anchor="' + json.id + '"]';
  var sectionElement = document.querySelector(sectionSelector);
  sectionElement.innerHTML = `<div class="container container-limited py-3" id="${json.id}-wrap"></div>`;

  let elementsHTML = `<div class="mx-4 mx-md-0"><h2 class="text-white">${json.name}</h2><p class="text-white">${json.desc}</p></div><div class="row position-relative"><div class="col-12 col-md-6"><div class="accordion accordion-exclusive accordion-flush shadow-sm mx-4 mx-md-0" id="${json.id}-accordion">`;

  var childrenInfo = json.children;
  for (var i = 0; i < childrenInfo.length; i++) {
    let buttonState = i === 0 ? '' : ' collapsed';
    let contentState = i === 0 ? ' show' : '';
    elementsHTML += `<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button bg-unido-orange text-white${buttonState}" type="button" data-bs-toggle="collapse" data-bs-target="#group-${childrenInfo[i].id}" aria-expanded="false" aria-controls="group-${childrenInfo[i].id}">${childrenInfo[i].name}</button></h2><div id="group-${childrenInfo[i].id}" class="accordion-collapse collapse${contentState}" data-bs-parent="#${json.id}-accordion"><div class="accordion-body p-0"><ul class="list-group list-group-flush">`;
    for (const subItem of childrenInfo[i].children) {
      let itemLINK = '';
      if (subItem.link) {
        itemLINK = subItem.link;
        if (subItem.locLink) {
          itemLINK = assetsURL + subItem.link;
        }
      }
      elementsHTML += `<li class="list-group-item list-group-item-${subItem.type}"><a href="#" data-mo-toggle="alert" data-mo-target="#inst-outputs-expl" data-mo-desc="${subItem.desc}" data-mo-button="${subItem.button}" data-mo-link="${itemLINK}" class="text-dark text-truncate d-block link-underline link-underline-opacity-0" title="${subItem.name}"><i class="bi bi-file-text text-unido-blue me-2"></i>${subItem.name}</a></li>`;
    }
    elementsHTML += `</ul></div></div></div>`;
  }

  elementsHTML += `</div></div><div class="col-md-6" id="inst-outputs-expl"><div class="alert alert-warning alert-dismissible rounded-0 fade show shadow-lg" role="alert"><h4 class="alert-heading h4-responsive"><i class="bi bi-info-circle-fill me-1"></i>${translation.knowMore}</h4><p class="alert-content">${translation.clickItemsKnowMore}</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div></div>`;

  var targetObjID = json.id + '-wrap';
  const targetObj = document.getElementById(targetObjID);
  targetObj.innerHTML = elementsHTML;

  let alertToggles = document.querySelectorAll('[data-mo-toggle="alert"]');
  alertToggles.forEach(function(obj) {
    obj.addEventListener('click', showAlertContent, false);
  });

}

// display alert content
function showAlertContent() {
  let targetAlert = this.getAttribute('data-mo-target');
  let alertTitle = this.getAttribute('title');
  let alertDesc = this.getAttribute('data-mo-desc');
  let alertButton = this.getAttribute('data-mo-button');
  let alertLinkURL = this.getAttribute('data-mo-link');
  if (alertButton && alertLinkURL) {
    alertDesc += `<br><a class="alert-link" target="_blank" href="${alertLinkURL}">${alertButton}<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a>`;
  }
  let alertBox = document.querySelector(targetAlert);
  alertBox.innerHTML = `<div class="alert alert-warning alert-dismissible rounded-0 fade show shadow-lg" role="alert"><h4 class="alert-heading">${alertTitle}</h4><p class="alert-content mb-0">${alertDesc}</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div></div>`;
}

//***************** Callback for creating photo walls from JSON data *****************//

function markPhotoLightBox(obj) {
  return `<div class="col mt-2"><div class="card border-0 bg-transparent card-${obj.type}"><a href="#" class="photo-lightbox-toggle text-decoration-none" data-bs-toggle="modal" data-bs-target="#photo-lightbox" data-hdsrc="${assetsURL+obj.hdimg}" data-photodesc="${obj.desc}"><img src="${assetsURL+obj.thumb}" class="card-img-top rounded-0 shadow" alt="${obj.name}"><span class="photo-desc d-block p-0 small text-secondary text-truncate">${obj.desc}</span></a></div></div>`;
}

function createSectionCapakno(json) {
  let elementsHTML = ``;
  for (const item of json.children) {
    elementsHTML += `<div class="fp-hr-slider" id="cak-slide-${item.id}"><div class="container"><h2>${item.name}</h2><p class="mb-1">${item.desc}</p><div class="row row-cols-3 row-cols-md-4 g-4 mt-0">`;
    for (const obj of item.children) {
      elementsHTML += markPhotoLightBox(obj);
    }
    elementsHTML += `</div></div></div>`;
  }

  let selector = '[data-anchor="' + json.id + '"]';
  let cakWrap = document.querySelector(selector);
  cakWrap.innerHTML = elementsHTML;
}

const photoLightbox = document.getElementById('photo-lightbox');
if (photoLightbox) {
  let preloaderImg = document.createElement("img");
  photoLightbox.addEventListener('show.bs.modal', event => {

    document.body.classList.add('darker-backdrop');

    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const hdPhotoSRC = button.getAttribute('data-hdsrc');
    const photoDesc = button.getAttribute('data-photodesc');

    // Construct bootstrap spinner
    const progressBar = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';

    // Write HD photo url into <img> element
    const hdPhoto = '<img src="' + hdPhotoSRC + '" class="img-fluid shadow-lg">';

    // Find .modal-body to hold photo
    const photoHolder = photoLightbox.querySelector('.modal-body');
    //Find .modal-footer to hold photo description
    const descHolder = photoLightbox.querySelector('.modal-footer');

    // Put a spinner into photo holder and replace with photo and description when photo is loaded
    photoHolder.innerHTML = progressBar;
    descHolder.innerHTML = '';
    preloaderImg.src = hdPhotoSRC;
    preloaderImg.addEventListener('load', (event) => {
      photoHolder.innerHTML = hdPhoto;
      descHolder.innerHTML = photoDesc;
    });
  });
  photoLightbox.addEventListener('hide.bs.modal', event => {
    document.body.classList.remove('darker-backdrop');
    preloaderImg.src = '';
  });
}


//***************** Callback for creating charts from JSON data *****************//

function transposeArray(array) {
  const rows = array.length;
  const columns = array[0].length;
  const transposedArray = [];
  for (let j = 0; j < columns; j++) {
    transposedArray[j] = [];
    for (let i = 0; i < rows; i++) {
      transposedArray[j][i] = array[i][j];
    }
  }
  return transposedArray;
}

// animate numbers
const counterAnim = (qSelector) => {
  const target = document.querySelectorAll(qSelector);
  target.forEach(
    function(element) {
      let start = parseFloat(element.getAttribute('data-anc-start')) || 0,
        end = parseFloat(element.getAttribute('data-anc-end')),
        duration = parseFloat(element.getAttribute('data-anc-duration')) || 1000;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerText = Math.floor(progress * (end - start) + start).toLocaleString('en');
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  );
};

function markupChartSection(json) {
  var sectionSelector = '[data-anchor="' + json.id + '"]';
  var sectionElement = document.querySelector(sectionSelector);
  var sectionInnerHTML = ``;

  var items = json.children;
  for (const item of items) {
  	sectionInnerHTML += `<div class="fp-hr-slider" id="slide-${item.id}"><div class="container container-limited bg-white py-2" id="${item.id}-wrap">`;
  	if (item.charType == 'echarts' ) {
    	sectionInnerHTML += `<div class="asr-fixed"><div class="chart-container"></div></div>`;
    }
    sectionInnerHTML +=`</div></div>`;
  }
  sectionElement.innerHTML = sectionInnerHTML;
}

function createStackedBarChart(json) {
  var plants = json.data;
  var chartWrapID = `${json.id}-wrap`;
  var chartWrap = document.getElementById(chartWrapID);
  var chartContainer = chartWrap.querySelector('.chart-container');

  const catArray = Object.keys(plants[0].numbers);
  const seriesArray = []

  let headerHTML = `<h2>${json.name}</h2><div class="dropdown ms-auto chart-toggles"><button type="button" class="btn btn-link dropdown-toggle rounded-0" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"><i class="bi bi-list-check"></i></button><div class="dropdown-menu p-0 rounded-0 normalScroll" style="max-height: 50vh;overflow-y: auto;"><div class="list-group list-group-flush small"><label class="list-group-item list-group-item-action d-flex form-switch" for="checkbox-all-items-${json.id}">${translation.allItems}<input type="checkbox" class="form-check-input ms-auto" data-echarts-toggle="toggle-group-all" data-group-target="#${chartWrapID}" id="checkbox-all-items-${json.id}" checked></label>`

  //console.log(catArray);
  for (const plant of plants) {
    var seriesItem = {
      name: plant.plant,
      data: Object.values(plant.numbers),
      type: plant.type,
      stack: plant.stack,
      id: plant.id // Add an ID for series 1  
    }
    seriesArray.push(seriesItem);
  }

  //console.log(seriesArray);


  // Initialize ECharts instance
  var chart = echarts.init(chartContainer);

  // Define chart options
  var option = {
    /*title: {
      text: 'Sample Line Chart'
    },*/
    grid: {
      containLabel: true,
      top: '15%',
      bottom: '5%',
      left: '0',
      right: '0'
    },
    xAxis: {
      type: 'category',
      data: catArray
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      //trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: -9999
    },
    series: seriesArray
  };

  // Set chart options
  chart.setOption(option);

  // Handle window resize to make the chart responsive
  window.addEventListener('resize', function() {
    chart.resize();
  });

  for (const item of seriesArray) {
    headerHTML += `<label class="list-group-item list-group-item-action d-flex form-switch" for="checkbox-${item.id}">${item.name}<input type="checkbox" id="checkbox-${item.id}" class="form-check-input ms-auto" data-echarts-toggle="series" data-echarts-target="#${chartWrapID}" data-echarts-series="${item.name}" checked></label>`;
  }

  headerHTML += `</div></div></div>`;
  const chartHeader = document.createElement('div');
  const chartFooter = document.createElement('p');
  chartHeader.classList.add('d-flex');
  chartHeader.innerHTML = headerHTML;
  chartWrap.insertBefore(chartHeader, chartWrap.children[0]);

  chartFooter.classList.add('small', 'mb-0', 'text-secondary');
  chartFooter.innerHTML = json.desc;
  chartWrap.appendChild(chartFooter);
}

function createLineChart(json) {
  var plants = json.data;
  var chartWrapID = `${json.id}-wrap`;
  var chartWrap = document.getElementById(chartWrapID);
  var chartContainer = chartWrap.querySelector('.chart-container');

  const catArray = Object.keys(plants[0].numbers);
  const seriesArray = []

  let headerHTML = `<h2>${json.name}</h2><div class="dropdown ms-auto chart-toggles"><button type="button" class="btn btn-link dropdown-toggle rounded-0" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"><i class="bi bi-list-check"></i></button><div class="dropdown-menu p-0 rounded-0 normalScroll" style="max-height: 50vh;overflow-y: auto;"><div class="list-group list-group-flush small"><label class="list-group-item list-group-item-action d-flex form-switch" for="checkbox-all-items-${json.id}">${translation.allItems}<input type="checkbox" class="form-check-input ms-auto" data-echarts-toggle="toggle-group-all" data-group-target="#${chartWrapID}" id="checkbox-all-items-${json.id}" checked></label>`

  //console.log(catArray);
  for (const plant of plants) {
    var seriesItem = {
      name: plant.plant,
      data: Object.values(plant.numbers),
      type: plant.type,
      id: plant.id // Add an ID for series 1  
    }
    seriesArray.push(seriesItem);
  }

  //console.log(seriesArray);


  // Initialize ECharts instance
  var chart = echarts.init(chartContainer);

  // Define chart options
  var option = {
    /*title: {
      text: 'Sample Line Chart'
    },*/
    grid: {
      containLabel: true,
      top: '15%',
      bottom: '5%',
      left: '0',
      right: '0'
    },
    xAxis: {
      type: 'category',
      data: catArray
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      //trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: -9999
    },
    series: seriesArray
  };

  // Set chart options
  chart.setOption(option);

  // Handle window resize to make the chart responsive
  window.addEventListener('resize', function() {
    chart.resize();
  });

  for (const item of seriesArray) {
    headerHTML += `<label class="list-group-item list-group-item-action d-flex form-switch" for="checkbox-${item.id}">${item.name}<input type="checkbox" id="checkbox-${item.id}" class="form-check-input ms-auto" data-echarts-toggle="series" data-echarts-target="#${chartWrapID}" data-echarts-series="${item.name}" checked></label>`;
  }

  headerHTML += `</div></div></div>`;
  const chartHeader = document.createElement('div');
  const chartFooter = document.createElement('p');
  chartHeader.classList.add('d-flex');
  chartHeader.innerHTML = headerHTML;
  chartWrap.insertBefore(chartHeader, chartWrap.children[0]);

  chartFooter.classList.add('small', 'mb-0', 'text-secondary');
  chartFooter.innerHTML = json.desc;
  chartWrap.appendChild(chartFooter);
}

function updatePieChart(json, plantID) {
  var dataCates = json.cates;
  var dataPhases = json.phases;
  var tArray = ['phase'].concat(dataCates)
  var chartWrapID = `${json.id}-wrap`;
  var chartWrap = document.getElementById(chartWrapID);
  var chartContainer = chartWrap.querySelector('.chart-container');

  var datasetSource = [];
  datasetSource.push(tArray);

  var chosenPlant = json.data.find(function(item) {
    return item.id === plantID;
  });

  var recordsArray = chosenPlant.records;
  for (var i = 0; i < recordsArray.length; i++) {
    var datasetItem = recordsArray[i];
    var cArray = [dataPhases[i], ...recordsArray[i]];
    datasetSource.push(cArray);
  }

  var option = {
    legend: {
      bottom: '5%'
    },
    title: [{
        text: chosenPlant.plant,
        left: '50%',
        textAlign: 'center'
      }, {
        text: dataPhases[0],
        top: '10%',
        left: '25%',
        textAlign: 'center',
        textStyle: {
          color: '#999',
          fontSize: 14
        }
      },
      {
        text: dataPhases[1],
        top: '10%',
        left: '75%',
        textAlign: 'center',
        textStyle: {
          color: '#999',
          fontSize: 14
        }
      }
    ],
    tooltip: {},
    dataset: {
      source: transposeArray(datasetSource)
    },
    series: [{
        type: json.type,
        radius: ['25%', '50%'],
        center: ['25%', '50%'],
        name: dataPhases[0],
        encode: {
          itemName: 'phase',
          value: dataPhases[0]
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 4
        },
        label: {
          show: true,
        }
      },
      {
        type: json.type,
        radius: ['25%', '50%'],
        center: ['75%', '50%'],
        name: dataPhases[1],
        encode: {
          itemName: 'phase',
          value: dataPhases[1]
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 4
        },
        label: {
          show: true,
        }
      }
    ]
  };

  var chart = echarts.init(chartContainer);
  chart.setOption(option);
  window.addEventListener('resize', function() {
    chart.resize();
  });
}

function updateBarChart(json, plantID) {
  var dataCates = json.cates;
  var dataPhases = json.phases;
  var chartWrapID = `${json.id}-wrap`;
  var chartWrap = document.getElementById(chartWrapID);
  var chartContainer = chartWrap.querySelector('.chart-container');


  var chosenPlant = json.data.find(function(item) {
    return item.id === plantID;
  });

  var option = {
    title: {
      text: chosenPlant.plant,
      left: '50%',
      textAlign: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '10%'
    },
    grid: {
      containLabel: true,
      top: '20%',
      bottom: '5%',
      left: '0',
      right: '0'
    },
    yAxis: {
      type: 'value',
    },
    xAxis: {
      type: 'category',
      data: dataCates
    },
    series: [{
        name: dataPhases[0],
        color: '#f47a42',
        type: 'bar',
        data: chosenPlant.records[0]
      },
      {
        name: dataPhases[1],
        color: '#009cdc',
        type: 'bar',
        data: chosenPlant.records[1]
      }
    ]
  };

  var chart = echarts.init(chartContainer);
  chart.setOption(option);
  window.addEventListener('resize', function() {
    chart.resize();
  });
}

function createComparisonChart(json) {
  var plantsData = json.data;
  var chartWrapID = `${json.id}-wrap`;
  var chartWrap = document.getElementById(chartWrapID);
  var chartContainer = chartWrap.querySelector('.chart-container');


  let headerHTML = `<h2>${json.name}</h2><div class="dropdown ms-auto chart-toggles"><button type="button" class="btn btn-link dropdown-toggle rounded-0" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-list-check"></i></button><div class="dropdown-menu p-0 rounded-0 normalScroll" style="max-height: 50vh;overflow-y: auto;"><div class="list-group list-group-flush small">`;


  for (var i = 0; i < plantsData.length; i++) {
    var isChecked = i === 0 ? ' checked' : '';
    headerHTML += `<label class="list-group-item list-group-item-action d-flex" for="radio-${plantsData[i].id}">${plantsData[i].plant}<input type="radio" name="radio-group-${json.id}" id="radio-${plantsData[i].id}" class="form-check-input ms-auto" data-echarts-data-group-id="${json.id}" data-echarts-toggle="subchart" data-echarts-subchart="${plantsData[i].id}"${isChecked}></label>`;
    if (i === 0) {
      if (json.type == 'pie') {
        updatePieChart(json, plantsData[i].id);
      } else if (json.type == 'bar') {
        updateBarChart(json, plantsData[i].id);
      }
    }
  }

  headerHTML += `</div></div></div>`;
  const chartHeader = document.createElement('div');
  const chartFooter = document.createElement('p');
  chartHeader.classList.add('d-flex');
  chartHeader.innerHTML = headerHTML;
  chartWrap.insertBefore(chartHeader, chartWrap.children[0]);
  chartFooter.classList.add('small', 'mb-0', 'text-secondary');
  chartFooter.innerHTML = json.desc;
  chartWrap.appendChild(chartFooter);
}

function createAnimatedNumbers(json) {

  var chartWrapID = `${json.id}-wrap`;
  var chartWrap = document.getElementById(chartWrapID);
  var aniNumbersHTML = `<div class="row"><h2>${json.name}</h2><p class="small text-secondary">${json.desc}</p>`;

  for (const obj of json.data) {
    var ancEnd = obj.number,
      ancStart = Math.floor(obj.number * 0.5),
      ancDur = String(obj.number).length * 400;
    aniNumbersHTML += `<div class="col-md-6 d-flex py-2"><div id="${obj.id}" data-anc-start="${ancStart}" data-anc-end="${ancEnd}" data-anc-duration="${ancDur}" class="anc-counter text-unido-blue display-4 text-end" style="min-width:10rem;"></div><div class="ms-1 text-start align-self-end small">${obj.name}</div></div>`;
  }
  aniNumbersHTML += `</div>`;
  chartWrap.innerHTML = aniNumbersHTML;


  // Create an Intersection Observer instance with a callback function
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Call counterAnim() when the element is visible
        counterAnim('.anc-counter');
        // Stop observing once the element is visible
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(chartWrap);

}

function toggleSeries() {
  var checked = this.checked;
  var targetChartID = this.getAttribute('data-echarts-target');
  var seriesName = this.getAttribute('data-echarts-series');
  var targetChart = echarts.init(document.querySelector(targetChartID + ' .chart-container'));
  targetChart.dispatchAction({
    type: checked ? 'legendSelect' : 'legendUnSelect',
    name: seriesName
  });
}

function toggleSameGroup() {
  const isChecked = this.checked;
  const targetChartID = this.getAttribute('data-group-target');
  var targetChart = echarts.init(document.querySelector(targetChartID + ' .chart-container'));
  var groupAttribute = '[data-echarts-target="' + this.getAttribute('data-group-target') + '"]';
  var toggleGroup = document.querySelectorAll(groupAttribute);
  toggleGroup.forEach(function(checkbox) {
    checkbox.checked = isChecked;
    var seriesName = checkbox.getAttribute('data-echarts-series');
    targetChart.dispatchAction({
      type: isChecked ? 'legendSelect' : 'legendUnSelect',
      name: seriesName
    });
  });
}

//***************** Callback for creating knowledge hub from JSON data *****************//

function generateListTerm(item) {
  return `<li class="list-group-item" id="kh-${item.id}"><a href="#" data-term-expl="${item.desc}" data-bs-toggle="modal" data-bs-target="#kh-term-exp" class="${item.type} text-decoration-none text-dark" title="${item.name}">${item.name}</a></li>`;
}

function generateListItem(item) {
  if (item.link) {
    let itemLINK = item.locLink ? assetsURL + item.link : item.link;
    return `<li class="list-group-item" id="kh-${item.id}"><a target="_blank" href="${itemLINK}" class="${item.type} text-decoration-none text-dark" title="${item.name}">${item.name}</a></li>`;
  } else {
    return `<li class="list-group-item" id="kh-${item.id}"><span class="${item.type} text-decoration-none text-secondary" title="${item.name}">${item.name}</span></li>`;
  }
}

function generateFolderTree(folder) {
  const ariaOpen = folder.expanded ? 'aria-expanded="true" ' : '';
  const showCollapse = folder.expanded ? 'show ' : '';

  let folderHTML = `<li class="list-group-item" id="kh-${folder.id}"><a href="#" data-bs-target="#group-${folder.id}" data-bs-toggle="collapse" class="kh-folder text-decoration-none text-dark" ${ariaOpen} title="${folder.name}">${folder.name}</a><ul class="list-group list-group-flush collapse ${showCollapse}mb-n1 ms-1" id="group-${folder.id}">`;

  for (const child of folder.children) {
    if (child.type === "kh-item") {
      folderHTML += generateListItem(child);
    } else if (child.type === "kh-term") {
      folderHTML += generateListTerm(child);
    } else if (child.type === "kh-folder") {
      folderHTML += generateFolderTree(child);
    }
  }

  folderHTML += '</ul></li>';
  return folderHTML;
}

function createSectionKnohub(json) {

  var sectionSelector = '[data-anchor="' + json.id + '"]';
  var sectionElement = document.querySelector(sectionSelector);
  sectionElement.innerHTML = `<div class="container container-limited"><div class="kh-wrap" id="${json.id}-wrap"></div></div>`;

  let treeHTML = `<h2 class="text-unido-blue">${json.name}</h2><div class="bs-tree normalScroll mb-3"><ul id="knwoledge-tree" class="list-group list-group-flush small">`;

  for (const obj of json.children) {
    if (obj.type === "kh-folder" && obj.children) {
      treeHTML += generateFolderTree(obj);
    } else if (obj.type === 'kh-item') {
      treeHTML += generateListItem(obj);
    } else if (obj.type === 'kh-term') {
      treeHTML += generateListTerm(obj);
    }
  }

  treeHTML += `</ul></div><p class="text-very-small text-secondary">${json.desc}</p>`;

  const wrapID = json.id + '-wrap';
  const treeObj = document.getElementById(wrapID);
  treeObj.innerHTML = treeHTML;
}

const termExplanationBox = document.getElementById('kh-term-exp');
if (termExplanationBox) {
  termExplanationBox.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const termTitle = button.getAttribute('title');
    let termExpl = button.getAttribute('data-term-expl');
    const termExplHolder = termExplanationBox.querySelector('.modal-body');
    const termTitleHolder = termExplanationBox.querySelector('.modal-title');
    const linkKnowMore = button.getAttribute('data-know-more-link');
    if (linkKnowMore) {
      termExpl += `<br><a class="mt-2 rounded-0 btn btn-success" href="${linkKnowMore}">${translation.knowMore}<i class="bi bi-arrow-up-right-square-fill ms-1"></i></a>`
    }
    termExplHolder.innerHTML = termExpl;
    termTitleHolder.innerHTML = termTitle;
  })
}

//***************** Callback for creating partner list from JSON data *****************//

function createSectionPartners(json) {

  var sectionSelector = '[data-anchor="' + json.id + '"]';
  var sectionElement = document.querySelector(sectionSelector);
  sectionElement.innerHTML = `<div id="${json.id}-wrap" class="container container-limited"></div>`;

  let partnersHTML = '';
  let projPartnerLogos = json.children;
  partnersHTML += `<h2 class="text-white text-center">${json.name}</h2><div class="row">`;
  for (const obj of projPartnerLogos) {
    partnersHTML += `<div id="logo-${obj.id}" class="col-4 col-md-3 ${obj.type} text-center px-1 mb-2 ${obj.type}" title="${obj.name}"><div class="bg-white"><img src="${assetsURL+obj.img}" class="img-fluid ${obj.type}" alt="${obj.name}"></div></div>`;
  }
  partnersHTML += `</div><p class="text-white text-center small">${json.desc}</p>`;

  var targetBoxID = json.id + '-wrap';
  const targetBox = document.getElementById(targetBoxID);
  targetBox.innerHTML = partnersHTML;

}

//***************** Callback for creating follow us from JSON data *****************//
function createSectionFollow(json) {

  var sectionSelector = '[data-anchor="' + json.id + '"]';
  var sectionElement = document.querySelector(sectionSelector);
  sectionElement.innerHTML = `<div class="container container-limited" id="${json.id}-wrap"></div>`;
  
  let followUsHTML = `<h2 class="text-center text-white mb-3">${json.name}</h2><div class="row">`;

  for (const obj of json.children) {
    const qrCaption = obj.link ? `<a class="text-white text-decoration-none" href="${obj.link}" target="_blank">${obj.name}</a>` : `<span class="text-white">${obj.name}</span>`;

    followUsHTML += `<div class="col-4"><p class="text-center mb-1"><img src="${assetsURL+obj.img}" class="img-fluid img-${obj.type}"></p><p class="text-center text-very-small text-white">${qrCaption}</p></div>`;
  }
  followUsHTML += `</div><p class="text-very-small text-secondary px-4 mt-5 mb-0">${json.desc}</p>`;
  
  var selectorID = json.id+'-wrap';
  const followUsWrap = document.getElementById(selectorID);
  followUsWrap.innerHTML = followUsHTML;
}


// Use the fetch() method to make an HTTP GET request to the URL
fetch(jsonURL)
  .then(response => {
  // Check if the response status is OK (status code 200)
  if (response.ok) {
    // Parse the JSON data from the response
    return response.json();
  } else {
    // Handle the error if the response status is not OK
    throw new Error('Failed to fetch data');
  }
})
  .then(data => {
  // Use the JSON data in your code
  let contentJson = data;
  //console.log(contentJson);
  
  var storedArray = createArrarySearch(contentJson[0]);
  sessionStorage.setItem("searchDataCache", JSON.stringify(storedArray));
  var searchArray = JSON.parse(sessionStorage.getItem("searchDataCache"));
  
  createNavMenu(searchArray, 'fp-menu');

  let homeData = contentJson[0].home;
  createSectionHome(homeData);

  let projOverview = contentJson[0].projOverview;
  createSectionProjOverview(projOverview);

  let demoPlants = contentJson[0].demoPlants;
  createSectionDemoPlants(demoPlants);

  let TedemoEle = contentJson[0].techDemo;
  createSectionTechDemo(TedemoEle);

  let insOutputs = contentJson[0].instlOutputs;
  createSectionInsOutputs(insOutputs);

  let cakGroups = contentJson[0].CapAndKno;
  createSectionCapakno(cakGroups);

  let projectStats = contentJson[0].projectStats;
  markupChartSection(projectStats);
  createLineChart(projectStats.children[0]);
  createStackedBarChart(projectStats.children[1]);
  createComparisonChart(projectStats.children[2]);
  createComparisonChart(projectStats.children[3]);
  createAnimatedNumbers(projectStats.children[4]);

  let knoHUB = contentJson[0].knowledgeHub;
  createSectionKnohub(knoHUB);

  let projPartners = contentJson[0].projPartners;
  createSectionPartners(projPartners);

  let followElements = contentJson[0].projContact;
  createSectionFollow(followElements);

  let seriesToggles = document.querySelectorAll('[data-echarts-toggle="series"]');
  for (const obj of seriesToggles) {
    obj.addEventListener('change', toggleSeries, false);
  }

  let groupToggles = document.querySelectorAll('[data-echarts-toggle="toggle-group-all"]');
  for (const obj of groupToggles) {
    obj.addEventListener('change', toggleSameGroup, false);
  }

  let subchartToggles = document.querySelectorAll('[data-echarts-toggle="subchart"]');
  subchartToggles.forEach(input => {
    input.addEventListener('change', function() {
      if (this.checked) {
        const dataGroupID = this.getAttribute('data-echarts-data-group-id');
        const targetWrap = document.getElementById(dataGroupID + '-wrap');
        const subchartValue = this.getAttribute('data-echarts-subchart');
        var dataGroup = projectStats.children.find(function(item) {
          return item.id === dataGroupID;
        });
        if (dataGroup.type == 'pie') {
          updatePieChart(dataGroup, subchartValue);
        } else if (dataGroup.type == 'bar') {
          updateBarChart(dataGroup, subchartValue);
        }
      }
    });
  });

  // initialise Video.js
  var vjsElements = document.querySelectorAll('video.video-js');
  for (const ele of vjsElements) {
    const player = videojs(ele);
  }

  //create fullPage slides
  var myFullpage = new fullpage('#fullpage', {
    menu: '#fp-menu',
    verticalCentered: true,
    animateAnchor: true,
    navigation: true,
    navigationPosition: 'left',
    slideSelector: '.fp-hr-slider', // avoid conflict with BS5 carousel
    normalScrollElements: '.normalScroll',
    loopHorizontal: false,
    //sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#7BAA32'],
    //continuousVertical: true,
    licenseKey: 'gplv3-license'
  });
	

  var searchBox = document.getElementById('main-search-input');
  searchBox.addEventListener("input", function() {
    type2Search(searchArray, searchBox);
  });

  //remove loading spin
  const loadingSpin = document.getElementById("loading-status");
  loadingSpin.remove();

})
  .catch(error => {
  // Handle any errors that occurred during the fetch
  console.error('Error:', error);
});

console.log('Everything completed!');
