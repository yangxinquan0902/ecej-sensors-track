import { browerType, isExist, getQuerys, isObject, isNoop, noopFnTips } from '../utils';

// 页面名称映射表
let pageName = {
    'page/poster': '海报页',
    'goods-detail': '商品详情页面',
    'goodsList': '商品列表页面',
    'login': '登录页面',
    'order-list': '订单列表页面',
    'applyRefund': '申请退货退款页面',
    'store-main': '店铺页面',
    'member-shop': '店铺会员页面',
    'store-goods-search': '店铺搜索页面',
    'store-goods-cates': '店铺分类页面',
    'store-goods-list': '店铺商品列表页面',
    '/search': '搜索页面',
    'purchase-order': '购物车页面',
    'order-confirm': '订单确认页面',
    'order-detail': '订单详情',
    'pay-online': '订单支付页面',
    'user-center': '用户中心页面',
    'pay-success': '订单支付成功页面',
    'receive-address-city': '选择收货地址',
    'applySuccess': '退货退款成功页面',
    'order-sku-list': '确认订单-商品清单',
    'search-city':'城市搜索',
    'select-city':'城市搜索',
    'error': '404页面',
};
// 页面的源
let Origin = location.origin;
// 根据CurPageUrl展示CurPage
const getNameByCurPageUrl = (CurPageUrl)=>{
    if(!CurPageUrl) return '没有获取到内容';
    // 映射表里面有则替换,没有就取CurPageUrl
    let res = CurPageUrl;
    Object.keys(pageName).forEach((item)=>{
        /*
            '/': 统计路由栈时传递
            Origin + '/': 'https://stemobile.ecej.com/' 或者 'https://stemobile.ecej.com/?noNavbar=1'
        */
        if(
            CurPageUrl === '/' || 
            CurPageUrl.split('?')[0] === Origin + '/'
        ){
            res = presetProperties.productLineName + '首页';
        }else if(CurPageUrl.includes(item)){
            res = pageName[item];
        }
    });
    return res;
};
// 参数默认值处理 空值处理成'-1'
const defaultParamsFn = (params)=>{
    Object.keys(params).forEach((item)=>{
        params[item] = isNoop(params[item]) ? '-1' : params[item];
    });
};


let ecejCityId = sessionStorage.getItem('ecejCityId');
let cityName = sessionStorage.getItem('cityName');
// 用户信息
let LOGIN_DATA = localStorage.getItem('b2b-wechat@login');
// 微信小程序分享信息
let is_from_wx_share = localStorage.getItem('is_from_wx_share');




// 设置用户属性, 在wm_sta.js的getUserId方法中调用
const definedUserProps = async (userInfo)=>{
    let property = {
        userId: null,
        userName: null,
    };
    // 缓存优先
    if(isExist(LOGIN_DATA) && JSON.parse(LOGIN_DATA).customerId){
        property.userId = JSON.parse(LOGIN_DATA).customerId;
        property.userName = JSON.parse(LOGIN_DATA).accountName;
    }else if(isExist(userInfo)) {
        property.userId = userInfo.customerId;
        property.userName = userInfo.accountName;
    }
    window.sensors.login(property.userId);
    window.sensors.setProfile(property);
};


// 设置预置属性
let presetProperties = {
    productLine: 'ecej-market', // 产品线
    productLineName: 'E家集市',
    CurPageUrl: null,
    // 城市信息
    cityId: ecejCityId ? ecejCityId : null,
    city: cityName ? cityName : null,

    // wx-mini(微信小程序), wx-browser(微信浏览器)，ios，android
    browerType: null,

    // source: wx 或者 distribution(分发)
    source: isExist(is_from_wx_share) ? JSON.parse(is_from_wx_share).source : null,
    share_distinct_id: isExist(is_from_wx_share) ? JSON.parse(is_from_wx_share).share_distinct_id : null,
    share_url_path: isExist(is_from_wx_share) ? JSON.parse(is_from_wx_share).url_path : null,

    Refpage: null,

    // 渠道相关
    channel_id: null,        // 渠道号
    channel_source: null,    // 渠道来源
    channel_platfrom: null,  // 平台
    channel_location: null,  // 资源
    channel_type: null,      // 类目
    channel_content: null,   // 事件
    channel_batch: null,     // 批次
    channel_track_key: null, // key

    // 平台platform (用于区分是浏览器模拟器还是手机用户)
    ecej_platform: null,

    userId: isExist(LOGIN_DATA) && JSON.parse(LOGIN_DATA).customerId,
    
};

// 处理预置属性
const dealWithPresetParamsFn = async (params)=>{
    // console.log("getQuerys>>>", getQuerys(window.location));
    let querys = getQuerys(window.location);
    if(JSON.stringify(querys) !== '{}'){
        presetProperties.channel_id = querys.channel_id;
        presetProperties.channel_source = querys.channel_source;
        presetProperties.channel_platfrom = querys.channel_platfrom;
        presetProperties.channel_location = querys.channel_location;
        presetProperties.channel_type = querys.channel_type;
        presetProperties.channel_content = querys.channel_content;
        presetProperties.channel_batch = querys.channel_batch;
        presetProperties.channel_track_key = querys.channel_track_key;
    }


    presetProperties.cityId = sessionStorage.getItem('ecejCityId');
    presetProperties.city = sessionStorage.getItem('cityName');
    presetProperties.browerType = await browerType();
    // 传入优先
    presetProperties.CurPageUrl = params.CurPageUrl ? params.CurPageUrl : window.location.href;


    // 获取来源
    let ecej_stack = isExist(localStorage.getItem('ecej_stack')) && localStorage.getItem('ecej_stack').split(',') || [];
    let referrel = ecej_stack && ecej_stack.length > 1 ? ecej_stack[1] : '/';
    console.log('referrel>>>>', referrel);
    presetProperties.Refpage = getNameByCurPageUrl(referrel);

    // 重新获取数据，防止有数据更新
    is_from_wx_share = localStorage.getItem('is_from_wx_share');
    if(isExist(is_from_wx_share)){
        presetProperties.source = JSON.parse(is_from_wx_share).source;
        presetProperties.share_distinct_id = JSON.parse(is_from_wx_share).share_distinct_id;
        presetProperties.share_url_path = JSON.parse(is_from_wx_share).page;
    }

    // 用户来自的平台
    presetProperties.ecej_platform = window.navigator.platform.includes('Win') ? 'PC' : 'Mobile';
};

