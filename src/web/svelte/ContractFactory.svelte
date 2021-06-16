<div class="w3-border-blue w3-round w3-border w3-blue" style="padding: 2px">
    <div class="w3-container w3-blue">
        <h6 class="w3-left">
            <b class="w3-tooltip">
                <a href="https://www.instagram.com/p/CAu0kN-gd_u" target="_blank" rel="noopener"
                   class="w3-button w3-round w3-medium">&#9432; Create Round</a>
                <span style="position:absolute;left:180px;z-index: 1; width: 140px"
                      class="w3-text w3-tag">Make Your Own  Round</span>
            </b>
        </h6>
        <h6>
            <a href="https://etherscan.io/address/{BitPredictFactory.address}"
               target="_blank" rel="noopener" class="w3-button w3-small w3-black w3-round w3-right">
                <b>Explore &#11045</b>
            </a>
        </h6>
    </div>
    <div class="w3-container w3-white">
        <label class="w3-text-black">
            <br>
            <b class="w3-tooltip">Crypto Ticker:
                <span class="w3-text w3-tag"
                      style="position:absolute;left:250px;width:100%;z-index: 1">Crypto Prediction Price</span>
            </b>
            <select class="w3-select w3-large w3-margin-bottom w3-text-deep-purple"
                    style="font-weight: bold; width: 150px; cursor: pointer"
                    bind:value={crTicker}>
                {#each tickerList as ticker}
                    <option value="{ticker}" class="w3-large">{ticker}</option>
                {/each}
            </select>
        </label>
        <br>
        <br>
        <label class="w3-text-black ">
            <b class="w3-tooltip">Ticket Price: {crTicket/100} ETH
                <span style="position:absolute;left:220px;z-index: 1"
                      class="w3-text w3-tag">Per Participant</span>
            </b>
            <input type="range" min="1" max="100" bind:value="{crTicket}"
                   class="w3-input w3-border w3-light-grey slider w3-margin-bottom">
        </label>
        <label class="w3-text-black">
            <b class="w3-tooltip">Closes In:
                {crClose/24 < 1? '' : Math.floor(crClose/24) + ' Days' }
                {crClose%24 === 0 ? '' : crClose%24 + ' Hour(s)'}
                <span style="position:absolute;left:205px;z-index: 1"
                      class="w3-text w3-tag">Participation Stops</span>
            </b>
            <input type="range" min="1" step="1" max="449" bind:value={crClose}
                   class="w3-input w3-border w3-light-grey slider w3-margin-bottom">
        </label>
        <label class="w3-text-black">
            <b class="w3-tooltip">Executes In:
                {crExecute/24 < 1? '' : Math.floor(crExecute/24) + ' Days' }
                {crExecute%24 === 0 ? '' : crExecute%24 + ' Hour(s)'}
                <span style="position:absolute;left:240px;z-index: 1"
                      class="w3-text w3-tag">Winner(s) Announced</span>
            </b>
            <input type="range" min="2" step="1" max="450" bind:value={crExecute}
                   class="w3-input w3-border w3-light-grey slider w3-margin-bottom">
        </label>
        <label class="w3-text-black">
            <b class="w3-tooltip">Your Commission: {Math.floor(crCommission/10)} %
                <span style="position:absolute;left:240px;z-index: 1"
                      class="w3-text w3-tag">Jackpot Fees</span>
            </b>
            <input type="range" min="0" step="1" max="250" bind:value={crCommission}
                   class="w3-input w3-border w3-light-grey slider w3-margin-bottom">
        </label>
        <button class="w3-button w3-right w3-round w3-margin-top w3-margin-bottom w3-blue"
                on:click={createContractAsync}>
            <b>Deploy Contract</b>
        </button>
    </div>
</div>
<script>

    import BitEth from "../js/BitEth";
    import BitPredictFactory from '../js/BitPredictFactory';

    let crTicker;
    let crTicket = 1;
    let crClose = 6;
    let crExecute = 10;
    let crCommission = 25;

    export let tickerList;
    export let setPending;

    $ : update(crExecute, crClose, tickerList);

    function update() {
        crExecute = crExecute <= crClose ? crClose + 1 : crExecute;
        if (!crTicker) crTicker = tickerList[0];
    }

    async function createContractAsync() {
        let address = await BitEth.getAddressAsync();
        let bytes9Ticker = web3.fromAscii(crTicker);
        let uintWeiTicket = String(crTicket * 10 ** 18 / 100);
        let uintClosureDelay = String(crClose * 3600);
        let uintExecutionDelay = String(crExecute * 3600);
        let uintFees = String(Math.floor(crCommission / 10));
        let tx = await BitPredictFactory.createPredictionContractAsync(address,
                bytes9Ticker,
                uintWeiTicket,
                uintClosureDelay,
                uintExecutionDelay,
                uintFees);
        setPending(tx);
    }

</script>