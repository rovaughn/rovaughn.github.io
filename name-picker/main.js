var natural = require('natural');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var lcs = require('./lcs');

var lists = ['Male', 'Female', 'Pokemon', 'Brands'];

var listmemo = {};
var scorememo = {};
var query  = 'charmander charmeleon charizard';
var chosen_lists = new Set();
var tree   = render();
var rootNode = createElement(tree);

document.body.appendChild(rootNode);

function load_list(name, done) {
    if (listmemo[name]) {
        return listmemo[name];
    }

    var req = new XMLHttpRequest();

    req.open('GET', name + '.json', false);
    req.send(null);

    if (req.status === 200) {
        return listmemo[name] = JSON.parse(req.responseText);
    } else {
        throw new Error('SJAX failed');
    }
}

function update() {
    var newTree = render();
    var patches = diff(tree, newTree);

    rootNode = patch(rootNode, patches);
    tree     = newTree;
}

function render() {
    var pieces = query.toLowerCase().split(/\s+/).filter(function(str) {
        return str != '';
    });
    var queryChange = function(e) {
        query = e.target.value;
        scorememo = {};
        update();
    };

    var results = pieces.length > 0 && rank_results(pieces);

    return h('div', [
        h('input', {type: 'text', value: query, onchange: queryChange}),
        h('ul', {className: 'radioset'}, lists.map(function(list) {
            return h('li', [
                h('input', {
                    type: 'checkbox',
                    checked: chosen_lists.has(list),
                    onchange: function(e) {
                        if (e.target.checked) {
                            chosen_lists.add(list);
                        } else {
                            chosen_lists.delete(list);
                        }
                        update();
                    }
                }),
                h('label', list)
            ]);
        })),
        results ?
        h('ol', results.map(function(item) {
            return h('li', item);
        })) :
        h('p', 'Enter multiple names separated by spaces')
    ])
}

function score(targets, name) {
    var total = 0;
    var metanames = natural.DoubleMetaphone.process(name);

    for (var i = 0; i < targets.length; i++) {
        total += lcs(targets[i], name).length/targets[i].length;
        total += natural.JaroWinklerDistance(targets[i], name);
        for (var j = 0; j < metanames.length; j++) {
            total += natural.JaroWinklerDistance(targets[i], metanames[j])/metanames.length;
        }
    }

    return total;
}

function rank_results(targets) {
    var names = [];

    chosen_lists.forEach(function(list) {
        names = names.concat(load_list(list));
    });

    names.sort(function(a, b) {
        if (!scorememo[a]) { scorememo[a] = score(targets, a); }
        if (!scorememo[b]) { scorememo[b] = score(targets, b); }

        return scorememo[b] - scorememo[a];
    });

    return names.slice(0, 100);
}

