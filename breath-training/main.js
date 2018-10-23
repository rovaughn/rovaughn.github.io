
function print_remaining(s) {
    s = Math.round(s);
    var min = (s/60)|0;
    var sec = s % 60;

    if (sec < 10) {
        sec = '0' + sec;
    }

    return min + ':' + sec;
}

function start(total_time, bpm, points) {
    var start_elem = document.getElementById('start');
    var timer_elem = document.getElementById('timer');
    start_elem.style.display = 'none';
    timer_elem.style.display = 'block';
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    var beginTime = +new Date();

    function pie(start, end) {
        start = 2*Math.PI*(start - 0.25);
        end = 2*Math.PI*(end - 0.25);
    }

    var timer_elem = document.getElementById('timer');
    var need_refresh = true;
    var commandElem = document.getElementById('command');
    var remaining_elem = document.getElementById('remaining');
    var commandText = commandElem.innerText;

    var original_round_length = 0;
    for (var i = 0; i < points.length; i++) {
        original_round_length += points[i].length;
    }

    var round_length = 60 / bpm;
    
    for (var i = 0; i < points.length; i++) {
        points[i].length *= round_length / original_round_length;
    }

    var n_rounds = Math.ceil(total_time / round_length);
    total_time = n_rounds * round_length;

    var last_remaining = total_time;
    remaining_elem.innerText = print_remaining(last_remaining);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    function paint() {
        var elapsed = (+new Date() - beginTime)/1000;
        var position = elapsed % round_length;
        var remaining = (total_time - elapsed)|0;

        if (remaining <= 0) {
            clearInterval(timer);
            timer_elem.style.display = 'none';
            start_elem.style.display = 'block';
            return;
        }

        if (remaining !== last_remaining) {
            remaining_elem.innerText = print_remaining(last_remaining = remaining);
        }

        var start = 0;
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var next_point = points[(i + 1)%points.length];
            var end = start + point.length;

            if (position > start && position <= end) {
                if (point.name !== commandText) {
                    commandElem.innerText = commandText = point.name;
                }

                var breath = point.breath + (next_point.breath - point.breath) * (position - start) / (end - start);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.arc(101, 101, 100, 0, 2*Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(101, 101, 100*breath, 0, 2*Math.PI);
                ctx.fill();
            }

            start = end;
        }

        requestAnimationFrame(paint);
    }

    //var timer = setInterval(requestAnimationFrame.bind(null, paint), 1000/35);
    requestAnimationFrame(paint);
}

document.getElementById('start-btn').onclick = function() {
    var total_time = +document.getElementById('min').value;
    var bpm = +document.getElementById('bpm').value;

    console.log(total_time, bpm);

    start(total_time*60, bpm, [
        {name: 'Inhale', length: 3, breath: 0, color: 'white'},
        {name: 'Exhale', length: 9, breath: 1, color: 'white'},
    ]);
}

