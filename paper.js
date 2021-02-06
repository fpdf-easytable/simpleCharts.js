 /*********************************************************************
 * paper.js                                                    *
 *                                                                    *
 * Version: 1.2                                                       *
 * Date:    29-04-2018                                                *
 * Author:  Dan Machado                                               *
 * Require  raphaeljs v2.2.1                                          *
 **********************************************************************/
 
//###################################################################
//###################################################################
/*
 Reload the chart when resize the window:

How to use it:

instead of New chartName(data);

use:

chartLoader('chartName', data);

data can be an json object of a string json 

*/

(function(){
	var api={
		list:[],
		insert:function(chart, b){
					if(typeof window[chart]==='function'){
						this.list.push([chart, b, new window[chart](b)]);
					}
				},
		reload:function(){
					for(var i=0; i<this.list.length; i++){
						document.getElementById(this.list[i][1].canvasID).innerHTML='';
						this.list[i][2].Reload();
						this.list[i][2]=new window[this.list[i][0]](this.list[i][1]);
					}
				},
	};

	window.addEventListener('resize', function () { 
		"use strict";		
		api.reload();
	});
	
	this.chartLoader=function(chart, obj){	
		if(typeof obj==='string'){
			api.insert(chart, JSON.parse(document.getElementById(obj).innerHTML.trim()));
		}
		else{
			api.insert(chart, obj);
		}
	};

})();

function formatNumber(x, p){
	var d, num, tmp, l, r, txt;
	if(typeof p==='undefined') {
		d=2;
	}
	else{
		d=p;
	}
	
	num=String(x);
	if(num.indexOf('.')==-1) {
		num+='.';
	}
	num+='000000';
	tmp=num.split('.');
	l=tmp[0].length;
	r=l-Math.floor(l/3)*3;
	if(r==0) {
		r=3;
	}
	txt=tmp[0].substring(0, r);
	
	while(r<l-1){
		txt+=','+tmp[0].substring(r, r+3);
		r+=3;
	}
	return txt+'.'+tmp[1].substring(0, d);
}


function roundNumber(x, p){
	var d=2;
	if(typeof p==='number') {
		d=p;
	}	

	return Math.round(x* Math.pow(10, d))/Math.pow(10,d);
}


function CloneObject(Obj){
	var o, result;	
	if((Obj instanceof Object) && !(Obj instanceof Array)) {
		result={};
		for(o in Obj){
			//console.log(o);
			if(Obj.hasOwnProperty(o)){
				if(Obj[o] instanceof Object){
					result[o]=CloneObject(Obj[o]);
					
				}
				else{					
					result[o]=Obj[o];
				}
			}
		}
	}
	else if(Obj instanceof Array) {
		result=[];
		var i, len=Obj.length;
		for(i=0; i<len; i++){
			result[i]=Obj[i];
		}
	}
		
	return result;
}

/*
Overwrite or copy the properties from source to target
*/
function complementObject(Source, Target){
	if((Source instanceof Object) && !(Source instanceof Array)) {
		for(var o in Source){
			if(Source.hasOwnProperty(o)){
				if(typeof  Target[o]==='undefined'){
					if((Source[o] instanceof Object) && !(Source[o] instanceof Array)){ 
						Target[o]={};
					}
					else{
						Target[o]=null;
					}
				}
				if(complementObject(Source[o], Target[o])){
					Target[o]=Source[o];
				}
			}
		}
	}
	else if(!(Source instanceof Array)){
		return true;
	}
	else{
		return false;
	}
}

/*
For the same properties of Obj1 and Obj2,
it overwrite the values of Obj1 with the values of the same
properties of Obj2.
*/
function overWriteObj(Obj1, Obj2){
	var o;
	if(((Obj1 instanceof Object) && !(Obj1 instanceof Array)) && ((Obj1 instanceof Object) && !(Obj1 instanceof Array))){
		for(o in Obj1){
			if(Obj1.hasOwnProperty(o) && Obj2.hasOwnProperty(o)){
				if(Obj1[o] instanceof Object){
					overWriteObj(Obj1[o], Obj2[o]);	
				}
				else if(!(Obj2[o] instanceof Object)){
					Obj1[o]=Obj2[o];
				}
			}
		}
	}
}

