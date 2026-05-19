---
title: "SQL Server using Linux: SQuirrel SQL Client"
date: 2009-03-11
---

A big part of my job is using SQL server and having the necessary tools to interface with SQL server is a must. One of the only tools I have found for using SQL server on the Linux platform is [SQuirrel SQL Client](http://squirrel-sql.sourceforge.net/).
I am very impressed with the 3.0 release, and plugins such as sqlscript, sqlreplace, smarttools, and codecompletion make life much, much easier. And of course, the tool is open source. The only downfall I have found, which still has me using Enterprise Manager, is managing the SQL jobs and, sometimes, logins and users, although I find it easier to script user actions.
The 3.0 release is much better than the release I was using, 2.6 and I am very impressed with the performance, and easy installation, even though it's a Java client. Make sure you're using the [SQL Server 2005 JDBC driver](http://msdn.microsoft.com/en-us/data/aa937724.aspx) as it's JDBC 3.0 compliant and performs much better. Just a slight alteration in the connection string, and class, were necessary to switch.
A big thanks to the SQuirrel SQL developers!