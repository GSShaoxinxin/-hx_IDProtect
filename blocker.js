pattern = "*://*\/*";
var hxID;
pattern_arr_one_ele =[];//创建一个空数组


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.hxID){
	
	chrome.storage.sync.set({'blocked_hxID': request.hxID}, 
	function() {
		hxID = request.hxID;
		console.log('set hxID to storage'+request.hxID);
		}
	);

// code...
	console.log("message hxID",request.hxID);
 sendResponse('我已收到你的消息');//做出回应
 }else{
	 console.log("no message hxID");
 }
});





function blockRequest(details) {

	//console.log("append: ");
   // console.log(details.url); 
  
  	if(!details.url.includes('hxID',0)){
	  if(details.url.includes('?',0)){
		 // console.log('before concat that hxID ',hxID);
		  details.url = details.url.concat("&hxID=",hxID);
		 // console.log("&details.url",details.url);	
		  	
		  
	  }else{
		//  console.log('before concat that hxID ',hxID);
		  details.url = details.url.concat("?hxID=",hxID);
		 // console.log("?details.url",tmp_hxID);	
		  
	  }
	  
  }
  console.log('haha,no block details.url',details.url);
  return {
		redirectUrl: details.url
	};
 }

  


function isValidPattern(urlPattern) {
  var validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
  return !!urlPattern.match(validPattern);
}

function updateFilters(urls) {
	
	
  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
	  console.log("remove blockRequest");
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }

  
  if(isValidPattern(pattern)){
	  pattern_arr_one_ele.pop();
		pattern_arr_one_ele.push(pattern);
		 console.log("pattern_arr_one_ele[0]",pattern_arr_one_ele[0]);
  }else{
	  console.log("updateFilters error");
  }
  

  if (pattern.length) {
	  console.log("pattern.length",pattern.length);
	if(hxID){
		console.log('hxID is not null',hxID);
		chrome.storage.sync.get('blocked_hxID',
							function(data){
								myhxID = data;
								console.log("myhxID",myhxID);
								try{
									 chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
										urls: pattern_arr_one_ele
									  }, ['blocking']);
									} catch (e) {
									  console.error(e);
									}
			});
	}else{
		console.log('hxID is null',hxID);
		hxID ='12345678901234567890123456789012';
		console.log('create a hxID',hxID);
		try{
		 chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
			urls: pattern_arr_one_ele
		  }, ['blocking']);
		} catch (e) {
		  console.error(e);
		}
		
	}
							
	}
}
function updateFilters_for_save(urls) {
  if (chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }
  
if(isValidPattern(pattern)){
	 pattern_arr_one_ele.pop();
	pattern_arr_one_ele.push(pattern);
	 console.log("pattern_arr_one_ele[0]",pattern_arr_one_ele[0]);
  }else{
	  console.log("updateFilters_for_save error");
  }
  

  if (pattern) {
    try{
      chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
        urls: pattern_arr_one_ele
      }, ['blocking']);
    } catch (e) {
      console.error(e);
    }
  }
}

function load(callback) {
  chrome.storage.sync.get('blocked_pattern', function(data) {
    callback(data['blocked_pattern'] || []);
  });
}

function save(newpattern, callback) {
  pattern = newpattern;
  chrome.storage.sync.set({
    'blocked_pattern': newpattern,
	'flag':0
  }, function() {
	  console.log("set blocked_pattern,flag");
    updateFilters_for_save();
    callback.call();
  });
}

load(function(p) {
  pattern = p;
  updateFilters();
});



