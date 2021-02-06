 /*********************************************************************
 * grid.js                                                    *
 *                                                                    *
 * Version: 1.2                                                       *
 * Date:    29-04-2018                                                *
 * Author:  Dan Machado                                               *
 * Require  raphaeljs v2.2.1                                          *
 **********************************************************************/
function Grid(objData){
	this.objData=objData;
	this.containerID=objData.canvasID;
	this.canvas=document.getElementById(objData.canvasID);
	this.containerWidth=this.canvas.clientWidth;
	this.containerHeight=this.canvas.clientHeight; // 1.618= golden ration
	this.paddingX=10;
	this.paddingY=5;
	this.scaleFactor=1;
};



Grid.prototype.defaultSettings={
	gridSettings:{
		bgColor:'#ffffff', //this.canvas.style.background='#a1a1a1';
		//scale
		scaleColor : '#0000ff',//'#ccd6eb',
		labelColor : '#666666',
		scaleFontSize : 12,
		scaleArea:45, //the width of the 
		'font-family' : "Arial, sans-serif",
		popUpA:{'maxWidth':200, paddingX:5, paddingY:5, justifyContent:'left', fill:'#ffffff', stroke:'#a1a1a1', 'stroke-width': 0.5, font:{fill:'#ff88ee', 'font-size':14, 'font-style':'normal', 'font-weight':'normal', 'font-family':''}},
		popUpB:{'maxWidth':300,  paddingX:5, paddingY:5, justifyContent:'left', fill:'#000000', stroke:'#a1a1a1', 'stroke-width': 0, font:{fill:'#ffffff', 'font-size':12, 'font-style':'normal', 'font-weight':'normal', 'font-family':''}},		
		extraMk:true,	
		mxDecimals:2,
	},
	title:{fill:'#000000', 'font-size':22, 'font-style':'normal','font-weight':'bold'},
	subTitle:{fill:'#000000','font-size':16, 'font-style':'normal','font-weight':'normal'},
	axisTitles : {fill:'#a18899','font-size':16, 'font-style':'normal','font-weight':'normal'},
	keys : {fill:'#000000','font-size':14, 'font-style':'normal','font-weight':'normal'},	
	additionalInfo: {fill:'#000000', 'font-size':12, 'font-style':'normal','font-weight':'normal'}
};

Object.freeze(Grid.prototype.defaultSettings);


Grid.prototype.setDefaults=function(){
	var a, b;

	var result=CloneObject(this.defaultSettings.gridSettings);

	complementObject(this.settings, result);

	if(this.objData.hasOwnProperty('gridSettings')){
		overWriteObj(result, this.objData.gridSettings);
	}
	
	var fontSettings=['title','subTitle','axisTitles','keys','additionalInfo'];	
	var i, len=fontSettings.length;
	for(i=0; i<len; i++){
		result[fontSettings[i]]={};
		complementObject(this.defaultSettings[fontSettings[i]], result[fontSettings[i]]);
		result[fontSettings[i]]['font-family']=result['font-family'];

		if(this.objData.hasOwnProperty(fontSettings[i]) && this.objData[fontSettings[i]].hasOwnProperty('font')){
			overWriteObj(result[fontSettings[i]], this.objData[fontSettings[i]].font);
		}
	}

	if(result.popUpA.font['font-family']==''){	
		result.popUpA.font['font-family']=result['font-family'];
	}	

	if(result.popUpB.font['font-family']==''){
		result.popUpB.font['font-family']=result['font-family'];
	}	

	this.settings=null;
	this.settings=result;
	this.settings.paddingA=20;
	this.settings.paddingB=10;
	this.settings.paddingC=5;
	this.settings.popUpA.miniPage=true;	
	this.settings.popUpB.miniPage=true;
	
};


Grid.prototype.setPaper=function(){
	this.paper=new Paper(this.containerID);

	this.topPanel=new MiniPage(this.paper, 5, 0, this.containerWidth-10, 0, {paddingX:0, paddingY:this.paddingY});//, {fill:'#ffffff','stroke-width':0});
	this.bottomPanel=new MiniPage(this.paper, 5, 0, this.containerWidth-10, 0, {paddingX:0, paddingY:this.paddingY});//, {fill:'#ffffff','stroke-width':0});	
	
	this.popUp=new MiniPage(this.paper, 0, 0, 100, 100, this.settings.popUpA);
	this.popUp.hide();

	this.canvas.style.backgroundColor=this.settings.bgColor;
};

