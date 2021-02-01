import wx from 'weixin-js-sdk';

// 区分微信小程序(wx-mini)和微信浏览器(wx-brower)
const isWX_miniApp = (u)=>{
    const ua = u.toLowerCase();
    return new Promise((resolve)=>{
        if(ua.match(/MicroMessenger/i) == 'micromessenger') {
            wx.miniProgram.getEnv((res)=>{
                console.log('res.miniprogram >>>', res.miniprogram);
                const result = res.miniprogram ? 'wx-mini' : 'wx-browser';
                resolve(result);
            });
        }else {
            resolve(null);
        }
        
    });
};

// wx-mini(微信小程序), wx-browser(微信浏览器)，ios，android
export const browerType = async() => {
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    let isWx = await isWX_miniApp(u);
    return  isWx ? isWx : (isAndroid ? 'android' : 'ios');
};

// 获取查询字符串
export const getQuerys = (url)=>{
    const q = {};
    url.search.replace(/([^?&=]+)=([^&]+)/g,(all,k,v)=>{
        return q[k] = v;
    });
    return q;
};


// 判断缓存是否存在
export const isExist = (str)=>{
    return str && str !== 'null';
};


// 是否是对象类型
export const isObject = (obj)=>{
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
};


// 是否为空的数据类型  NaN null undefined '' false
export const isNoop = (obj)=>{
    return obj == null || obj === '' || obj === false || obj !== obj;
};

// 参数没有传递
export const noopFnTips = (str)=>{
    console.log(`%c Warn: ${str}参数是必填的!`, 'color: red;font-weight: bold;font-size: 20px;');
};
