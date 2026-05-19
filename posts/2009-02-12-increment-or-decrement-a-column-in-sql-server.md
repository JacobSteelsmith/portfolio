---
title: "Increment or decrement a column in SQL Server"
date: 2009-02-12
---

Using SQL on SQL Server, it is easy to decrement or increment a column.

UPDATE t\_test

SET inc = inc + 1,

dec = dec - 1

WHERE blah = blah