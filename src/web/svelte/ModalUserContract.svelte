{#if showPending}
    <div class="w3-modal w3-show-block" style="padding-top: 250px;">
        <div class="w3-modal-content w3-hover-shadow w3-round w3-blue w3-card">
            <div class="w3-container w3-blue w3-round">
                {#if pendingTx === null}
                    <div class="w3-panel w3-blue w3-display-container">
                        <div>
                            <div class="loader w3-left"></div>
                            <b style="margin-left: 20px">Loading Contracts From Ethereum</b> ({counter} sec)
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
<script>
    export let showPending;
    export let pendingTx;
    export let counter;
</script>