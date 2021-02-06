 /*********************************************************************
 * bars.js                                                    *
 *                                                                    *
 * Version: 1.2                                                       *
 * Date:    29-04-2018                                                *
 * Author:  Dan Machado                                               *
 * Require  raphaeljs v2.2.1                                          *
 **********************************************************************/
function Bars(objData){
	Grid.call(this, objData);
	this.settings={
							rowHeight : 30, //width of the space where the data will be written: set a max height so the rows adapt visually proportional
							barThickness:14, // the a max thickness too
							speed:500,
									// category 
							categoryBoxWidth : 160, // width of the vertical strip where, in the case of bar chart, the categories are printed
							categoryFontSize :12,
						};

	this.setDefaults();

	this.settings.rowHeight=Math.max(this.settings.rowHeight, this.settings.barThickness);

	this.setPaper();
	this.setKeys();	
	var lrBox=this.preparePanelsLR();

	this.x0=lrBox.lw+this.settings.paddingC+this.settings.paddingB+this.settings.categoryBoxWidth;
	this.xAxisLength=this.containerWidth-this.x0-this.settings.paddingC-lrBox.rw-this.settings.scaleArea/2;

	this.hScale={
			min:1000000,
			max:this.objData.dataSet[0].data[0],
			minEx:null,
			numIntervals:null,
			isLogarithmic:false,
			axisLength:this.xAxisLength,
			minVisualValue:10,
			intervalLength:80,
			factor:1,
			extraMk:this.settings.extraMk,
	};

	this.setScale.call(this.hScale, this.objData.dataSet, function(val, data) {
		var i, j, ilen, jlen, tmp;
		ilen=data.length;
		jlen=data[0].data.length; // we assume that every data has the same length (number of values)

		for(j=0;j<jlen; j++){
			tmp=0;
			for(i=0; i<ilen; i++) {
				if(data[i].data[j]>0) {
					if(val.min>Number(data[i].data[j])) {
						val.min=Number(data[i].data[j]);
					}
					tmp+=data[i].data[j];
				}
				if(val.max<tmp) {
					val.max=tmp;
				}
			}
		}
	});

	this.scaleFactor=1;
	var diff=0;
	if(this.hScale.axisLength!=this.xAxisLength){
		diff=this.hScale.axisLength-this.xAxisLength;
		this.scaleFactor=(this.containerWidth+diff)/this.containerWidth;
		this.containerWidth+=diff;//Note that this value will be used only to adjust the width of the paper and scale down
		//README: we do not need to adjust the container's width 
		//this.canvas.style.width=this.containerWidth+'px';
	}

	this.setTitle();
	this.setPanelsTB();
	
	var bBox=this.bottomPanel.getBBox();
	var tBox=this.topPanel.getBBox();

	this.yAxisLength=this.settings.rowHeight*this.objData.labels.length;
	this.y0=this.yAxisLength+this.settings.paddingC+tBox.height;

	this.containerHeight=this.yAxisLength+this.settings.paddingC;
	this.containerHeight+=tBox.height+bBox.height+this.settings.paddingA;

	var t=this.containerHeight-bBox.height;
	this.bottomPanel.move({y:t});

	this.setPanelsLR();

	var rBox=this.rightPanel.getBBox();
	
	var i, len;
	len=this.objData.dataSet.length;
	this.kyc=[]
	for(i=0; i<len; i++) {
		this.kyc[i]=new Rect(this.paper, -1000, -300, 10, 10,{fill: '#ffffff', 'stroke-width' : '0px'});
		this.kyc[i].hide();
	}

	var ilen=this.objData.dataSet.length;
	this.dataOrder=[];
	for(i=0; i<ilen; i++) {
		this.dataOrder[this.objData.dataSet[i]['name']]=i;
		this.kyc[i].attr({fill : this.objData.dataSet[i]['color']});
	}

	this.hTransform=this.transForm.bind(this.hScale);
	this.hInvTransform=this.invTransForm.bind(this.hScale);

	this.mkHScale(this.yAxisLength);

	this.printData();	
	
	this.scaleDown();

};


Bars.prototype=Object.create(Grid.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Bars,
		writable: true
	}
});


