import React, {Component} from 'react';
import { render } from 'react-dom';
import tao from './tao';
import { Router, Route, Link, Redirect } from 'react-router';

// Return a random integer in the range [0..n)
function rand(n) {
    return Math.random()*n|0;
}

function format(lines) {
    let paragraphs = [];
    let paragraph  = [];

    for (let line of lines) {
        if (line == '') {
            paragraphs.push(paragraph);
            paragraph = [];
        } else {
            paragraph.push(line);
        }
    }

    paragraphs.push(paragraph);

    return paragraphs.map((paragraph)=> {
        let pieces = [];

        for (let line of paragraph) {
            pieces.push(line);
            pieces.push(<br/>);
        }

        return <p>{pieces}</p>;
    });
}

class Main extends Component {
    render() {
        const { params: {n: nstr} } = this.props;
        const n = +nstr;

        return <div>
            <ul className='controls'>
                <li><Link to="/1">|&lt;</Link></li>
                <li><Link to={`/${n - 1}`}>&lt;</Link></li>
                <li><Link to={`/${rand(tao.length)}`}>Random</Link></li>
                <li><Link to={`/${n + 1}`}>&gt;</Link></li>
                <li><Link to={`/${tao.length}`}>&gt;|</Link></li>
            </ul>
            <div className='number'>{n}</div>
            <div className='tao'>{format(tao[n - 1])}</div>
        </div>;
    }
}

document.onkeypress = function(e) {
    console.log(e.which);
};

window.main = render(
    <Router>
        <Redirect from="/" to="/1"/>
        <Route path="/:n" component={Main}/>
    </Router>
, document.getElementById('main'));

