// https://wangdoc.com/javascript/dom/mutationobserver.html
(function(win) {
    'use strict';
    const intervalTime = 5000;
    const doc = win.document;
    const MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    const apiCheck = "http://222.28.84.165:39001/content";
    var insertedNodes = [];
    var mutationRecords = [];

    function _in_array(target, array) {
        for (let i = 0; i < array.length; i++) {
            if (target === array[i]) return true;
        }
        return false;
    }

    function _post_correct(textNode) {
        console.log(textNode);
        // 这里就是个模拟的
        var text = textNode.textContent;
        text = text.replace(/([\D]*)([\d]+)([\D]*)/g, "$1<s>$2</s>$3");
        $(textNode).replaceWith(text);
        // 通过这里来接校对接口
        // $.post(apiCheck, { suggest: txt }, function(result) {
        //     $(textNode).replaceWith(result);
        // });
    }

    function _text_callback(mutations, observer) {
        // console.log(mutations, observer);
        mutations.forEach(function(mutation) {
            // console.log(mutation);
            console.log(mutation.target.data);
            if (mutation.type == 'characterData') {
                mutationRecords.push(mutation);
            }
        });
    }

    function _dom_callback(mutations, observer) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                // [2] 在这里也监听普通的text元素
                var observer = new MutationObserver(_text_callback);
                observer.observe(mutation.addedNodes[i], { characterData: true, characterDataOldValue: true });
                // insertedNodes.push(mutation.addedNodes[i]);
            }
        });
        // console.log(insertedNodes);
    }

    function Scheck(elementid, elementleaf) {
        this._ele = document.getElementById(elementid);
        this._leaf = elementleaf;
        this._config = { attributes: true, childList: true, subtree: true };
        // [1] 在这里监听dom树的改变
        this._observer = new MutationObserver(_dom_callback);
        // this._observer.observe(this._ele, { childList: true, subtree: true, characterData: true, characterDataOldValue: true });
        this._observer.observe(this._ele, { childList: true, subtree: true });


        this._observers = [];
        // [2] 在这里监听普通的text元素
        var elements = this._ele.querySelectorAll('p');
        for (var j = 0; j < elements.length; j++) {
            var element = elements[j];
            var observer = new MutationObserver(_text_callback);
            observer.observe(element, { characterData: true, characterDataOldValue: true });
        }

        this.intervalID = 0;
        this.startlistener();
    }

    Scheck.prototype = {
        GetAllRec() {
            console.log(mutationRecords)
            var filter = []
            for (let index = mutationRecords.length - 1; index > 0; index--) {
                const prev = mutationRecords[index - 1];
                const next = mutationRecords[index];
                if (!_in_array(mutationRecords[index].target, filter)) {
                    filter.push(mutationRecords[index].target)
                }
            }
            for (let index = 0; index < filter.length; index++) {
                _post_correct(filter[index])
            }
            mutationRecords = [];
        },
        UnbindAll() {
            this._observer.disconnect();
            for (let index = 0; index < this._observers.length; index++) {
                const element = this._observers[index];
                element.disconnect();
            }
        },
        startlistener() {
            var that = this;
            this.intervalID = window.setInterval(function() {
                that.GetAllRec()
            }, intervalTime);
        },

        stoplistener() {
            console.log('stoplistener');
            clearInterval(this.intervalID);
        },
        // check() {
        //     // 检查是否匹配已储存的节点
        //     for (var i = 0; i < this._listeners.length; i++) {
        //         var listener = this._listeners[i];
        //         // 检查指定节点是否有匹配
        //         var elements = doc.querySelectorAll(listener.selector);
        //         for (var j = 0; j < elements.length; j++) {
        //             var element = elements[j];
        //             listener.fn.call(element, element);
        //         }
        //     }
        // },
    }

    // 对外暴露这个
    win.Scheck = Scheck;

})(this);