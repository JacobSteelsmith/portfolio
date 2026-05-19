---
title: "SQL Server and OLE DB"
date: 2009-07-14
---

I just ran into a less-than-documented issue with OLE DB and SQL Server 2008 64 bit Enterprise. The particular error message was:

OLE DB provider 'HP3KProvider' for linked server 'HP3000' returned data that does not match expected data length for column '[HP3KProvider].sid'. The (maximum) expected data length is 28, while the returned data length

is 18.

So what if the data is smaller than what was expected? Well, SQL Server cares and errors out. To get it to stop doing this, a trace flag is needed.

Before you do this, try to research what other effects, if any this will have, although I could not find much on this flag. I will be running this in production and will update this post if I find anything.

To get this to stop, apply the trace flag 8765. You can do this either by using the command:

DBCC TRACEON(8765)

before the query, or use a startup flag (the method I used) for the service. This is added using SQL Configuration manager for each instance in the form:

T8765

and, as you'll see, the parameters are semi-colon delimited. 