/*
keys:
	position: top/bottom =>align left/right/center (space-around)
	position: left/right =>align top/middle/bottom
*/
Grid.prototype.setKeys=function() {
	var i, numKeys;
	
	if(!this.objData.hasOwnProperty('keys')){//} instanceof Object) {
		return;
	}

	if(this.containerWidth<400 && (this.objData.keys.position=='right' || this.objData.keys.position=='left')){
		this.objData.keys.position='bottom';
	}


	if(this.objData.keys.position=='top' || this.objData.keys.position=='bottom'){
		if(this.objData.keys.align=='center') {
			this.objData.keys.align='space-around';
		}
		this.keyBlock=new Group('inline', this.containerWidth-2*this.paddingX, this.objData.keys.align);
	}
	else{
		this.keyBlock=new Group('stocked', 'left');
	}

	if(this.objData.chartType=='columns' || this.objData.chartType=='bars' || this.objData.chartType=='donut' ||this.objData.chartType=='sunburst'|| this.objData.chartType=='lines') {
		var txt;
		numKeys=this.objData.dataSet.length;
		for(i=0; i<numKeys; i++){
			var row=new Row(0,0,'left');
			row.insert(new Rect(this.paper, 10, 10, 10, 10,{fill: this.objData.dataSet[i].color, 'stroke-width' : '0px'}));
			row.insertSpace(5);
			if(this.objData.chartType=='sunburst'){ 
			txt=this.objData.dataSet[i].name[0];
			}
			else{
				txt=this.objData.dataSet[i].name;
			}
			if(this.objData.chartType=='donut' || this.objData.chartType=='sunburst'){
				txt+=' '+this.objData.dataSet[i].data[0]+'%';
			}
			row.insert(new Text(this.paper, 25, 5, 160, 'after', 'left', txt, this.settings.keys));
			
			if(this.objData.keys.position=='top' || this.objData.keys.position=='bottom'){
				row.insertSpace(10);
			}
			this.keyBlock.insert(row);
		}
	}
	else if(this.objData.chartType=='bubbles'){
	}		
};


Grid.prototype.setTitle=function() {
	var align=1;
	if(this.objData.hasOwnProperty('title')){
		var title=new Text(this.paper, 0, 0, this.containerWidth, 'after', 'left', this.objData.title.text, this.settings.title);
		align=this.getAlignment.call(this.objData.title);
		this.topPanel.insert(new Wrapper(title, {w:this.containerWidth, align:align, vPadding:2}));
	}
	
	if(this.objData.hasOwnProperty('subTitle')){
		var subTitle=new Text(this.paper, 0, 0, this.containerWidth, 'after', 'left', this.objData.subTitle.text, this.settings.subTitle);
		align=this.getAlignment.call(this.objData.subTitle);
		this.topPanel.insert(new Wrapper(subTitle, {w:this.containerWidth, align:align, vPadding:1}));
	}
};

	/*
		top:set title.set subtitle

		bottom:set xtitle if any

		set keys if(they are meant to be top or bottom panel)

		set any additional info for top and bottom

		left:
			set keys (if required)
			set ytitle (if any)

		right:
			set ytitle (if required)
			set keys (if required)
	*/

Grid.prototype.getAlignment=function(){
	var align=1;
	if(this.hasOwnProperty('align')){
		if(this.align=='right'){
			align=99;
		}
		else if(this.align=='center'){
			align=50;
		}
	}
	return align;
};


