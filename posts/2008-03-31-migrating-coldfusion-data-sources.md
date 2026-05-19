---
title: "Migrating coldfusion: data sources"
date: 2008-03-31
---

I didn't find a whole lot on the web about this, aside from http://www.petefreitag.com/item/68.cfm. When migrating ColdFusion MX 7, it is good to know that the settings, including data sources, are stored in \*cf\_root\*\lib in neo-\*x\*.xml files.

For example, all of the data sources can be found in neo-query.xml. If you're migrating a server to the same version of ColdFusion, I don't see why this wouldn't work. You should be able to save the old file(s) on the new installation and drop the new file in there. I would shut the service off and start again when finished.

I'll post back with anything special that needs to be done. 