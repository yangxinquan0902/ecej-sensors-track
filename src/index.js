import event from './event/index';
import './utils/collectRouterStack';

const SA = (__DEV__) => {
    /**
     * url的domain解析失败
     * 原因：当前页面域名 domain 无法解析（比如：www.biz.work、localhost、192.168.11.23 等）
     */
    window.sensors = window['sensorsDataAnalytic201505'];

    // 配置项
    const config = {
        // SDK 使用的一个默认的全局变量，如定义成 sensors 的话，后面可以使用 sensors.track() 用来跟踪信息
        name: 'sensors',
        // 数据接收地址
        server_url: __DEV__ ? 'https://sa.ecej.com:4106/sa?project=default' : 'https://sa.ecej.com:4106/sa?project=ecejuserapp',
        // 设置 true 后会在网页控制台打 logger，会显示发送的数据,设置 false 表示不显示。
        show_log: __DEV__ ? true : false,
        /**
         * send_type: 默认值 'image' 表示使用图片 get 请求方式发数据，
         * ( 神策系统 1.10 版本以后 ) 可选使用 'ajax' 和 'beacon' 方式发送数据，这两种默认都是 post 方式， beacon 方式兼容性较差
         */
        send_type: 'image',
        /**
         * max_string_length: 通用字符串最大长度，超过部分会被截取丢弃（由于超过 7000 的字符串会导致 url 超长发不出去，所以限制长度），默认值：500
         */
        max_string_length: 2000,

        // Web 元素点击($WebClick)
        heatmap: {
            // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
            clickmap: 'not_collect',
            // 视区停留事件($WebStay)
            scroll_notice_map: 'default',
            collect_tags:{
                div : true
            }
        }
    };


    // 初始化神策埋点,开始给神策后台发送数据
    window.sensors.init(config);

    
    window.sensors.quick('isReady',function(){
       
    });

    // 把event里面的事件都放在window对象下
    // 注意：Object.entries属于ES8的新特性，所以要在tsconfig.json中添加 "lib": ["DOM", "ES6", "es2017"],
    Object.entries(event).forEach((item)=>{
        window[item[0]] = item[1];
    });

};

export default SA;