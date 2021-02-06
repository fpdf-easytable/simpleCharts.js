 /*********************************************************************
 * sunburst.js                                                    *
 *                                                                    *
 * Version: 1.2                                                       *
 * Date:    29-04-2018                                                *
 * Author:  Dan Machado                                               *
 * Require  raphaeljs v2.2.1                                          *
 **********************************************************************/
function SunburstChart(objData){
	Grid.call(this, objData);
	// setDefaults
	this.settings={
							donutRation :0.3,
							maxDonutFont:50,
							orderData:true,
						};

	this.setDefaults();
	this.setPaper();
	
	this.setTitle();
	this.setKeys();
	
	this.setPanelsTB();
	var tBox=this.topPanel.getBBox();
	var bBox=this.bottomPanel.getBBox();

	var lrBox=this.preparePanelsLR();

	var dim=this.containerWidth-(lrBox.lw+lrBox.rw+2*this.settings.paddingA);
	this.donutWidth=(dim/2*Math.min(0.8, Math.max(this.settings.donutRation, 0)))/this.objData.dataSet[0].data.length;
	this.radious=dim/2-this.objData.dataSet[0].data.length*(this.donutWidth);
	
	this.x0=lrBox.lw+this.settings.paddingA+dim/2;
	this.y0=tBox.height+this.settings.paddingA+dim/2;

	this.containerHeight=this.y0+this.settings.paddingA+dim/2+bBox.height;

	var t=this.containerHeight-bBox.height;
	this.bottomPanel.move({y:t});

	this.setPanelsLR();

	this.cAngle=-3*Math.PI/2;
	
	this.mkLabels();

	var ord=[];	
	var dataSetLength=this.objData.dataSet.length;
	var i;
	for(i=0; i<dataSetLength; i++){
		ord[i]=i;
	}

	if(this.settings.orderData) {
		ord.sort(function(a,b){
			return this.objData.dataSet[a].data-this.objData.dataSet[b].data;
		});
	}

	this.labels[ord[dataSetLength-1]].show();
	this.dataTest={a:ord[dataSetLength-1]};

	var data=[];
	for(i=0; i<dataSetLength; i++) {
		data[i]=this.objData.dataSet[ord[i]].data[0];
	}

	this.printArch(this.cAngle, data, ord, 0, 0, 700, 0, 0);
	
	this.canvas.style.height=this.containerHeight+'px';
	this.paper.setSize(this.containerWidth, this.containerHeight);
};


SunburstChart.prototype=Object.create(Grid.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: SunburstChart,
		writable: true
	}
});



SunburstChart.prototype.printArch=function(startAngle, data, ord, i, j, ms, g, rt){//perc, color){
	if(i<data.length){
		var perc=data[i];

		var color=changeColor(this.objData.dataSet[ord[j]].color, i*g*(0.20));

		if(g<1){
			var tmpdata=[];
			for(k=0; k<this.objData.dataSet[ord[i]].data[1].length; k++) {
				tmpdata[k]=this.objData.dataSet[ord[i]].data[1][k];
			}
			this.printArch(startAngle, tmpdata, ord, 0, j, Math.floor(ms/this.objData.dataSet[ord[i]].data[1].length), g+1, ord[i]);
		}

		var donutArch=new AnimatedArch(this.paper, startAngle, perc, this.x0, this.y0, this.radious+g*this.donutWidth, this.donutWidth, ms, {fill:color, stroke:color,'stroke-width' : '0px'});
		donutArch.attr({'stroke-width':'1px', stroke:'#ffffff'});

		if(g==0){
			var labels=this.labels;
			var current=this.dataTest;
			var ii=i;
	
			if(ii!=current.a) {
				labels[current.a].hide();
				current.a=ii;
				labels[ii].show();				
			}

			var r=null;
			donutArch.mouseover(function (e) {
				if(r==null){
					if(ii!=current.a) {
						labels[current.a].hide();
						current.a=ii;
						labels[ii].show();				
					}
					
					donutArch.attr({fill:changeColor(color, 0.5)});
					r=1;
				}
			}.bind(this));
	
			donutArch.mouseout(function () {
				donutArch.attr({fill:color});
				r=null;		
			});
		
			var j=j+1;	
		}
		else{
			var texts=new Group('stocked', this.settings.popUpA.justifyContent);
			texts.insert(new Text(this.paper, 0, 0, this.settings.popUpA.maxWidth, 'after', 'left', this.objData.dataSet[rt].name[0], {fill : this.settings.popUpA.font.fill, 'font-size':this.settings.popUpA.font['font-size'], "font-weight": '500', 'font-family':this.settings.popUpA.font['font-family']}));
			texts.insertSpace(5);
			
			var tmp=new Row();
			tmp.insert(new Text(this.paper, 0, 0, this.settings.popUpA.maxWidth, 'after', 'left', this.objData.dataSet[rt].name[g][i] +' '+formatNumber(data[i], this.settings.mxDecimals), this.settings.popUpA.font));
			texts.insert(tmp);
			texts.hide();
			/**/
			var r=texts.getBBox();
			var mxw=r.width+2*this.settings.popUpA.paddingX;
			var mxh=r.height+2*this.settings.popUpA.paddingY;

			r=null;

			donutArch.mouseover(function(e) {
				if(r==null){
					r=1;
					this.moveLabel(e, mxw, mxh, texts, function(xp, yp){});
					donutArch.attr({fill:changeColor(color, 0.5)});
				}
			}.bind(this));

			donutArch.mouseout(function () {
				donutArch.attr({fill:color});
				texts.hide();
				this.popUp.hide();
				r=null;
			}.bind(this));
			
			
		}

		i++;
		
		setTimeout(function(){
			this.printArch(startAngle+(2*Math.PI*perc/100), data, ord, i, j, ms, g, rt);
		}.bind(this), ms);
	}
};

 
SunburstChart.prototype.mkLabels=function(){
	this.labels=[];
	var mrg=10;
	var i, dataSetLength, xx, yy, box, t, p, scale;
	dataSetLength=this.objData.dataSet.length;

	for(i=0; i<dataSetLength; i++) {
		
		this.labels[i]=new Group('stocked', 'center');
		xx=yy=0;
		
		this.labels[i].insert(new Text(this.paper, 0, 0, 2*(this.radious+this.donutWidth), 'after', 'center', this.objData.dataSet[i].name[0], {fill : this.objData.dataSet[i].color, 'font-size':this.settings.maxDonutFont,  'font-family':this.settings['font-family']}));			
		this.labels[i].insert(new Text(this.paper, 0, 0, 2*(this.radious+this.donutWidth), 'after', 'center', this.objData.dataSet[i].data[0]+'%', {fill : this.objData.dataSet[i].color, 'font-size':Math.floor(this.settings.maxDonutFont*0.8),  'font-family':this.settings['font-family']}));

		box=this.labels[i].getBBox();

		xx=this.x0-box.width/2-mrg/2;
		yy=this.y0-box.height/2;

		t=Math.sqrt((box.width+mrg)*(box.width+mrg)+box.height*box.height);
		p=Math.min(1, 2*this.radious/t);
		scale='s'+p+','+p+','+this.x0+','+this.y0;
		
		this.labels[i].move({x:xx, y:yy});
		this.labels[i].Scale(scale);
		this.labels[i].hide();
	}
};





