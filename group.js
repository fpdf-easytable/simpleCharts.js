
function Set(){
	this.x=0;
	this.y=0;
	this.width=0;
	this.height=0;
	this.set=[];
};


Set.prototype.getBBox=function(){
	return {x:this.x, y:this.y, width:this.width, height:this.height};
};


Set.prototype.move=function(Style){
	var tx=this.x, ty=this.y;
	
	if(Style.hasOwnProperty('x')) {
		tx=Style.x;
	}

	if(Style.hasOwnProperty('y')) {
		ty=Style.y;
	}

	var i, len, tmp;
	len=this.set.length;
	for(i=0; i<len; i++){
		tmp=this.set[i].getBBox(); // we consider the box after transformation
		this.set[i].move({x:tx+tmp.x-this.x, y:ty+tmp.y-this.y});
	}

	this.x=tx;
	this.y=ty;
};



Set.prototype.toShow=function(){
	this.looping(function(shape){		
		shape.toFront();
		shape.show();
	});
};


Set.prototype.show=function(){
	this.looping(function(shape){
		shape.show();
	});
};


Set.prototype.toFront=function(){
	this.looping(function(shape){
		shape.toFront();
	});
};


Set.prototype.hide=function(){
	this.looping(function(shape){
		shape.hide();
	});
};


Set.prototype.Scale=function(scale){
	this.looping(function(shape){
		shape.attr({transform:scale});
	});
};


Set.prototype.looping=function(doSomething){
	var i, len=this.set.length;
	for(i=0; i<len; i++){
		doSomething(this.set[i]);
	}
};

//####################################################################
//####################################################################
//####################################################################
/*
Settings={vPadding:vp, hPadding:hp, h:h, w:w, align:[0,100], valign:[0,100]}

if h (w) is set and h>element.height (w>element.width), 
the element is set into a box of height h (width w) 

align and valing apply just when h and w are set.
This values indicate the percentage of the difference of w-element.width
(h-element.height) to be set before the element. In particular
0 means aligned to the left (valign=0 aligned to the top)
100 means aligned to the right (valign=100 aligned to the bottom)
default if 50 meaning center/middle

Short cut is to define hPadding and/or vPadding.

*/

function Wrapper(element, Settings){
	Shape.call(this);
	this.x=0;
	this.y=0;
	this.width=0;
	this.height=0;
	this.obj=element;

	var box=this.obj.getBBox();
	this.x=box.x;
	this.y=box.y;
	var padding=0;

	if(Settings.hasOwnProperty('h')){
		if(Settings.h>box.height) {
			this.height=Settings.h;
			padding=Settings.h-box.height;
			if(Settings.hasOwnProperty('valign')){
				padding*=(Settings.valign/100);
			}
			else {
				padding*=0.5;
			}
		}
	}
	else if(Settings.hasOwnProperty('vPadding')){
		this.height=box.height+2*Settings.vPadding;
		padding=Settings.vPadding;
	}
	else{
		this.height=box.height;	
	}

	if(padding>0) {
		this.y-=padding;
	}

	padding=0;
	if(Settings.hasOwnProperty('w')){
		if(Settings.w>box.width) {
			this.width=Settings.w;
			padding=Settings.w-box.width;
			if(Settings.hasOwnProperty('align')){
				padding*=(Settings.align/100);
			}
			else {
				padding*=0.5;
			}
		}
	}
	else if(Settings.hasOwnProperty('hPadding')){
		this.width=box.width+2*Settings.hPadding;
		padding=Settings.hPadding;
	}
	else{
		this.width=box.width;
	}

	if(padding>0){
		this.x-=padding;
	}
};


Wrapper.prototype=Object.create(Shape.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Wrapper,
		writable: true
	}
});


Wrapper.prototype.getBBox=function(){
	return {x:this.x, y:this.y, width:this.width, height:this.height};
};


Wrapper.prototype.move=function(Style){
	var x, y, tx, ty, box;
	x=this.x;
	y=this.y;

	if(Style.hasOwnProperty('x')) {
		x=Style.x;
	}

	if(Style.hasOwnProperty('y')) {
		y=Style.y;
	}

	box=this.obj.getBBox();
	tx=box.x-this.x+x;
	ty=box.y-this.y+y;
	this.obj.move({x:tx, y:ty});
	this.x=x;
	this.y=y;
};




