---
title: Building Browser Helper Objects using Managed Code
author: 
date: Mon, 20 Nov 2006 01:35:39 GMT
template: article.jade
---

&lt;font face=&quot;Verdana&quot;&gt;Over the past&amp;nbsp;few days I&#39;ve been&amp;nbsp;exploring the&amp;nbsp;extensibility of IE7 from a user experience perspective.&amp;nbsp; One of the options for creating an Add-On for IE is something called the Browser Helper Object (BHO for short).&amp;nbsp; With&amp;nbsp;a BHO you can trap a variety of events in Internet Explorer (such as browsing for a page, or when the user quits the browser), examine the results and take actions as required.&amp;nbsp; This powerful feature allows you to build UIs that really integrate with the browsing experience.&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;**How do I write one in .NET?**&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;BHOs sound great, but the question is - how do I write one in .NET?&amp;nbsp; Although the BHO interface is COM-based, it&#39;s not as hard as it sounds.&amp;nbsp; Firstly, you must create a class library in .NET and add the following COM references:&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;&lt;&#x2F;font&gt;&lt;font face=&quot;Courier&quot;&gt;
[ComImport(), Guid(&quot;fc4801a3-2ba9-11cf-a229-00aa003d7352&quot;)]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IObjectWithSite
{
void SetSite([In ,MarshalAs(UnmanagedType.IUnknown)] object pUnkSite);
void GetSite(ref Guid riid, [MarshalAs(UnmanagedType.IUnknown)] out object ppvSite);
}&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;This interface provides the GetSite and SetSite for hooking into events within IE.&amp;nbsp; After you have these defined, create a class that overrides IObjectWithSite:&lt;&#x2F;font&gt;

&lt;font face=&quot;Courier&quot;&gt;[ClassInterfaceAttribute(ClassInterfaceType.None)]
[GuidAttribute(MyGuid)]
[ProgIdAttribute(&quot;MyNamespace.MyBHO&quot;)]
public class MyBHO: IObserver, IObjectWithSite
{&lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Courier&quot;&gt;}&lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Verdana&quot;&gt;In this class you&#39;ll need to define a browser class object and browser events object from the Internet Controls library (VS.NET will create an Interop assembly called Interop.SHDocVw when you import this):&lt;&#x2F;font&gt;

&lt;font face=&quot;Courier&quot;&gt;protected SHDocVw.IWebBrowser2 m_pIWebBrowser2;
protected SHDocVw.DWebBrowserEvents2_Event m_pDWebBrowserEvents2; &lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Verdana&quot;&gt;With these defined, you now override GetSite and SetSite, initializing the Internet Controls and enabling the events:&lt;&#x2F;font&gt;

&lt;font face=&quot;Courier&quot;&gt;public void SetSite(object pUnkSite)
{ &lt;&#x2F;font&gt;&lt;font face=&quot;Courier&quot;&gt;
if (m_pIWebBrowser2!=null)
Release(); &lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Courier&quot;&gt;if (pUnkSite==null)
return; &lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Courier&quot;&gt;m_pIWebBrowser2 = pUnkSite as SHDocVw.IWebBrowser2;&amp;nbsp; &#x2F;&#x2F; set the reference&lt;&#x2F;font&gt;

&lt;font face=&quot;Courier&quot;&gt;if (!(m_pIWebBrowser2.FullName.ToUpper().EndsWith(&quot;IEXPLORE.EXE&quot;)))&amp;nbsp; &#x2F;&#x2F;make sure only runs on IE
{
Release();
return;
} &lt;&#x2F;font&gt;

&lt;font face=&quot;Courier&quot;&gt;m_pDWebBrowserEvents2 = m_pIWebBrowser2 as SHDocVw.DWebBrowserEvents2_Event ; &lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Courier&quot;&gt;if (m_pDWebBrowserEvents2 != null)
{
m_pDWebBrowserEvents2.BeforeNavigate2 += new SHDocVw.DWebBrowserEvents2_BeforeNavigate2EventHandler(BeforeNavigate);
m_pDWebBrowserEvents2.OnQuit += new SHDocVw.DWebBrowserEvents2_OnQuitEventHandler(OnQuit);
} 
else
{

Release();
return;
}
}&lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Courier&quot;&gt;&lt;&#x2F;font&gt;&amp;nbsp; &lt;p&gt;&lt;font face=&quot;Courier&quot;&gt;public void GetSite(ref System.Guid riid, out object ppvSite)
{
ppvSite=null;
if (m_pIWebBrowser2 != null)
{
IntPtr pSite = IntPtr.Zero;
IntPtr pUnk = Marshal.GetIUnknownForObject(m_pIWebBrowser2); 
Marshal.QueryInterface(pUnk, ref riid, out pSite); 

Marshal.Release(pUnk); 
if (!pSite.Equals(IntPtr.Zero))
{
ppvSite = pSite; 
}
else
{
Release();
Marshal.ThrowExceptionForHR(E_NOINTERFACE);
}
}
else
{
Release();
Marshal.ThrowExceptionForHR(E_FAIL); 
}
}&lt;&#x2F;font&gt; &lt;p&gt;&lt;font face=&quot;Verdana&quot;&gt;As you can see in the SetSite method, you can now define the hooks within Internet Explorer:&lt;&#x2F;font&gt;
&lt;font face=&quot;Courier&quot;&gt;m_pDWebBrowserEvents2.BeforeNavigate2 += new SHDocVw.DWebBrowserEvents2_BeforeNavigate2EventHandler(BeforeNavigate);
m_pDWebBrowserEvents2.OnQuit += new SHDocVw.DWebBrowserEvents2_OnQuitEventHandler(OnQuit);
&lt;&#x2F;font&gt; 