Grid.prototype.setPanelsTB=function(){
	//README: setTitle needs to be called before this function.
	// set bottomPanel()
	if(this.objData.hasOwnProperty('axisTitles') && typeof this.objData.axisTitles.xTitle!=='undefined') {
		this.xTitle=new Wrapper(new Text(this.paper, 0, 0, this.containerWidth, 'after', 'left', this.objData.axisTitles.xTitle, this.settings.axisTitles), {w:this.containerWidth, align:55, vPadding:5});
		this.bottomPanel.insert(this.xTitle);
	}

	if(this.objData.hasOwnProperty('keys')){
		if(this.objData.keys.position=='top'){
			this.topPanel.insert(this.keyBlock);
		}
		else if(this.objData.keys.position=='bottom'){
			this.bottomPanel.insert(this.keyBlock);
		}
	}

	if(this.objData.hasOwnProperty('additionalInfo')){
		var i, l, tmp, align;
			aling=this.getAlignment.call(this.objData.additionalInfo[i]);
			
			if(this.objData.additionalInfo.position=='top'){
				
				this.topPanel.insert(new Wrapper(new Text(this.paper, 0, 0, this.containerWidth, 'after', 'left', this.objData.additionalInfo.content, this.settings.additionalInfo),
		 					{w:this.containerWidth, align:align, vPadding:5}));
			}
			else{
				this.bottomPanel.insert(new Wrapper(new Text(this.paper, 0, 0, this.containerWidth, 'after', 'left', this.objData.additionalInfo.content, this.settings.additionalInfo),
		 					{w:this.containerWidth, align:align, vPadding:5}));
			}
	}

	this.bottomPanel.insertSpace(5);
	this.topPanel.move({x:5, y:0});
};


Grid.prototype.preparePanelsLR=function(){
	var lw=0;
	var lh=0;
	var rw=0;
	var rh=0;
	var box;
	if(this.objData.hasOwnProperty('keys')){
		if(this.objData.keys.position=='left'){
			box=this.keyBlock.getBBox();
			lw=box.width;
			lh=box.height;
		}
		else if(this.objData.keys.position=='right'){
			box=this.keyBlock.getBBox();
			rw=box.width;
			rh=box.height;
		}
	}

	if(this.objData.hasOwnProperty('axisTitles') && typeof this.objData.axisTitles.yTitle!=='undefined') {
		this.yTitle=new Text(this.paper, 0, 0, this.containerWidth, 'after', 'left', this.objData.axisTitles.yTitle, this.settings.axisTitles);
		this.yTitle.attr({'transform' : "r-90,"+10+","+10 });
		box=this.yTitle.getBBox();
		lw+=box.width+this.paddingX;
		lh=Math.max(lh, box.height);
	}
	return {lw:lw, lh:lh, rw:rw, rh:rh};
};


Grid.prototype.setPanelsLR=function(){
	/* 
		README: it is better not to merge this block with the previous block		
	*/	
	var t=this.containerHeight-(this.bottomPanel.height+this.topPanel.height);

	this.leftPanel=new Row(0, t); 
	this.leftPanel.insertSpace(this.paddingX); 
	this.rightPanel=new Row(0, t);
	this.rightPanel.insertSpace(this.paddingX);

	if(this.objData.hasOwnProperty('keys')){
		var valign='top';
		if(this.objData.keys.hasOwnProperty('align')){
			valign=this.objData.keys.align;	
		}
		if(this.objData.keys.position=='left'){
			this.leftPanel.insert(this.keyBlock, valign);
			this.leftPanel.insertSpace(this.paddingX);
		}
		else if(this.objData.keys.position=='right'){
			this.rightPanel.insert(this.keyBlock, valign);
			this.rightPanel.insertSpace(this.paddingX);
		}
	}	

	if(this.objData.hasOwnProperty('axisTitles') && typeof this.objData.axisTitles.yTitle!=='undefined') {
		this.leftPanel.insert(this.yTitle, 'middle');
		this.leftPanel.insertSpace(this.paddingX);
	}

	this.leftPanel.move({y:this.topPanel.height});
	
	this.rightPanel.move({x:(this.containerWidth-this.rightPanel.getBBox().width), y:this.topPanel.height});
};


