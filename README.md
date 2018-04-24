# SimpleChartjs
A set of hight customizable charts 
 
[Raphaël—JavaScript Library](http://dmitrybaranovskiy.github.io/raphael/).


# Settings

General structure for the object used to make a chart. Depending on the chart type, 
some settings might vary.

    var objData={
    canvasID : 'ID of the canvas container',
    chartType:'bars/bubbles/columns/lines/donut/sunburst',
    gridSettings:{...},
    title:{text:'Title for the chart', align:'left/center/right', font:{...}},
    subTitle:{text:'Subtitle for the chart', align:'left/center/right', font:{...}},
    axisTitles : {yTitle:'Title for the vertical axe', xTitle: 'Title for the horizontal axe', font:{...}},
    keys : {position:'left/top/right/bottom', align:'left/right/center', font:{...}},
    additionalInfo: [
				{position:'top/bottom', align:'left/right/center', content:'sdfsdfsdf', font:{...}},
			],
    labels: [...],
    dataSet : [...],
    };

The font property for the properties: title, subTitle, axisTitles, keys, and additionalInfo 
has the following format:

    {fill:'#000000', 'font-size':22, 'font-style':'normal','font-weight':'bold', 'font-family': "myFontFamily"}

General properties for the gridSettings property. Depending on the type of chart, additional
settings will be used.

    gridSettings:{
    bgColor:'#ffffff',
    scaleColor : '#0000ff',
    labelColor : '#666666',	
    scaleFontSize : 12,
    scaleArea:45, 
    'font-family' : "Arial, sans-serif",
    popUpA:{'maxWidth':200, paddingX:5, paddingY:5, justifyContent:'left', fill:'#ffffff', stroke:'#a1a1a1', 'stroke-width': 0.5, font:{fill:'#ff88ee', 'font-size':14, 'font-style':'normal', 'font-weight':'normal', 'font-family':'myFontFamily'}},
    popUpB:{'maxWidth':300,  paddingX:5, paddingY:5, justifyContent:'left', fill:'#000000', stroke:'#a1a1a1', 'stroke-width': 0, font:{fill:'#ffffff', 'font-size':12, 'font-style':'normal', 'font-weight':'normal', 'font-family':'anotherFavouriteFontFamily'}},		
    }


| Setting | Description |
| --- | --- |
| bgColor | the color of the canvas, default '#ffffff' |
| scaleColor | color for the scale, default '#0000ff' |
| labelColor  | color for the font of the scale, default '#666666' |
| scaleFontSize | scale font size, default 12 |
| 'font-family' | font use across all the text in the chart, however this can be set for particular parts of the chart.
Default "Arial, sans-serif" |
| popUpA | settings for the popUp for the category text, if the category text is too wide to fit in the area allocated for it, it is set in a popUp, default {'maxWidth':200, paddingX:5, paddingY:5, justifyContent:'left', fill:'#ffffff', stroke:'#a1a1a1', 'stroke-width': 0.5, font:{fill:'#ff88ee', 'font-size':14, 'font-style':'normal', 'font-weight':'normal', 'font-family':''}}, |
| popUpB | settings for the popUp that will hold the description of the records, default {'maxWidth':300,  paddingX:5, paddingY:5, justifyContent:'left', fill:'#000000', stroke:'#a1a1a1', 'stroke-width': 0, font:{fill:'#ffffff', 'font-size':12, 'font-style':'normal', 'font-weight':'normal', 'font-family':''}},	 |	
</table>


**Additional settings to be included in gridSettings**

*Bars*

    rowHeight : 30,
    categoryFontSize : 12,
    categoryBoxWidth : 60,
    barThickness : 14,
    speed : 500,

| Setting | Description |
| --- | --- |
| rowHeight | the line height of the category, default 30 |
| categoryBoxWidth | the max width for the category text, default 160 |
| categoryFontSize | the font size for the category text, default 12, |
| barThickness | the thickness for the bar, default 14 |
| speed | the elapsed time, in ms, for the animation of the bar, default 500 |

*Bubbles*

    bubbleStyle : {fill:'#bddaf5', stroke:'#7aaadc'}

| Setting | Description |
| --- | --- |
| bubbleStyle | style applied to the bubbles, default {fill:'#bddaf5', stroke:'#7aaadc'} |


*Columns*

    maxColumnWidth : 60,
    columnPadding : 15, 
    groupColumnPadding : 50, 
    categoryFontSize : 12,

| Setting | Description |
| --- | --- |
| maxColumnWidth | the max width for the columns (to keep the proportions), default 60 |
| columnPadding | space between each column, default 15 |
| groupColumnPadding | space between each group of columns, default 50 |


*Donut and Sunburst*

    donutWidth : 30,
    maxDonutFont: 50,

| Setting | Description |
| --- | --- |
| donutWidth | the width of the donut (the ring), default 30 |
| maxDonutFont | the max font size for the labels display in side the dunut, default 50 |


*Lines*

    minDataInterval : 25, 
    'line-width' : 2,
    elapsedTime : 2000,
    categoryFontSize : 12,

| Setting | Description |
| --- | --- |
| minDataInterval | minimum space between each record (or point), default 25 |
| 'line-width' | the thickness for the lines, default 2 |
| elapsedTime | the elapsed time (in ms) for the line animation, default 2000 |




**Note: **Colors can be set as gradient: '90-#ccc-#a1a1a1:100-90'

# Get In Touch

Your comments and questions are welcome: easytable@yandex.com (with the subject: SimpleChartsjs)



# Donations

I like coffee, I mean good quality coffee. So if you like this class maybe you would 
like to help me with my coffee :-)

Holly Molly people, you are so tight! :-D

If you are using this for the company you work for, they are getting the money, you are getting 
the medals and I am getting nothing! Is that fair?

Or at least put some stars to the project.

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JALWQVBS2KGQC)


# License

Copyright (c) 2018, Dan Machado
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.



