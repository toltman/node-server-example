document.querySelector(".request-complement")
    .addEventListener("click", function () {
        fetch("/complement")
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                document.querySelector(".complement").innerText = data.complement;
            })
            .catch(function (err) {
                console.error(err);
            })
    })

document.querySelector(".request-insult")
    .addEventListener("click", function () {
        fetch("/insult")
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                document.querySelector(".insult").innerText = data.insult;
            })
            .catch(function (err) {
                console.error(err);
            })
    })

const { easing, physics, spring, tween, styler, listen, value, transform } = window.popmotion;
const { pipe, clampMax } = transform;

const ball = document.querySelector('.ball');
const ballStyler = styler(ball);
const ballY = value(0, (v) => ballStyler.set('y', Math.min(0, v)));
const ballScale = value(1, (v) => {
    ballStyler.set('scaleX', 1 + (1 - v));
    ballStyler.set('scaleY', v);
});
let count = 0;
let isFalling = false;

const ballBorder = value({
    borderColor: '',
    borderWidth: 0
}, ({ borderColor, borderWidth }) => ballStyler.set({
    boxShadow: `0 0 0 ${borderWidth}px ${borderColor}`
}));

const checkBounce = () => {
    if (!isFalling || ballY.get() < 0) return;

    isFalling = false;
    const impactVelocity = ballY.getVelocity();
    const compression = spring({
        to: 1,
        from: 1,
        velocity: - impactVelocity * 0.01,
        stiffness: 800
    }).pipe((s) => {
        if (s >= 1) {
            s = 1;
            compression.stop();

            if (impactVelocity > 20) {
                isFalling = true;
                gravity
                    .set(0)
                    .setVelocity(- impactVelocity * 0.5);
            }
        }
        return s;
    }).start(ballScale);
};

const checkFail = () => {
    if (ballY.get() >= 0 && ballY.getVelocity() !== 0 && ball.innerHTML !== 'Tap') {
        count = 0;
        tween({
            from: { borderWidth: 0, borderColor: 'rgb(255, 28, 104, 1)' },
            to: { borderWidth: 30, borderColor: 'rgb(255, 28, 104, 0)' }
        }).start(ballBorder);

        ball.innerHTML = 'Tap';
    }
};

const gravity = physics({
    acceleration: 2500,
    restSpeed: false
}).start((v) => {
    ballY.update(v);
    checkBounce(v);
    checkFail(v);
});

listen(ball, 'mousedown touchstart').start((e) => {
    e.preventDefault();
    count++;
    ball.innerHTML = count;

    isFalling = true;
    ballScale.stop();
    ballScale.update(1);

    gravity
        .set(Math.min(0, ballY.get()))
        .setVelocity(-1200);

    tween({
        from: { borderWidth: 0, borderColor: 'rgb(20, 215, 144, 1)' },
        to: { borderWidth: 30, borderColor: 'rgb(20, 215, 144, 0)' }
    }).start(ballBorder);
});