Grid.prototype.getScaleValues=function(x){
	var t=x;
	if(x<0.000001){
		t=(String)(x*10000000)+'/10M';
	}
	else if(x<0.00001){
		t=(String)(x*1000000)+'/1M';
	}	
	else if(x<0.0001){
		t=(String)(x*100000)+'/100k';
	}
	else if(x<0.001){
		t=(String)(x*10000)+'/10k';
	}
	else if(x<0.01){
		t=(String)(x*1000)+'/1k';
	}
	else if(x>=1000000){
		t=(String)(x/1000000)+'M';
	}
	else if(x>=1000){
		t=(String)(x/1000)+'k';
	}
	return t;
};

Grid.prototype.mkVScale=function(axisLength){
	var u=0, tmp=this.x0-this.settings.scaleArea-this.settings.paddingB;
	while(u<this.vScale.axisLength) {
		new Line(this.paper,this.x0, this.y0-u, this.x0+axisLength, this.y0-u, {stroke : this.settings.scaleColor});
		if(u>0){
			new Text(this.paper, tmp, this.y0-u, this.settings.scaleArea, 'middle', 'right', this.getScaleValues(this.vInvTransform(u)),  {fill : this.settings.labelColor, 'font-size':this.settings.scaleFontSize, 'font-family':this.settings['font-family']});
		}	
		u+=this.vScale.intervalLength;
	}

	u=this.vScale.axisLength;
	//last bit
	
	new Text(this.paper, tmp, this.y0-u, this.settings.scaleArea, 'middle', 'right', this.getScaleValues(this.vInvTransform(u)),  {fill : this.settings.labelColor, 'font-size':this.settings.scaleFontSize, 'font-family':this.settings['font-family']});
	new Line(this.paper, this.x0, this.y0-u, this.x0+axisLength, this.y0-u, {stroke : this.settings.scaleColor});
	
};


Grid.prototype.mkHScale=function(axisLength){
	var tmp, box, t, u=0;
	while(u<this.hScale.axisLength) {
		new Line(this.paper, this.x0+u, this.y0-axisLength, this.x0+u, this.y0, {stroke : this.settings.scaleColor});

		if(u>0) {
			tmp=new Text(this.paper, this.x0+u, this.y0+this.settings.paddingC, this.settings.scaleArea, 'after', 'left', this.getScaleValues(this.hInvTransform(u)),  {fill : this.settings.labelColor, 'font-size':this.settings.scaleFontSize, 'font-family':this.settings['font-family']});
			box=tmp.getBBox();
			t=box.x-box.width/2;
			tmp.move({x:t});
		}
		u+=this.hScale.intervalLength;
	}
	//last bit
	u=this.hScale.axisLength;
	tmp=new Text(this.paper, this.x0+u, this.y0+this.settings.paddingC, this.settings.scaleArea, 'after', 'left', this.getScaleValues(this.hInvTransform(u)),  {fill : this.settings.labelColor, 'font-size':this.settings.scaleFontSize, 'font-family':this.settings['font-family']});			
	box=tmp.getBBox();
	t=box.x-box.width/2;
	tmp.move({x:t});
	new Line(this.paper, this.x0+u, this.y0-axisLength, this.x0+u, this.y0, {stroke : this.settings.scaleColor});
};


Grid.prototype.transForm=function(x){
	if (x>0) {
		if(this.isLogarithmic){
			return this.factor*(Math.log10(x)+1-this.minEx);
		}
		else{		
			return this.factor*x;
		}
	}
	else {
		return 0;
	}
};


Grid.prototype.invTransForm=function(y, r){
	var p=6;
	if(typeof r==='number'){
		p=r;
	}

	var t=roundNumber(y/this.factor, r);
	if(this.isLogarithmic){
		return Math.pow(10, this.minEx-1+t);
	}
	else{
		return t;
	}
};


