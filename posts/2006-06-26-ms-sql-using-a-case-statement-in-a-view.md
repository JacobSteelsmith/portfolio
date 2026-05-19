---
title: "MS SQL: Using A Case Statement In A View"
date: 2006-06-26
---

Here is a neat trick for using conditional processing in a view.

I needed to create a view that contained an employee id and employee name amongst other data. The original view included two joins, but for the sake of simplicity, I have altered the view. This view uses a case statement to determine which "full name" to show, the full name using the first name or the full name using the nickname if the employee has one.

```


SELECT emp_id,
CASE
    WHEN LEN(nickname) = 0 THEN firstname + ' ' + lastname
    ELSE nickname + ' ' + lasname
END AS FullName
FROM tblEmployees
```

Using a case statement we can determine, in the view, whether the length of the nickname is zero (LEN(nickname) = 0) and, if it is zero, use the firstname. If the length of the nickname is not zero (the ELSE), then we use the nickname. So, in my case, Jake is my nickname so my full name would be **Jake Steelsmith**. If I didn't have a nickname, it would use my first name so my full name would be **Jacob Steelsmith**.