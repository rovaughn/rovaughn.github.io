(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tag = require('./tag');

var _tag2 = _interopRequireDefault(_tag);

var Congratulate = _tag2['default'].define('Congratulate');
var ShowWorkbooks = _tag2['default'].define('ShowWorkbooks');
var ShowExercise = _tag2['default'].define('ShowExercise');
var ShowInput = _tag2['default'].define('ShowInput');

var _DoingExercise = _tag2['default'].define('DoingExercise', {
    input: _tag2['default'].string,
    flip: _tag2['default'].oneOf(ShowExercise, ShowInput)
});
var _InWorkbook = _tag2['default'].define('InWorkbook', {
    currentWorkbook: _tag2['default'].string,
    currentExercise: _tag2['default'].number,
    view: _tag2['default'].oneOf(_DoingExercise, Congratulate)
});

var Workbook = {
    exercises: _tag2['default'].arrayOf(_tag2['default'].string),
    completed: _tag2['default'].number
};

var _State = _tag2['default'].define('State', {
    workbooks: _tag2['default'].objectOf(Workbook),
    substate: _tag2['default'].oneOf(ShowWorkbooks, _InWorkbook)
});

function mapObject(o, f) {
    return Object.keys(o).map(function (k) {
        return f(k, o[k]);
    });
}

// A textarea that does nice things like supports tab.
var Editor = React.createClass({
    displayName: 'Editor',

    inputKeyDown: function inputKeyDown(e) {
        if (e.keyCode === 9) {
            var val = e.target.value,
                start = e.target.selectionStart,
                end = e.target.selectionEnd;

            e.target.value = val.substring(0, start) + '    ' + val.substring(end);
            //e.target.selectionStart = e.target.selectionEnd = start + 1;

            e.preventDefault();
            return false;
        }
    },

    render: function render() {
        if (this.props.readOnly) {
            return React.createElement('textarea', { ref: 'textarea',
                style: this.props.style,
                rows: '25', cols: '80', readOnly: true,
                value: this.props.value });
        } else {
            return React.createElement('textarea', { ref: 'textarea',
                style: this.props.style,
                rows: '25', cols: '80', ref: 'input',
                value: this.props.value,
                onKeyDown: this.inputKeyDown,
                onChange: this.props.onChange });
        }
    }
});

var Main = React.createClass({
    displayName: 'Main',

    getInitialState: function getInitialState() {
        return _State({
            workbooks: this.props.workbooks,
            substate: ShowWorkbooks
        });
    },

    /*componentDidUpdate() {
        localStorage.state = this.state.serialize();
    },*/

    render: function render() {
        var _this = this;

        return this.state.match({
            State: function State(_ref) {
                var workbooks = _ref.workbooks;
                var substate = _ref.substate;
                return substate.match({
                    ShowWorkbooks: function ShowWorkbooks() {
                        var enterWorkbook = function enterWorkbook(name) {
                            return function () {
                                _this.replaceState(_State({
                                    workbooks: workbooks,
                                    substate: _InWorkbook({
                                        currentWorkbook: name,
                                        currentExercise: 0,
                                        view: _DoingExercise({
                                            input: '',
                                            flip: ShowExercise
                                        })
                                    })
                                }));
                            };
                        };

                        return React.createElement(
                            'div',
                            null,
                            React.createElement(
                                'h1',
                                null,
                                'Select a workbook'
                            ),
                            React.createElement(
                                'ul',
                                null,
                                mapObject(workbooks, function (name, workbook) {
                                    return React.createElement(
                                        'li',
                                        { key: name },
                                        React.createElement(
                                            'a',
                                            { href: '#', onClick: enterWorkbook(name) },
                                            React.createElement(
                                                'strong',
                                                null,
                                                name
                                            )
                                        ),
                                        ': ',
                                        workbook.completed,
                                        ' completed out of ',
                                        workbook.exercises.length
                                    );
                                })
                            )
                        );
                    },

                    InWorkbook: function InWorkbook(_ref2) {
                        var currentWorkbook = _ref2.currentWorkbook;
                        var currentExercise = _ref2.currentExercise;
                        var view = _ref2.view;

                        var workbook = workbooks[currentWorkbook];
                        var exercise = workbook.exercises[currentExercise];

                        var nextExercise = function nextExercise() {
                            workbook.completed += 1;

                            if (workbook.completed === workbook.exercises.length) {
                                _this.replaceState(_State({
                                    workbooks: workbooks,
                                    substate: ShowWorkbooks
                                }));
                            } else {
                                _this.replaceState(_State({
                                    workbooks: workbooks,
                                    substate: _InWorkbook({
                                        currentWorkbook: currentWorkbook,
                                        currentExercise: currentExercise + 1,
                                        view: _DoingExercise({
                                            input: '',
                                            flip: ShowExercise
                                        })
                                    })
                                }));
                            }
                        };

                        return view.match({
                            Congratulate: function Congratulate() {
                                return React.createElement(
                                    'div',
                                    null,
                                    React.createElement(
                                        'p',
                                        null,
                                        'Congratulations, that\'s correct!'
                                    ),
                                    React.createElement(
                                        'button',
                                        { ref: 'next', onClick: nextExercise },
                                        'Next'
                                    )
                                );
                            },

                            DoingExercise: function DoingExercise(_ref3) {
                                var input = _ref3.input;
                                var flip = _ref3.flip;

                                var flipToShowInput = function flipToShowInput() {
                                    React.findDOMNode(_this.refs.editor).focus();
                                    _this.replaceState(_State({
                                        workbooks: workbooks,
                                        substate: _InWorkbook({
                                            currentWorkbook: currentWorkbook,
                                            currentExercise: currentExercise,
                                            view: _DoingExercise({
                                                input: input,
                                                flip: ShowInput
                                            })
                                        })
                                    }));
                                };

                                var flipToShowExercise = function flipToShowExercise() {
                                    _this.replaceState(_State({
                                        workbooks: workbooks,
                                        substate: _InWorkbook({
                                            currentWorkbook: currentWorkbook,
                                            currentExercise: currentExercise,
                                            view: _DoingExercise({
                                                input: input,
                                                flip: ShowExercise
                                            })
                                        })
                                    }));
                                };

                                var changeInput = function changeInput(e) {
                                    if (e.target.value === exercise) {
                                        _this.replaceState(_State({
                                            workbooks: workbooks,
                                            substate: _InWorkbook({
                                                currentWorkbook: currentWorkbook,
                                                currentExercise: currentExercise,
                                                view: Congratulate
                                            })
                                        }));
                                    } else {
                                        _this.replaceState(_State({
                                            workbooks: workbooks,
                                            substate: _InWorkbook({
                                                currentWorkbook: currentWorkbook,
                                                currentExercise: currentExercise,
                                                view: _DoingExercise({
                                                    input: e.target.value,
                                                    flip: ShowInput
                                                })
                                            })
                                        }));
                                    }
                                };

                                return flip.match({
                                    ShowExercise: function ShowExercise() {
                                        return React.createElement(
                                            'div',
                                            null,
                                            React.createElement(
                                                'p',
                                                null,
                                                'Memorize the following, then when you’re ready to re-enter it, click “Flip.”'
                                            ),
                                            React.createElement(Editor, { ref: 'editor', readOnly: true, value: exercise }),
                                            React.createElement(
                                                'button',
                                                { ref: 'flip', onClick: flipToShowInput },
                                                'Flip'
                                            )
                                        );
                                    },

                                    ShowInput: function ShowInput() {
                                        return React.createElement(
                                            'div',
                                            null,
                                            React.createElement(
                                                'p',
                                                null,
                                                'Enter the code you just saw.  You can flip back to look at it.'
                                            ),
                                            React.createElement(Editor, { ref: 'editor', style: { marginLeft: '100px' }, value: input, onChange: changeInput }),
                                            React.createElement(
                                                'button',
                                                { ref: 'flip', onClick: flipToShowExercise },
                                                'Flip'
                                            )
                                        );
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

Promise.all(['dumb'].map(function (name) {
    return xr.get('./' + name + '.txt', {}, {
        load: function load(data) {
            return {
                name: name,
                completed: 0,
                exercises: data.trim().split('\n---\n')
            };
        }
    });
})).then(function (workbooks) {
    var o = {};

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = workbooks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var workbook = _step.value;

            o[workbook.name] = workbook;
            delete workbook.name;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    window.main = React.render(React.createElement(Main, { workbooks: o }), document.getElementById('main'));
});

},{"./tag":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function hasType(x, t) {
    if (typeof x === 'undefined') {
        return 'defined';
    } else if (typeof t === 'function' && typeof t.tagName !== 'undefined') {
        return x instanceof Tag && x.name === t.tagName ? null : t.name;
    } else if (typeof t === 'function') {
        return t(x);
    } else if (t instanceof Tag) {
        return x instanceof Tag && x.name === t.name ? null : t.name;
    } else {
        for (var k in x) {
            if (typeof t[k] === 'undefined') {
                return 'object without field "' + k + '"';
            }
        }

        var err = undefined;

        for (var k in t) {
            if (err = hasType(x[k], t[k])) {
                return 'object with field "' + k + '" that is ' + err;
            }
        }
    }
}

var Tag = (function () {
    function Tag(name) {
        _classCallCheck(this, Tag);

        this.name = name;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        this.args = args;
    }

    _createClass(Tag, [{
        key: 'match',
        value: function match(alternatives) {
            var alt = alternatives[this.name];

            if (typeof alt === 'undefined') {
                alt = alternatives['default'];
            }

            if (typeof alt === 'function') {
                return alt.apply(null, this.args);
            } else if (typeof alt === 'undefined') {
                throw new Error('No case provided for "' + this.name + '"');
            } else {
                return alt;
            }
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.name + '(' + this.args.map(JSON.stringify).join(', ') + ')';
        }
    }, {
        key: 'set',
        value: function set(newValues) {
            var oldValues = this.args[0],
                combined = {};

            for (var k in oldValues) {
                combined[k] = oldValues[k];
            }

            for (var k in newValues) {
                combined[k] = newValues[k];
            }

            return new Tag(this.name, combined);
        }
    }], [{
        key: 'define',
        value: function define(name) {
            for (var _len2 = arguments.length, types = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                types[_key2 - 1] = arguments[_key2];
            }

            if (types.length === 0) {
                return new Tag(name);
            }

            var fn = function fn() {
                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                if (args.length !== types.length) {
                    throw new Error('Tag constructor "' + name + '" expects ' + types.length + ' arguments, not ' + args.length);
                }

                for (var i = 0; i < args.length; i++) {
                    var arg = args[i],
                        type = types[i],
                        err = hasType(arg, type);

                    if (err) {
                        throw new Error('Tag constructor "' + name + '" expected argument ' + (i + 1) + ' to be ' + err);
                    }
                }

                return new (_bind.apply(Tag, [null].concat([name], args)))();
            };

            fn.tagName = name;

            return fn;
        }
    }, {
        key: 'any',
        value: function any() {
            return null;
        }
    }, {
        key: 'number',
        value: function number(x) {
            return typeof x === 'number' ? null : 'number';
        }
    }, {
        key: 'string',
        value: function string(x) {
            return typeof x === 'string' ? null : 'string';
        }
    }, {
        key: 'boolean',
        value: function boolean(x) {
            return typeof x === 'boolean' ? null : 'boolean';
        }
    }, {
        key: 'objectOf',
        value: function objectOf(type) {
            return function (x) {
                if (typeof x !== 'object') return 'object';

                var err = undefined;

                for (var k in x) {
                    if (err = hasType(x[k], type)) {
                        return 'object of ' + err;
                    }
                }
            };
        }
    }, {
        key: 'arrayOf',
        value: function arrayOf(type) {
            return function (arr) {
                if (!(arr instanceof Array)) return 'array';

                var err = undefined;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var x = _step.value;

                        if (err = hasType(x, type)) {
                            return 'array of ' + err;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            };
        }
    }, {
        key: 'oneOf',
        value: function oneOf() {
            for (var _len4 = arguments.length, types = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                types[_key4] = arguments[_key4];
            }

            return function (x) {
                var errs = [];
                var err = undefined;

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = types[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var type = _step2.value;

                        if (err = hasType(x, type)) {
                            errs.push(err);
                        } else {
                            return;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return errs.join(' or ');
            };
        }
    }, {
        key: 'validate',
        value: function validate(message, fn) {
            return function (x) {
                return fn(x) ? null : message;
            };
        }
    }]);

    return Tag;
})();

exports['default'] = Tag;
module.exports = exports['default'];

},{}]},{},[2,1]);