//####################################################################
//####################################################################
//####################################################################
//####################################################################

/*
Row(width, height, valign)

width=0, the row expands without limits and justifyContent defaults to left

width<=(the sum of the width of the elements), then the justifyContent is ignored.

height>0; the height will be fixed till one element with bigger height is
inserted. In that case, the height == biggest height of all the elements. 

valign:top/middle/bottom default top. Insert the elements at the top/middle/bottom
								of the row. This value is overwrite by the valign parameter 
								of insert method.
*/

function Row(width, height, justifyContent, valign){
	Set.call(this);
	this.coordinates=[]; //since we could insert objects that can be shared, so we just need to record their coordinate x, to bring it back to the row when need it (for example a pop up that share labels)
	this.sp=[];//spaces between elements
	this.valignment=[];
	this.justifyContent='left';
	this.valign=0;

	this.w=0;
	this.xd=1; //expand Distance
	if(typeof width==='number'){
		this.width=width; // target width
		//this.w=width; // target width
		this.xd=0;
	}
		

	if(typeof height==='number'){
		this.height=height;
	}

 	if(typeof valign==='string'){
		if(valign=='middle' || valign=='bottom'){
			if(valign=='middle'){// || valign=='bottom'){
				this.valign=1;
			}
			else if(valign=='bottom'){
				this.valign=2;
			}
		}
	}

	if(this.xd==0){
		if(typeof justifyContent==='string'){
			if(justifyContent=='center' || justifyContent=='right' || justifyContent=='space-between' || justifyContent=='space-around'){
				this.justifyContent=justifyContent;
			}
		}
	}
};


Row.prototype=Object.create(Set.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Row,
		writable: true
	}
});

/*
valign: if it is set, it will overwrite the one set by default,
values: top, middle, bottom,
*/
Row.prototype.insert=function(element, valign){
	var i=0, len=this.set.length;
	this.set[len]=element;

	if(typeof this.sp[len]==='undefined'){
		this.sp[len]=0;
	}
	
	var box=this.set[len].getBBox();
	this.valignment[len]=this.valign

	if(typeof valign==='string'){
		if(valign=='top'){ 
			this.valignment[len]=0;
		}
		else if(valign=='middle'){// || valign=='bottom'){
			this.valignment[len]=1;
		}
		else if(valign=='bottom'){
			this.valignment[len]=2;
		}
	}

	var x=this.x;
	this.w+=box.width;
	if(this.xd || this.w>this.width){
		this.width=this.w;
	}
	var wpadding;

	if(this.xd==0 && this.justifyContent!='left'){
		wpadding=Math.max(0, (this.width-this.w));
		
		if(this.justifyContent=='right' || this.justifyContent=='center'){
			if(this.justifyContent=='center'){
				wpadding/=2;
			}

			x+=wpadding;
			wpadding=0;
		}
		else if(this.justifyContent=='space-between' && len>0){ //|a b c d|
			if(len==0) {
				x+=wpadding/2;
			}
			else{
				wpadding/=len;
			}
		}
		else if(this.justifyContent=='space-around'){ // | a b c d |
			wpadding/=(len+1);
			x+=wpadding/2;
		}

		for(i=0; i<len+1; i++){
			x+=this.sp[i];
			this.set[i].move({x:x});
			this.coordinates[i]=x;
			box=this.set[i].getBBox();
			x+=box.width+wpadding;
		}
	}
	else{
		//console.log(this.width);
		x+=(this.w-box.width);
		this.set[len].move({x:x});
		this.coordinates[len]=x;
	}

	var t=0;
	for(i=0; i<len+1; i++){
		t+=this.valignment[i];
	}

	if(t>0){
		box=this.set[len].getBBox();
		if(this.height>box.height){
			var t=this.valignment[len]*(this.height-box.height)/2;
			this.set[len].move({x:this.coordinates[len], y:this.y+t});	
		}
		else if(this.height<box.height){
			
			this.height=box.height;
			var vx, vy;
			for(i=0; i<len+1; i++){
				box=this.set[i].getBBox();
				//vx=box.x;
				vy=this.y+this.valignment[i]*(this.height - box.height)/2;
				this.set[i].move({y:vy});
			};
		}
	}
	else{
		this.set[len].move({y:this.y});
	}	
	
	if(this.height<box.height){
		this.height=box.height;
	}
};


