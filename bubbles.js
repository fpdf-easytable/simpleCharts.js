
function BubbleChart(objData){
	Grid.call(this, objData);
	
	this.containerHeight=this.containerWidth/1.618;
	this.canvas.style.height=this.containerHeight+'px';

	this.settings={
							bubbleStyle:{fill:'#bddaf5', stroke:'#7aaadc'}
					};

	this.setDefaults();

	this.setPaper();
	this.setKeys();
	var lrBox=this.preparePanelsLR();

	this.x0=lrBox.lw+this.settings.paddingC+this.settings.paddingB+this.settings.scaleArea/2;
	this.xAxisLength=this.containerWidth-(this.x0+this.settings.paddingC+lrBox.rw);

	this.hScale={
			min:1000000,
			max:this.objData.dataSet[0].data[0],
			minEx:null,
			numIntervals:null,
			isLogarithmic:false,
			axisLength:this.xAxisLength,
			minVisualValue:10,
			intervalLength:80,
			factor:1
	};

	this.setScale.call(this.hScale, this.objData.dataSet, function(val, data) {
		var i, ilen;
		ilen=data.length;

		for(i=0;i<ilen; i++){
			if(data[i].data[0]>0){
				if(val.min>Number(data[i].data[0])) {
					val.min=Number(data[i].data[0]);
				}
				else if(val.max<Number(data[i].data[0])) {
					val.max=Number(data[i].data[0]);
				}
			}
		}
	});

	this.scaleFactor=1;
	var xDiff=0;
	if(this.hScale.axisLength!=this.xAxisLength){
		xDiff=this.hScale.axisLength-this.xAxisLength;
		this.scaleFactor=(this.containerWidth+xDiff)/this.containerWidth;
		this.containerWidth+=xDiff;
		//README: we do not need to adjust the container's width 
		//this.canvas.style.width=this.containerWidth+'px';
	}
	
	this.setTitle();
	this.setPanelsTB();
	
	//	set axes
	var tBox=this.topPanel.getBBox();	
	var bBox=this.bottomPanel.getBBox();

	this.yAxisLength=this.containerHeight-(tBox.height+bBox.height+this.settings.paddingC+this.settings.paddingB+(3/5)*this.settings.paddingA);

	this.vScale={
			min:1000000,
			max:this.objData.dataSet[0].data[1],
			minEx:null,
			numIntervals:null,
			isLogarithmic:false,
			axisLength:this.yAxisLength,
			minVisualValue:10,
			intervalLength:80,
			factor:1
	};

	this.setScale.call(this.vScale, this.objData.dataSet, function(val, data) {
		var i, ilen;
		ilen=data.length;

		for(i=0;i<ilen; i++){
			if(data[i].data[1]>0){
				if(val.min>data[i].data[1]) {
					val.min=data[i].data[1];
				}
				else if(val.max<data[i].data[1]) {
					val.max=data[i].data[1];
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

	this.vTransform=this.transForm.bind(this.vScale);
	this.vInvTransform=this.invTransForm.bind(this.vScale);

	this.hTransform=this.transForm.bind(this.hScale);
	this.hInvTransform=this.invTransForm.bind(this.hScale);

	this.mkVScale(this.hScale.axisLength);
	this.mkHScale(this.vScale.axisLength);

	var dataSetLength=objData.dataSet.length;

	var ord=[];
	for(i=0; i<dataSetLength; i++) {
		ord[i]=i;
	}

	ord.sort(function(a,b){
		return objData.dataSet[b].data[2]-objData.dataSet[a].data[2];
	});

	for(i=0; i<dataSetLength; i++) {
		this.printBubble(ord[i], objData);
		var ii=ord[i];

	}

	this.scaleDown();
	/*
	this.paper.setSize(this.containerWidth, this.containerHeight);
	this.paper.setViewBox(0, 0, this.scaleFactor*this.containerWidth, this.scaleFactor*this.containerHeight, true);
	this.canvas.style.height=(this.containerHeight/this.scaleFactor)+'px';
	/**/
};


BubbleChart.prototype=Object.create(Grid.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: BubbleChart,
		writable: true
	}
});




BubbleChart.prototype.printBubble=function(i, objData){
	var i=i;
	(function () {		
		setTimeout(function () {
			var objData=this.objData;
			var popUp=this.popUp;
			var maxTextWidth=this.settings.popUpA.maxWidth;
			var v, j, ty;
	
			var textBlock=new Group('stocked',this.settings.popUpA.justifyContent);
			textBlock.insert(new Text(this.paper, -500, 0, maxTextWidth, 'after', 'left', objData.dataSet[i].name, {fill : this.settings.popUpA.font.fill, 'font-size':this.settings.popUpA.font['font-size'], 'font-weight':'bold', 'font-family':this.settings.popUpA.font['font-family']}));
			textBlock.insertSpace(5);
			var txt=[objData.dataNames[0]+' '+formatNumber(objData.dataSet[i].data[0],this.settings.mxDecimals), objData.dataNames[1]+' '+formatNumber(objData.dataSet[i].data[1], this.settings.mxDecimals), objData.dataNames[2]+' '+objData.dataSet[i].data[2]];
			for(j=0; j<3; j++){
				textBlock.insert(new Text(this.paper, -500, 0, maxTextWidth, 'after', 'left', txt[j], this.settings.popUpA.font));
			}
			textBlock.hide();
			//console.log(this.settings.popUpA.paddingX);
			var mxw=textBlock.width, mxh=textBlock.height;
			mxh+=2*this.settings.popUpA.paddingX;
			mxw+=2*this.settings.popUpA.paddingY;

			var bubble=new AnimateCircle(this.paper, this.x0+this.hTransform(objData.dataSet[i].data[0]), this.y0-this.vTransform(objData.dataSet[i].data[1]), 7+10*Math.log10(objData.dataSet[i].data[2]), {fill:this.settings.bubbleStyle.fill,'fill-opacity':0.8, stroke:this.settings.bubbleStyle.stroke, 'stroke-opacity':0.8});

			r=null;

			bubble.mouseover(function(e){

				if(r==null){
					r=true;
					bubble.attr({'stroke-width' : '2px'});
					
					this.moveLabel(e, mxw, mxh, textBlock);
				}
			}.bind(this));

			bubble.mouseout(function () {
				bubble.attr({'stroke-width' : '1px'});
				textBlock.hide();
				popUp.hide();
				r=null;
			});
		}.bind(this), 10);
	}.bind(this))();
};
