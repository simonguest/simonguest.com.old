---
title: Using Windows 7 to host PHP applications in 5 easy steps!
author: Simon Guest
date: Mon, 09 Mar 2009 00:24:55 GMT
template: article.jade
---

A few people have asked me recently whether it’s possible to setup Windows 7 as a PHP server (for development purposes).  The answer is absolutely yes, and it’s a breeze to setup.  Follow these five simple steps to get PHP up and running in minutes.

<span class="more"></span>

1.  In the **Programs and Features **control panel, click on the **Turn Windows features on or off** link:

2.  In the list of Windows Features, expand** Internet Information Services**, **World Wide Web Services**, and the **Application Deployment Features**.  If it’s not already, select the **CGI** checkbox and click OK.  (The most reliable way of hosting PHP applications on Windows 7 is to use the built in FastCGI interface for IIS – checking this box installs it together with any pre-requisites.)

3.  Download the **non-thread-safe** **(NTS) **version of PHP from [http://www.php.net/downloads.php](http://www.php.net/downloads.php).  The current version (as of time of writing is 5.2.9).  (The thread safe (TS) version will also work, but generally NTS is faster, and thread safety is not an issue under FastCGI).  Expand the zip to an installation directory of your choice – e.g. c:devphp

4.  Copy the **php.ini-recommended **file to **php.ini **in the PHP directory.  Edit the php.ini file and add correctly configure **extension_dir**, pointing to the PHP extensions directory (normally the .ext folder of the PHP installation – e.g c:devphpext).  You can also configure other php.ini options and modules here if required.

5.  Run **Internet Information Services Manager** by typing **inetmgr** in the Start menu.  You can either set the global settings of the server, or (recommended) add a new web site to run the PHP applications.  Once you’ve done this, double click on the **Handler Mappings **for the site and add a new module mapping with the following settings:

**Request path **should be set to *.php.  **Module** should be FastCgiModule.  **Executable** should be {php_install_dir}php-cgi.exe.  **Name** can be anything – I use “PHP via Fast CGI”.

That’s it! Simply start/restart IIS and you are ready to go.  The easiest way to test that everything is working is to create a simple info.php file with a single line:

```html
<?php phpinfo(); ?>
```
When you access this page from a browser (e.g. [http://localhost:8081/info.php](http://localhost:8081/info.php)), you should see the PHP info screen.

Validate that the server API is using CGI/FastCGI and that the loaded configuration file is the one in your installation directory.