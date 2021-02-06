 /*********************************************************************
 * donut.js                                                    *
 *                                                                    *
 * Version: 1.2                                                       *
 * Date:    29-04-2018                                                *
 * Author:  Dan Machado                                               *
 * Require  raphaeljs v2.2.1                                          *
 **********************************************************************/
function DonutChart(objData){
	Grid.call(this, objData);
	// setDefaults
	this.settings={
							donutRation :0.3,
							maxDonutFont:50,
							//elapsedTime:3000,
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

   this.donutWidth=dim/2*Math.min(0.8, Math.max(this.settings.donutRation, 0));

	this.radious=dim/2-this.donutWidth;
	
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
	for(i=0; i<dataSetLength; i++) {
		ord[i]=i;
	}

	if(this.settings.orderData) {
		(function(rt){
			ord.sort(function(a,b){
				return rt.dataSet[a].data-rt.dataSet[b].data;
			});
		})(this.objData);
	}

	this.labels[ord[dataSetLength-1]].show();
	this.dataTest={a:ord[dataSetLength-1]};

	this.printArch(ord, 0);

	this.canvas.style.height=this.containerHeight+'px';
	this.paper.setSize(this.containerWidth, this.containerHeight);
};


DonutChart.prototype=Object.create(Grid.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: DonutChart,
		writable: true
	}
});



DonutChart.prototype.printArch=function(ord, i){
	if(i<this.objData.dataSet.length){
		var j=ord[i];
		var perc=this.objData.dataSet[j].data;

		var ms=700;
		var donutArch=new AnimatedArch(this.paper, this.cAngle, perc, this.x0, this.y0, this.radious, this.donutWidth, ms, {fill:this.objData.dataSet[j].color, stroke:this.objData.dataSet[j].color,'stroke-width' : '0px'});
		
		var labels=this.labels;
		var current=this.dataTest;
		var ii=j;

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
					
				donutArch.attr({fill:changeColor(this.objData.dataSet[j].color, 0.2)});
				r=1;
			}
		}.bind(this));
	
		donutArch.mouseout(function () {
			donutArch.attr({fill:this.objData.dataSet[j].color});
			r=null;		
		}.bind(this));
		
		this.cAngle+=2*Math.PI*perc/100;
		i++;
		setTimeout(function(){
			this.printArch(ord, i);
		}.bind(this), ms);
	}
};

 
DonutChart.prototype.mkLabels=function(){
	this.labels=[];
	var mrg=10;
	var i, dataSetLength, xx, yy, box, t, p, scale;
	dataSetLength=this.objData.dataSet.length;

	for(i=0; i<dataSetLength; i++) {
		
		this.labels[i]=new Group('stocked', 'center');
		xx=yy=0;
		
		this.labels[i].insert(new Text(this.paper, 0, 0, 2*(this.radious+this.donutWidth), 'after', 'center', this.objData.dataSet[i].name, {fill : this.objData.dataSet[i].color, 'font-size':this.settings.maxDonutFont,  'font-family':this.settings['font-family']}));			
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





