// https://wangdoc.com/javascript/dom/mutationobserver.html
(function(win) {
    'use strict';
    var doc = win.document;
    var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    var insertedNodes = [];

    function _post_correct(textNode) {
        console.log(textNode)
        $(textNode).replaceWith("<b>Hello world!</b>")
    }

    function _text_callback(mutations, observer) {
        console.log(mutations, observer);
        mutations.forEach(function(mutation) {
            console.log(mutation.target.data);
            // switch (mutation.type) {
            //     case 'characterData':
            //         break;
            //     case 'childList':
            //         break;
            //     default:
            //         break;
            // }
            // console.log(mutation.oldValue);
            // console.log(observer);
            // _post_correct(mutation.target)
        });
    }

    function _dom_callback(mutations, observer) {
        // console.log(mutations, observer);
        // mutations.forEach(function(mutation) {
        //     switch (mutation.type) {
        //         case 'characterData':
        //             break;
        //         case 'childList':
        //             break;
        //         default:
        //             break;
        //     }
        //     console.log(mutation.oldValue);
        //     console.log(mutation.target);
        //     console.log(observer);
        //     _post_correct(mutation.target)
        // });
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                mutation.addedNodes[i]
                var observer = new MutationObserver(_text_callback);
                observer.observe(mutation.addedNodes[i], { childList: true, subtree: true, characterData: true, characterDataOldValue: true });
                // insertedNodes.push(mutation.addedNodes[i]);
            }
        });
        // console.log(insertedNodes);
    }

    function Scheck(elementid, elementleaf) {
        this._ele = document.getElementById(elementid);
        this._leaf = elementleaf;
        this._config = { attributes: true, childList: true, subtree: true };

        this._observer = new MutationObserver(_dom_callback);
        // this._observer.observe(this._ele, { childList: true, subtree: true, characterData: true, characterDataOldValue: true });
        this._observer.observe(this._ele, { childList: true, subtree: true });

        this._observers = [];
    }

    Scheck.prototype = {
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
        Bind(path) {
            var that = this;
            // first, find all blocks 
            this._ele.querySelectorAll(this._leaf).forEach(block => {
                console.log(block);
                that._textlistener();
                // then highlight each 

            });
            // $("#photos").bind('DOMNodeInserted', function(e) {
            //     alert('element now contains: ' + $(e.target).html());
            // });
        },
        UnbindAll() {
            //使用配置文件对目标节点进行观测

            // 停止监听
            this.observer.disconnect();
        },
        _domlistener() {

        },
        _textlistener() {
            var config = { characterData: true, subtree: true };
            var observer = null
            observer.observe(block, config);
            this._observers.append(observer);
            return observer
        },
        _post() {

        }
    }

    // 对外暴露
    win.Scheck = Scheck;

})(this);