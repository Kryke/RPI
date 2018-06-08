window.last_query_text = ''; 
window.last_nexnPageToken = ''; 
window.loading = false; 

//получение объекта XMLHttpRequest
function getXhrObject(){
  if(typeof XMLHttpRequest === 'undefined'){
    XMLHttpRequest = function() {
      try { return new window.ActiveXObject( "Microsoft.XMLHTTP" ); }
        catch(e) {}
    };
  }
  return new XMLHttpRequest();
}

function getQueryString(params){
    var str = '';
    for (k in params){
        str += k+'='+params[k]+'&';
    }
    return str;
}

function getTemplateItem(result){
    return ''+
    '<div class="res-thumbnail">'+
        '<a href="https://www.youtube.com/watch?v='+result.id.videoId+'">'+
            '<img src="'+result.snippet.thumbnails.medium.url+'" class=res-thumbnail" alt="Result thumbnail">'+
        '</a>'+
    '</div>'+
    '<div class="res-data">'+
        '<div class="title">'+result.snippet.title+'</div><br>'+
        '<div class="channel"><a href="https://www.youtube.com/channel/'+result.snippet.channelId+'?autoplay=1">'+result.snippet.channelTitle+'</a></div>'+
        '<div>Опубликовано: '+result.snippet.publishedAt.substring(0,10)+'</div><br>'+
        '<div class="curs">'+result.snippet.description+'</div><br> '+
    '</div>';
}

function addResult(result){
    var cont = document.getElementById('contentBlock');
    
    if(result.nextPageToken) { 
        window.last_nexnPageToken = result.nextPageToken;
    }
    for (k in result.items){ 
        var newItem = document.createElement('div'); 
        newItem.className = 'output'; 
        newItem.innerHTML = getTemplateItem(result.items[k]); 
        cont.appendChild(newItem); 
    }
    window.loading = false; 
}

function getResult(input){
    
    if(input) { 
        window.last_query_text = input; 
        document.getElementById('contentBlock').innerHTML = ''; 
        window.last_nexnPageToken = '';
    }else{
        input = window.last_query_text; 
    }
    if(!input){ 
        document.getElementById('contentBlock').innerHTML = '';
        return false;
    }
    
    var queryParams = {
        part: 'id,snippet',
        videoDuration: 'any',
        key: 'AIzaSyB6P9yfPl2vg0_A77QYI8e9Cds7dM1sFDI',
        q: window.last_query_text+' in:video',
        maxResults: 20,
    };
    
    if(window.last_nexnPageToken){ 
        queryParams.pageToken = window.last_nexnPageToken;
    }
    window.loading = true; 
    var xhr = getXhrObject();
    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/search?'+getQueryString(queryParams), true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200){
        var result = JSON.parse(xhr.responseText);
        addResult(result); 
      }
    }
    xhr.send(null);

}

document.addEventListener("DOMContentLoaded", function(event) {

    var mousepos, to;
    var clicked = false; 
    
    
    var contentBlock = document.getElementById('contentBlock');
    var ratio = 3; 
    
    contentBlock.addEventListener("mousedown", onDragStart, false);
    contentBlock.addEventListener("mousemove", onDrag, false);
    document.addEventListener("mouseup", onDragEnd, false);
    contentBlock.addEventListener("mouseup", onDragEnd, false);
    
    //нажатие мыши
    function onDragStart(e) {
        mousepos = e.screenX; 
        clicked = true;  
        return;
    }
    //перемещение мыши
    function onDrag(e) {
        if(!clicked) return; 
        
        clearTimeout(to); 
        var delta = (e.screenX - mousepos) * ratio; 
        to = setTimeout(function () { 
            contentBlock.scrollLeft = contentBlock.offsetLeft + contentBlock.scrollLeft - delta; 
            mousepos = e.screenX; 
            
            if(!window.loading && (contentBlock.scrollWidth - contentBlock.offsetWidth - contentBlock.scrollLeft)<200) getResult();
            
        }, 10);
        
    }
    function onDragEnd(e){
        clicked = false; 
        setTimeout(function () { 
            contentBlock.scrollLeft = Math.floor(contentBlock.scrollLeft/338) * 338; 
        },20);
        return;
    }

},false);
