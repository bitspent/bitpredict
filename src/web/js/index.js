import '../css/w3.css';
import '../css/index.css';
import App from '../svelte/App.svelte';

function onlyHttps() {
    window.location.protocol !== "https:"
    && window.location.href.indexOf('localhost') < 0
    && (window.location.href = window.location.href.replace('http:', 'https:'));
}

new App({target: document.getElementsByTagName('app')[0]});

onlyHttps();