---
title: "Queue file size limit exceeded in Postfix"
date: 2011-08-29
---

I encountered this error today in our Postfix based mail archive server (mailarchiva). We use it to archive email from Google Apps and route our email through it.

We received complaints of people not being able to send attachments, getting an error message similar to:

Delivery to the following recipient failed permanently:

Technical details of permanent failure:

Google tried to deliver your message, but it was rejected by the recipient domain. We recommend contacting the other email provider for further information about the cause of this error. The error that the other server returned was: 552 552 5.3.4 Error: message file too big (state 18).

This was caused by Postfix and it's limit on not only messages but mailbox sizes.

I had to add this setting in /etc/postfix/main.cf:

message\_size\_limit = 31457280

The extra size is to accommodate encoding. Be sure to reload postfix after this is done using:

$ sudo /etc/init.d/postfix reload