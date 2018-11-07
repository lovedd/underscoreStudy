/**
 * debounce：防抖。在事件触发的n秒后才开始执行，如果在触发后的n秒内再次触发，会重新刷新等待时间，直到n秒内不再触发时执行。
 */

let  count = 1;
let  container = document.getElementById('container');


function getUserAction(e) {
    container.innerHTML = count++;
    console.log(3, this);
    console.log('e', e);
    return count;
}

// no debounce
// container.onmousemove = getUserAction;

// debounce v1
function debounceV1(func, time) {
    let handler;
    console.log(1, this);
    return function() {
        console.log(2, this);
        clearTimeout(handler);
        handler = setTimeout(func, time);
    }
}
// container.onmousemove = debounceV1(getUserAction, 300);

// debounce v2  纠正this指向
function debounceV2(func, time) {
    let handler;
    console.log(1, this);
    return function() {
        console.log(2, this);
        clearTimeout(handler);
        handler = setTimeout(func.bind(this, ...arguments), time);
    }
}
// container.onmousemove = debounceV2(getUserAction, 300);

// debounce v3 不是每次都需要clearTimeOut
function debounceV3(func, time) {
    let handler;
    return function() {
        let args = arguments;
        if (handler) {
            clearTimeout(handler);
        }
        handler = setTimeout(() => {
            console.log(2, this);
            handler = null;
            func.apply(this, args);
        }, time);
    }
}
// container.onmousemove = debounceV3(getUserAction, 300);

// debounce v4 需要支持立即执行
function debounceV4(func, time, immediate) {
    let handler;
    return function() {
        let args = arguments;
        if (handler) {
            clearTimeout(handler);
        }
        if (immediate && !handler) {
            func.apply(this, args);
        }
        handler = setTimeout(() => {
            console.log(2, this);
            handler = null;
            func.apply(this, args);
        }, time);
    }
}
// container.onmousemove = debounceV4(getUserAction, 300, true);

//debounce v5 支持返回传入函数的返回值，在每次debounce时返回,意义不大，只能返回立即执行的result。应该在func执行的时候对func的执行结果暴露到一个回调函数进行处理
function debounceV5(func, time, immediate) {
    let handler;
    let result;
    return function () {
        let args = arguments;
        immediate = immediate && !handler;
        if (handler) {
            clearTimeout(handler);
        }

        handler = setTimeout(() => {
            console.log(2, this);
            handler = null;
            func.apply(this, args);
        }, time);

        if (immediate) {
            result = func.apply(this, args);
            return result;
        }
    }
}

container.onmousemove = function() {
    console.log(4, this);
    let args = arguments;
    let res = debounceV5.call(this, getUserAction, 300, true).call(this, ...args);
    console.log('res', res);
};

//debounce v6 支持返回传入函数的返回值