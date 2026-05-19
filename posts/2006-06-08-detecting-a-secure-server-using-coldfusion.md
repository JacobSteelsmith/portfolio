---
title: "Detecting A Secure Server Using ColdFusion"
date: 2006-06-08
---

I needed a quick tag to detect if the page the tag resided in was called using a secure URL. Unfortunately, the CGI function was not easily found, so here it is.

<cfif CGI.HTTPS EQ "off">

<cfset NewLink = "https://" & #CGI.HTTP\_HOST# & #CGI.PATH\_INFO#>

<cfif #CGI.QUERY\_STRING# NEQ "">

<cfset NewLink = NewLink & "?" & #CGI.QUERY\_STRING#>

</cfif>

</cfif>

CGI.HTTPS returns "off" if the URL is not of a secure server. Once that is checked, you build the new URL using the next few lines. From there, you can output the new link, or redirect to the new URL.