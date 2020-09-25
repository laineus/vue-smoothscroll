var SmoothScroll = require('./src/smoothscroll')
module.exports = {
    install: function (Vue, options) {
        var isVue3 = Vue.version.startsWith('3')
        options = options || { name: 'smoothscroll' }
        Vue.directive(options.name, {
            [isVue3 ? 'mounted' : 'inserted']: function (el, binding) {
                SmoothScroll(el, binding.value['duration'], binding.value['callback'], binding.value['context'], binding.value['axis'])
            }
        })
        var prototype = isVue3 ? Vue.config.globalProperties : Vue.prototype
        Object.defineProperty(prototype, '$SmoothScroll', {
            get: function () {
                return SmoothScroll
            }
        })
    }
}
