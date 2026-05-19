---
title: "Error opening project in VS 2010 after machine rename"
date: 2012-02-15
---

I started up Visual Studio 2010 on my Windows 7 virtual machine to finally get some development done and was greeted with this error when opening a project I had recently worked on:

> The solution appears to be under source control, but it's binding information cannot be found. Because it is not possible to recover this missing information automatically, the projects whose bindings are missing will be treated as not under source control.

Another symptom of this problem can be seen when using Windows Explorer. The folders that should be under source control no longer have the little green icon in the corner, and there is no longer a Team Foundation Server menu.

One solution I came across suggested using the Change Source Control dialog, available at File -> Source Control -> Change Source Control. The solution said to highlight each project/solution and then click Bind. However, I was presented with the error:

> The mappings for the solution could not be found.

After an hour of searching, I figured out that this happened because I renamed my virtual machine to conform to our standards. Apparently, the workspaces in Visual Studio depend on the name of the computer, not some sort of unique identifier.

To fix this, the first step is to close the solution. After the initial error you will be asked if you want to "temporarily work uncontrolled" or if you would like to "permanently remove source control association bindings." Choose "temporarily work uncontrolled" and then immediately close the solution using File -> Close Solution.

Next, open the workspaces dialog using File -> Source Control -> Workspaces...

You will notice the Manage Workspaces dialog box contains one workspace with your new machine name. Click on Edit... to view the details of this workspace.

In my case there were no working folders. There should be an entry for every project you have under source control. I should have at least 10 here.

Click Cancel to return to the Manage Workspaces dialog box and click the check box labeled "Show remote workspaces." When I did this, I now have second entry that has my computer's old name. Clicking edit when for this "remote" workspace brings up all of my missing mappings.

Next, you will want to note the old computer name and follow the steps outlined [here](http://blogs.msdn.com/b/buckh/archive/2006/03/03/update-workspace.aspx):

* Close Visual Studio.
* Open the Visual Studio command prompt found in All Programs -> Microsoft Visual Studio 2010 -> Visual Studio Tools -> Visual Studio Command Prompt (2010).
* Enter the command: **tf workspaces /updateComputerName:OldComputerName /s:http://Tfs\_server:8080** substituting "OldComputerName" and the address of your TFS server. I had to add /tfs to the end of the address.

When I started Visual Studio, I now had two workspaces. I was able to delete the "new" one that had no mappings, and for completeness I renamed the old one to match the new computer name. Now all of my projects open properly.

Also, I now see the little green corner on the folders that are under source control when I use Windows Explorer, and the Team Foundation Server menu appears again. I had to reboot to see these.