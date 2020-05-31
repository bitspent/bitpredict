<div class="w3-content">
    <div class="w3-border w3-round w3-amber">
        <div class="w3-container w3-round ">
            <h6><b>Winner(s)</b></h6>
        </div>
        <table class="w3-table w3-striped w3-small w3-hoverable">
            <tr>
                <th>Address</th>
                <th>Price Bet</th>
                <th>Solution</th>
                <th>Won</th>
            </tr>
            {#each items as event}
                <WinnerRow event={event} user={userAddress}/>
            {/each}
        </table>
    </div>
</div>

<script>
    import WinnerRow from "./WinnerRow.svelte";

    export let userAddress;
    export let winners;

    let items = [];

    $: update(winners);

    function update() {
        if (winners.length > 0) {
            items = [];
            setTimeout(() => {
                items = inverse(winners);
            }, 1);
        }
    }

    function inverse(arr) {
        let _ = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            _.push(arr[i]);
        }
        return _;
    }
</script>