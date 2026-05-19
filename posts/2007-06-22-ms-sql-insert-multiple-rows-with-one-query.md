---
title: "MS SQL: Insert Multiple Rows With One Query"
date: 2007-06-22
---

Just figured this out. Using Microsoft SQl Server 2000, you can insert multiple rows into a table with one query as in the following examples:

Single Column:

CREATE TABLE test

(

val1 INTEGER NOT NULL

)

INSERT INTO test

SELECT 62

UNION

SELECT 91

UNION

SELECT 95

UNION

SELECT 98

UNION

SELECT 99

This will insert 5 rows into the table. To do multiple columns, use the following:

CREATE TABLE test

(

val1 VARCHAR(10),

val2 VARCHAR(10),

val3 VARCHAR(10),

val4 VARCHAR(10)

)

GO

INSERT INTO test

(val1, val2, val3, val4)

(SELECT 'a1', 'a2', 'a3', 'a4')

UNION

(SELECT 'b1', 'b2', 'b3', 'b4')

UNION

(SELECT 'c1', 'c2', 'c3', 'c4')

GO