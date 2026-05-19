---
title: "Ajax: The Basics And Get"
date: 2006-07-19
---

I've been working with some aspects of the Ajax group of technologies lately. It sounds complicated and difficult to learn, but it really isn't. It uses the XMLHttpRequest object supported by many browsers. My current development requires I code for IE and Firefox, although it seems to be functional in Netscape.
To use the XMLHttpRequest object, I put together two simple functions and put them in a file named SimpleAjax.js. Here are the functions:

```


function getXmlHttpObject(){
     var objXMLHttp = null;
     
     if(window.XMLHttpRequest)
          objXMLHttp = new XMLHttpRequest(); 

     else if(window.ActiveXObject){
          try{
               objXMLHttp = new ActiveXObject('Microsoft.XMLHTTP');
          }
          catch(e){
               try{
                    objXMLHttp = new ActiveXObject('Msxml2.XMLHTTP');
               }
               catch(e) {}
          }
     }

     return objXMLHttp;
}

function initSimpleAjax(){
     xmlHttp = getXmlHttpObject();

     if(xmlHttp == null){
          alert('Your browser does not support HTTP request.');
     }

     return xmlHttp;
}

```

The function getXmlHttpObject() tries to instantiate the XMLHttpRequest object for several different browsers. The function initSimpleAjax simply calls getXmlHttp object and alerts the user if the browser does not implement this functionality.
The XMLHttpRequest object makes requests to a server in the background using JavaScript, versus the browser making requests to the server while the user waits. These requests can be made asynchronously. That is, the script will continue processing after the request is made rather than waiting for a response. It seems as if this could be dangerous, but I haven't found it to be troublesome as of yet.
Every request needs a handler. This is a function that handles the changes in state of the request object. Here is an example of one:

```

function stateChanged(){
	if(xmlHttp.readyState == 4 || xmlHttp.readyState == 'complete'){
		document.getElementById('spanOut').innerHTML = xmlHttp.responseText;
	}	
}
```

This function checks the object's ready state. If the readyState is equal to 4, or complete, the function will populate the space between the <span id="spanOut"> and </span> tags on the page with the response from the page queried. The response from the page queried is simply the html it produces.
The different readyState codes are as follows:

* 0 = uninitialized
* 1 = loading
* 2 = loaded
* 3 = interactive
* 4 = complete

The object can query a server using either the **post** or the **get** method. Here is an example of a function that queries a page on a server (ColdFusion in this case) using the get method along with the handler that handles the call, which sets the text box that holds the journal entry name to the output produced by the ColdFusion page.

```

function stateChangedLoadName(){
	if(xmlHttp.readyState == 4 || xmlHttp.readyState == 'complete'){
		document.getElementById('txtEntryName').value = xmlHttp.responseText;
	}	
}

function loadEntryName(id){
        //initialize the request object
	xmlHttp = initSimpleAjax();
	
        //if we have a valid object
	if(xmlHttp != null){
                //give the object the function for handling state changes
		xmlHttp.onreadystatechange = stateChangedLoadName;	

                //build the url to send the request to
		var url = 'journal.cfm?GetName=1&ID=' + id;
		
                //send the request to the server
		xmlHttp.open('GET', url, false);
                //have to do this, send nothing on get
		xmlHttp.send(null);
	}
}
```

The page called on the server outputs the entry name for the requested id, and the javascript fills in the value of the text box, all without the browser doing anything and much faster than it could. I will show how to post using the XMLHttpRequest object and list some properties and methods of that object in a future entry.