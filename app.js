/* -------------------------------------------------------------------------- */
/*                                  DEĞİŞKENS                                 */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const tBody = document.querySelector("tBody");
  const searchBtn = document.getElementById("search-button");
  const searchInput = document.getElementById("searchInput");
  const modalContent = document.querySelector(".modal-content");
  const saveBtn = document.getElementById("saveBtn");
  const canvas = document.querySelector(".offcanvas-body ul.list-group");
  const modal = document.querySelector('.modal.fade');
  const maxLocalCoins = 5;

  let getCoins = [];
  let setLocalCoins = [];

  /* -------------------------------------------------------------------------- */
  /*                                  FETCİHNGG                                 */
  /* -------------------------------------------------------------------------- */

  const getCripto = async () => {
    try {
      const response = await fetch(`https://api.coinranking.com/v2/coins`);
      if (!response.ok) {
        throw new Error(`Sth went wrong: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.data.coins);

      showCoins(data.data.coins);
      getCoins = data.data.coins;
    } catch (error) {
      if (error.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  };

  const delayBetweenRequests = 1000;
  const handleApiRequests = async () => {
    for (let i = 0; i < 3; i++) {
      await getCripto();
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
    }
  };

  function showCoins(data) {
    data.forEach((element) => {
      const { symbol, name, color, coinrankingUrl, iconUrl, rank, change } = element;
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="fw-bold" style="color: rgb(52, 51, 51);">${name} </td>
        <td style="color:${color}">${rank} </td>
        <td style="color:${color}; font-weight:800">${symbol} </td>
        <td>
          <img src="${iconUrl}" alt="${name} Icon" width="30px" />
        </td>
        <td style="color: ${change > 0 ? 'darkgreen' : 'darkred'}">
          ${change > 0 ? `<i class="fa-solid fa-caret-up fa-bounce" style="color:darkgreen;"></i>` : `<i class="fa-solid fa-caret-down fa-fade" style="color:darkred;"></i>`} ${change}
        </td>
        <td>
          <a href="${coinrankingUrl}" target="_blank">
            <i class="fa-solid fa-chart-line fa-2x" style="color: rgba(77, 77, 184, 0.776);"></i>
          </a>
        </td>
      `;
      tBody.appendChild(tr);
    });
  }

  handleApiRequests();

  const showModal = (coins) => {
    coins.forEach((element) => {
      const { symbol, name, color, coinrankingUrl, iconUrl, change } = element;

      if (name.toLowerCase() === searchInput.value.toLowerCase()) {
        setLocalCoins.push(element);
        localStorage.setItem("coins", JSON.stringify(setLocalCoins));

        modalContent.innerHTML = `
          <div class="modal-header modal-dialog-centered">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">${name}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body d-flex flex-column gap-5 justify-content-around mt-3">
            <div class="d-flex flex-row justify-content-around align-items-center ">
              <img src="${iconUrl}" alt="${name} Icon" width="60px" />
              <p style="font-size:25px ; color:${color}; font-weight:800">${symbol}</p>
              <p style="font-size:25px; color:gray"><span style="color:blue; font-size:25px"> Change</span>${change}</p>
              <a href="${coinrankingUrl}" target="_blank">
                <i class="fa-solid fa-chart-line fa-3x"  style="color: #4d8f5a;"></i>
              </a>
            </div>
            <div class="d-flex justify-content-center" >
            
              <button style="background-color: rgb(207, 193, 68); border:none; border-radius:10px;width:80px ; height:40px ;" type="button " id="saveBtn" aria-label="close" data-bs-dismiss="modal" >Kaydet</button>
            </div>
          </div>`;

        modalContent.addEventListener("click", (e) => {
          if (e.target.id == "saveBtn") {
            handleSaveClick();
          }
        });
      }
    });
  };

  const handleSaveClick = () => {
    console.log("çalıştı");
    const savedCoins = JSON.parse(localStorage.getItem("savedCoins")) || [];
    const selectedCoin = getCoins.find((coin) => coin.name === searchInput.value);

    if (selectedCoin) {
      savedCoins.push(selectedCoin);
      localStorage.setItem("savedCoins", JSON.stringify(savedCoins));
    }
    showlocal(setLocalCoins);
  };

  const modalheader = document.querySelector(".modal-header");
  searchBtn.addEventListener("click", () => {
    if (searchInput.value !== "") {
      showModal(getCoins);
    } else {
      modalheader.innerHTML = `
        <p class=" text-center" style="color:darkred"> Lütfen geçerli bir değer giriniz</p>
      `;
    }
  });

  saveBtn.addEventListener("click", () => {
    let localCoins = localStorage.getItem("coins");
    modal.style.display="none"

    if (localCoins) {
      try {
        const parsedCoins = JSON.parse(localCoins);
        setLocalCoins = parsedCoins;
      } catch (error) {}
    }
    showlocal(setLocalCoins);

  });

  function showlocal(setLocalCoins) {
    const canvas = document.querySelector(".offcanvas-body ul.list-group");
    canvas.innerHTML = "";

    setLocalCoins.forEach((element) => {
      const { name } = element;

      let li = document.createElement("li");
      li.innerHTML = `
        <li class="list-group-item" style="border:none;border-radius:10px; background-image: linear-gradient(94.3deg, rgba(26,33,64,1) 10.9%, rgba(81,84,115,1) 87.1%);">${name}</li>`;

      canvas.appendChild(li);
    });

    
  }
});