// 特殊参数处理
const dealWithSpecialParamsFn = (params)=>{
    // ecejgoodsPrice是string类型 '¥0.02' => '0.02'
    if(params.ecejgoodsPrice){
        params.ecejgoodsPrice = typeof params.ecejgoodsPrice === 'string' && params.ecejgoodsPrice.includes('¥') ? params.ecejgoodsPrice.split('¥')[1] : params.ecejgoodsPrice;
    }

    // number => string
    let speArr = [
        'ecejgoodsNum', 
        'ecejgoodsStock', 
        'ecejpayOrderPrice', 
        'ecejtotalPrice', 
        'ecejGoodsCateId', 
        'ecejComponentKey',
        'ecejComponentPosition',
        'contentPosition'
    ];
    for(var item in params){
        if(speArr.includes(item)){
            params[item] += '';
        }
    }
};

// 统计H5的页面浏览相关
const autoTrack = async (params = {})=>{
    await window.customSensorsCodeTrack('H5PageVisit', params);
};
// 统计H5的页面点击相关
const clickTrack = async (params = {}) => {
    await window.customSensorsCodeTrack('H5PageClick', params);
};
// 统计H5的页面曝光相关
const exposureTrack = async (params = {})=>{
    await window.customSensorsCodeTrack('H5Exposure', params);
};
// 统计底部导航按钮
const buttonIconTrack = async (params = {})=>{
    await window.customSensorsCodeTrack('BottomIcon', params);
};
/* 
    自定义埋点
    pointName是自定义事件名
*/
const customSensorsCodeTrack = async(pointName = noopFnTips('事件名'), params = {}, cb) => {
    try {
        // 预置属性处理
        await dealWithPresetParamsFn(params);
        // 特殊参数处理
        dealWithSpecialParamsFn(params);
        // 参数默认值处理
        defaultParamsFn(params);
        const newParams = {
            ...presetProperties,
            CurPage: getNameByCurPageUrl(presetProperties.CurPageUrl),
            ...params
        };
        await window.sensors.track(pointName, newParams, cb && cb());
    } catch(e){
        console.log('sensors is wrong at customSensorsCodeTrack method>>>', e);
    }
};


// 提供一个用于修改预置属性的方法
const modifyPresetProperties = (...res)=>{
    if(isObject(res[0])){
        presetProperties = {
            ...presetProperties,
            ...res[0]
        };
    }else if(res.length === 2){
        presetProperties[res[0]] = res[1];
    }
    
};


// 提供一个修改页面关系隐射表的方法
/*
  createPageName({
        'aaa': 111,
        'bbb': 222
  });
  createPageName('aaa', 999)
*/
const createPageName = (...res)=>{
    if(isObject(res[0])){
        pageName = {
            ...pageName,
            ...res[0]
        };
    }else if(res.length === 2){
        pageName[res[0]] = res[1];
    }
    
};







// SDK会自动收集页面浏览事件(PV, UV)，以及设置初始来源
const pageView = async (params = {})=>{
    try {
        await dealWithPresetParamsFn(params);
        const newParams = {
            ...presetProperties,
            /* 
                CurPage若用户没有传递，则是根据CurPageUrl计算来的
                CurPageUrl，CurPage 用户传递的优先 (params会覆盖)
            */
           CurPage: getNameByCurPageUrl(presetProperties.CurPageUrl),
            ...params
        };
        await window.sensors.quick('autoTrack', newParams);
    } catch(e){
        console.log('sensors is wrong at autoTrack method>>>', e);
    }
};

// 自动搜集点击之后的参数，会携带更多预制属性和自定义属性
/**
 * 增加新方法 trackAllHeatMap ，当调用这个方法时，
 * 此方法的第二个参数可以传入包括 a, input, button, textarea 标签和 div，img 等的所有标签。
 * 而 trackHeatMap 只采集除 a, input, button,textarea 之外的标签
 * ev是代表当前元素(必传，不然没法统计)， cb是回调函数
 * 
 * 注意：当ev获取不到的时候就需要传递ev参数
 */
const webClick = async (params = {}, cb, e) => {
    try {
        await dealWithPresetParamsFn(params);
        const ev = e ? e : event.target;
        // console.log("ev>>>>", ev);
        const newParams = {
            ...presetProperties,
            CurPage: getNameByCurPageUrl(presetProperties.CurPageUrl),
            ...params,
        };
        await window.sensors.quick('trackAllHeatMap', ev, newParams, cb && cb());
    } catch(e){
        console.log('sensors is wrong at clickTrack method>>>', e);
    }
};




export default {
    definedUserProps,
    modifyPresetProperties,
    createPageName,
    autoTrack,
    clickTrack,
    exposureTrack,
    buttonIconTrack,
    customSensorsCodeTrack,
    pageView,
    webClick,
};