Row.prototype.insertSpace=function(x){
	this.sp[this.set.length]=x;
	this.w+=x;
	if(this.xd || this.w>this.width){
		this.width+=x;
	}
};



//DO NOT DELETE!!
Row.prototype.move=function(Style){
	if(Style.hasOwnProperty('x')) {
		this.x=Style.x;
	}

	if(Style.hasOwnProperty('y')) {
		this.y=Style.y;
	}

	var i, len, box, vy;
	len=this.set.length;
	for(i=0; i<len; i++){
		box=this.set[i].getBBox();
		vy=this.y+this.valignment[i]*(this.height - box.height)/2;
		this.set[i].move({x:this.coordinates[i]+this.x, y:vy});	
	}
};


//####################################################################
//####################################################################
//####################################################################
/*

geometry:default/inline/stoked

default: keep the geometry of the elements as they are set
			the elements are inserted keeping their coordinates
			and as group it keeps the geometry of the group.
			The dimensions of the group are set as following
			x=min({x : x = element.Box.x})
			y=min({y : y = element.Box.y})
			w=max({ w : w= element.Box.x+element.Box.width - x })
			w=max({ h : h= element.Box.y+element.Box.height - y })



left: insert the element one after another and the block is aligned to the left
right: insert the element one after another and the block is aligned to the right
center: insert the element one after another and the block is aligned to the center
space-between: |a b c d|
space-around: | a  b  c  d |

*/

//###################################
//###################################
//###################################
/*
if geometry='stoked'
if w is ignored and elements are stocked one under the previous one:
a
b
c
...
the width of the group is equal to the max width

if geometry='inline'
	if w=0, elements are set one after  the other and justifyContent=left
	if w>0, the width of the group is set to w and elements are  pushed one after the other and when
 	it reach the set width, the new elements form a new line
*/

function Group(geometry, width, justifyContent){
	Set.call(this);
	this.currentRow=0;// the index of the element that start a new row
	this.h=0;
	this.sil=false;

	if(typeof width==='number' && geometry=='inline') {
		if(width>0){
			this.width=width;
			this.sil=true;
		}
	}

	this.geometry='default';
	if(geometry=='inline' || geometry=='stocked') {
		this.geometry=geometry;
	}

	this.justifyContent='left';
	if(typeof justifyContent==='undefined' && typeof width==='string'){
		justifyContent=width;
	}

	if(geometry=='inline' && (justifyContent=='space-between' || justifyContent=='space-around')){
		this.justifyContent=justifyContent;
	}else if(justifyContent=='left' || justifyContent=='right' || 	justifyContent=='center'){
		this.justifyContent=justifyContent;
	}
	
	//console.log(this.justifyContent);
};


Group.prototype=Object.create(Set.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Group,
		writable: true
	}
});