/*
str   hex color
correctionFactor (float) between -1 and 1. Use negative values 
						to produce darker colors and positive values 
						to make lighter colors;
*/
function changeColor(str, correctionFactor){
	var factor=Math.abs(correctionFactor);
	if(factor<0){
		//factor*=-1;
		factor+=1;
	}

	var hexKey={'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
				'A':10,'B':11,'C':12,'D':13,'E':14,'F':15};
	var hex=[0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
	var c, nc='#';
	var str=String(str);
	str=str.toUpperCase();
	var i, n=str.length;
	for(i=1; i<4; i++){
		c=hexKey[str[2*i-1]]*16+hexKey[str[2*i]];
		if(correctionFactor<0){
			c*=factor;
			console.log(c);
		}
		else{
			c=(255 - c)*factor+c;
		}
		c=Math.round(c)
		nc+=String(hex[Math.floor(c/16)])+String(hex[(c-Math.floor(c/16)*16)]);
	}
	
	return nc;
}


//###################################################################
//###################################################################
//###################################################################
//###################################################################

function Paper(id){
	this.ID=id;
	var p=document.getElementById(this.ID);
	this.paper=Raphael(id, p.clientWidth,p.clientHeight);//, this will take the default width and height
	
}

Paper.prototype.setViewBox=function(x, y, w, h,fit) {
	this.paper.setViewBox(x, y, w, h,fit);
};


Paper.prototype.setSize=function(w,h){
	this.paper.setSize(w,h);
};


Paper.prototype.canvasSetAttribute=function(attribute, value){
	this.paper.canvas.setAttribute(attribute, value);
};


Paper.prototype.Clear=function () {
	document.getElementById(this.ID).innerHTML='';
	this.paper.clear();
}


Paper.prototype.getById=function(id){
	return this.paper.getById(id);
};


Paper.prototype.getDimension=function(str){
	var p=document.getElementById(this.ID);
	if(str=='width'){
		return p.clientWidth;
	}else if(str=='height'){	
		return p.clientHeight;
	}
};


Paper.prototype.defaults={ 
	text : {fill : '#000000', 'font-family' : 'inherit', 'font-size' : 12, 'font-style' : 'normal', 'font-weight' : 'normal'} 
};


Object.freeze(Paper.prototype.defaults);





//####################################################################
//####################################################################
//####################################################################
//####################################################################

function Shape(){
	this.obj=null;
};


Shape.prototype.attr=function(Style){
	//to move the object we use move method
	this.obj.attr(Style);
};


Shape.prototype.move=function(Coord){
	var tx, ty, box=this.obj.getBBox();

	if(Coord.hasOwnProperty('x')) {	
		tx=Coord.x;
	}
	else{
		tx=box.x;
	}
	
	if(Coord.hasOwnProperty('y')) {
		ty=Coord.y;
	}
	else{
		ty=box.y;
	}

	var boxT=this.obj.getBBox(true);
	var rx, ry;
	if(this.obj.matrix.a>0){
		if(this.obj.matrix.b>0){
			rx=(boxT.height)*this.obj.matrix.b
			ry=0;
		}
		else{			
			rx=0;
			ry=-1*(boxT.width)*this.obj.matrix.b;
		}
	}
	else{
		if(this.obj.matrix.b>0){
			rx=box.width;
			ry=-1*(boxT.height)*this.obj.matrix.a;
		}
		else{		
			rx=-1*(boxT.width)*this.obj.matrix.a;
			ry=box.height;
		}	
	}

	tx+=rx;
	ty+=ry;

	var x = this.obj.matrix.invert().x(tx, ty); 	
	var y = this.obj.matrix.invert().y(tx, ty);

	this.obj.attr({x:x, y:y});
};


Shape.prototype.show=function(){
	this.obj.show();
};


Shape.prototype.hide=function(){
	this.obj.hide();
};


Shape.prototype.toFront=function(){
	this.obj.toFront();
};


Shape.prototype.toShow=function(){
	this.obj.show();
	this.obj.toFront();
};


Shape.prototype.toBack=function(){
	this.obj.toBack();
};


Shape.prototype.mouseover=function(cbk){
	this.obj.mouseover(cbk);
};


Shape.prototype.mouseout=function(cbk){
	this.obj.mouseout(cbk);
};


Shape.prototype.getId=function(){
	return this.obj.id;
};


Shape.prototype.getBBox=function(bool){
	if(typeof bool==='boolean') {
		return this.obj.getBBox(bool);
	}
	else{
		return this.obj.getBBox();
	}
};

//####################################################################


function Rect(paper, x, y, width, height, Style){	
	Shape.call(this);
	this.obj=paper.paper.rect(x,y,width, height,0);
	if(typeof Style!=='undefined'){
		this.obj.attr(Style);
	}
};


Rect.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Rect,
		writable: true
	}
});

