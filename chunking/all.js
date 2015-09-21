(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _tag = require('./tag');

var _tag2 = _interopRequireDefault(_tag);

var exercises = ["if n == 0:\n" + "    return 'zero'", "if n == 1:\n" + "    return 'one'", "if n == 2:\n" + "    return 'two'\n" + "elif n == 3:\n" + "    return 'three'", "if n == 4:\n" + "    return 'four'\n" + "elif n == 5:\n" + "    return 'five'\n" + "elif n == 6:\n" + "    return 'six'", "if n == 1:\n" + "    return 'ten'", "if n == 7:\n" + "    return 'seventy'\n" + "elif n == 8:\n" + "    return 'eighty'", "while n > 0:\n" + "    n, digit = n // 10, n % 10", "list = []", "list.append('one')", "list = []", "list.append(name_of_integer(1))", "list = []", "list.append(name_of_integer(n))", "def name_of_digit(n):\n" + "    if n == 0:\n" + "        return 'zero'\n" + "    elif n == 1:\n" + "        return 'one'", "n, d = tuple", "name_of_fraction((0, 100))", "return name_of_integer(n) + ' tenth'", "return name_of_integer(n) + ' one hundredth'", "return name_of_integer(n) + ' one one thousandth'", "assert name_of_digit(0) == 'zero'", "assert name_of_digit(1) == 'one'", "assert name_of_digit(2) == 'two'", "assert name_of_digit(3) == 'three'", "assert name_of_digit(4) == 'four'", "assert name_of_digit(5) == 'five'", "assert name_of_digit(6) == 'six'", "assert name_of_digit(7) == 'seven'", "assert name_of_digit(8) == 'eight'", "assert name_of_digit(9) == 'nine'", "assert name_of_tens(1) == 'ten'", "assert name_of_tens(2) == 'twenty'", "assert name_of_tens(3) == 'thirty'", "assert name_of_tens(4) == 'forty'", "assert name_of_tens(5) == 'fifty'", "assert name_of_tens(6) == 'sixty'", "assert name_of_tens(7) == 'seventy'", "assert name_of_tens(8) == 'eighty'", "assert name_of_tens(9) == 'ninety'", "assert name_of_fraction((1, 10)) == 'one tenth'", "assert name_of_fraction((2, 100)) == 'two one hundredths'", "assert name_of_fraction((3, 1000)) == 'three one hundredths'", "assert name_of_decimal(98, (7, 10)) == 'ninety eight and seven tenths'", "assert name_of_decimal(98, (0, 10)) == 'ninety eight'", "assert name_of_decimal(0, (7, 10)) == 'seven tenths'", "assert name_of_integer(9) == 'nine'", "assert name_of_integer(2015) == 'two thousand fifteen'", "assert name_in_dollars(0, 7) == 'seven cents'", "assert name_in_dollars(1, 0) == 'one dollar'", "assert name_in_dollars(0, 1) == 'one cent'", "assert name_in_dollars(2, 3) == 'two dollars and three cents'", "assert name_of_number('1') == 'one'", "assert name_of_number('10') == 'ten'", "assert name_of_number('123') == 'one hundred twenty three'", "assert name_of_number('12.5') == 'twelve and five tenths'", "assert name_of_number('$3') == 'three dollars'", "assert name_of_number('$4.50') == 'four dollars and fifty cents'"];

var ShowExercise = _tag2["default"].define('ShowExercise', 0);
var _EnteringInput = _tag2["default"].define('EnteringInput', 1);
var Congratulate = _tag2["default"].define('Congratulate', 0);

var Main = React.createClass({
    displayName: "Main",

    getInitialState: function getInitialState() {
        return { current: 0,
            input: '',
            exercises: exercises,
            state: ShowExercise
        };
    },

    componentDidUpdate: function componentDidUpdate() {
        localStorage.state = JSON.stringify(this.state);
    },

    showExercise: function showExercise() {
        this.setState({ state: ShowExercise });
    },

    enterInput: function enterInput() {
        var _this = this;

        this.countdownInterval = setInterval(function () {
            _this.state.state.match({
                EnteringInput: function EnteringInput(_ref) {
                    var countdown = _ref.countdown;

                    if (countdown === 1) {
                        clearInterval(_this.countdownInterval);
                    }

                    _this.setState({
                        state: _EnteringInput({ countdown: countdown - 1 })
                    });
                },
                "default": function _default() {
                    clearInterval(_this.countdownInterval);
                }
            });
        }, 1000);

        this.setState({
            state: _EnteringInput({ countdown: 3 })
        }, function () {
            React.findDOMNode(_this.refs.input).focus();
        });
    },

    /*inputKeyDown(e) {
        if (e.keyCode === 9) {
            let val   = e.target.value,
                start = e.target.selectionStart,
                end   = e.target.selectionEnd;
             this.setState({
                input: val.substring(0, start) + '    ' + val.substring(end)
            }, ()=> {
                e.target.selectionStart = e.target.selectionEnd = start + 1;
            });
             e.preventDefault();
            return false;
        }
    },*/

    changeInput: function changeInput(e) {
        var _this2 = this;

        if (e.target.value === exercises[this.state.current]) {
            this.setState({
                state: Congratulate
            }, function () {
                React.findDOMNode(_this2.refs.next).focus();
            });
        } else {
            this.setState({
                input: e.target.value
            });
        }
    },

    nextExercise: function nextExercise() {
        this.setState(function (state) {
            return {
                state: ShowExercise,
                current: state.current + 1,
                input: ''
            };
        });
    },

    render: function render() {
        var _this3 = this;

        return this.state.state.match({
            Congratulate: function Congratulate() {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "p",
                        null,
                        "Congratulations, that's correct!"
                    ),
                    React.createElement(
                        "button",
                        { ref: "next", onClick: _this3.nextExercise },
                        "Next"
                    )
                );
            },
            ShowExercise: function ShowExercise() {
                var exercise = exercises[_this3.state.current];

                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "p",
                        null,
                        "Memorize the following, then when you’re ready to re-enter it, click “Flip.”"
                    ),
                    React.createElement("textarea", { rows: "25", cols: "80", readOnly: true, value: exercise }),
                    React.createElement(
                        "button",
                        { onClick: _this3.enterInput },
                        "Flip"
                    )
                );
            },
            EnteringInput: function EnteringInput(_ref2) {
                var countdown = _ref2.countdown;

                var input = _this3.state.input;

                if (countdown === 0) {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "p",
                            null,
                            "Enter the code you just saw.  You can flip back to look at it again now"
                        ),
                        React.createElement("textarea", { rows: "25", cols: "80", value: input, onChange: _this3.changeInput }),
                        React.createElement(
                            "button",
                            { onClick: _this3.showExercise },
                            "Flip"
                        )
                    );
                } else {
                    var _input = _this3.state.input;

                    return React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "p",
                            null,
                            "Enter the code you just saw.  You can flip back to look at it again in ",
                            countdown,
                            " seconds..."
                        ),
                        React.createElement("textarea", { rows: "25", cols: "80", ref: "input", value: _input,
                            onKeyDown: _this3.inputKeyDown,
                            onChange: _this3.changeInput }),
                        React.createElement(
                            "button",
                            { disabled: true },
                            "Flip"
                        )
                    );
                }
            }
        });
    }
});

var main = React.render(React.createElement(Main, null), document.getElementById('main'));

},{"./tag":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
        key: 'toJSON',
        value: function toJSON() {
            return [this.name].concat(this.args);
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
        value: function define(name, nargs) {
            if (nargs === 0) {
                return new Tag(name);
            }

            return function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                if (args.length !== nargs) {
                    throw new Error('Tag constructor "' + name + '" expects ' + nargs + ' arguments, not ' + args.length);
                }

                return new (_bind.apply(Tag, [null].concat([name], args)))();
            };
        }
    }, {
        key: 'fromJSON',
        value: function fromJSON(_ref) {
            var _ref2 = _toArray(_ref);

            var name = _ref2[0];

            var args = _ref2.slice(1);

            return new (_bind.apply(Tag, [null].concat([name], _toConsumableArray(args))))();
        }
    }]);

    return Tag;
})();

exports['default'] = Tag;
module.exports = exports['default'];

},{}]},{},[2,1]);
