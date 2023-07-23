var a=[], b=[], c=[], lock=[], chain=[0, 0, 0, 0, 0, 0], px=0, py=0, now=0;
for(var i=0; i<6; ++i)a.push([[0], [0], [0], [0]]), b.push([0, 0, 0, 0]), lock.push([0, 0, 0, 0]);

function toStr(n){
	n=String(n);
	var i=0;
	for(; i<n.length; ++i)if(n[i]=='e')break;
	if(n.length>10)return n.slice(0, i-n.length+10)+n.slice(i);
	return n;
}

function upd(){
	s='';
	for(var i=0; i<6; ++i){
		s+='<tr><th class="c'+String(chain[i])+'">第 '+String(i+1)+' 組</th>';
		for(var j=0; j<4; ++j){
			if(lock[i][j])s+='<td class="lock">';
			else if(i==px&&j==py)s+='<td class="on">';
			else s+='<td>';
			s+=toStr(a[i][j][b[i][j]])+'</td>';
		}
		s+='</tr>\n';
	}
	document.querySelector('#table').innerHTML=s;
	if(py==-1)s='<tr><th width="50%">所有值</th><td>第 '+String(px+1)+' 組</td>';
	else{
		n=a[px][py].length, w='width="'+String(100/(n+1))+'%"';
		s='<tr><th '+w+'>所有值</th>';
		for(var i=0; i<a[px][py].length; ++i){
			if(i==b[px][py])s+='<td class="on" '+w+'>';
			else s+='<td '+w+'>';
			s+=toStr(a[px][py][i])+'</td>';
		}
	}
	s+='</tr>\n';
	document.querySelector('#stack').innerHTML=s;
	s='精確值： ';
	if(py!=-1)s+=String(a[px][py][b[px][py]]);
	document.querySelector('#precision').innerHTML=s;
}
setInterval(upd, 1000/30);

function copy(a){
	a0=new Array();
	for(var i=0; i<6; ++i){
		a0.push([[], [], [], []]);
		for(var j=0; j<4; ++j)for(var k=0; k<a[i][j].length; ++k)a0[i][j].push(a[i][j][k]);
	}
	return a0;
}

document.onkeydown=function(e){
	e=window.event||e;
    var k=e.keyCode;
	if(k>111&&k<122)e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	if(k==87)px=Math.max(px-1, 0), e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	if(k==65)py=Math.max(py-1, -1), e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	if(k==83)px=Math.min(px+1, 5), e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	if(k==68)py=Math.min(py+1, 3), e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	if(k==69)b[px][py]=(b[px][py]+1)%a[px][py].length, e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	if(k==90){
		if(c.length>now)c[now]=copy(a);
		else c.push(copy(a));
		if(now>0)--now;
		a=copy(c[now]);
		e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	}
	if(k==81){
		if(now<c.length-1)++now, a=copy(c[now]);
		e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	}
	if(k==67){
		if(py==-1)chain[px]=(chain[px]+1)%4;
		else lock[px][py]=1-lock[px][py];
		e.keyCode=0, e.returnValue=false, e.cancelBubble=false;
	}
	if(k==13||k==108){
		s=document.querySelector('input').value;
		if(s.length==0||py==-1){alert('Unreadable!'); return 0;}
		if(c.length>now)c[now]=copy(a);
		else c.push(copy(a));
		++now;
		if(s[0]=='=')a[px][py][b[px][py]]=Number(s.slice(1));
		else if(s[0]=='+')a[px][py][b[px][py]]+=Number(s.slice(1));
		else if(s[0]=='-')a[px][py][b[px][py]]-=Number(s.slice(1));
		else if(s[0]=='*')a[px][py][b[px][py]]*=Number(s.slice(1));
		else if(s[0]=='/')a[px][py][b[px][py]]/=Number(s.slice(1));
		else if(s[0]=='>')a[px][py].push(Number(s.slice(1))), a[px][py][b[px][py]]-=Number(s.slice(1));
		else if(s=='<'){
			for(var i=0; i<6; ++i)for(var j=0; j<4; ++j){
				var dx=Math.abs(px-i), dy=Math.abs(py-j);
				dx=Math.min(dx, 6-dx), dy=Math.min(dy, 4-dy);
				d=dx*dx+dy*dy;
				if(d!=0&&lock[i][j]==0)a[i][j][b[i][j]]=d*(a[px][py][b[px][py]]+1)/a[i][j][b[i][j]];
			}
		}
		else if(s==':'){
			m=[[], [], [], []]
			for(var i=0; i<4; ++i){
				for(var j=0; j<3; ++j)m[i].push(a[0][i][b[0][i]])
				for(var j=1; j<6; ++j)
					m[i][0]=Math.max(m[i][0], a[j][i][b[j][i]]),
					m[i][1]=Math.min(m[i][1], a[j][i][b[j][i]]),
					m[i][2]+=a[j][i][b[j][i]];
				m[i][2]/=6, m[i].push(m[i][0]-m[i][1]);
			}
			a1=[];
			for(var i=0; i<6; ++i)a1.push([0, 0, 0, 0]);
			for(var i=0; i<6; ++i)for(var j=0; j<4; ++j)for(var k=0; k<4; ++k)a1[i][j]+=a[i][k][b[i][k]]*m[k][j];
			for(var i=0; i<6; ++i)for(var j=0; j<4; ++j)if(lock[i][j]==0)a[i][j][b[i][j]]=a1[i][j];
		}
		else if(s=='[')a[px][py][b[px][py]]=Math.ceil(Math.sqrt(a[px][py][b[px][py]]));
		else if(s=='?')alert('使用wasd可以移動到想要改變的格子或是隊伍\n按c可以改變該格顏色（可以使用隊伍顏色來區分鐵鎖連環，但並沒有自動鐵鎖連環的效果）或是bunger狀態\n按e切換要做更動的分裂格\n按z復原\n按q取消復原\n=a：指定成a\n+a：增加a\n其他符號以此類推\n>a：分裂a到新的那格\n<：反演\n:：一目十行\n[：開根號取上高斯');
		else alert('Unreadable!');
	}
};
