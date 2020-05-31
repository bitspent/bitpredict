<div class=" w3-content w3-border-blue w3-round w3-border w3-white">
    <div class="w3-container w3-blue" style="margin-right: -0.5px!important;">
        <h6 class="w3-medium"><b>My Recent Contracts</b></h6>
    </div>
    <table class="w3-table w3-striped w3-small w3-hoverable">
        <tr>
            <th>#</th>
            <th>Pair</th>
            <th>Ticket</th>
            <th>Status</th>
        </tr>
        {#each items as event}
            {#if event.creator === queryUser}
                <ContractRow event={event}/>
            {/if}
        {/each}
    </table>
</div>

<script>
    import ContractRow from "./ContractRow.svelte";

    export let events;
    export let queryUser;

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