Bars.prototype.printData=function() {
	var i, j, keys, y;
	var ilen=this.objData.labels.length;
	var jlen=this.objData.dataSet.length;

	y=this.y0-this.yAxisLength;

	var tmp={};
	var tmpc={};
	var tmpv=[];

	for(i=0; i<ilen; i++){
		//print lables
		new Line(this.paper, this.x0-10, y, this.x0, y, {stroke : this.settings.scaleColor});
		this.printcategory(this.objData.labels[i], this.x0-this.settings.categoryBoxWidth-this.settings.paddingC, y+this.settings.rowHeight/2, this.settings.categoryBoxWidth, 'middle', 'left', this.popUp, this.containerID);

		//order data set
		var keys=[];
		var colors=[];
		for(j=0; j<jlen; j++){
			colors[j]=this.objData.dataSet[j]['color'];
			keys[j]=this.objData.dataSet[j]['name'];
		}

		for(j=0; j<jlen; j++){
			tmp[this.objData.dataSet[j]['name']]=this.objData.dataSet[j]['data'][i];
		   tmpc[this.objData.dataSet[j]['color']]=this.objData.dataSet[j]['data'][i];
		   tmpv[j]=this.objData.dataSet[j]['data'][i];
		}

		keys.sort(function(a,b){
			return tmp[a]-tmp[b];
		});

		colors.sort(function(a,b){
			return tmpc[a]-tmpc[b];
		});

		tmpv.sort(function(a,b) {
			return a-b;
		});

		var orderr=[];
		for(j=0; j<jlen; j++) {
			orderr[this.dataOrder[keys[j]]]=j;
		}

		this.stockedLogData((this.settings.rowHeight/2)+y-this.settings.barThickness/2, tmpv, colors, keys, this.objData.labels[i], orderr);
		y+=this.settings.rowHeight;

		tmp=null;
		tmp={};
	}

	// last
	new Line(this.paper, this.x0-10, y, this.x0, y, {stroke : this.settings.scaleColor});
};


Bars.prototype.stockedBars=function(y, t, v, c, i, id){
	if(i<v.length){
		var rt=t+v[i];
		var ms=Math.round(1000*(this.hTransform(rt)-this.hTransform(t))/this.settings.speed);
		new AnimateHBar(this.paper, this.x0+this.hTransform(t), y, this.hTransform(rt)-this.hTransform(t), this.settings.barThickness, ms, {fill : c[i], 'stroke-width' : '0px'});
		this.paper.getById(id).toFront();
		i++;
		setTimeout(function(){
			this.stockedBars(y,rt,v,c, i, id);	
		}.bind(this), ms);
	}
};


Bars.prototype.stockedLogData=function(y, vals, colors, keys, label, orderr){

	var y=y, vals=CloneObject(vals), colors=CloneObject(colors), keys=CloneObject(keys), label=label, orderr=CloneObject(orderr);

	(function () {	
		
		setTimeout(function () {	
			var i, len;
			len=vals.length;
			var x, t=0;
			for(i=0; i<len; i++) {
				t+=vals[i];
			}
			x=this.hTransform(t);
			
			var bar=new Rect(this.paper, this.x0, y, x, this.settings.barThickness, {fill:'#ffffff','fill-opacity':0.0, 'stroke-opacity':0.0});

			this.stockedBars(y, 0, vals, colors, 0, bar.getId());	
			
			var texts=new Group('stocked', this.settings.popUpA.justifyContent);
			texts.insert(new Text(this.paper, 0, 0, this.settings.popUpA.maxWidth, 'after', 'left', label, {fill : this.settings.popUpA.font.fill, 'font-size':this.settings.popUpA.font['font-size'], "font-weight": '500', 'font-family':this.settings.popUpA.font['font-family']}));
			texts.insertSpace(5);
			
			for(i=0; i<len; i++) {
				var tmp=new Row();
				tmp.insert(this.kyc[i], 'middle');
				tmp.insertSpace(5);
				tmp.insert(new Text(this.paper, 0, 0, this.settings.popUpA.maxWidth, 'after', 'left', keys[orderr[i]] +' '+formatNumber(vals[orderr[i]], this.settings.mxDecimals), this.settings.popUpA.font));
				texts.insert(tmp);
			}
			texts.hide();
			/**/
			var r=texts.getBBox();
			var mxw=r.width+2*this.settings.popUpA.paddingX;
			var mxh=r.height+2*this.settings.popUpA.paddingY;

			var popUp=this.popUp;
			r=null;

			bar.mouseover(function(e) {
				if(r==null){
					r=1;
					this.moveLabel(e, mxw, mxh, texts, function(xp, yp){});
				}
			}.bind(this));

			bar.mouseout(function () {
				texts.hide();
				popUp.hide();
				r=null;
			});	
		}.bind(this), Math.round(Math.random()*100)*10);
	}.bind(this))();
};



