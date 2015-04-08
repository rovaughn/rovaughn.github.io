
var ShowMass = React.createClass({
  statics: {
    conversions: {
      kg:  1,
      eV:  5.6095884e35,
      lbs: 2.2046226
    }
  },

  render: function() {
    var value = this.props.value / ShowMass.conversions[this.props.from]
                                 * ShowMass.conversions[this.props.to];
    
    return <span>{value.toPrecision(3)}{this.props.to}</span>;
  }
});

var SideBySide = React.createClass({
  render: function() {
    return <table className="side-by-side">
    <tbody>
    <tr>
    {React.Children.map(this.props.children, function(child) {
      return <td>{child}</td>;
    })}
    </tr>
    </tbody>
    </table>;
  }
});

function setter(o, k) {
  return function(e) {
    var x = {};
    x[k] = e.target.value;
    o.setState(x);
  };
}

var Diagram = React.createClass({
  render: function() {
    return <img style={{margin: 'auto'}} src={this.props.name + ".png"}/>;
  }
});

var ManagedInput = React.createClass({
  change: function(e) {
    var node = this.refs.input.getDOMNode();

    this.props.cursor.set({
      value: e.target.value,
      selectionStart: node.selectionStart,
      selectionEnd: node.selectionEnd
    });
  },

  update: function(e) {
    var node = this.refs.input.getDOMNode();

    setTimeout(function() {
      this.props.cursor.merge({
        selectionStart: node.selectionStart,
        selectionEnd: node.selectionEnd
      });
    }.bind(this), 0);
  },

  componentDidMount: function() {
    var node = this.refs.input.getDOMNode();

    node.onclick = this.update;
    node.onkeydown = this.update;

    node.selectionStart = this.props.cursor.value.selectionStart;
    node.selectionEnd   = this.props.cursor.value.selectionEnd;

    node.focus();
  },

  render: function() {
    return <input ref="input" onChange={this.change} value={this.props.cursor.value.value} {...this.props}/>;
  }
});


var slides = [];

// 0
slides.push(React.createClass({
  render: function() {
    return <div>
      <h1 style={{fontSize: 48, textAlign: 'center', paddingTop: 150}}>State and React Components</h1>
      <p style={{textAlign: 'center'}}>Alec Newman</p>
    </div>;
  },
}));

// 1
slides.push(React.createClass({
  setter: function(key) {
    return function(e) {
      this.props.cursor.refine(key).set(e.target.value);
    }.bind(this);
  },

  unitSelect: function(value, onChange) {
    return <select value={value} onChange={onChange}>
      <option>lbs</option>
      <option>kg</option>
      <option>eV</option>
    </select>;
  },

  render: function() {
    var props = this.props.cursor.value;

    var result = <ShowMass value={props.value} from={props.from} to={props.to}/>;

    return <div>
      <h2>What is a React component?</h2>
      <p>A function from props and state to a DOM tree.  Data to data.</p>
      <Diagram name="15-04-07-14-00-05"/>
      <p><code>{'<Red>text</Red> = <span style="color: red;">text</span>'}</code></p>
      <p><code>{'<Mass kg="100" units="lbs"/> = <span>220lbs</span>'}</code></p>
    </div>;
  }
}));

// 2
slides.push(React.createClass({
  render: function() {
    return <div>
      <h2>State</h2>
      <p>State can change over the lifetime of a component.</p>
      <Diagram name="15-04-07-14-03-42"/>
    </div>;
  }
}));

// 3
slides.push(React.createClass({
  render: function() {
    return <div>
      <h2>Consistency principle</h2>
      <p>Keeping state in one spot, and computing things from the central state, makes it much easier to keep the overall application consistent.</p>
    </div>;
  }
}));

// 4
slides.push(React.createClass({
  render: function() {
    return <div>
      <h2>Consistency principle</h2>
      <Diagram name="15-04-07-14-54-51"/>
    </div>;
  }
}));

// 5
slides.push(React.createClass({
  render: function() {
    return <div>
      <h2>Consistency principle</h2>
      <Diagram name="15-04-07-14-54-49"/>
    </div>;
  }
}));

// 6
slides.push(React.createClass({
  render: function() {
    return <div>
      <h2>Global state</h2>
      <ul>
      <li>Consistency</li>
      <li>Serializable</li>
      <li>Pure components</li>
      <li>Testable</li>
      <li>Reusability/composability</li>
      <li>Unambiguous life cycle</li>
      </ul>
    </div>;
  }
}));

// 7
slides.push(React.createClass({
  render: function() {
    return <div>
      <h2>Local state</h2>
      <Diagram name="15-04-07-15-10-01"/>
      <ul>
        <li>Less props to pass back and forth</li>
        <li>Potentially more efficient</li>
      </ul>
    </div>;
  }
}));

