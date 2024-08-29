// select branch
window.addEventListener("load", async () => {
  let res = await fetch("https://ksp.co.il/m_action/api/mlay/1");
  let r = await res.json();
  const snifim = Object.entries(r.result.stores).map((x) => {
    return {
      inner: x[0],
      display: x[1].name,
    };
  });
  const selectTag = document.createElement("select");
  selectTag.setAttribute("id", "__snifim");
  let defaultSelection = document.createElement("option");
  defaultSelection.innerText = "--- בחרו סניף ---";
  defaultSelection.setAttribute("disabled", true);
  defaultSelection.setAttribute("selected", true);
  selectTag.appendChild(defaultSelection);
  snifim.forEach((snif) => {
    let tag = document.createElement("option");
    tag.value = snif.inner;
    tag.innerText = snif.display;
    tag.classList.add("__zebamlai_snif");
    selectTag.appendChild(tag);
  });
  Array.from(document.querySelector(".muirtl-vzk0w6").children)[0].appendChild(
    selectTag,
  );

  selectTag.addEventListener("change", (event) => itsGoTime());
});

async function itsGoTime() {
  // clear tags
  Array.from(document.querySelectorAll(".__zebamlai")).forEach((tag) =>
    tag.remove(),
  );
  // get data from api
  let ksp = async (maqat, store) => {
    let base_url = (maqat) => `https://ksp.co.il/m_action/api/mlay/${maqat}`;
    let res = await fetch(base_url(maqat));
    let r = await res.json();
    return r.result.stores[store];
  };
  let snif = document.getElementById("__snifim").value;
  if (!snif) return;
  // get the elements containing maqatim from page
  let maqatim = Array.from(document.querySelectorAll("span")).filter((el) => {
    return el.textContent.match(/מק\"ט KSP: \d+/);
  });
  let data = await Promise.all(
    maqatim.map(async (el) => {
      let maqat = el.textContent.replaceAll('מק"ט KSP: ', "");
      let r = await ksp(maqat, snif);
      return { el, inStock: r.qnt > 0 };
    }),
  );
  data.forEach((maqat) => {
    let s = document.createElement("span");
    s.classList.add("__zebamlai");
    s.innerText = maqat.inStock ? "כרגע במלאי" : "לא במלאי";
    s.style.backgroundColor = maqat.inStock ? "green" : "";
    s.style.color = maqat.inStock ? "white" : "";
    s.style.margin = "0 1rem";
    s.style.padding = "0.25rem 0.5rem";
    maqat.el.appendChild(s);
  });
}
