document.querySelector('#imageInput').addEventListener('change', update);

function inversion(img, cx, cy, r){
	var cv0
	var canvas=document.querySelector('#inversion'), ctx=canvas.getContext('2d');
	canvas.height=img.height, canvas.width=img.width;
	ctx.drawImage(img, 0, 0);
	var origin=ctx.getImageData(0, 0, canvas.width, canvas.height), inv=[];
	for(var i=0; i<origin.data.length; ++i)inv.push(0);
	var w0=canvas.width, h0=canvas.height;
	var w1=canvas.width, h1=canvas.height;
	for(var i=0; i<canvas.height; ++i)for(var j=0; j<canvas.width; ++j){
		var d=(cx-i)*(cx-i)+(cy-j)*(cy-j);
		if(d==0)continue;
		d=r*r/((cx-i)*(cx-i)+(cy-j)*(cy-j));
		var x1=Math.round(cx+(i-cx)*d), y1=Math.round(cy+(j-cy)*d);
		for(var k=0; k<4; ++k)inv[4*(x1*w1+y1)+k]=origin.data[4*(i*w0+j)+k];
	}
	for(var i=0; i<inv.length; ++i)origin.data[i]=inv[i];
	ctx.putImageData(origin, 0, 0);
}

function update(evt){
	const file=evt.target.files[0];
	if(!file)return;
	const img=new Image();
	img.onload=function(){
		var cx=100, cy=100, r=100;
		var canvas=document.querySelector('#original'), ctx=canvas.getContext('2d');
		canvas.height=img.height, canvas.width=img.width;
		ctx.drawImage(img, 0, 0);
		var origin=ctx.getImageData(0, 0, canvas.width, canvas.height), inv=[];
		for(var i=0; i<origin.data.length; ++i)inv.push(0);
		var w0=canvas.width, h0=canvas.height;
		var w1=canvas.width, h1=canvas.height;
		for(var i=0; i<canvas.height; ++i)for(var j=0; j<canvas.width; ++j){
			var d=(cx-i)*(cx-i)+(cy-j)*(cy-j);
			if(d==0)continue;
			d=r*r/((cx-i)*(cx-i)+(cy-j)*(cy-j));
			var x1=Math.round(cx+(i-cx)*d), y1=Math.round(cy+(j-cy)*d);
			for(var k=0; k<4; ++k)inv[4*(x1*w1+y1)+k]=origin.data[4*(i*w0+j)+k];
		}
		for(var i=0; i<inv.length; ++i)origin.data[i]=inv[i];
		ctx.putImageData(origin, 0, 0);
	};
	const reader=new FileReader();
	reader.onload=function(evt){img.src=evt.target.result;};
	reader.readAsDataURL(file);
}
