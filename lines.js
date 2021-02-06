 /*********************************************************************
 * lines.js                                                    *
 *                                                                    *
 * Version: 1.2                                                       *
 * Date:    29-04-2018                                                *
 * Author:  Dan Machado                                               *
 * Require  raphaeljs v2.2.1                                          *
 **********************************************************************/
 
function Lines(objData){
	Grid.call(this, objData);

	this.containerHeight=this.containerWidth/1.618;
	this.canvas.style.height=this.containerHeight+'px';

	this.settings={
							minDataInterval:35, // gab between each record (or point)
							'line-width':2,
							elapsedTime:2000,
						};

	this.setDefaults();
	this.setPaper();
	this.setKeys();
	var lrBox=this.preparePanelsLR();

	this.x0=lrBox.lw+this.settings.paddingC+this.settings.paddingB+this.settings.scaleArea/2;
	this.xAxisLength=this.containerWidth-(this.x0+this.settings.paddingA+lrBox.rw);
	
	this.setTitle();
	this.setPanelsTB();

	var bBox=this.bottomPanel.getBBox();
	var tBox=this.topPanel.getBBox();

	this.yAxisLength=this.containerHeight-(tBox.height+bBox.height+this.settings.paddingC+this.settings.paddingB+(3/5)*this.settings.paddingA);

	this.vScale={
			min:1000000,
			max:this.objData.dataSet[0].data[0],
			minEx:null,
			numIntervals:null,
			isLogarithmic:false,
			axisLength:this.yAxisLength,
			minVisualValue:10,
			intervalLength:80,
			factor:1
	};

	this.setScale.call(this.vScale, this.objData.dataSet, function(val, data) {
		var i, j, ilen, jlen;
		ilen=data.length;
		jlen=data[0].data.length;

		for(i=0;i<ilen; i++){
			for(j=0; j<jlen; j++) {
				if(data[i].data[j]>0) {
					if(val.min>Number(data[i].data[j])) {
						val.min=Number(data[i].data[j]);
					}
	
					if(val.max<Number(data[i].data[j])) {
						val.max=Number(data[i].data[j]);
					}
				}
			}
		}
	});


		//README: the chart does not scale down vertically
	//this.yScaleFactor=1;
	//var yDiff=0;
	if(this.vScale.axisLength!=this.yAxisLength){
		this.containerHeight+=(this.vScale.axisLength-this.yAxisLength);
		this.canvas.style.height=this.containerHeight+'px';
	}
//##########################################
//##########################################

	this.setPanelsLR();

	var t=this.containerHeight-bBox.height;
	this.bottomPanel.move({y:t});
	
	this.y0=t-(this.settings.paddingB+(3/5)*this.settings.paddingA);

	this.vTransform=this.transForm.bind(this.vScale);
	this.vInvTransform=this.invTransForm.bind(this.vScale);

	this.mkVScale(this.xAxisLength);

	this.hScale();

	this.ms=Math.round(this.settings.ms/this.objData.dataSet[0].data.length);

	this.printSeries(0);
	
	this.paper.setSize(this.containerWidth, this.containerHeight);
};


Lines.prototype=Object.create(Grid.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Lines,
		writable: true
	}
});



Lines.prototype.hScale=function(){

	var len=this.objData.serie.length;
	var r=len;
	var tmp=(this.xAxisLength-this.settings.paddingA)/(r-1);
	var jump=1;

	while(this.settings.minDataInterval>tmp){
		jump++;
		r=Math.floor(len/jump);
		tmp=(this.xAxisLength-this.settings.paddingA)/r;
	}

	this.settings.minDataInterval=(this.xAxisLength-this.settings.paddingA)/(len-1);

	this.firstPoint=this.x0+this.settings.paddingA/2;
	var x, i=0, ilen;
	x=this.firstPoint;
	ilen=this.objData.serie.length;

	for(i=0; i<ilen; i++){
		if(i%jump==0){//} || i==ilen-1) {
			new Line(this.paper, x, this.y0+5, x, this.y0, {stroke : this.settings.scaleColor});
			this.printcategory(this.objData.serie[i], x-(this.settings.scaleArea/2), this.y0+2+this.settings.scaleFontSize, this.settings.scaleArea, 'after', 'center', this.popUp, this.containerID);
		}
		x+=this.settings.minDataInterval;	
	}
};


Lines.prototype.printSeries=function(k){
	var x1, y1, x2, y2, ilen, jlen;
	ilen=this.objData.serie.length;
	jlen=this.objData.dataSet.length;
	var i=k;
	var j;

	for(j=0; j<jlen; j++){
		x1=this.firstPoint+i*this.settings.minDataInterval;
		y1=this.y0-this.vTransform(this.objData.dataSet[j].data[i]);
		this.recordPoint(i, j, x1, y1);
		if(i<ilen-1){
			x2=x1+this.settings.minDataInterval;
			y2=this.y0-this.vTransform(this.objData.dataSet[j].data[i+1]);
		
			new AnimateLine(this.paper, x1, y1, x2, y2, this.ms, {'stroke':this.objData.dataSet[j].color, 'stroke-width':this.settings['line-width']+'px'});
		}
	}

	if(i<ilen-1){
		setTimeout(function(){
			i++;
			this.printSeries(i);
		}.bind(this), this.ms);
	}
};


Lines.prototype.recordPoint=function(i, j, x, y) {

	var i=i, j=j, x=x, y=y;
	
	(function () {			
		setTimeout(function () {
			var popUp=this.popUp;
			var objData=this.objData;
			var ty, r, txt;

			var textBlock=new Group('stocked', this.settings.popUpA.justifyContent);
			textBlock.insert(new Text(this.paper, -500, this.y0, this.settings.popUpA.maxWidth, 'after', 'left', this.objData.serie[i], {fill : this.settings.popUpA.font.fill, 'font-size':this.settings.popUpA.font['font-size'], 'font-style':this.settings.popUpA.font['font-style'],'font-weight':'bold', 'font-family':this.settings.popUpA['font-family']}));
			textBlock.insertSpace(5);

			txt=this.objData.dataSet[j].name+' '+formatNumber(this.objData.dataSet[j].data[i], this.settings.mxDecimals);
			textBlock.insert(new Text(this.paper, -500, 0, this.settings.popUpA.maxWidth, 'after', 'left', txt, this.settings.popUpA.font));
			textBlock.hide();
			
			var box=textBlock.getBBox();
			var mxw=box.width, mxh=box.height;
			mxh+=2*this.settings.popUpA.paddingX;
			mxw+=2*this.settings.popUpA.paddingY;

			var tt=new Circle(this.paper, x, y, this.settings['line-width']*1.75, {fill:this.objData.dataSet[j].color, 'stroke-width':8, stroke:this.objData.dataSet[j].color,  'stroke-opacity':0.0 });

			r=null;
			tt.mouseover(function (e) {

				if(r==null){
					tt.attr({'stroke-opacity':0.5});
					r=1;
					this.moveLabel(e, mxw, mxh,textBlock,function(xp, yp){});
				}
			}.bind(this));

			tt.mouseout(function () {
				tt.attr({'stroke-opacity':0.0});
				textBlock.hide();
				popUp.hide();
				r=null;
			});			
		}.bind(this), 100);
	}.bind(this))();
};



