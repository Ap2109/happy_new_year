"use strict";

function shuffle(t) {
    let r = t.length;
    for (; r > 0;) {
        let e = Math.floor(Math.random() * r);
        r--, [t[r], t[e]] = [t[e], t[r]]
    }
    return t
}

const TIME_WRITER = 1000; // Reduced from 2000 to 1000
const typeWriterElement = document.getElementById("typewriter");
const defaultMessage = "Năm mới sắp tới, lời chúc sắp được tiết lộ";
const textArray = [defaultMessage];

function delWriter(t, r, e) {
    r >= 0 ? (typeWriterElement.innerHTML = t.substring(0, r--), setTimeout(function() {
        delWriter(t, r, e)
    }, 5 + 50 * Math.random())) : "function" == typeof e && setTimeout(e, TIME_WRITER) // Reduced delay from 10+100 to 5+50
}

function typeWriter(t, r, e) {
    r < t.length + 1 ? (typeWriterElement.innerHTML = t.substring(0, r++), setTimeout(function() {
        typeWriter(t, r++, e)
    }, 100 - 50 * Math.random())) : r === t.length + 1 && setTimeout(function() { // Reduced delay from 250-100 to 100-50
        delWriter(t, r, e)
    }, TIME_WRITER)
}

function StartWriter(t) {
    void 0 === textArray[t] ? setTimeout(function() {
        StartWriter(0)
    }, TIME_WRITER) : t < textArray[t].length + 1 && typeWriter(textArray[t], 0, function() {
        StartWriter(t + 1)
    })
}
setTimeout(function() {
    StartWriter(0)
}, TIME_WRITER);