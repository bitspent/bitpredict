let BitEth = {
    /*
     * Get Default Account[0]
     */
    getAddressAsync() {
        return new Promise(async (res, rej) => {
            if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
                const accounts = await ethereum.request({method: 'eth_accounts'});
                if (accounts && accounts.length === 0) {
                    await ethereum.enable();
                    window.location.reload();
                } else {
                    res(accounts[0]);
                }
            }
        });
    },
    cutAddress(address) {
        return address.substring(0, 8) + '...' + address.substring(36);
    }
};

export default BitEth;