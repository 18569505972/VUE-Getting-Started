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
## computed、watch、methods
### 区别：
computed：关联元素变化就调用  
watch：键发生变化就调用    
methods：满足条件时调用  
## query与params区别
query会拼接到url后面，params不会，params得在路由中定义，两者可以同时使用  
path的时候params写在path中    
## vuex命名空间namespaced 
```javascript
export default{
	state:{},
	getters:{},
	mutations:{},
	actions:{},
	namespaced：true
}
```
调用其他模块actions：dispatch('模块路径',参数,{root:true})  
调用其他模块getters：rootGetters[路径]  
调用其他模块state：rootState.模块参数名    
调用其他模块mutations:commit('模块路径',参数,{root:true})
## 父子组件事件数据交互（$children获取所有子组件数组）    
### 父组件向子组件传参（props单向传递）：   
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
父：  
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
子：  
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
或者  
```javascript
beforeRouteUpdate(to,from,next){
	//监听变化
}
```
## routes配置参数：
path：路径  
name:命名路由  
aligns：路由别名  
redirect:路由重定向  
meat：传递自定义数据  
children：组件嵌套  
component：组件  
components:多个视图组件  
```javascript
<router-view name="a"></router-view>
<router-view name="b"></router-view>
routes=[
	{
		path：'/',
		name:'index',
		components:{
			a:组件a,
			b:组件b
		}
	}
]
```
## mode设置导航模式：  
###hash模式（默认值）    
将URL hash值作为路由，支持所有浏览器，包括IE9一下不支持H5 history的浏览器。  
### history模式  
h5 history api和服务器配置  
## base设置路由基路径：  
设置后router-link不需要写基路径。  
## fallback（默认true）：  
若不支持history模式，则会退到hash模式。支持hash模式下，服务端渲染。  
## router-link属性：  
#### to：  跳转地址  
#### replace:  调用router.replace(),不会留下history记录  
#### append：  相对路径前增加基路径，如/a导航到b，不加为/b，加了为/a/b  
#### tag：  渲染成某种html标签  
#### active-class：激活链接时所用的css类名，全局配置linkActiveClass。  
#### exact-active-class：精确匹配激活的类名，全局配置linkExactActiveClass 。  
#### exact：  匹配模式，路由完全匹配时才添加css激活类名。  
#### 绑定事件：  @click.native='事件名'  
#### 较与a的好处：  
无论是 HTML5 history 模式还是 hash 模式，它的表现行为一致，所以，当你要切换路由模式，或者在 IE9 降级使用 hash 模式，无须作任何变动。   
在 HTML5 history 模式下，router-link 会守卫点击事件，让浏览器不再重新加载页面。  
当你在 HTML5 history 模式下使用 base 选项之后，所有的 to 属性都不需要写 (基路径) 了。   
## keep-alive：  
包裹在router-view组件外面，第一次触发生命钩子created、mounted、activated，退出时触发deactivated,再次进入（浏览器前进后退）只触发activated，不用发起初始化请求。  
启用：路由meta中配置keepAlive:true  
## 组件过度  
### 适用范围：  
组件根节点、v-if、v-show、动态组件  
### 过度类名：  
v-enter：过度开始状态，元素插入之前生效  
v-enter-active：过度生效时状态  
v-enter-to:过度完成时状态  
v-leave：离开过渡开始状态  
v-leave-active：离开生效时状态  
v-leave-to：离开结束状态  
### 实例：  
```javascript
<transition name="fade">
	<p v-if="show">666</p>
</transition>
export default{
	data(){
		return {
			show:true  
		}  
	}  
}  
<style>  
.fade-enter-active,.fade-leave-active{  
	transition: opacity 1s;  
}  
.fade-enter,.fade-leave{  
	opacity: 0;  
}  
</style>  
```
## vue-router钩子函数：  
### 类别：  
#### 1、全局钩子  
beforeEach、beforeResolve、beforeAfter  
```javascript
const router=new Vuerouter({...})  
router.beforeEach((to,from,next)=>{
	//
	next()
})
```
#### 2、路由钩子  
beforeEnter  
```javascript
const router=new Vuerouter({
	routes:[
		{
			path:'/',
			name:'index',
			component:index,
			beforEnter:(to,from,next)=>{
				//
				next()
			},
			beforLeave:(to,from,next)=>{
				//
				next()
			}
		}
	]
})
```
#### 3、组件内钩子  
beforeRouterEnter、beforRouterUpdate、beforRouterLeave  
```javascript
export default{
	data(){
	
	},
	methods:{

	},
	beforeRouterEnter:(to,from,next)=>{
		//当前组件路由确认前调用
		//不能获取到this，组件实例还未创建
		next()
	},
	beforeRouterUpdate:(to,from,next)=>{
		//组件复用是调用  
		//可以获取到this
	}，
	beforerouterLeave:(to,from,next)=>{
		//组件路由离开时调用
		//可以获取到this
	}
}
```
### 执行顺序：  
全局beforeEach——>如果存在组件复用则调beforeRouterUpdate——>路由配置beforeEnter——》激活组件调用beforeRouterEnter——>全局beforeResolve——>导航被确认——>全局afterEach——>dom更新——>beforeRouterEnter的next回调。  
### 运用:  
#### (1)清除定时器  
beforeRouterLeave内清除组件内部定时器，避免占据缓存。
#### (2)跳转拦截  
beforeRouterLeave页面内有未完成的操作，阻止页面跳转。
#### (3)页面遮罩  
beforeEach通过改变提交vuex遮罩状态，控制遮罩的显示。
#### (4)登录拦截  
beforeEach判断用户登录状态，未登录跳转登录页。  
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
2、第三方插件运用cdn  
### 代码优化：
1、频繁切换场景使用v-show，其他场景尽量使用v-if，减少dom数量  
2、for循环添加key  
3、watch慎用deep：true（便利对象属性）   
4、少用watcher    
## axios  
### 功能特性：
1、在浏览器发送XMLHttpRequests请求（不是ajax）  
2、nodeJs发送http请求   
3、支持promise API  
4、拦截请求和响应    
5、转换请求和响应数据    
6、自动转换成JSON数据     
7、取消请求   
7、防止xsrf（跨站请求伪造）攻击，header内设置token值  

  






