{#if showPending}
    <div class="w3-modal w3-show-block" style="padding-top: 250px;">
        <div class="w3-modal-content w3-hover-shadow w3-round w3-blue w3-card">
            <div class="w3-container w3-blue w3-round">
                {#if showClose}
                    <span on:click={()=> showPending = false} style="z-index: 1"
                          class="w3-button w3-text-black w3-xlarge w3-display-topright">&times;</span>
                    <div class="w3-panel w3-blue w3-display-container">
                        <h5><b>Your Contract Is Deployed</b></h5>
                        <p>Copy & Share the Contract Link:</p>
                        <label>
                            <textarea style="width: 100%"
                                      readonly>{'http://bitpredict.live?contract='+newContract}</textarea>
                        </label>
                        <a class="w3-button w3-deep-purple"
                           href="whatsapp://send?text=Checkout my crypto prediction betting contract, {'http://bitpredict.live?contract='+newContract}"
                           data-action="share/whatsapp/share">Share via Whatsapp</a>
                    </div>
                {:else}
                    {#if pendingTx === null}
                        <div class="w3-panel w3-blue w3-display-container">
                            <div>
                                <div class="loader w3-left"></div>
                                <b style="margin-left: 20px">Loading Contract From Ethereum</b> ({counter} sec)
                            </div>
                        </div>
                    {:else}
                        <div class="w3-panel w3-blue w3-display-container">
                            <div>
                                <div class="loader w3-left"></div>
                                <b style="margin-left: 20px">Pushing Contract Tx to Ethereum</b> ({counter} sec)
                            </div>
                            <label>
                                        <textarea class="w3-margin-top" style="width: 100%"
                                                  readonly>{pendingTx}</textarea>
                            </label>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
{/if}
<script>
    export let showClose;
    export let showPending;
    export let newContract;
    export let counter;
    export let pendingTx;
</script>