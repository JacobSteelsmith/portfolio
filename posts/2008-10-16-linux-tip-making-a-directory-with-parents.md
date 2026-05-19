---
title: "Linux tip: making a directory with parents"
date: 2008-10-16
---

Making a directory is no big deal:

$ mkdir ~/temp

But what if you have to make a bunch of directories nested? So what if I had to make ~/temp/temp1/temp2/temp3/temp4 ? Using the -p switch, for parents, the utility will create the structure for you.

$ mkdir -p ~/temp/temp1/temp2/temp3/temp4

This command will create all the directories leading down to temp4. 