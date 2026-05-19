---
title: "Linux Tip: Compiling using multiple cores"
date: 2008-10-17
---

Compiling software can be very time consuming. To speed things up, and utilize what you paid for, you can use the -j switch for make. So make -j4 bootstrap will cause make to run four jobs at one time. This speeds things up drastically and will utilize four cores. 