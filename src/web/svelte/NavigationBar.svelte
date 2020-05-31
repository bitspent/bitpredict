<div class="w3-bar w3-blue w3-card">
    <a href="." class="w3-bar-item w3-button w3-tag"><b>Ξ BitPredict</b></a>
    <div style="margin-top: 2px; margin-right: 2px"
         on:click={()=>contractAddress ? window.open('?contract='+contractAddress, '_blank'): ''}
         class="w3-bar-item w3-button w3-small w3-black w3-right">Go
    </div>
    <label class="w3-small">
        <input type="text" style="margin:2px 2px" class="w3-bar-item w3-input w3-right"
               placeholder="contract address..." bind:value={contractAddress}>
    </label>
</div>
<script>
    let contractAddress;
</script>