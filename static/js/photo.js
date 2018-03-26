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
