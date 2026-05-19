---
title: "Linux tip: get number of files in a directory"
date: 2008-01-30
---

Just a quick post. To get the number of files in a directory under linux, use the following command:
$ ls -l | wc -l
This will output the number of files in the present working directory which can be output by using the command 'pwd'.