//####################################################################

function Line(paper, x0, y0, x1, y1, Style){	
	Shape.call(this);	
	this.obj=paper.paper.path('M'+x0+','+y0+'L'+x1+','+y1);
	if(typeof Style!=='undefined'){
		this.obj.attr(Style);
	}
};


Line.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Line,
		writable: true
	}
});


//####################################################################


function AnimateHBar(paper, x, y, length, width, ms, Style){
	Shape.call(this);	
	this.obj=paper.paper.path('M'+x+','+y+'L'+x+','+y+'L'+x+','+(y+width)+'L'+x+','+(y+width)+'Z');

	if(typeof Style!=='undefined'){
		this.obj.attr(Style);
	}
	this.obj.animate({path: 'M'+x+','+y+'L'+(x+length)+','+y+'L'+(x+length)+','+(y+width)+'L'+x+','+(y+width)+'Z'}, ms, "linear");
};


AnimateHBar.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: AnimateHBar,
		writable: true
	}
});


//####################################################################


function AnimateVBar(paper, x, y, width, height, Style) {
	Shape.call(this);	
	this.obj=paper.paper.path('M'+x+','+y+'L'+(x+width)+','+y+'L'+(x+width)+','+y+'L'+x+','+y+'Z');
	if(typeof Style!=='undefined') {
		this.obj.attr(Style);
	}
	this.obj.animate({path: 'M'+x+','+y+'L'+(x+width)+','+y+	'L'+(x+width)+','+(y-height)+'L'+x+','+(y-height)+'Z'}, 2000, "linear");
};


AnimateVBar.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: AnimateVBar,
		writable: true
	}
});

//####################################################################


function Circle(paper, x, y, radious, Style) {
	Shape.call(this);
	this.obj=paper.paper.circle(x, y, radious);
	if(typeof Style!=='undefined'){
		this.obj.attr(Style);
	}
}


Circle.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Circle,
		writable: true
	}
});


//####################################################################


function AnimateCircle(paper, x, y, radious, Style) {
	Shape.call(this);
	this.obj=paper.paper.circle(x, y, 0.1);
	if(typeof Style!=='undefined'){
		this.obj.attr(Style);
	}
	this.obj.animate(Raphael.animation({r:radious}, 2000));
}


AnimateCircle.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: AnimateCircle,
		writable: true
	}
});

//####################################################################

function Path(paper, path, Style) {
	Shape.call(this);
	this.obj=paper.paper.path(path);
	if(typeof Style!=='undefined'){
		this.obj.attr(Style);
	}
}

Path.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Path,
		writable: true
	}
});

//####################################################################

function AnimateLine(paper, x1, y1, x2, y2, ms, Style) {
	Shape.call(this);	
	this.obj=paper.paper.path('M'+x1+','+y1);
	if(typeof Style!=='undefined') {
		this.obj.attr(Style);
	}
	this.obj.animate({path: 'M'+x1+','+y1+'L'+x2+','+y2}, ms, "linear");
};


AnimateLine.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: AnimateLine,
		writable: true
	}
});


//####################################################################


function AnimatedArch(paper, initialAngle, perc, cx, cy, radious, width, ms, Style){
	Shape.call(this);
	this.r=5;
	this.ms=ms;
	this.tt=0;
	this.time=Date.now()+ms;
	this.perc=perc;
	this.initialAngle=initialAngle;
	this.radious=radious;
	this.width=width;
	this.cx=cx;
	this.cy=cy;
	this.x0=(this.radious+this.width)*Math.cos(this.initialAngle)+this.cx;	
	this.y0=(this.radious+this.width)*Math.sin(this.initialAngle)+this.cy;	
	
	this.x1=this.radious*Math.cos(this.initialAngle)+cx;	
	this.y1=this.radious*Math.sin(this.initialAngle)+cy;

	this.obj=paper.paper.path('M'+this.x0+' '+this.y0+'L'+this.x1+' '+this.y1);
	if(typeof Style!=='undefined'){
		this.obj.attr(Style);
	}
	
	this.animateArch();
};


AnimatedArch.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: AnimatedArch,
		writable: true
	}
});


