# vue基础知识笔记  
## 生命周期  
### 概念：  
vue实例从创建到销毁的过程，开始创建、初始化数据、编译模板、挂载dom、渲染、更新、卸载。  
### 生命周期钩子：  
#### beforeCreate-created： 
监控data数据的变化，并且初始化事件。 
#### created-beforeMount：  
有template选项则将template编译为reader函数，否则将外部模板编译为html。（data数据和模板生成）     
#### beforeMount-mounted（只执行一次）：  
用编译好的html替换，el属性指向的对象，或者对应html标签里的内容。  
#### beforeUpdate-update：  
实时监控数据变化，随时更新dom。  
#### beforeDestroy-destroyed  
解绑vue实例，移除事件监听器，销毁子实例。 
## 父子组件事件数据交互（$children获取所有子组件数组）    
### 父组件向子组件传参（props单向传递）： 
子：  
(1)   
父：  
```javascript
<component msg='' v-bind:str='str' v-bind:arr='arr'></component>
export default {  
	name:'app',  
	data:{  
		return {  
			str:'123456',  
			arr:[1,2,3]
		}  
	}  
}  
```
子：  
```javascript
props:{  
	str:{  
		type:'String',  
		required:true,  
		default:'' 
	},  
	arr:{  
		type:'Array',
		required:true,  
		default:[]  
	}  
}   
```
(2)$parent  
父：  
```javascript
 <component></component>
export default {  
	name:'app',  
	data:{  
		return {  
			str:'123456',  
			arr:[1,2,3]
		}  
	}  
}  
```
子：  
```javascript
mounted(){  
	this.$parent.str='8899';  
} 
```
### 子组件向父组件传参：  
(1) $emit   
子：  
```javascript
<component msg='' v-bind:str='str' v-bind:arr='arr' @click="childMsg"></component>
<div>{childmsg}</div>
export default {  
	name:'app',  
	data(){  
		return {  
			childmsg:''  
		}  
	},  
	method(){
		childMsg:(msg) => {
			this.childmsg=msg.msg
		}
	}  
}
```
父：  
```javascript
data(){  
	return {  
		msg:'123'  
	}  
}    
mounted(){  
	this.$emit('childMsg',{msg:this.msg});  
}  
```
(2)$refs、ref(渲染完成后生成)   
父： 
```javascript 
<component ref="child" ></component>
<div>{childmsg}</div>
export default {  
	name:'app',  
	data(){  
		return {  
			childmsg:''  
		}  
	},  
	mounted(){
		console.log(this.$refs.child.msg) \\123  
	}  
}
```
子： 
```javascript 
data(){  
	return {  
		msg:'123'  
	}  
}    
```
## vue-router组件复用  
### 原因：  
```javascript
{  
  path：'music/:musicId',  
  name:'music',    
  component: resolve => require(['./component/music.vue'],resolve)  
}  
```
路由参数发生改变，但vue-router认为访问的是music.vue，由于music.vue已经渲染，所以直接复用，不会执行初始生命周期函数。  
### 解决方法：  
```javascript
watch:{  
	'$route':function(to,from){  
		if(to.name=='music'){  
			//执行初始化操作 （首次挂载路由监听无效，需created或mounted初始化）  
		}  
	}  
}  
```
## $nextTick  
### 由来：  
vue数据驱动视图更新，是异步的，及修改数据的当下，视图不会更新，等同一事件循环中所有数据变化完成后，在统一进行更新。  
### 应用场景： 
created、mounted操作渲染后的Dom，视图更新后对新的视图进行操作。 
#### 实例：  
```javascript
<span v-for="(item,index) in arr">{{item}}</span>  
<input type="text" name="" ref="btn" v-show='isShow'>  
<button  @click="nexttickfun">push</button>   
data(){  
	return {  
		arr:[1,2,3,4,5],  
		isShow:false  
	}  
},  
created(){  
	console.log(this.arr+'init')  
	this.arr.push(6);  
	console.log(this.arr+'push');  
	this.$nextTick(function(){  
		this.$refs.btn.value='666';  
	})  
},  
methods:{  
	nexttickfun(){  
		this.isShow=true;  
		this.$nextTick(function(){  
			this.$refs.btn.focus();   
		})  
	}  
}  
```
## vue优化  
### 项目优化：  
#### 懒加载（按需加载）方式：  
1、vue异步组件技术：  
```javascript
resolve => require(['@/components/name'],resolve)  
```
2、es import：  
```javascript
() => import('@/components/name')  
```
3、webpack   
```javascript
require.ensure():r => require.ensure([],() => r(require('@/components/name'),'name'))  
```

  