/*
elements are bounded in-line
*/
Group.prototype.insert=function(element){
	var counter=this.set.length;
	this.set[counter]=element;
	var box=this.set[counter].getBBox();

	if(this.geometry=='default') {

		if(box.x<this.x){
			this.x=box.x;
		}

		if(box.y<this.y){
			this.y=box.y;
		}

		if(box.y+box.height>this.y+this.height){
			this.height=box.y+box.height-this.y;
		}

		if(box.x+box.width>this.x+this.width){
			this.width=box.x+box.width-this.x;
		}
	}
	else if(this.geometry=='stocked') {
		var i, x=this.x, y=this.y;
		var a=0;
		if(this.justifyContent=='center') {
			a=1;
		}
		else if(this.justifyContent=='right') {
			a=2;
		}

		x=this.x+a*(this.width-box.width)/2;

		this.set[counter].move({x:x, y:y+this.height});
		this.height+=box.height;
		if(a){
			if(this.x>x){
				this.x=x;
			}
		}

		if(box.width>this.width) {
			this.width=box.width;
		}
	}
	else if(this.geometry=='inline') {
		var i, x, y, wpadding, w=0;
		x=this.x;

		if(this.sil==false){ // elements are set one after another
			this.set[counter].move({x:x+this.width, y:this.y});
			this.width+=box.width
			if(this.height<box.height){
				this.height=box.height;
			}
			//console.log(box);
		}
		else{
			
			for(i=this.currentRow; i<counter; i++){
				w+=this.set[i].getBBox().width;
			}

			if(w+box.width>this.width) {
				this.currentRow=counter;
				w=box.width;
				this.h=0;
			}
			else {
				w+=box.width;
			}

			if(this.h<box.height) {
				this.height+=(box.height-this.h);
				this.h=box.height;
			}
			y=this.y+this.height-this.h;
			wpadding=this.width-w;

			if(this.justifyContent=='left'){//by default;
				wpadding=0;
			}
			else if(this.justifyContent=='right' || this.justifyContent=='center'){
				if(this.justifyContent=='center'){
					wpadding/=2;
				}
				
				x+=wpadding;
				wpadding=0;
			}
			else if(this.justifyContent=='space-between' && counter>0){ //|a b c d|
				if(counter-this.currentRow==0) {
					x+=wpadding/2;
				}
				else{
					wpadding/=(counter-this.currentRow);
				}
			}
			else if(this.justifyContent=='space-around'){ // | a b c d |
				wpadding/=(counter+1-this.currentRow);
				x+=wpadding/2;
			}

			for(i=this.currentRow; i<counter+1; i++){
				this.set[i].move({x:x, y:y});
				box=this.set[i].getBBox();
				x+=box.width+wpadding;
			}
		}
	}
};


Group.prototype.insertSpace=function(h){
	if(h>0){
		if(this.w==0 && this.geometry=='inline'){
			this.width+=h;
		}
		else{
			this.height+=h;
		}
	}
};



//####################################################################
//####################################################################
//####################################################################
/*
x : x position of the left upper corner
y : y position of the left upper corner
w : width
h : height

Style={justifyContent, geometry, paddingX, paddingY}
*/

function MiniPage(paper, x, y, w, h, Style){	

	if(typeof Style==='undefined'){
		var Style={};
	}
	this.setDefaults(Style);

	this.paddingX=Style.paddingX;
	this.paddingY=Style.paddingY;
	
	Group.call(this, Style.geometry, w-2*this.paddingX, Style.justifyContent);
	Group.prototype.move.call(this, {x:x+this.paddingX, y:y+this.paddingY});

	this.miniPage=null;
	if(Style.miniPage) {
		this.miniPage=new Rect(paper, x, y, w, h, Style);
	}
}


MiniPage.prototype=Object.create(Group.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: MiniPage,
		writable: true
	}
});


MiniPage.prototype.defaults={
	geometry:'stocked',
	paddingX:5,
	paddingY:5,
	miniPage:false,
	justifyContent:'left'
};

Object.freeze(MiniPage.prototype.defaults);

MiniPage.prototype.setDefaults=function(Style){
	var a;
	for(a in this.defaults){
		if(this.defaults.hasOwnProperty(a)){
			if(typeof Style[a]==='undefined'){
				Style[a]=this.defaults[a];
			}
		}
	}
};


MiniPage.prototype.getBBox=function(bool){
	if(this.miniPage!==null){
		return this.miniPage.getBBox(bool);
	}
	else{
		return {x:this.x-this.paddingX, y:this.y-this.paddingY, height:this.height+2*this.paddingY, width:this.width+2*this.paddingX};
	}
};


MiniPage.prototype.insertSpace=function(h){
	Group.prototype.insertSpace.call(this, h);

	if(this.miniPage!==null){
		var box=this.getBBox();
		if(this.height+2*this.paddingY!=box.height) {
			this.reSize(this.width+2*this.paddingX, this.height+2*this.paddingY);	
		}
	}
};


MiniPage.prototype.insert=function(element){
	Group.prototype.insert.call(this, element);

	if(this.miniPage!==null){
		var box=this.getBBox();
		if(this.height+2*this.paddingY!=box.height) {
			this.reSize(this.width+2*this.paddingX, this.height+2*this.paddingY);	
		}
	}
};

