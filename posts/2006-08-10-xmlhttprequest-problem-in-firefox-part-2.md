---
title: "XMLHttpRequest Problem In Firefox Part 2"
date: 2006-08-10
---

I've noticed another odd behavior in FireFox while using the XMLHttpRequest object. When posting to a page on a server that requires authentication, the first post will go through just fine. But the second post, without refreshing the page, will cause the server to want authentication. I'm not sure if this behavior was present in the previous version and this behavior his not present if the object is querying a page using get. Using post works fine using IE 7.