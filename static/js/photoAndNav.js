var photoBox= function(photos){
	this.photos=[];
	this.points=[];
	this.photo_box=null;
	
	//当前图片
	this.activeIndex=0;
	this.prevIndex=0;
	//创建最外层
	var createBox=function(){
		var me=this;
		var box=document.createElement('div');
		box.className="photo_box";
		box.appendChild(createPhotos.call(this,photos));
		//按钮
		var btn=document.createElement("div");
		btn.className="button left";
		btn.addEventListener('click',function(){
			me.goPrev();
		});
		box.appendChild(btn); 
		btn=document.createElement("div");
		btn.className="button right";
		btn.addEventListener('click',function(){
			console.log(1);
			me.goNext();
		});
		box.appendChild(btn);
		//停靠
		box.appendChild(createPosition.call(this,photos));
		return box;
	}
	//图片组
	var createPhotos=function(photos){
		var ul=document.createElement("ul");
		ul.className="photo_view";
		var li=null;
		for(var i=0;i<photos.length;i++){
			li=createPhotoItem(photos[i]);
			this.photos.push(li);
			ul.appendChild(li);
		}
		return ul;
	}
	var createPhotoItem=function(img){
		var li=document.createElement("li");
		li.className="photo_item";
		var a=document.createElement("a");
		a.setAttribute("href",img.url);
		a.setAttribute("target","_blank");
		var i=document.createElement('img');
		i.setAttribute("src",img.src);
		i.setAttribute("alt",img.alt);
		a.appendChild(i);
		li.appendChild(a);
		return li;
	};
	//停靠
	var createPosition=function(photos){
		var me =this;
		var ul=document.createElement("ul");
		ul.className="position_point";
		var li=null;
		for(var i=0;i<photos.length;i++){
			li=document.createElement("li");
			li.className="point";
			li.setAttribute("data-index",i);
			li.addEventListener("click",function(e){
				me.pointClick(e);
			});
			this.points.push(li);
			ul.appendChild(li);
		}
		return ul;
	};
	this.goIndex=function(index){
		this.photos[this.prevIndex].className="photo_item ";
		this.prevIndex=this.activeIndex;
		this.activeIndex=index;
		this.photos[this.prevIndex].className="photo_item prev";
		this.photos[this.activeIndex].className="photo_item active";
		this.points[this.prevIndex].className="point";
		this.points[this.activeIndex].className="point active";
	};
	this.goPrev=function(){
		if(this.activeIndex>0){
			this.goIndex(this.activeIndex-1);
		}else{
			this.goIndex(this.photos.length-1);
		}
	}
	this.goNext=function(){
		if(this.activeIndex<this.photos.length-1){
			this.goIndex(this.activeIndex+1);
		}else{
			this.goIndex(0);
		}
	}
	
	this.pointClick=function(e){
		this.goIndex(e.target.getAttribute("data-index"))
	}
	
	var create=function(){
		this.photo_box=createBox.call(this);
		this.photos[this.activeIndex].className="photo_item active";
		this.points[this.prevIndex].className="point active";
	};
	this.fill=function(targetId){
		document.getElementById(targetId).innerHTML="";
		document.getElementById(targetId).appendChild(this.photo_box);
	};
	create.call(this);
}
//创建导航组
/*
 * [
 * {
 * 		title:"手机电话卡",
 * 		subList:[
 * 		{title:"红米note2",imgSrc:"/img/icon/1.jpg",href:"http://www.baidu.com"}
 * ]
 * }
 * ]
 */
var createNavLeft=function(config){
	var me=this;
	//创建导航节点
	var createNav=function(){
		//创建子导航
		var createSubItem=function(item){
			//生成子导航内的列表
			var createSubList=function(subList){
				//生成子导航列表内的链接项
				var createSubListItem=function(subItem){
					//生成li标签
					var li=document.createElement("li");
					li.className="subListItem";
					var a=document.createElement("a");
					a.setAttribute("href",subItem.href);
					var img=document.createElement("img");
					img.setAttribute("src",subItem.imgSrc);
					img.setAttribute("alt",subItem.title);
					a.appendChild(img);
					var span=document.createElement("span");
					span.appendChild(document.createTextNode(subItem.title));
					a.appendChild(span);
					li.appendChild(a);
					return li;
				}
				var ul_subList=document.createElement("ul");
				ul_subList.className="subList";
				//循环添加子项
				for(var i=0;i<subList.length;i++){
					ul_subList.appendChild(createSubListItem((subList[i])));
				}
				return ul_subList;
			}
			//生成导航项标签
			var li_navItem=document.createElement("li");
			li_navItem.className="navItem";
			var span_title=document.createElement("span");
			span_title.className="navTitle";
			span_title.appendChild(document.createTextNode(item.title));
			li_navItem.appendChild(span_title);
			li_navItem.appendChild(createSubList(item.subList));
			return li_navItem;
		}
		//生成外层标签
		var ul_navLeft=document.createElement("ul");
		ul_navLeft.className="navLeft";
		//循环生成一级导航
		for(var i=0;i<config.length;i++){
			//调用createSubNam生成子导航
			ul_navLeft.appendChild(createSubItem(config[i]));
		}
		return 	ul_navLeft;
	}
	return createNav();
}

var createNavAndPhotos=function(targetId){
	var div=document.createElement("div");
	div.className="photoAndNav";
	var photos=new photoBox([
		{"alt":"图片1","src":"img/1.jpg","url":"http://www.baidu.com"},
		{"alt":"图片2","src":"img/2.jpg","url":"http://www.baidu.com"},
		{"alt":"图片3","src":"img/3.jpg","url":"http://www.baidu.com"},
		{"alt":"图片4","src":"img/4.jpg","url":"http://www.baidu.com"},
		{"alt":"图片5","src":"img/5.jpg","url":"http://www.baidu.com"},
		{"alt":"图片6","src":"img/6.jpg","url":"http://www.baidu.com"},
		{"alt":"图片7","src":"img/7.jpg","url":"http://www.baidu.com"}
	]);
	
	div.appendChild(photos.photo_box );
	
	document.getElementById(targetId).innerHTML="";
	document.getElementById(targetId).appendChild(div);
}
