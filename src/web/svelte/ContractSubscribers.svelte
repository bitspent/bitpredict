<div class="w3-content">
    <div class="w3-border w3-round w3-blue">
        <div class="w3-container">
            <h6><b>Users Bets</b></h6>
        </div>
        <table class="w3-table w3-striped w3-small w3-hoverable">
            <tr>
                <th>Address</th>
                <th>Price Bet</th>
                <th>Time</th>
            </tr>
            {#each items as event}
                <BetRow event={event} user={userAddress}/>
            {/each}
        </table>
    </div>
</div>
<script>
    import BetRow from "./BetRow.svelte";

    export let events;
    export let userAddress;

    let items = [];

    $: update(events);

    function update() {
        if (events.length > 0) {
            items = [];
            setTimeout(() => {
                items = inverse(events);
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