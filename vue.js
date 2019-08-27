class Vue {
    constructor(options = {}) {
        // 初始化根dom节点
        this.$el = document.querySelector(options.el)
        // 初始化数据
        this.data = options.data
        // 将data绑定到类this上
        Object.keys(this.data).forEach((key) => {
            this.proxyData(key)
        })
        // 初始化方法
        this.methods = options.methods
        // 任务队列
        this.watcherTask = {}
        // 监听this.data
        this.observe()
        // 解析dom
        this.compile(this.$el)
    }
    // 将data绑定到vue类this上
    proxyData(key) {
        let that = this
        // 关联类与this.data
        Object.defineProperty(that, key, {
            configurable: false,
            enumerable: true,
            get() {
                return that.data[key]
            },
            set(newVal) {
                that.data[key] = newVal
            }
        })
    }
    observe() {
        let that = this
        Object.keys(this.data).forEach((key) => {
        	// 记录旧值
            var value = this.data[key]
            // 给每个data值添加空的任务队列
            this.watcherTask[key] = []
            // 关联data与视图
            Object.defineProperty(this.data, key, {
                configurable: false,
                enumerable: true,
                get() {
                    return value
                },
                set(newVal) {
                	// 对比新旧值
                    if (value !== newVal) {
                    	// 初始化旧值
                        value = newVal
                        // 更新对应的dom视图
                        that.watcherTask[key].forEach((task) => {
                            task.update()
                        })
                    }
                }
            })
        })
    }
    // 初始化解析模板，关联输入与data
    compile(el) {
        let nodes = el.childNodes
        for (let i = 0; i < nodes.length; i++) {
            // 当前为元素节点
            if (nodes[i].nodeType === 1) {
                // 递归解析所有dom
                if (nodes[i].childNodes.length > 0) {
                    this.compile(nodes[i])
                }
                // 解析v-model指令
                if (nodes[i].hasAttribute('v-model')) {
                	let attrVal = nodes[i].getAttribute('v-model')
                	// 监听dom输入
                    nodes[i].addEventListener('input', () => {
                        this.watcherTask[attrVal].push(new Watcher(nodes[i], this, attrVal, 'value'))
                        // 绑定data值
                        this.data[attrVal] = nodes[i].value
                    })
                    nodes[i].removeAttribute('v-model')
                }
                // 解析v-model指令
                if (nodes[i].hasAttribute('@click')) {
                	let attrVal = nodes[i].getAttribute('@click')
                	// 监听点击事件
                    nodes[i].addEventListener('click', (event) => {
                        this.methods[attrVal] && this.methods[attrVal].bind(this)(event)
                    })
                    nodes[i].removeAttribute('@click')
                }
            } else if (nodes[i].nodeType === 3) {
            	// {{}}指令解析
                let text = nodes[i].textContent.trim()
                if (!text) continue
                this.compileText(nodes[i], 'textContent')
            }
        }
    }
    // 解析文本dom
    compileText(node, type) {
        let reg = /\{\{(.*?)\}\}/g,
            txt = node.textContent
        // 文本节点中是否含有{{}}
        if (reg.test(txt)) {
            node.textContent = txt.replace(reg, (matched, value) => {
                let tpl = this.watcherTask[value] || []
                tpl.push(new Watcher(node, this, value, type))
                if (value.split('.').length > 1) {
                    let v = null
                    value.split('.').forEach((val, i) => {
                        v = !v ? this[val] : v[val]
                    })
                    return v
                } else {
                    return this[value]
                }
            })
        }
    }
}
// 更新视图
class Watcher {
    constructor(el, vm, value, type) {
        this.el = el
        this.vm = vm
        this.value = value
        this.type = type
    }
    update() {
        this.el[this.type] = this.vm.data[this.value]
    }
}