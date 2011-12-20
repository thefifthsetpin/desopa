/*

		Copyright (c) 2011 - 2012 Tamer Rizk (trizk@inficron.com)
		
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

var DeSopafy = false;
var DeSopaListener = false;
(function(window,document,undefined){

	const DE_STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;  
	const DE_STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;  
	const DE_NS_BINDING_ABORTED = Components.results.NS_BINDING_ABORTED; 
	
	var deURL = '';
	var deDomain = '';
	var deWindow = false;
	var deOn = false;
	var subContent = false;
	var deTab = false;
	var deIP = {};
	var deCache = {};
  var deConsole = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

	//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	var DeReq = function(u,f,d,x){ x=this.ActiveXObject;x=new(x?x:XMLHttpRequest)('Microsoft.XMLHTTP');x.timeout=15000;x.open(d?'POST':'GET',u,1);x.setRequestHeader('Content-type','application/x-www-form-urlencoded');x.onreadystatechange=function(){x.readyState>3&&f?f(x.responseText,x):0};x.send(d)};
	var DeSyn = function(n,a){	
		deIP[n] = a!=null && typeof a[1] && a[1] ? a[1] : '';
		if('0' in deIP && '1' in deIP && deIP['0']==deIP['1']){
			deCache[deDomain]=deIP['0'];
			DeSubRe();	
		}else if('0' in deIP && '2' in deIP && deIP['0']==deIP['2']){
			deCache[deDomain]=deIP['0'];
			DeSubRe();	
		}else if('2' in deIP && '1' in deIP && deIP['2']==deIP['1']){
			deCache[deDomain]=deIP['2'];
			DeSubRe();	
		}else if('2' in deIP && '1' in deIP && '0' in deIP && deIP['2']!=deIP['1'] && deIP['2']!=deIP['0']){
			deCache[deDomain]=deIP[(new Date).getTime()%3];
			DeSubRe();	
		}else if(!('0' in deIP)){
			DeNS[0]();
		}else if(!('1' in deIP)){
	  	DeNS[1]();
		}else if(!('2' in deIP)){
	  	DeNS[2]();
		}else{
	  	deCache[deDomain]='';
		}
	};

	var DeNS = [
		function(){DeReq('http://www.kloth.net/services/nslookup.php',function(d){ DeSyn('0', d.match(/Address\:[\r\n\s\t]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)[\r\n\s\t]*<\/pre>/i))},'d='+deDomain+'&n=localhost&q=A')},
		function(){DeReq('http://enc.com.au/itools/nslookup.php',function(d){ DeSyn('1', d.match(/"webrow".*network=([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)[^0-9]/i))},'domain='+deDomain)},
		function(){DeReq('http://88.198.46.60/action.php?atype=3',function(d){ DeSyn('2', (d.substr(d.indexOf('Name:'))).match(/>[\r\n\s\t]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)[\r\n\s\t]*</i))},'host='+deDomain+'&go=Go')},
	];

	var DeRe = function(s){
		var re = new RegExp( '([\/"\'\(])(?:www[0-9]?\.)?'+deDomain.replace(/\./g,'\.'),'gi');
		return s.replace(re,'$1'+deCache[deDomain]);	
	};

	var DeSubRe = function(){
		var re = new RegExp( deDomain.replace(/\./g,'\.'),'gi');
		deWindow.location.href=DeRe(deURL);
		subContent = true;	
		document.getElementById('desopa-box').style.display='none';
			
	};
	
	DeSopafy = function(o){
		if(deOn){					
			deOn = false;
			o.label = 'DeSopa off';
			o.style.backgroundColor = 'yellow';
			o.style.fontWeight = '200';
		}else{			
			deOn = true;
			o.label = 'DeSopa on';
			o.style.backgroundColor = 'green';	
			o.style.fontWeight = '600';
		}		
	};

	DeSopaListener = {

		QueryInterface: function(aIID)  {  
  		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||  
       	aIID.equals(Components.interfaces.nsISupportsWeakReference) ||  
      	aIID.equals(Components.interfaces.nsISupports))  
    	return this;  
  		throw Components.results.NS_NOINTERFACE;  
		},  

  	onLocationChange: function(progress, request, location)  {  
    
  		if(DE_STATE_START && deOn && request!=null && !location.spec.match(/^about\:/i)) { 
  			//foo.1.2.3.4 won't work anyway. Need a workaround for subdomains.
				if(location.spec.match(/^(?:[a-z0-9]+:\/\/)?(?:[a-z0-9\-]+\.)?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/i)){	
					subContent = true;
				}else{
					deURL = location.spec;
					deDomain = deURL.replace(/^(?:[a-z0-9]+:\/\/)|(?:\/.*)$/ig,'');
					deWindow = progress.DOMWindow;			
					//deConsole.logStringMessage( deDomain );		
					request.cancel(DE_NS_BINDING_ABORTED);
					if(deDomain in deCache){ 
						if(deCache[deDomain]) DeSubRe();					
					}else{
						deIP = {};
						//document.getElementById('desopa-box').innerHTML='Resolving and caching IP for '+deDomain+'...';
						document.getElementById('desopa-box').style.display='block';
						DeNS[(new Date).getTime()%3]();			
													
					}
				}													
			}		  
  	},    
  
  	onStateChange: function(progress, request, flag, status)  {  		
			if(DE_STATE_START && deOn && flag && subContent && request!=null && request.name.match(/^(?:[a-z0-9]+:\/\/)?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/i) && deWindow.document.head.innerHTML!=null){
				subContent = false;
				deWindow.document.head.innerHTML = DeRe(deWindow.document.head.innerHTML);
				deWindow.document.body.innerHTML = DeRe(deWindow.document.body.innerHTML);  	
			}  
  	},
   
  	onProgressChange: function(a, b, c, d, e, f) {},  
  	onStatusChange: function(a, b, c, d) {},  
  	onSecurityChange: function(a, b, c) {}  
	};

	SetupDeSopa = {

  	init: function() { 
   		gBrowser.addProgressListener(DeSopaListener);  
  	},  
    
  	uninit: function() {  
    	gBrowser.removeProgressListener(DeSopaListener);  
  	},  
	};
})(this,document);				

window.addEventListener("load", function() {SetupDeSopa.init()}, false);  
window.addEventListener("unload", function() {SetupDeSopa.uninit()}, false);		
