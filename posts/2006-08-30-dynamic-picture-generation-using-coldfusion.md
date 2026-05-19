---
title: "Dynamic Picture Generation Using ColdFusion"
date: 2006-08-30
---

I had an unusual problem to solve today. One of my applications generates signed documents using Microsoft Word. The user clicks a button and is prompted to open or save the word document. The signatures are important ones, and stored outside the webroot.
I solved this by referencing a coldfusion file in the src attribute of the image tag in the html that outputs the document. The file is called dynpic.cfm. So the image tag looks like this:

```

<img src="https://someserver.someschool.edu/production/someapp/dynpic.cfm?pic=chair" />
```

There is a choice of two signatures, hence the pic variable in the URL.
The page dynpic.cfm starts out by authenticating the user using <cfldap>. That code is contained in another template I wrote named i\_SigAuth.cfm. This template sets a variable named auth which is used in the processing, indicating the authentication status of the user.
We need the setting enablecfoutputonly on, and we need to tell the browser, this is a jpeg (or the application in this case as it's MS Word generating the output).
The page then uses <cffile> to read the picture file and then outputs it to the page.

```

<cfset picFile = '[path to default picture]'>

<cfinclude template="i_SigAuth.cfm">

<cfsetting enablecfoutputonly="yes">
	
	<cfcontent type="image/jpeg">
	
	<cfif auth EQ 1>
                <cfif ISDEFINED('URL.pic')>
		        <cfif URL.pic EQ 'chair'>
			        <cfset picFile = '[path to picture]'>
		        <cfelseif URL.pic EQ 'pres'>
		  	        <cfset picFile = '[path to picture]'>
		        </cfif>
	        </cfif>
	</cfif>
	
	<cffile action="read" variable="picOut" file="#picFile#">	
	
	<cfoutput>#picOut#</cfoutput>
 
<cfsetting enablecfoutputonly="no">
```

When someone opens the Word document, the signatures will only appear if the user is authenticated and in the proper group.