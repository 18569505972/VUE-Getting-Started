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
\<component msg='' v-bind:str='str' v-bind:arr='arr'\>\<\/component\\\>
export default {  
	name:'app',  
	data:{  
		return {  
			str:'123456',  
			arr:[1,2,3]
		}  
	}  
}
子：  
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
(2)$parent  
父：  
 \<component \>\<\/component\\\>
export default {  
	name:'app',  
	data:{  
		return {  
			str:'123456',  
			arr:[1,2,3]
		}  
	}  
}
子：  
mounted(){  
	this.$parent.str='8899';  
} 
### 子组件向父组件传参：  
(1) $emit 
子：  
\<component msg=''\ v-bind:str='str' v-bind:arr='arr' @click="childMsg">\<\/component\>
\<div\>{childmsg}\<\/div\>
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
父：  
data(){  
	return {  
		msg:'123'  
	}  
}    
mounted(){  
	this.$emit('childMsg',{msg:this.msg});  
}  
(2)$refs、ref(渲染完成后生成)   
父：  
 \<component ref="child" \>\<\/component\>
\<div\>{childmsg}\<\/div\>
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
子：  
data(){  
	return {  
		msg:'123'  
	}  
}    
## vue-router组件复用  
### 原因：  
{  
  path：'music/:musicId',  
  name:'music',  
  component: resolve => require(['./component/music.vue'],resolve)  
}  
路由参数发生改变，但vue-router认为访问的是music.vue，由于music.vue已经渲染，所以直接复用，不会执行初始生命周期函数。  
### 解决方法：  
watch:{  
	'$route':function(to,from){  
		if(to.name=='music'){  
			//执行初始化操作 （首次挂载路由监听无效，需created或mounted初始化）  
		}  
	}  
}  
## vue优化  
### 项目优化：  
#### 懒加载（按需加载）方式：  
1、vue异步组件技术：resolve => require(['@/components/name'],resolve)  
2、es import：() => import('@/components/name')  
3、webpack require.ensure():r => require.ensure([],() => r(require('@/components/name'),'name'))

  






