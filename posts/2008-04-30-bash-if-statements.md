---
title: "Bash: if statements"
date: 2008-04-30
---

An if statement in shell scripting looks something like this:
`if [ "$VAR" = 1 ]
then
#do something
elif [ "$VAR" = 2 ]
then
#do something else
else
#do something by default
fi`
Notice we're quoting the variable to protect from shell expansion.
There are [a variety of file tests one can use](http://tldp.org/LDP/abs/html/fto.html):
`if [ -e /tmp/test.file ]
then
#do something
elif [ -d "$VAR" ]
then
#do something else
else
#another default action
fi`
There is also [a variety of comparison operators one can use](http://tldp.org/LDP/abs/html/comparison-ops.html):
`if [ -z "$a" ] #checking if $a is null
then
#do something
elif [ "$a" != "$b" ] #checking if $a is not equal to $b
then
#do something
else
#do something default
fi`
Bash variables are not typed. They are all character strings, but in certain contexts and if the variable contains only digits, the shell will allow integer operations and comparisons. [An excellent primer on variables is located here](http://tldp.org/LDP/abs/html/untyped.html). 