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
