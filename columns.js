function Columns(objData){
	Grid.call(this, objData);

	this.containerHeight=this.containerWidth/1.618;
	this.canvas.style.height=this.containerHeight+'px';

	this.settings={
							maxColumnWidth : 60,
							columnPadding : 15, // gab between each column
							groupColumnPadding :50, // padding between each group of columns
						};

	this.setDefaults();
	this.setPaper();
	this.setKeys();	
	var lrBox=this.preparePanelsLR();

	this.x0=lrBox.lw+this.settings.paddingC+this.settings.paddingB+this.settings.scaleArea/2;
	this.xAxisLength=this.containerWidth-(this.x0+this.settings.paddingA+lrBox.rw);

	var numColumnsPerGroup=this.objData.dataSet.length; // num of columns in each group (series)
	var numGroups=this.objData.dataSet[0].data.length; // num of groups (series)

	var tmp=this.xAxisLength/numGroups;
	var tmp1=this.settings.groupColumnPadding+numColumnsPerGroup*this.settings.maxColumnWidth+(numColumnsPerGroup-1)*this.settings.columnPadding;

	this.scaleFactor=1;
	var diff=0;
	var mxC=20;
	if(tmp1>tmp){
		var k=tmp/tmp1;
		if(k*this.settings.maxColumnWidth<mxC){
			k=mxC/this.settings.maxColumnWidth;
			diff=k*tmp1*numGroups-this.xAxisLength;
			this.scaleFactor=(this.containerWidth+diff)/this.containerWidth;
			this.containerWidth+=diff;
			this.xAxisLength=k*tmp1*numGroups;
			tmp=tmp1*k;
		}
		this.settings.maxColumnWidth=k*this.settings.maxColumnWidth;
		this.settings.columnPadding=k*this.settings.columnPadding;
		this.settings.groupColumnPadding=k*this.settings.groupColumnPadding;
	}
	else if(tmp1<tmp){
		this.settings.groupColumnPadding+=(tmp-tmp1);
	}

	this.setTitle();
	this.setPanelsTB();

	var bBox=this.bottomPanel.getBBox();
	var tBox=this.topPanel.getBBox();

	//this.yAxisLength=this.y0-(tBox.y+tBox.height+this.settings.paddingC);

	this.yAxisLength=this.containerHeight-(tBox.height+bBox.height+this.settings.paddingC+this.settings.paddingB+(3/5)*this.settings.paddingA);

	this.vScale={
			min:1000000,
			max:this.objData.dataSet[0].data[0],
			minEx:null,
			numIntervals:null,
			isLogarithmic:false,
			axisLength:this.yAxisLength,
			minVisualValue:10, // the min segment that can be drawn as value
			intervalLength:80,
			factor:1,
			extraMk:this.settings.extraMk,
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
		//yDiff=this.vScale.axisLength-this.yAxisLength;
		//this.yScaleFactor=(this.containerHeight+yDiff)/this.containerHeight;
		this.containerHeight+=(this.vScale.axisLength-this.yAxisLength);
		this.canvas.style.height=this.containerHeight+'px';
	}

	this.setPanelsLR();
	
	var t=this.containerHeight-bBox.height;
	this.bottomPanel.move({y:t});
	
	this.y0=t-(this.settings.paddingB+(3/5)*this.settings.paddingA);
	/*
	console.log(this.getScaleValues(0.02));
	console.log(this.getScaleValues(0.001));
	console.log(this.getScaleValues(0.0001));
	console.log(this.getScaleValues(0.00002));
	console.log(this.getScaleValues(0.000002));
	//console.log(this.getScaleValues(0.0000002));
/**/
	this.vTransform=this.transForm.bind(this.vScale);
	this.vInvTransform=this.invTransForm.bind(this.vScale);

	//console.log(this.vScale.isLogarithmic);

	this.mkVScale(this.xAxisLength);

	this.setCathegories(tmp);
// *
	this.printSeries(numGroups, numColumnsPerGroup);
	
	this.scaleDown();
	/*
	
	this.paper.setSize(this.containerWidth, this.containerHeight);
	this.paper.setViewBox(0, 0, this.scaleFactor*this.containerWidth, this.scaleFactor*this.containerHeight, true);
	this.canvas.style.height=(this.containerHeight/this.scaleFactor)+'px';
/**/
};


Columns.prototype=Object.create(Grid.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Columns,
		writable: true
	}
});



Columns.prototype.setCathegories=function(groupColumnWidth){
	var i, llength=this.objData.dataSet[0].data.length;
	var x=this.x0;
	for(i=0; i<llength+1; i++) {

		new Line(this.paper, x, this.y0, x, this.y0+10,{stroke : this.settings.scaleColor});

		if(i<llength) {
			this.printcategory(this.objData.labels[i], x, this.y0+10, groupColumnWidth, 'after', 'center', this.popUp, this.containerID);
		}
		x+=groupColumnWidth;
	}
};


Columns.prototype.printSeries=function(numGroups, numColumnsPerGroup) {
	var x, i, j;
	x=this.x0+(this.settings.groupColumnPadding/2);

	for(i=0; i<numGroups; i++) {
		this.columnGroup(i, numColumnsPerGroup, x);
		x+=(this.settings.groupColumnPadding-this.settings.columnPadding);
		x+=numColumnsPerGroup*(this.settings.columnPadding+this.settings.maxColumnWidth);
	}
};


Columns.prototype.columnGroup=function (i, numColumnsPerGroup, xp) {

	var i=i, numColumnsPerGroup=numColumnsPerGroup, xp=xp;

	(function () {			
		setTimeout(function () {
			var popUp=this.popUp;
			var objData=this.objData;
			var j, x, ty, r, txt;
			x=xp;

			var textBlock=new Group('stocked', this.settings.popUpA.justifyContent);
			textBlock.insert(new Text(this.paper, -500, this.y0, this.settings.popUpA.maxWidth, 'after', 'left', objData.labels[i],  {fill : this.settings.popUpA.font.fill, 'font-size':this.settings.popUpA.font['font-size'], "font-weight": '500', 'font-family':this.settings.popUpA.font['font-family']}));
			textBlock.insertSpace(5);

			for(j=0; j<numColumnsPerGroup; j++) {

				new AnimateVBar(this.paper, x, this.y0, this.settings.maxColumnWidth, this.vTransform(objData.dataSet[j].data[i]), {fill: objData.dataSet[j].color, 'sfill-opacity':0.8, 'stroke-width' : '0px'});
				x+=this.settings.columnPadding+this.settings.maxColumnWidth;

				txt=this.objData.dataSet[j].name+' '+formatNumber(this.objData.dataSet[j].data[i], this.settings.mxDecimals);
				textBlock.insert(new Text(this.paper, -500, 0, this.settings.popUpA.maxWidth, 'after', 'left', txt, this.settings.popUpA.font));
			}
			textBlock.hide();
			var mxw=textBlock.width, mxh=textBlock.height;
			mxh+=2*this.settings.popUpA.paddingX;
			mxw+=2*this.settings.popUpA.paddingY;

			var tt=new Rect(this.paper, xp, 0, x-xp-this.settings.columnPadding, this.y0, {fill:'#ffffff','fill-opacity':0.0, 'stroke-opacity':0.0});
			r=null;
			tt.mouseover(function (e) {

				if(r==null){
					r=1;
					this.moveLabel(e, mxw, mxh,textBlock,function(xp, yp){});
				}
			}.bind(this));

			tt.mouseout(function () {
				textBlock.hide();
				popUp.hide();
				r=null;
			});			
		}.bind(this), 100);
	}.bind(this))();
};



