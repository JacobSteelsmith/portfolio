---
title: "Adding A Server-Side Microsummary"
date: 2006-10-23
---

With the [release builds of Firefox 2.0 available on their FTP servers](http://edge.i-hacked.com/) come [many new features](http://www.mozilla.com/en-US/firefox/2.0/releasenotes/), including "Live Titles."
Live titles allow web developers to include a text-only microsummary, which the browser can display instead of the standard, static title when the user bookmarks the page. I just created a server-side microsummary for this blog. The live title is very small, so I just wanted to have the title read "x posts. Latest: <title>" where x is the number of total posts and <title> is the title of the latest post.
I couldn't find a function that returned all the posts in the database so I added this function to the functions.php page found /wp-includes/:

```


function get_num_posts(){
          global $wpdb;
          return $wpdb->get_var("SELECT COUNT(*) FROM $wpdb->posts WHERE post_status = 'publish'");
}

```

I then added this code to the top of the index.php file in my current theme:

```

<?php if( (isset($_GET['view'])) && ($_GET['view'] == 'microsummary') ){ 
	
          if (have_posts()){
                    echo(get_num_posts() . ' posts. Latest: ');
                    get_posts(1);
                    the_title();
          }

} 

else { ?>
```

Also, don't forget to add this at the end of the index.php file:

<?php } ?>

The last step is to add the following into the header.php file between the **<head> </head>** tags:

<link rel="microsummary" href="index.php?view=microsummary" />

This will give your users the choice of a dynamic bookmark title to use rather than the old static title. 