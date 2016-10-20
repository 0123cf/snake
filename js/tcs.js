/**
 * 原创
 * 作者：谢秀岳
 * 日期：2016-10-17
 * © 0123.cf
 */
/**
 * 
 * @param {string} a 获取的id值
 */
function id(a){return document.getElementById(a)}
function load(){
	var inner,
	box,
	w,//列
	h,//行
	color,
	body,//蛇的身体
	site,//移动方向
	food,//食物
	//mobile//移动位置控制
	inner=[];//画位置
	body=[];//蛇节点
	w=15;//列数的设定
	h=20;//行数的设定
	box=id("view");
	site="";//储存点击时的id 用来判断方向
	food=[];//食物的位置
	mobile=0;
	//评分
	scoreBox=id("score");
	
	scoreBox.innerHTML='0';
	//控制
	id("kz").style.display="block";
	
	//获得容器
	for(var i=0;i<=h;i++){
			inner[i]=[];
			for(var j=0;j<=w;j++){
				inner[i][j]='<span></span>';
			}
			inner[i][0]='<li>'+inner[i][0];
			inner[i][j-1]+='</li>';
	}
	var c=inner.join('').replace(/[,]/g,"");
	//渲染页面
	var c=	box.innerHTML=c;
	//食物
	function foodbox(){
		var y,x;
		function test(){
			y=Math.round(Math.random()*h);
			x=Math.round(Math.random()*w);
			//遍历身体 避免重合
			body.forEach(function(e){
				if(e[0]==y){
					if(e[1]==x){
						console.log('重合');
						test();
					}
				}
			});
		}
		test();
		food=[y,x];
		// console.log(food)
		box.getElementsByTagName("li")[food[0]].getElementsByTagName("span")[food[1]].style.background="#00BFFF";
	}
	body[0]=[Math.round(Math.random()*h),Math.round(Math.random()*w)];
	function snake(a){
		body.forEach(function(e){
			var color=a!="off"?"#FF4500":"#fff";
				box.getElementsByTagName("li")[e[0]].getElementsByTagName("span")[e[1]].style.background=color;
		})
	}
		//身体初始化
		snake();
		//食物初始化
		foodbox();
		
		var t=setInterval(function(){
			 snake("off");//清除痕迹
			 var l=body.length-1;
			 var ll=body[l].length-1;
			 var xe=body[l][0];
			 var ye=body[l][1];
			 //添加的方向
			 var tMobile,
			 	 lMobile;
			 tMobile=0;
			 lMobile=0;
			 //判断方向、操作的节点
			 if(site==''){
			 	//储存食物、body第一节点
			 	var foodsite=food[0];
			 	var bodysite=body[0][0];
			 	if(foodsite<bodysite||foodsite==bodysite){
			 		var x=xe-1;
					var y=ye;
					//赋值 不在执行初始化
					site="up";
			 	}else if(foodsite>bodysite){
			 		var x=xe+1;
					var y=ye;
					site="bottom";
			 	}
			 }
			 if(site=="up"){
			 	var x=xe-1;
				var y=ye;
			 }else{
				 if(site=="left"){
				 	x=xe;
				 	y=ye-1;
				 }
				 if(site=="right"){
				 	x=xe;
				 	y=ye+1;
				 }
				 if(site=="bottom"){
				 	x=xe+1;
				 	y=ye;
				 }
			 }
	  		if(x<0||x>h||y<0||y>w){
	  				alert("卧槽，撞墙了");
	  				//渲染死亡状态
	  				snake();
	  				window.clearInterval(t);
					return;
	  		}
	  		/*
	  		 * 删除头部，添加尾部
	  		 */
	  		body.shift();
	  		body.push([x,y]);
			if(food[0]==(+x)&&food[1]==(+y)){
				console.log("吃到了！");
				var scores=+score.innerHTML;
				score.innerHTML=++scores;
				if(w*h==scores){
					alert('英雄成功过关！');
				}
				//身体加一节
				body.push([
					body[l][0]+tMobile,
					body[l][1]+lMobile
				]);
				//随机食物
				foodbox();
			}else{
				/**
				 * 检测是否吃到自己
				 * 避免吃的时候检测，刚添加的元素。
				 */
				body.forEach(function(e,i){
					//确认没有和自身节点冲突，执行判断
					if(i!=body.length-1&&e[0]==(+x)&&e[1]==(+y)){
						console.log(e);
						//渲染死亡状态
		  				snake();
		  				window.clearInterval(t);
						alert('自杀完毕！英雄请重新来过。');
					}
				});
			}
			//正式添加
	  		snake();
		},500)
	//div方向点击
	document.body.onclick=function(e){
	  	var e=e.target;
	  	if(e.id=="up"||e.id=="bottom"||e.id=="left"||e.id=="right"){
	  		site=e.id;
	  	}
	}
	//键盘监听
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==37){ // left
            site='left';
          }
        if(e && e.keyCode==38){ 
             site='up';
         }            
         if(e && e.keyCode==39){
             site='right';
        }          
         if(e && e.keyCode==40){ 
             site='bottom';
        }
    }; 
    /**
     * 手势控制
     * touchatart 对原点的记录
     * move判断方向
     */
    //定义原型值  x为左右 y为上下。
    var y1,x1;
    document.body.addEventListener("touchstart",function(event){
    	y1=event.changedTouches[0].clientY;
    	x1=event.changedTouches[0].clientY;
    	start=true;
    });
    // TODO 触发不是很理想
    document.body.addEventListener("touchmove",function(event){
    	var y=event.changedTouches[0].clientY;
    	var x=event.changedTouches[0].clientX;
    	/**
    	 * 为移动提供方向
    	 * @param {String} a
    	 */
    	function getMoveValue(a){
   			site=a;
    	}
    	//移动触发值
    	var mobileValue=30;
    	//上
    	if(y+mobileValue<y1){
    		console.log('up');
    		getMoveValue('up');
    	}else{
    		//用层层是避免二次赋值
    		//下
    		if(y-mobileValue>y1){
	    		console.log('buttom');
	    		getMoveValue('bottom');
	    	}else{
	    		//左
	    		if(x+mobileValue<x1){
		    		console.log('left');
		    		getMoveValue('left');
		    	}else{
		    		//右
		    		if(x-mobileValue>x1){
			    		console.log('right');
			    		getMoveValue('right');
			    	}else{
			    		//没有达到条件
			    		console.log('error!');
			    	}
		    	}
	    	}
    	}
    });  
}
load();
id('load').addEventListener('click',function(){
	load();
})