/*
Some times we do not want to store the text into the MiniPage, because we wan to reuse it 
to display other text too. In this case we move the corresponding text on top of the minipage

rx x-coordinate relative to the px
ry y-coordinate relative to the py

*/

MiniPage.prototype.bound=function(element, rx, ry, reSize){	
	var box=this.getBBox();
	var tx=box.x+rx, ty=box.y+ry;
	element.move({x:tx, y:ty});
	//console.log(typeof reSize);
	if(typeof reSize==='boolean' && reSize===true) {
		box=element.getBBox();
		
		this.reSize(box.width+2*this.paddingX, box.height+2*this.paddingY);
	}
};


MiniPage.prototype.reSize=function(w, h){
	if(this.miniPage!==null){
		this.miniPage.attr({width:w, height:h});
	}
};


MiniPage.prototype.toFront=function(){
	if(this.miniPage!==null){
		this.miniPage.toFront();
	}
	Group.prototype.toFront.call(this);
};


MiniPage.prototype.hide=function(){
	if(this.miniPage!==null){
		this.miniPage.hide();
	}
	Group.prototype.hide.call(this);
};


MiniPage.prototype.toShow=function(){
	if(this.miniPage!==null){
		this.miniPage.toShow();
	}
	Group.prototype.toShow.call(this);
};


MiniPage.prototype.setStyle=function(id,Style){
	if(id=='body'){
		this.miniPage.attr(Style);
	}
	else{
		this.set[id].attr(Style);
	}
};

/*
move the MiniPage and its content to the position x, y 
*/
MiniPage.prototype.move=function(Coord){//x, y){
	var box=this.getBBox();
	var tx=box.x, ty=box.y;

	if(Coord.hasOwnProperty('x')) {
		tx=Coord.x;
	}

	if(Coord.hasOwnProperty('y')) {
		ty=Coord.y;
	}
	if(this.miniPage!==null){
		this.miniPage.move({x:tx, y:ty});
	}
	Group.prototype.move.call(this, {x:tx+this.paddingX, y:ty+this.paddingY});
};

//####################################################################
//####################################################################
//####################################################################

/*
if geometry='stoked'
if w is ignored and elements are stocked one under the previous one:
a
b
c
...
the width of the group is equal to the max width


if geometry='inline'
	if w=0, elements are set one after  the other and justifyContent=left
	if w>0, the width of the group is set to w and elements are  pushed one after the other and when
 	it reach the set width, the new elements form a new line
*/
//experimental
/*
function Group2(geometry, width, justifyContent){
	Set.call(this);
	this.set[0]=new Row(width,0, justifyContent);

	if(typeof width==='number' && geometry=='inline') {
		if(width>0){
			this.width=width;
		}
	}

	this.geometry='default';
	if(geometry=='inline' || geometry=='stocked') {
		this.geometry=geometry;
	}

	this.justifyContent='left';
	if(typeof justifyContent==='undefined' && typeof width==='string'){
		justifyContent=width;
	}

	if(geometry=='inline' && (justifyContent=='space-between' || justifyContent=='space-around')){
		this.justifyContent=justifyContent;
	}else if(justifyContent=='left' || justifyContent=='right' || 	justifyContent=='center'){
		this.justifyContent=justifyContent;
	}
	
	//console.log(this.justifyContent);
};


Group2.prototype=Object.create(Set.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Group2,
		writable: true
	}
});


elements are bounded in-line

Group2.prototype.insert=function(element, valign){
	var box=element.getBBox();
	var counter=this.set.length;
	if(counter==0 || this.set[counter-1].getBBox().width+box.width>this.width){
		this.set[counter]=new Row();
		this.set[counter].move({x:this.x, y:this.y+this.height});
	}
	else{
		counter--;
	}
	
	var tmp='top';
	if(typeof valign!=='undefined'){
		tmp=valign;
	}
	this.set[counter].insert(element, tmp);

	this.height+=this.set[counter].getBBox().height;	
};


Group2.prototype.insertSpace=function(h){
	if(h>0){
		if(this.w==0 && this.geometry=='inline'){
			this.width+=h;
		}
		else{
			this.height+=h;
		}
	}
};

*/
//####################################################################
//####################################################################
//####################################################################
//####################################################################
