<!--
/* constructor for Console class */
function Console() {
	
	this.data = {};
	
	/* fetching content from the given url via AJAX call */
	this.loadDefinition = function(url, cbk) {
		
		var self = this, /* saving scope reference for callbacks' usage */
		xmlhttp = (window.XMLHttpRequest)? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'); /* covering all browsers */
		
		/* same-origin request */
		if (url.indexOf(window.location.host)) {
			
			xmlhttp.onreadystatechange = function() {
				/* if AJAX request was successful, cache returned data in own property */
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
					self.data = JSON.parse(xmlhttp.responseText);
					/* calling render function or any other callback is optional */
					if(typeof cbk !== 'undefined')
						cbk(self);
				}
			}
			xmlhttp.open('GET', url, true);
		}
		/* cross-origin request */
		else {			
			/* XHR for Chrome, Firefox, Opera, Safari */
			if ('withCredentials' in xmlhttp)
				xmlhttp.open('GET', url, true);
			
			/* XDomainRequest for IE */
			else if (typeof XDomainRequest != 'undefined') { 
				xmlhttp = new XDomainRequest();
				xmlhttp.open('GET', url);
			} 
			
			/* CORS not supported */
			else 
				xmlhttp = null; 
			
			/* Successful response handler */
			xmlhttp.onload = function() {
				self.data = JSON.parse(xmlhttp.responseText);
			};

			/* Error handler */
			xmlhttp.onerror = function() {
				console.log('Remote server doesn\'t seem to allow CORS requests.');
			};
		}
		
		(xmlhttp)? xmlhttp.send() : console.log('Error while making a request. Possibly CORS is not supported.');
	};
	
	/* drawing widgets and rendering page content */
	this.render = function(self) {
		self = self || this; /* when render is called as a callback(by loadDefinition), 'this' references window object and not Console object */
		if(self.data.layout.content.widgets === 'undefined') return;

		var content = "<div class='row'>",
		count = 0,
		pageWidth = document.body.offsetWidth,
		get
		widgets = self.data.layout.content.widgets,
		widgetsPerLine = Math.floor(pageWidth/250);
		
		for(var i in widgets) {
			
			/* if we filled a row, close it and open a new one */
			if(count != 0 && count%widgetsPerLine == 0)
				content += "</div><div class='row'>";
			
			if(widgets[i].is_visible){
				content += "<div class='widget col-"+(count%2)+"'><h4>"+widgets[i].title+"</h4><div class='content'>"+widgets[i].content+"</div></div>";
				count++;
			}
		}
		content += "</div>";
		
		document.title = self.data.layout.header.title;
		document.body.innerHTML = content;
	};
}

var con = new Console(),
url = 'data.php';
//url = 'http://updates.html5rocks.com';

window.addEventListener('load', function(){
	con.loadDefinition(url, con.render);
});

window.addEventListener('resize', function(){
	con.render();
});
-->