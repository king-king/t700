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

* remove：用来从页面上移除该元素，不必关心该DOM元素是否在页面上。
* bindEvent：为该元素绑定事件，返回值具有remove方法，可以移除绑定的事件。
* transform：可以改变元素的x、y、z、scale、rotate5个属性。
* onDrag：可以在该元素上监听拖拽事件，如果需要物体移动，需要重写onMove、onEnd函数。
* css：可以为元素设定css

### basic.js 中的接口
该文件中的接口都在util名字空间下

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



    