<div class="w3-container">
    <div class="w3-panel w3-blue w3-display-container w3-round">
        <div on:click={()=> helperHidden = !helperHidden}
             class="w3-button w3-blue w3-hover-black w3-left-align">
            <h6><b>Crypto Price Betting {@html helperHidden ? '&barvee;' : 'x'}</b></h6>
        </div>
        <div class="{ helperHidden ? 'w3-hide' : ''}">
            <p>Create your crypto pricing betting contract and challenge your friends.
                Provably Fair Smart Contracts Powered By <b>
                    <a rel="noopener" target="_blank" href="https://provable.xyz/">Provable</a></b>
                Oracles.
            </p>
            <div class="w3-cell-row">
                <div class="w3-container w3-cell w3-mobile">
                    <h5><b>How it works?</b></h5>
                    <p>
                        Once deployed, share the participation link.<br>
                        &bullet; Anyone can join before the <b>Closure Date.</b><br>
                        &bullet; Winner(s) are announced on the <b>Execution Date.</b>
                    </p>
                </div>
                <div class="w3-container w3-cell w3-mobile">
                    <h5><b>Jackpot Winner?</b></h5>
                    <p>
                        When execution date is reached, the Jackpot is shared equally with the winners.
                        <br>&bullet; The closest price prediction(s) to the Ticker on the execution date is the
                        winning result
                        <br>&bullet; Only one participation (prediction) per wallet (address)
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    let helperHidden = true;
</script>