// 8
slides.push(React.createClass({
  render: function() {
    return <div>
      <h2>Local state</h2>
      <ManagedInput style={{fontSize: 30}} cursor={this.props.cursor}/>
      <p><pre>{JSON.stringify(this.props.cursor.value, null, 2)}</pre></p>
    </div>;
  }
}));


// 9
slides.push(React.createClass({
  toggle: function() {
    this.props.cursor.refine('show').apply(function(b) { return !b; });
  },

  render: function() {
    var show = this.props.cursor.value.show;

    return <div>
      <h2>Lifecycle</h2>
      <p><button onClick={this.toggle}>{show ? 'Hide' : 'Show'}</button></p>
      {show ? <p><input/></p> : <p/>}
    </div>;
  }
}));

var Chatroom = React.createClass({
  selectConvo: function(convoName) {
    return function() {
      this.props.cursor.merge({
        selected: convoName
      });
    }.bind(this);
  },

  changeDraft: function(e) {
    this.props.cursor
      .refine('conversations')
      .refine(this.props.cursor.value.selected)
      .refine('draft')
      .set(e.target.value);
  },

  send: function() {
    var convo = this.props.cursor.refine('conversations')
                                 .refine(this.props.cursor.value.selected);
    
    convo.refine('messages').push([{you: true, content: convo.value.draft}]);
    convo.refine('draft').set('');
  },

  render: function() {
    var props         = this.props.cursor.value,
        conversations = props.conversations,
        convoNames    = Object.keys(props.conversations),
        selected      = props.selected,
        selectedConvo = conversations[selected];

    convoNames.sort();

    return <div className="chatroom">
      <div className="leftpane">
      <ul>
        {convoNames.map(function(convoName) {
          var convo = conversations[convoName],
              classes = React.addons.classSet({
                selected: convoName === selected,
                unsent: convo.draft,
                online: convo.online
              });
          
          return <li className={classes}
                     onClick={this.selectConvo(convoName)}>{convoName}</li>;
        }, this)}
      </ul>
      </div>
      <div className="rightpane">
      <ul>
      {selectedConvo.messages.map(function(message) {
        if (message.you) {
          return <li className="you">{message.content}</li>;
        } else {
          return <li>{message.content}</li>;
        }
      })}
      </ul>
      </div>
      <div className="editor">
        <input type="text" value={selectedConvo.draft} onChange={this.changeDraft}/>
        <button onClick={this.send}>Send</button>
      </div>
    </div>;
  }
});

// 10
slides.push(React.createClass({
  toggle: function() {
    this.props.cursor.refine('show').apply(function(b) { return !b; });
  },

  render: function() {
    var cursor   = this.props.cursor,
        show     = cursor.value.show,
        chatroom = cursor.refine('chatroom');

    return <div>
      <h2>Example application: Messenger</h2>
      <p><button onClick={this.toggle}>{show ? 'Hide state' : 'Show state'}</button></p>
      <Chatroom cursor={chatroom}/>
      {show ? <pre>{JSON.stringify(chatroom.value, null, 2)}</pre> : null}
    </div>;
  }
}));

var phi = (1 + Math.sqrt(5)) / 2;

var Main = React.createClass({
  getInitialState: function() {
    try {
      return JSON.parse(localStorage.state);
    } catch (e) {
      return {
        current: 0,
        slideProps: [
          /* 0 */ {},
          /* 1 */ {},
          /* 2 */ {},
          /* 3 */ {},
          /* 4 */ {},
          /* 5 */ {},
          /* 6 */ {},
          /* 7 */ {},
          /* 8 */ {value: "hello", selectionStart: 2, selectionEnd: 3},
          /* 9 */ {show: false},
          /* 10 */ {chatroom: {selected: "Alice", conversations: {
            Alice: {messages: [
              {you: false, content: "hey what's up"},
              {you: true,  content: "not much wbu"}
            ], draft: ''},
            Bill: {messages: [
              {you: true, content: "What's up Bill"},
              {you: false, content: "I'm doing alright"},
              {you: false, content: "Hey man I haven't heard back from you in a while"}
            ], draft: ''},
            Eve: {messages: [
            ], draft: ''}
          }}}
        ]
      };
    }
  },

  componentWillMount: function() {
    window.onkeydown = this.keyPress;
  },

  componentDidUpdate: function() {
    localStorage.state = JSON.stringify(this.state);
  },

  keyPress: function(e) {
    if (e.which === 34 && this.state.current < slides.length - 1) {
      this.setState({
        current: this.state.current + 1
      });
    } else if (e.which === 33 && this.state.current > 0) {
      this.setState({
        current: this.state.current - 1
      });
    }
  },

  render: function() {
    var width  = 700,
        height = width / phi, 
        cursor = Cursor.build(this);

    return <div className="slide" style={{width: width, height: height}}>
      {React.createElement(slides[this.state.current], {cursor: cursor.refine('slideProps').refine(this.state.current)})}
    </div>;
  }
});

var main = React.render(<Main/>, document.getElementById('main'));

