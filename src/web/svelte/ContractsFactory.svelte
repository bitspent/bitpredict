<div class="w3-border-blue w3-round w3-border w3-white">
    <div class="w3-container w3-blue">
        <h6 class="w3-left"><b>Recent Contracts</b></h6>
        <a href=".?address={userAddress}" style="margin-top: 6px;"
           class="w3-bar-item w3-button w3-small w3-black w3-round w3-right"><b>My Contracts</b></a>
    </div>
    <table class="w3-table w3-striped w3-small w3-hoverable">
        <tr>
            <th></th>
            <th>Pair</th>
            <th>Ticket</th>
            <th>Status</th>
        </tr>
        {#each items as event}
            <ContractRow event={event}/>
        {/each}
    </table>
</div>
<script>
    import ContractRow from "./ContractRow.svelte";

    export let userAddress;
    export let events;

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