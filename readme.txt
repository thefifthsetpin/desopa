# DeSopa v1.4 

SECTIONS:
------------------
I.   ABOUT
II.  HOW TO USE
III. KNOWN LIMITATIONS
IV.  HOW IT WORKS
V.   DISCLAIMER

I. ABOUT:
---------------
Powerful special interests are attempting to force legislation for tighter control of the Internet, because they believe such legislation will preserve their power. The bill they have sponsored, SOPA, not only has severe consequences for the Internet, it doesn't even achieve their objectives. SOPA, under the innocuous banner "Stop Online Piracy Act" will have the following repercussions:

1) Make organizations, such as Google, Facebook, Digg and Reddit liable to censor user generated content. Censoring billions of records for billions of possible violations is expensive. One of these companies has already stated that it may be forced to shut down as a result of the financial burden caused by SOPA. Other companies may have to scale back the services they offer for free, or otherwise charge for them.

2) Provide well financed trade groups such the MPAA and RIAA with leverage to shape the future of the internet for the benefit of the organizations they represent, by threatening closure of services that they believe are not in their interest.

3) Create a high barrier to entry for start-ups and a rough legal landscape for small businesses. If SOPA was implemented 10 years ago, there is a high probability that we would not have many of the online services we take for granted such as YouTube and Pandora.

4) The probable dissolution of DNS caused by the natural circumvention of blocked sites will result in wide array of security problems, bleeding the digital economy of integrity.

The internet creates market efficiencies that forces industries to adapt, thus pushing forward progress for humanity as a whole. Public freedoms should not be curtailed and the Internet, built by the masses, should not be destroyed, so that a powerful few may have a false sense of security that their business models are sustainable without technological evolution.

This program is a proof of concept that SOPA will not help prevent piracy. The program, implemented as a Firefox extension, simply contacts offshore domain name resolution services to obtain the IP address for any desired website, and accesses those websites directly via IP. Similar offshore resolution services will eventually maintain their own cache of websites, without blacklisting, in order to meet the demand created by SOPA.

If SOPA is implemented, thousands of similar and more innovative programs and services will sprout up to provide access to the websites that people frequent. SOPA is a mistake. It does not even technically help solve the underlying problem, as this software illustrates. What it will do is give undue leverage to predatory organizations, cripple innocent third party websites, severely dampen digital innovation and negatively impact the integrity and security of the Internet.

Please bring this to the attention of congressmen responsible for voting on SOPA. SOPA will not technically achieve its stated objectives. Anyone voting in favor of it is morally responsible for destroying the freedoms, innovation, hard work and aspirations of many.

II. HOW TO USE:
---------------------------
- Enable the Status/Add-on bar if it is not enabled (View->Toolbars->Add-on bar)
- Click on the light blue DeSopa button in the Status/Add-on bar, at the bottom of the browser window, to access websites by IP.
- Click the green DeSopa button to switch back to DNS resolution.

III. KNOWN LIMITATIONS:
---------------------------------------
- Can only resolve tabs one at a time.
- First time resolution is a bit slow because three services are checked serially and compared. This may be done in parallel in the future, or a trusted single source may be used.
- Page elements are not resolved to IP unless the element's host has been otherwise accessed by the user.

IV. HOW IT WORKS:
---------------------------------
When turned on, DeSopa intercepts URLs, sends the base URL to three offshore DNS services via HTTP, makes a best effort to check that two of them are equivalent, caches the IP for the browser session, redirects to the equivalent URL using the IP, and substitutes out the domain name in the source code with the IP address for future requests.

V. DISCLAIMER:
--------------
DESOPA IS MEANT TO BE A PROOF OF CONCEPT TO SHOW THAT THERE ARE SEVERE FLAWS IN SOPA, AND THAT LEGISLATION OF SOPA WILL RESULT IN VARIOUS TECHNICAL PROBLEMS AND WORKAROUNDS THAT WILL WRECK HAVOC ON THE INTERNET. DESOPA RESOLVES IP ADDRESSES BY CONSULTING OFFSHORE SERVERS FOR WHICH DESOPA AND ITS AUTHOR HAVE NO CONTROL. YOU ARE STRONGLY ADVISED NOT TO USE DESOPA WHILE ENTERING ANY PRIVATE OR PERSONAL INFORMATION, UNLESS YOU VERIFY THE ACCURACY OF THE IP ADDRESS YOU ARE CONTACTING YOURSELF. YOU ARE FULLY RESPONSIBLE FOR YOUR USE OR MISUSE OF THIS SOFTWARE.

DeSopa is released under GPL v2
http://www.gnu.org/licenses/gpl-2.0.html

GitHub: https://github.com/TamerRizk/desopa