AnimatedArch.prototype.animateArch=function(){
	
	if(Date.now()<this.time){
		this.tt=this.ms-(this.time-Date.now());
		this.a=0;
	}
	else{
		this.a+=1;
		this.tt=this.ms;
	}

	if(this.a<3){
		this.a++;
		var rThis=this;		
		this.correction=0;//+=0.4;
		
		setTimeout(function(){
			rThis.animateArch();
		}, this.r);
		
		if(this.correction>1){
			this.correction=0;
		}

		//*
		var rr=this.perc*(this.tt/this.ms)*0.9999;
		var a=Math.floor(0.5+(rr)/100);
		var b=1;
		var angle=this.initialAngle+2*Math.PI*(rr)/100;
		var cos=Math.cos(angle);	
		var sin=Math.sin(angle);	

		var arch='M'+this.x0+','+this.y0+'A'+(this.radious+this.width)+' '+(this.radious+this.width)+' 0 '+a+' '+b;
		arch+=' '+((this.radious+this.width)*cos+this.cx)+' '+((this.radious+this.width)*sin+this.cy);
		arch+='L'+(this.radious*cos+this.cx)+','+(this.radious*sin+this.cy);
		arch+='A'+this.radious+' '+this.radious+' 0 '+a+' '+(1-b)+' '+this.x1+' '+this.y1;
		arch+='Z';
		
		this.obj.node.setAttribute('d', arch);		
		/**/
	}
	else{
		//console.log('Finish!');
	}
};


//####################################################################
//####################################################################
//####################################################################
//####################################################################


/*
The text is set as follows: the text is broken into lines of max width maxw.
Therefore the whole text is set in a box of width maxw and height H. 
The upper left corner of this box is set in the position (x,y). 
The horizontal alignment of the text given by align is relative to the width
of the box. The vertical alignment given by valign is relative to the position
(x,y)
*/

function Text(Paper, x, y, maxw, valign, align, text, Style){
	Shape.call(this);
	if(typeof Style==='undefined') {
		Style=this.defaultStyle;
	}
	else{
		var p;
		for(p in this.defaultStyle){
			if(this.defaultStyle.hasOwnProperty(p) && !Style.hasOwnProperty(p)){
				Style[p]=this.defaultStyle[p];
				
			}
		}
	}

	this.Style=Style;

	this.dummySVG.counter++;
	
	if(this.dummySVG.data===null) {
		this.dummySVG.data=document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.dummySVG.data.setAttribute('viewBox', "0 0 1000 100"); 
		this.dummySVG.data.setAttribute('preserveAspectRatio',"xMidYMid meet");
		
		document.body.appendChild(this.dummySVG.data);

		var svgtxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
		svgtxt.setAttribute('x', -10000);
		svgtxt.setAttribute('y', 100);
		
		var svgspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
		svgspan.setAttribute('dy', 4);
		svgtxt.appendChild(svgspan);

		this.dummySVG.data.appendChild(svgtxt);
	}

	if(this.strStyle.data!=Style['font-size']+Style['font-weight']+Style['font-family']+Style['font-style']) {
		this.strStyle.data=Style['font-size']+Style['font-weight']+Style['font-family']+Style['font-style'];

		this.dummySVG.data.childNodes[0].setAttributeNS(null,'font-size', Style['font-size']+'px');
		this.dummySVG.data.childNodes[0].setAttributeNS(null,'font-family',Style['font-family']);
		this.dummySVG.data.childNodes[0].setAttributeNS(null,'font-style', Style['font-style']);
		this.dummySVG.data.childNodes[0].setAttributeNS(null,'font-weight', Style['font-weight']);
		this.dummySVG.data.childNodes[0].setAttributeNS(null,'text-anchor', "start");
	}

	var tmpText=String(text).trim();
	tmpText=tmpText.replace('&amp;', '&');
	
	var text=this.textLines(maxw, tmpText);

	var i, bw, tw, ftxt, len;
	len=text.length;
	ftxt='';
	for(i=0; i<len; i++) {
		ftxt+=text[i];
		if(i<len-1) {
			ftxt+='\n';
		}
	}

	this.align=align;
	this.valign=valign;

	Style['text-anchor']='middle';//default is text-anchor=middle

	bw=x+maxw/2;	
	if(align=='left'){
		Style['text-anchor']='start';
		bw=x;
	}else if(align=='right'){
		Style['text-anchor']='end';
		bw=x+maxw;
	}

	this.obj=Paper.paper.text(0, y, ftxt);
	this.obj.attr(Style);

	tw=this.obj.getBBox().height;
	
	if (valign=='before') { // position the text on top of the position y
		tw=y-tw/2;
	}
	else if(valign=='after'){ // position the text below the position y
		tw=y+tw/2;
	}else {
		tw=y;
	}

	this.obj.attr({x:bw, y:tw});
	
	this.dummySVG.counter--;
};


