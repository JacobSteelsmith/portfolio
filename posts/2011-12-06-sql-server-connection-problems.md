---
title: "SQL Server connection problems"
date: 2011-12-06
---

I ran into a problem whereby my SQL Server jobs wouldn't run. I received this warning in the log:

The program sqlservr.exe, with the assigned process ID 4724, could not authenticate locally by using the target name MSSQLSvc/dev2.[DOMAIN]:[PORT]. The target name used is not valid. A target name should refer to one of the local computer names, for example, the DNS host name. Try a different target name.

I also saw this message:

The login is from an untrusted domain and cannot be used with Windows authentication.

I had moved this machine from a physical to a virtual. I found the final solution here:

http://support.microsoft.com/kb/926642 (method 1 using the FQDN in the error message).

after reading this great post:

http://36chambers.wordpress.com/2010/04/08/how-to-set-up-aliases-for-named-instances-in-sql-server