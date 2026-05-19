---
title: "Display templates (partial views) in MVC 3 using Razor"
date: 2011-11-29
---

http://stackoverflow.com/questions/6365633/what-is-the-html-displayfor-syntax-for

This is an excellent, easy way to have a consistent user interface. You can use display templates to default values, or give all the values of a specific type the same look and feel (or do both). For example, creating the view String.cshtml inside Views -> Shared -> DisplayTemplates will affect all strings that are rendered using:

`@Html.DisplayFor()`

The display template, also called a partial view looks like this:

`@model string
@if ((string.IsNullOrEmpty(Model)) || (string.IsNullOrWhiteSpace(Model)))
{
    <text>(not set)</text>
}
else
{
    @Model
}`

Either the string is set or the text "(not set)" is displayed if there is no value, if the value is null, or if it is only white space.