---
title: "SQL: Totaling A Column Containing Varying Values"
date: 2006-06-14
---

I have been doing quite a few surveys recently and one of the tasks involved is mining the responses for data. Here's a neat trick I learned for totalling and counting responses using sql rather than programmatically on the front end.

Let's say you have a table of customers (tblCustomers) that houses the name of each person and the flavor of ice cream each customer prefers:

|  |  |  |

| --- | --- | --- |

| intRecID | nvchName | intIceCreamID |

| --- | | |

| 1 | Jake | 1 |

| 2 | Jennifer | 2 |

| 3 | Kitty | 3 |

Here is the table that contains the corresponding values for intIceCreamID.

|  |  |

| --- | --- |

| intRecID | nvchFlavor |

| --- | | |

| 1 | Vanilla |

| 2 | Chocolate |

| 3 | Strawberry |

As you can see, I like vanilla, Jennifer likes chocolate and the cat likes strawberry.

To count the number of people that like each flavor, you could use the following view:

```


CREATE VIEW sv_FlavorTotals
AS
   SELECT (SELECT COUNT(intFlavorID) FROM tblCustomers WHERE intFlavorID = 1) AS VanillaCount,
   (SELECT COUNT(intFlavorID) FROM tblCustomers WHERE intFlavorID = 2) AS ChocolateCount,
   (SELECT COUNT(intFlavorID) FROM tblCustomers WHERE intFlavorID = 3) AS StrawberryCount
GO
```

The output would look like this (assuming we only had the three records shown above):

|  |  |  |

| --- | --- | --- |

| VanillaCount | ChocolateCount | StrawberryCount |

| --- | | |

| 1 | 1 | 1 |

You can easily get a total of the records, replacing COUNT with SUM in the view. You could also do them all in one.