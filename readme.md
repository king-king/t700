# 邀请函系统

### 目录结构
-/lib
    -/util:存放库js脚本
    -/style ：存放库样式表
    
    
### 库的基本机制

* 每个项目必须有一个加载欢迎页面，css类是：“loading-page”。

* 每个页面必须添加名为“page”的css类，同时库会自动为每个页面添加一个带着序号的css类，如第1个页面会被
自动加上css类：“page-0”。

* 每个页面的状态是用css类来表示的，当页面被切出后会被加上类“animate”。如果需要做入场动画，可以在css中
在“.page.animate”下写入场动画。如果需要对不同的页面分别写不同的入场动画（更常见的情况）可以利用框架自
动为page添加的css类，如下：“.page-0.animate”。


### 扩展：每个Node元素都具备的方法

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


### basic.js 中的接口
该文件中的接口都在util名字空间下

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



    