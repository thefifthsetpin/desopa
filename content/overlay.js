/*
		DeSopa v1.4
		
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

var DESOPA = new function() {

	const DE_STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;  
	const DE_STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;  
	const DE_NS_BINDING_ABORTED = Components.results.NS_BINDING_ABORTED; 
	
	var deURL = '';
	var deDomain = '';
	var deIP = '';
	var deWindow = false;
	var deOn = false;
	var subContent = false;
	var deTab = false;
	var deAddr = {};
	var deCache = {};
	
  //var deConsole = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	//deConsole.logStringMessage('');

	this.DeSopafy = function(o){
		if(deOn){					
			deOn = false;
			o.label = 'DeSopa off';
			o.style.backgroundColor = '#EDF9FA';
			o.style.fontWeight = '200';
		}else{			
			deOn = true;
			o.label = 'DeSopa on';
			o.style.backgroundColor = 'green';	
			o.style.fontWeight = '600';
		}		
	};
	
	this.Setup = {
  	init: function() { 
   		gBrowser.addProgressListener(DeSopaListener);  
  	},  
    
  	uninit: function() {  
    	gBrowser.removeProgressListener(DeSopaListener);  
  	},  
	};
	
	var DeReq = function(u,f,d,x){ x=this.ActiveXObject;x=new(x?x:XMLHttpRequest)('Microsoft.XMLHTTP');x.timeout=15000;x.open(d?'POST':'GET',u,1);x.setRequestHeader('Content-type','application/x-www-form-urlencoded');x.onreadystatechange=function(){x.readyState>3&&f?f(x.responseText,x):0};x.send(d)};
	var DeSyn = function(n,a){	
		deAddr[n] = a!=null && typeof a[1] && a[1] ? a[1] : '';
		if('0' in deAddr && '1' in deAddr && deAddr['0']==deAddr['1']){
			deCache[deDomain]=deAddr['0'];
			deCache[deCache[deDomain]]=deDomain;
			DeSubRe();	
		}else if('0' in deAddr && '2' in deAddr && deAddr['0']==deAddr['2']){
			deCache[deDomain]=deAddr['0'];
			deCache[deCache[deDomain]]=deDomain;
			DeSubRe();	
		}else if('2' in deAddr && '1' in deAddr && deAddr['2']==deAddr['1']){
			deCache[deDomain]=deAddr['2'];
			deCache[deCache[deDomain]]=deDomain;
			DeSubRe();	
		}else if('2' in deAddr && '1' in deAddr && '0' in deAddr && deAddr['2']!=deAddr['1'] && deAddr['2']!=deAddr['0']){
			deCache[deDomain]=deAddr[(new Date).getTime()%3];
			deCache[deCache[deDomain]]=deDomain;
			DeSubRe();	
		}else if(!('0' in deAddr)){
			DeNS[0]();
		}else if(!('1' in deAddr)){
	  	DeNS[1]();
		}else if(!('2' in deAddr)){
	  	DeNS[2]();
		}else{
	  	deCache[deDomain]='';
		}
	};
	
	var HttpRequestObserver = {
  	observe: function(subject, topic, data){
    	if (topic == "http-on-modify-request") {
				var host = (subject.QueryInterface(Components.interfaces.nsIHttpChannel).getRequestHeader('Host')).replace(/^(?:[a-z0-9]+:\/\/)?|(?:\/.*)$/g,'');		
				if(host.match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/i)){
					var oct = host.split('.');
					oct = oct.reverse();
					oct[0] = oct[3]+'.'+oct[2]+'.'+oct[1]+'.'+oct[0];												
					subject.QueryInterface(Components.interfaces.nsIHttpChannel).setRequestHeader('Host', deCache[oct[0]] ? deCache[oct[0]] : host, false);									
				}			
    	}
  	},
    
		registered : false,
  	
		get observerService() {
    	return Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
  	},

  	register: function() {
    	this.observerService.addObserver(this, "http-on-modify-request", false);
    	this.registered = true;
  	},

  	unregister: function() {
    	this.observerService.removeObserver(this, "http-on-modify-request");
    	this.registered = false;
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
		subContent = true;
		deIP = deCache[deDomain];	
		document.getElementById('desopa-box').style.display='none';
		HttpRequestObserver.register();
		deWindow.location.href=DeRe(deURL);			
	};

	var DeSopaListener = {

		QueryInterface: function(aIID)  {  
  		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||  
       	aIID.equals(Components.interfaces.nsISupportsWeakReference) ||  
      	aIID.equals(Components.interfaces.nsISupports))  
    	return this;  
  		throw Components.results.NS_NOINTERFACE;  
		},  

  	onLocationChange: function(progress, request, location)  {  
      
  		if(DE_STATE_START && deOn && request!=null && !location.spec.match(/^about\:/i)) {   		
				if(location.spec.match(/^(?:[a-z0-9]+:\/\/)?(?:[a-z0-9\-]+\.)?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/i)){						
					subContent = true;
					var oct = (location.spec.replace(/^(?:[a-z0-9]+:\/\/)?|(?:\/.*)$/g,'')).split('.');
					oct = oct.reverse();
					deIP = oct[3]+'.'+oct[2]+'.'+oct[1]+'.'+oct[0];			
					if(!HttpRequestObserver.registered) HttpRequestObserver.register(); 					
				}else{
					deURL = location.spec;
					deDomain = deURL.replace(/^(?:[a-z0-9]+:\/\/)|(?:\/.*)$/ig,'');
					deWindow = progress.DOMWindow;						
					request.cancel(DE_NS_BINDING_ABORTED);
					if(deDomain in deCache){ 
						if(deCache[deDomain]) DeSubRe();					
					}else{
						deAddr = {};
						//document.getElementById('desopa-box').innerHTML='Resolving and caching IP for '+deDomain+'...';
						document.getElementById('desopa-box').style.display='block';
						DeNS[(new Date).getTime()%3]();																
					}
				}													
			}			  
  	},    
        
  	onStateChange: function(progress, request, flag, status)  {  		
			if(DE_STATE_START && deOn && flag && subContent && request!=null && request.name.match(/^(?:[a-z0-9]+:\/\/)?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/i) && deWindow.document!=null && deWindow.document.head!=null && deWindow.document.head.innerHTML!=null){
				if(HttpRequestObserver.registered) HttpRequestObserver.unregister();
				subContent = false;
				deWindow.document.head.innerHTML = DeRe(deWindow.document.head.innerHTML);
				deWindow.document.body.innerHTML = DeRe(deWindow.document.body.innerHTML);  	
			}
  	},
  	   
  	onProgressChange: function(a, b, c, d, e, f) {		
			if(deOn && !HttpRequestObserver.registered){
				HttpRequestObserver.register();
			}			
		}, 
		 
  	onStatusChange: function(a, b, c, d) { },  
  	onSecurityChange: function(a, b, c) { }  
	};

};				
 
window.addEventListener("load", function() {DESOPA.Setup.init()}, false);  
window.addEventListener("unload", function() {DESOPA.Setup.uninit()}, false);		