Text.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Text,
		writable: true
	}
});


Text.prototype.strStyle={data:null};

Text.prototype.dummySVG={data:null, counter:0};

Text.prototype.textContainer={data:null};// document.createElement("DIV");

Text.prototype.defaultStyle={fill : '#000000', 
										'font-family' : "Arial, sans-serif",
										'font-size' : 12, 
										'font-style' : 'normal', 
										'font-weight' : 'normal'
									};

Text.prototype.textM=function(text){
	this.dummySVG.data.childNodes[0].childNodes[0].appendChild(document.createTextNode(text)); 
	var box = this.dummySVG.data.getBBox();
	this.dummySVG.data.childNodes[0].childNodes[0].removeChild(this.dummySVG.data.childNodes[0].childNodes[0].childNodes[0]);	
	return box.width;
};

Text.prototype.trimText=function(text, mxwidth, Style){
	var result='';
	var i, len, wl;
	text=String(text).trim();
	len=text.length;

	wl=this.textM('...');
	var w, tmp='';
	text=text.replace("\n", ' ');
	
	if(mxwidth>=this.textM(text)){
		return text;
	}

	for(i=0; i<len; i++){
		tmp=result;
		result+=text[i];
		
		w=this.textM(result+'...')
		if(mxwidth==w){
			result='...';
			break;
		}
		else if(mxwidth<w){
			result=tmp+'...';
			break;
		}
	}
	
	return result;
};


Text.prototype.breakingText=function(text){
	var result={
					words : [],
					lengths : [],
					sp :0
					};

	result.sp= this.textM('a a')-2*this.textM('a');				
	this.spaceWidth=result.sp;

	var words=String(text).split(" ");
	var i, j, len, wl;
	j=0;
	len=words.length;

	for(i=0; i<len; i++){
		words[i]=words[i].trim()
		wl=this.textM(words[i]);
		if(wl!=0){
			result.words.push(words[i]);
			result.lengths.push(wl);
		}
	}
	
	return result;
};


Text.prototype.textLines=function(boxw, text){
	var bw=boxw;
	var wText;
	var lines=[];
	
	var i, j, len, k, lenb;
	var blocks=String(text).split("\n");
	j=0;

	lenb=blocks.length;
	
	for(k=0; k<lenb; k++){
		lines[j]='';
		bw=boxw;

		wText=this.breakingText(blocks[k]);

		len=wText.words.length;
	
		for(i=0; i<len; i++){
			if(bw-wText.lengths[i]<0 && bw!=boxw) {
				j++;
				lines[j]='';
				bw=boxw;
			}

			if(lines[j].length>0){
				lines[j]+=' ';
				bw-=wText.sp;		
			}
			
			lines[j]+=wText.words[i];
			bw-=wText.lengths[i];
		}
		j++;
	}	
	return lines;
};


/*
if coordinates x, y are present, the upper left corner of the text 
box is moved to the new coordinates Style.x, Style.y
*/
Text.prototype.move=function(Coord){
	var tx, ty, box=this.obj.getBBox();

	if(Coord.hasOwnProperty('x')) {	
		tx=Coord.x;
	}
	else{		
		tx=box.x;
	}
	
	if(Coord.hasOwnProperty('y')) {	
		ty=Coord.y;
	}
	else{		
		ty=box.y;
	}

	var boxT=this.obj.getBBox(true);
	var rx, ry;
	if(this.obj.matrix.a>0){
		if(this.obj.matrix.b>0){
			rx=(boxT.height)*this.obj.matrix.b
			ry=0;
		}
		else{			
			rx=0;
			ry=-1*(boxT.width)*this.obj.matrix.b;
		}
	}
	else{
		if(this.obj.matrix.b>0){
			rx=box.width;
			ry=-1*(boxT.height)*this.obj.matrix.a;
		}
		else{		
			rx=-1*(boxT.width)*this.obj.matrix.a;
			ry=box.height;
		}	
	}

	tx+=rx;
	ty+=ry;
	var x = this.obj.matrix.invert().x(tx, ty); 	
	var y = this.obj.matrix.invert().y(tx, ty);

	if(this.align=='right'){
		x+=boxT.width;
	}else if(this.align=='center'){
		x+=boxT.width/2;
	}
	y+=boxT.height/2;

	this.obj.attr({x:x, y:y});
};


Text.prototype.attr=function(Style){
	//we use move method to reposition the text
	delete Style.x;
	delete Style.y;
	this.obj.attr(Style);
};

