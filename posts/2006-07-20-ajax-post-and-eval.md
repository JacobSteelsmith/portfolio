---
title: "Ajax: Post And Eval()"
date: 2006-07-20
---

As I demonstrated, the XMLHttpRequest object can be used to query a page using the get method. The object can also query a page using the post method. It is a bit more difficult as one must create the request header. Here is an example:

```

function stateChanged(){
	if(xmlHttp.readyState == 4 || xmlHttp.readyState == 'complete'){
		
	}	
}

function savePosition(id, posX, posY){
	//get the object
        xmlHttp = initSimpleAjax();
        
        //if the browser supports it
	if(xmlHttp != null){
                //give the object the handler
                xmlHttp.onreadystatechange = stateChanged;
                
                //build the post string
		var postString = 'ElementID=' + encodeURI(id) + '&PosX=' + encodeURI(posX) + '&PosY=' + encodeURI(posY);
		
                //build the url
		var url = 'DivConceptCF.cfm';
		
                //start the request
		xmlHttp.open('post', url, true);
                
                //build the request header
		xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                
                //set the length of the content (the vars and values)
		xmlHttp.setRequestHeader('Content-length', postString.length);
		
                //signal end of header
                xmlHttp.setRequestHeader('Connection', 'close');
		
                //sent the post string
                xmlHttp.send(postString);
	}
}
```

The first thing you'll notice is the handler doesn't do anything. This is ok. The second thing you'll notice is the post string. You build it in a similar fashion to the get string in the url, except without the leading question mark.

One of the most powerful features of using this object comes when you use the eval() function in JavaScript. This function takes a string and evaluates it as JavaScript statements. So in the page you query, you can simply write JavaScript code as output, setting variables or calling functions. For example, I called a ColdFusion page that sets the following variables pulled from a database, or determined by the logic in the page:

```

WriteOutput("isOverlapping = true; swapWith = '" & nvchElementName & "'; swapWithX=" & intPosX & "; swapWithY=" & intPosY & ";");
```

Then, in your request handler, you do the following:

```

function stateChangeEval(){
	if(xmlHttp.readyState == 4 || xmlHttp.readyState == 'complete'){
		eval(xmlHttp.responseText);
		
                //do more processing
	}	
}
```

Any JavaScript code output by the ColdFusion page will be available to the rest of the script, or to the entire instance of the page if the variables are global.