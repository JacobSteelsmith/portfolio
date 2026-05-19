---
title: "Creating zip files using ColdFusion 7"
date: 2008-09-15
---

Here is the code to zip multiple files and compress them using ColdFusion and Java. I tested it using two picture files and two text files.

```

<cfscript>
  
  files = ArrayNew(1);
  path = GetDirectoryFromPath(GetCurrentTemplatePath());

  files[1] = 'test1.txt';
  files[2] = 'test2.txt';
  
  zip_name = 'test.zip';

  //file output stream
  file_out_stream = 
    CreateObject('java', 'java.io.FileOutputStream'); 
  ret = file_out_stream.init(path & zip_name);

  //file input stream
  zip_out_stream = 
    CreateObject('java', 'java.util.zip.ZipOutputStream');
  ret = zip_out_stream.init(file_out_stream);

  //compress the files
  for (x = 1; x LTE ArrayLen(files); x = x + 1) {
    
    //load the file to read
    fis = CreateObject('java', 'java.io.FileInputStream');
    ret = fis.init(path & files[x]);

    //make a new zip entry (use the name of the file)
    zip_entry = 
      CreateObject('java', 'java.util.zip.ZipEntry');
    ret = zip_entry.init(files[x]);

    //put the entry into the outbound zip stream
    zip_out_stream.putNextEntry(zip_entry);

    //read in a byte from the input stream
    buf = fis.read();

    //-1 means eof...while we're not at the end of file
    while(buf NEQ -1) {
      //write the buffer to the out stream for this entry.
      zip_out_stream.write(buf);
      //read the next byte
      buf = fis.read();
    }

    //cleanup
    zip_out_stream.closeEntry();
    fis.close();

  }

  //cleanup
  zip_out_stream.close();
</cfscript> 

```