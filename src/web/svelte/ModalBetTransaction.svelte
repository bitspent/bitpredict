{#if showPending}
    <div class="w3-modal w3-show-block" style="padding-top: 250px;">
        <div class="w3-modal-content w3-hover-shadow w3-round w3-blue w3-card">
            <div class="w3-container w3-blue w3-round">
                {#if showClose}
                    <span on:click={()=> showPending = false} style="z-index: 1"
                          class="w3-button w3-xlarge w3-text-black w3-display-topright">&times;</span>
                    <div class="w3-panel w3-blue w3-display-container">
                        <h5><b>Your Price Bet on {userTicker}: {userPrediction} </b></h5>
                    </div>
                {:else}
                    <div class="w3-panel w3-blue w3-display-container">
                        <div>
                            <div class="loader w3-left"></div>
                            <b style="margin-left: 20px">{ pendingTx ? 'Broadcasting Bet Transaction' : 'Loading Contract From Ethereum' }</b>
                            ({counter} sec)
                        </div>
                        {#if pendingTx != null}
                            <label>
                                <textarea class="w3-margin-top" style="width: 100%" readonly>{pendingTx}</textarea>
                            </label>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<script>

    export let pendingTx;
    export let counter;
    export let userTicker;
    export let userPrediction;
    export let showClose;
    export let showPending;

</script>