---
title: "Detecting Javascript In Coldfusion And Other Languages"
date: 2006-10-25
---

I had been struggling for a while trying to find a way to detect JavaScript capability in my applications, then adjusting the application accordingly. My employer requires accessibility to all websites and web applications with JavaScript disabled. This can be done using the **noscript** tags with a meta refresh, but this is very, very bad form.
Using ColdFusion, I was able to solve this problem. I believe this can be done in any language which allows the setting and manipulation of cookies. Here is the code:

```

<cfset jscript = 0>

<!---write a cookie using javascript--->
<script type="text/javascript">
	document.cookie = 'JSTEST=1; path=/; ';
</script>

<!---check for the cookie, set the flag for the app, then toggle the variable in the cookie--->
<cfif ISDEFINED('COOKIE.jstest')>
	<cfif COOKIE.jstest EQ 1>
		<cfset jscript = 1>
		<cfcookie name="jstest" value="0">
	</cfif>
</cfif>
```

The first line sets a variable for use within the application. Next, we create a cookie using JavaScript, setting the value to one. If the browser is not JavaScript enabled, the cookie will not be created. Then, using ColdFusion, we check for the presence of the cookie. If it is there, and the value of the cookie is one, we set the variable used in the application to one, indicating a JavaScript enabled browser. The snippet then sets the value of the cookie to zero, for the next check.
I set the cookie's value back to zero because I am checking for JavaScript on every page load. This is done because a user, who has JavaScript enabled, may send a link to someone else who does not have JavaScript enabled. Also, I wanted to catch a user who disables JavaScript while inside my application.
There is one problem with this. It takes two refreshes if someone disables or enables JavaScript while in the application. The variable will be set on the second refresh. I believe this is due to the JavaScript being processed after the page loads. This is a small issue considering most users will not disable or enable JavaScript while using the application.
The variable that is set, in this case **jscript** can be used to make adjustments to application functionality in the case of no JavaScript.