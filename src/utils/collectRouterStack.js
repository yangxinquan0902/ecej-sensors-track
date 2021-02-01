// 搜集路由栈信息

// 初始化的时候，默认首页路由
window.stack = ['/'];
// 每一次重新进入App都重新计算路由栈
localStorage.setItem('ecej_stack', window.stack);

// 对原函数做一个拓展
let rewriteHistoryMode = function(type){
    let origin = window.history[type]; // 先将原函数存放起来
    // 当window.history[type]函数被执行时，这个函数就会被执行
    return function(){ 
      // 执行原函数, arguments是原来的参数
      let result = origin.apply(this, arguments); 
      
      // 自定义事件来触发push,replace事件
      // 定义一个自定义事件
      let e = new Event(type.toLocaleLowerCase());
      // 把默认参数，绑定到自定义事件上，new Event返回的结果，自身上面没有arguments的
      e.arguments = arguments;
      // 触发自定义事件，把e传给自定义事件
      window.dispatchEvent(e);

      return result;
    };
};
  
window.history.pushState = rewriteHistoryMode('pushState'); // 覆盖原来的pushState方法
window.history.replaceState = rewriteHistoryMode('replaceState'); // 覆盖原来的replaceState方法


// 清除路由栈数据
const cleanUpStack = ()=>{
    if(window.stack.length > 2){
        window.stack = window.stack.slice(0, 2);
    }
};

// 前进后退时执行
window.addEventListener('popstate',(e)=>{
    console.log('popstate>>>>', e.target.location.pathname);
    cleanUpStack();
    window.stack.unshift(e.target.location.pathname);
    // console.log("stack>>>", window.stack);
    localStorage.setItem('ecej_stack', window.stack);
});

// 调用history.push时执行
window.addEventListener('pushstate',(e)=>{
    console.log('pushstate>>>>', e.target.location.pathname);
    cleanUpStack();
    window.stack.unshift(e.arguments[2]);
    localStorage.setItem('ecej_stack', window.stack);
});

// 调用history.replace时执行
window.addEventListener('replacestate',(e)=>{
    console.log('replacestate>>>>', e.target.location.pathname)
    cleanUpStack();
    window.stack.unshift(e.target.location.pathname);
    localStorage.setItem('ecej_stack', window.stack);
});