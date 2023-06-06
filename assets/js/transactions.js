window.onload = getTransactions;

async function getTransactions() {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("accountId");
    const url = `${baseUrl}/operation/all/${userId}`;
    console.log(userId);
    await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    .then((response) => {
        console.log(response.data);
        let data = JSON.stringify(response.data);
        return data;
    });
}