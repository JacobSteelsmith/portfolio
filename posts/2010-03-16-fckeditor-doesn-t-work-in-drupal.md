---
title: "Fckeditor doesn't work in Drupal"
date: 2010-03-16
---

When installing the fckeditor module in Drupal on some host configurations, probably centos and Apache, this error may occur when browsing for files.

The server didn't reply with a proper XML data. Please check your configuration.

The clue to this error, at least on centos, is in /usr/local/apache/logs/error\_log:

[Tue Mar 16 21:20:06 2010] [error] [client xxx.xxx.xxx.xxx] SoftException in Application.cpp:601: Directory "/xx/xx/xx/xx/sites/default/modules/fckeditor/fckeditor/editor/filemanager" is writeable by group

Sure enough, the fckeditor folder had permissions set to 777. Setting them to 755 worked.