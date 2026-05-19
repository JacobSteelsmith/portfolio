---
title: "Some IP Parsing Fun Using ColdFusion"
date: 2006-04-19
---

I know some of you have been dying for code (yeah, right) so here's a small function I made for parsing an IP address. I needed the last byte to determine if the machine calling the page was a developer's machine or not.

<cfoutput>

<cfset BegPos = 1>

<cfset EndPos = 1>

<cfset ip = #CGI.REMOTE\_ADDR#>

<cfset ByteArray = ArrayNew(1)>

<cfloop index="i" from="1" to="4">

<cfset EndPos = #FIND(".", ip, BegPos)#>

<cfif EndPos GT 0>

<cfset ByteArray[i] =

#MID(ip, BegPos, EndPos - BegPos)#>

<cfset BegPos = #EndPos# + 1>

<cfelse>

<cfset BegPos = BegPos - 1>

<cfset ByteArray[i] =

#MID(ip, BegPos + 1, LEN(ip) - BegPos)#>

</cfif>

</cfloop>

</cfoutput>

By the way, this is exactly why I post in this blog, then link to it from other sites...I would never get away with this on blogs such as MySpace. The software would strip out the coldfusion tags. Plus, for developers and web-designers, blogs such as these give so much more control. Of course, most developers wouldn't be caught dead on MySpace! LOL!