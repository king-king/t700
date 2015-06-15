# 邀请函系统

### 目录结构
-/lib
    -/util:存放库js脚本
    -/style ：存放库样式表
    
    
### 库的基本机制

* 每个项目必须有一个加载欢迎页面， ：“loading-page”。

* 每个页面必须添加名为“page”的css类，同时库会自动为每个页面添加一个带着序号的css类，如第1个页面会被
自动加上css类：“page-0”。

* 每个页面的状态是用css类来表示的，当页面被切出后会被加上类“animate”。如果需要做入场动画，可以在css中
在“.page.animate”下写入场动画。如果需要对不同的页面分别写不同的入场动画（更常见的情况）可以利用框架自
动为page添加的css类，如下：“.page-0.animate”。


### 每个Node元素都具备的方法

**remove()：用来从页面上移除该元素，不必关心该DOM元素是否在页面上**
```js
var tar=document.querySelector(".tar");
tar.remove();// 将tar从页面移除
tar.remove();// 虽然tar已经从页面移除，但是只要tar引用还有效，调用remove()不会报错，可以省去检查tar是否在页面中
```
**bindEvent(type,listener,useCapture)：为该元素绑定事件，返回值具有remove方法，可以移除绑定的事件**
```js
var handler=el.bindEvent("touchstart",function(){
    /*do something*/
    handler.remove();// 只执行一次
},false);
```
**transform(x、y、z、rotate、scale)：可以改变元素的x、y、z、rotate、scale5个属性**
```js
el.transform(40,40,40,45,1.3);//x、y、z、rotate、scale可以有选择性的为null
```
**onDrag(object)：可以在该元素上监听拖拽事件，如果需要物体移动，需要重写onMove、onEnd函数**
```js
el.wx=el.wy=0;
el.onDrag({
    onMove:function(arg){
        el.transform(el.wx+=arg.dx,el.wy+=arg.dy,0);// move the el
    },
    onEnd:function(){
        /* do something */
    }
});
```
**onTap(callback)：监听点击事件**
```js
el.onTap(function(){
    /* do something */
});
```
**css(object)：可以为元素设定css**
```js
el.css({
    background:"red",
    position:"absolute",
    top:"50%",
    left:"50%",
    "-webkit-transform":"translate(-50%,-50%,0)",
    width: document.body.offsetWidth/5<<0 +"px",
    height: document.body.offsetHeight/5<<0 +"px"
});
````


### util命名空间中的接口（需要引用basic.js）

**insertCSSRules(obj)**
```js
util.insertCSSRules({
     ".selector" : {
        background : "red"
     },
     ".selector2" : {
        "border-radius" : "50px"
     }
})
```

**concurrentTask(tasks,callback)**并发执行tasks中的任务
* tasks[Array<Function>] 存放任务的数组
* callback[Function] 所有任务执行完毕后的回掉
```js

/*
    考虑一个需求，并发下载3张图片，全部下载完毕后打印“end”
*/
// 朴素写法
util.concurrentTask([
    function(done){
        var img=new Image();
        img.src="1.png";
        img.onload=function(){
            /*
                do something
            */
            done();
        }
    },
    function(done){
        var img=new Image();
        img.src="2.png";
        img.onload=function(){
            /*
                do something
            */
            done();
        }
    },
    function(done){
        var img=new Image();
        img.src="3.png";
        img.onload=function(){
            /*
                do something
            */
            done();
        }
    }
],function(){
    /*
        all tasks have been done
    */
    console.log("end");
});


// 下面是利用util.map紧凑型写法
var images=["1.png","2.png","3.png"];
util.concurrentTask(util.map(images,function(src,i){
   return function(done){
        /*
            do your task,for example:
        */ 
        var img=new Image();
        img.src=src;
        img.onload=function(){
            console.log(i);// 打印的顺序不是固定的
            done();
        }
   }
}),function(){
    console.log("end");
});

```

**serialTask(tasks,callback)**串行执行tasks中的任务
* tasks[Array<Function>] 存放任务的数组
* callback[Function] 所有任务执行完毕后的回掉
```js
var images=["1.png","2.png","3.png"];
util.serialTask(util.map(images,function(src,i){
   return function(done){
        /*
            do your task,for example:
        */ 
        var img=new Image();
        img.src=src;
        img.onload=function(){
            console.log(i);// 打印的顺序一定是有先后顺序的：0,1,2
            done();
        }
   }
}),function(){
    console.log("end");
});
```

###  附录

##### 远程调试
* 使用方法
    * 运行debug/debug-server/DBserver.js 开启服务器
    * 在浏览器访问debug/view/index.html该页面可以实时看到远程客户端的log数据
    * 在index.html页面上端有一个颜色条，<font color="green">绿色</font>表示可用，<font color="orangered">橘黄色</font>表示不可用，检查服务器是否开启或网络。
    * 在移动端引用debug/browser/debug.js脚本，用remote.log(text)打印需要调试的内容

* 说明
目前只支持单向调试，也就是移动端->pc浏览器，pc端不支持交互，无法在pc端输入命令操控移动端。




    