Grid.prototype.setScale=function(dataSet,doSomething){

	doSomething(this, dataSet);// get min and max values of the data

	if(this.max<this.min) {
		this.max=this.min;
	}

	//this.minVisualValue is the min segment that can be drawn as value
	if(this.minVisualValue>this.min*this.axisLength/this.max){
		this.isLogarithmic=true;

		var tmp=Math.ceil(Math.log10(this.max));

		this.minEx=Math.ceil(Math.log10(this.min))-1;

		if(tmp==this.minEx) {
			this.minEx--;
		}

		this.numIntervals=tmp-this.minEx+1;
		this.intervalLength=this.axisLength/this.numIntervals;
		
		if(this.intervalLength<40){
			this.intervalLength=40;
			this.axisLength=40*this.numIntervals;
		}

		this.factor=this.axisLength/(tmp-this.minEx+1);
	}
	else{
		
		this.factor=this.axisLength/this.max;
		var u=this.intervalLength/this.factor;
		var p=Math.pow(10,Math.ceil(Math.log10(u)));
	 	var t=[10, 5, 4, 2];
 		var i,v=p; // p=u
 
 		for(i=0; i<t.length; i++){
			if(u<p/t[i]){
				v=p/t[i];
				break;
			}
		}
		
		t=Math.ceil(this.max/v)*v; //MAX
		if(t==this.max && this.extraMk){
			t+=1/4*v; //MAX
		}
		this.factor=this.axisLength/t;
		this.intervalLength=v*this.factor;
	}	
};


Grid.prototype.printcategory=function(text, x, y, width, valign, align, popUp, containerID) {

	var txt=new Text(this.paper, -1500, 0, this.settings.popUpB.maxWidth, 'after', 'left', text, this.settings.popUpB.font);
	var txt1=txt.trimText(text, width, {'font-size':this.settings.categoryFontSize, 'font-family':this.settings['font-family']});

	var category=new Text(this.paper, x, y, width, valign, align, txt1, {fill : this.settings.labelColor, 'font-size':this.settings.categoryFontSize, 'font-family':this.settings['font-family']});

	if(txt1!=text) {
		var popUpSettings=this.settings.popUpB;
		var r=txt.getBBox();
	   var mxbw=r.width+2*popUpSettings.paddingX;
		var mxh=(r.height)+2*popUpSettings.paddingY;
		var x, y;
		var scaleFactor=this.scaleFactor;
		r=null;

		category.mouseover(function (e) {
			//console.log('asd');
			if(r==null){
				x=3+e.clientX-document.getElementById(containerID).getBoundingClientRect().left;
   			y=3+e.clientY-document.getElementById(containerID).getBoundingClientRect().top;
	   		r=1;

   			if(x+mxbw>document.getElementById(containerID).getBoundingClientRect().right) {
   				x-=mxbw;
	   		}
	   		
	   		x*=scaleFactor;
	   		y*=scaleFactor;
	   		popUp.setStyle('body',popUpSettings);
				popUp.reSize(mxbw, mxh);
				popUp.move({x:x, y:y});
				popUp.toShow();
				popUp.bound(txt, popUpSettings.paddingX, popUpSettings.paddingY);
				txt.toShow();
			}
		});

		category.mouseout(function () {
			txt.hide();
			popUp.hide();
			r=null;
		});
	}
};


Grid.prototype.moveLabel=function(e, mw, mh, textBlock, cbk){
	var clientBox=document.getElementById(this.containerID).getBoundingClientRect();
	var xpos=10+e.clientX;
	if(xpos+mw>clientBox.right){//-document.getElementById(containerID).getBoundingClientRect().left)) {
		xpos-=(mw+10);
	}
	xpos-=clientBox.left;
	xpos*=this.scaleFactor;

	var ypos=10+e.clientY;
	if(ypos+mh>clientBox.bottom) {
		ypos-=(mh+10);
	}
	ypos-=clientBox.top;	
	ypos*=this.scaleFactor;
	
	this.popUp.setStyle('body',this.settings.popUpA);
	this.popUp.reSize(mw, mh);
	this.popUp.move({x:xpos, y:ypos});
	this.popUp.toShow();
	this.popUp.bound(textBlock, this.settings.popUpA.paddingX, this.settings.popUpA.paddingY);
	textBlock.toShow();
};


Grid.prototype.scaleDown=function(){
	this.paper.setSize(this.containerWidth, this.containerHeight);
	this.paper.setViewBox(0, 0, this.scaleFactor*this.containerWidth, this.scaleFactor*this.containerHeight, true);
	this.canvas.style.height=(this.containerHeight/this.scaleFactor)+'px';
};
	
Grid.prototype.Reload=function(){
	this.paper.Clear();
};

