---
title: Displaying XPS Documents in Silverlight
author: 
date: Tue, 21 Apr 2009 00:10:39 GMT
template: article.jade
---

I’ve recently been involved on a project that has a requirement to create and view XPS documents in Silverlight.&amp;#160; The application needs to display the XPS file in a full screen window together with zoom and navigation features.

After a little searching on how to do this, I was able to get a head start with [this great post](http:&#x2F;&#x2F;blogs.msdn.com&#x2F;delay&#x2F;archive&#x2F;2007&#x2F;05&#x2F;22&#x2F;lighting-up-the-xml-paper-specification-proof-of-concept-xps-reader-for-silverlight.aspx) from David Anson, which includes sample code for viewing XPS files in Silverlight 2 beta 2.&amp;#160; As his [updated post](http:&#x2F;&#x2F;blogs.msdn.com&#x2F;delay&#x2F;archive&#x2F;2008&#x2F;10&#x2F;18&#x2F;roadblock-in-the-way-of-migrating-the-proof-of-concept-silverlight-xps-reader-simplesilverlightxpsviewer-sample-does-not-work-on-silverlight-2-rtw.aspx) attests to however, there were a few issues with Silverlight 2 due to a breaking change with the ways that font resources could be referenced from within a Silverlight assembly.&amp;#160; Fortunately, [this post](http:&#x2F;&#x2F;www.dotneteer.com&#x2F;Weblog&#x2F;post&#x2F;2008&#x2F;11&#x2F;Fix-for-Simple-XPS-Silverlight-Viewer-for-Silverlight-2.aspx) from Li Chen pointed me in the right direction, separating out the ODTTF fonts into separate XAP files which can be referenced at runtime.&amp;#160; 

The sample code provided by Li Chen works well with the sample XPS files provided, but I couldn’t get it working with an XPS file generated using Microsoft Word.&amp;#160; After a little debugging this weekend, I found a few subtleties with how the code dealt with XPS files geneated from Microsoft Word:

Firstly, the root document of the XPS file is called FixedDoc.fdoc instead of FixedDocument.fdoc (which is the name when using the XPS Printer Driver).&amp;#160; This was fairly easy to correct using a simple check:
  &lt;div class=&quot;code&quot;&gt;   

&#x2F;&#x2F; Added to support &amp;quot;Save as XPS&amp;quot; from Microsoft Word      
if (resourceInfo == null)       
{       
&amp;#160;&amp;#160;&amp;#160; resourceInfo = Application.GetResourceStream(_streamResourceInfo, ConvertPartName(&amp;quot;&#x2F;Documents&#x2F;1&#x2F;FixedDoc.fdoc&amp;quot;));       
}
 &lt;&#x2F;div&gt;  

Secondly, the .fdoc file refers to pages using relative links.&amp;#160; Instead of the absolute link (e.g. &#x2F;Documents&#x2F;1&#x2F;Pages&#x2F;1.page), a relative link (e.g. &#x2F;Page&#x2F;1.page) was causing the sample to be unable to find the pages.&amp;#160; A small piece of code to append the full path quickly fixes this also.
  &lt;div class=&quot;code&quot;&gt;   

&#x2F;&#x2F; Update the page names for &amp;quot;Save as XPS&amp;quot; from Microsoft Word      
List&amp;lt;string&amp;gt; _newPageNames = new List&amp;lt;string&amp;gt;();       
foreach (String pageName in _pageNames)       
{       
&amp;#160;&amp;#160;&amp;#160; if (pageName.StartsWith(&amp;quot;Page&amp;quot;))       
&amp;#160;&amp;#160;&amp;#160; {       
&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160;&amp;#160; _newPageNames.Add(&amp;quot;&#x2F;Documents&#x2F;1&#x2F;&amp;quot; + pageName);       
&amp;#160;&amp;#160;&amp;#160; }       
} 
 &lt;&#x2F;div&gt;  

Finally, it looks like Word includes a page attribute called BidiLevel, which isn’t recognized by the Canvas element.&amp;#160; Adding an additional exclusion line into the sample code quickly fixed it.
  &lt;div class=&quot;code&quot;&gt;   

_elementAttributesToRemove.Add(&amp;quot;Glyphs&amp;quot;, new List&amp;lt;string&amp;gt; { &amp;quot;BidiLevel&amp;quot; });
 &lt;&#x2F;div&gt;  

The result seems to work quite well, with an XPS file saved from Microsoft Word viewable within Silverlight.&amp;#160;&amp;#160; 

[![image](http:&#x2F;&#x2F;simonguest.com&#x2F;images&#x2F;DisplayingXPSDocumentsinSilverlight_9130&#x2F;image_thumb.png &quot;image&quot;)](http:&#x2F;&#x2F;simonguest.com&#x2F;images&#x2F;DisplayingXPSDocumentsinSilverlight_9130&#x2F;image.png) 

If you are interested in trying this yourself, I’ve posted a version of the sample code [here](http:&#x2F;&#x2F;simonguest.com&#x2F;downloads&#x2F;SimpleSilverlightXpsViewer.zip) which contains the above modifications.&amp;#160; To use the modified sample with your own XPS file, do the following:&amp;#160; 

1.&amp;#160; Go into Microsoft Word and “Save as &#x2F; XPS” to create a new XPS file.

2.&amp;#160; Download and compile the sample (note: only works in Visual Studio 2008).&amp;#160; 

3.&amp;#160; Copy the XPS into your Visual Studio project, in the **SimpleSilverlightXpsViewer_Web **project.&amp;#160; 

4.&amp;#160; In Windows Explorer, rename the original XPS file to a ZIP file.&amp;#160; Ignore the warning about changing the file extension.

5.&amp;#160; Open the zip file and go into the &#x2F;Resources directory.&amp;#160; Look for font files ending in ODTTF - these are embedded font files for the XPS file and must be referenced separately in the Silverlight project.&amp;#160; Copy all of these ODTTF files to the **SampleWordGenerated **project in the solution.&amp;#160; Also note that the ODTTF files are dynamically named when the XPS file is generated.&amp;#160; This means that although you may have already imported the correct ODTTF files for previous XPS file that use the same fonts, you’ll still need to re-import the fonts again to handle a new XPS file.&amp;#160; 

6.&amp;#160; Edit **default.html **in **SimpleSilverlightXpsViewer_Web **and on line 70 change the **xpsDocument=SampleWordGenerated.xps **to the correct name of your XPS file.&amp;#160; 

7.&amp;#160; F5 to run and you should see your XPS document displayed within a Silverlight control!

There is still a bit of work to do with the sample code, which I think would be worth taking into a CodePlex project.&amp;#160; For example, the code should initially read the XPS root file (FixedDocSeq.fdseq) instead of looking or FixedDoc.fdoc or FixedDocument.fdoc directly.&amp;#160; It would also be great to figure out a better way of extracting the fonts more dynamically at runtime.&amp;#160; Other than that though I found this to be a good solution to display XPS files in Silverlight applications, especially useful as Silverlight doesn’t support the FlowDocument element (which is commonly used in WPF applications for creating documents and report generation).