&lt;font face=&quot;Verdana&quot;&gt;&lt;font face=&quot;Verdana&quot;&gt;These can&amp;nbsp;point to&amp;nbsp;your own methods that can act on these events accordingly (e.g. launch a particular process with a given URL, rewrite URLs etc.)&lt;&#x2F;font&gt;&lt;&#x2F;font&gt;

**&lt;font face=&quot;Verdana&quot;&gt;How to install a BHO using an MSI&lt;&#x2F;font&gt;**

&lt;font face=&quot;Verdana&quot;&gt;One of the challenges is not building a BHO, but getting it to install&#x2F;uninstall reliably through an MSI.&amp;nbsp; To run correctly,&amp;nbsp;a BHO requires registration via COM interop, but setting the vsdrpCOM property in the MSI isn&#39;t enough (this results in a successful registration most of the time, but the add-in won&#39;t remove itself at uninstall).&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;My recommendation is to set the MSI property to vsdrpNoDotRegister and instead create your own registration component.&amp;nbsp; This can be a simple command prompt executable that you run as a custom action (for both install and uninstall) in the MSI.&amp;nbsp; &lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;To register the assembly, use the following code within your registration code:&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;&lt;font face=&quot;Courier&quot;&gt;System.Runtime.InteropServices.RegistrationServices r = new System.Runtime.InteropServices.RegistrationServices();
r.RegisterAssembly(System.Reflection.Assembly.LoadFile(bhoDll), System.Runtime.InteropServices.AssemblyRegistrationFlags.SetCodeBase);&lt;&#x2F;font&gt;
&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;To unregister the assembly, you use the UnregisterAssembly method:&lt;&#x2F;font&gt;

&lt;font face=&quot;Courier&quot;&gt;System.Runtime.InteropServices.RegistrationServices r = new System.Runtime.InteropServices.RegistrationServices();
r.UnregisterAssembly(System.Reflection.Assembly.LoadFile(bhoDll));
&lt;&#x2F;font&gt;

**&lt;font face=&quot;Verdana&quot;&gt;UAC Considerations for Vista&lt;&#x2F;font&gt;**

&lt;font face=&quot;Verdana&quot;&gt;This approach works all very well for XP, but if you are installing your BHO on Vista you&#39;ll need to set the user access control correctly.&amp;nbsp; One of the problems is that custom actions in MSIs run as an non-elevated user, which means that unless you are running the MSI as elevated your custom action won&#39;t have the permissions required to register the BHO.&amp;nbsp; I haven&#39;t found a way to elevate a user manually from a piece of managed code, but you can overcome this using one of two ways:&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;1.&amp;nbsp; Write a batch file that contains the following:&lt;&#x2F;font&gt;

&lt;font face=&quot;Courier&quot;&gt;msiexec &#x2F;i MyMSI.msi&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;...and right click on the batch file, and select &quot;Run as Administrator&quot;&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;2.&amp;nbsp; Use the ORCA tool (part of the Windows SDK) to set the custom actions to run as SYSTEM.&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;To do this, download the SDK, install and run ORCA and open your MSI.&amp;nbsp; Open the custom action from the left hand pane, select your custom action and set the type to 3090.&amp;nbsp; This will cause the custom action to run as the SYSTEM account and registration will be successful.&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;**Examples**&lt;&#x2F;font&gt;

&lt;font face=&quot;Verdana&quot;&gt;Finally, if you are looking for a great example of a managed BHO (and more details of how one works), check out [this post](http:&#x2F;&#x2F;www.15seconds.com&#x2F;issue&#x2F;040331.htm) from Michele Leroux Bustamante.&amp;nbsp; Here, Michele shows how to use a BHO for observing user behavior in IE, with downloadable code that you can build your own from.&lt;&#x2F;font&gt;
