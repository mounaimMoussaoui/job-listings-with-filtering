function getData(source) {
    return fetch(source).then((res) => {
        return res.json();
    },
    (rejected) => {
        throw new Error(`rejected --: ${rejected}`);
    });
}

function addedItem(items) {
    for(let obj of items) {
            let cloneItem = document.querySelector(".container article.item").cloneNode(true);
            cloneItem.setAttribute("id", obj.id);
            cloneItem.children[0].children[0].setAttribute("src", obj.logo);
            cloneItem.children[1].children[0].children[0].textContent = obj.company;
            if(obj.new) {
                cloneItem.children[1].children[0].children[1].setAttribute("data-new", obj.new);
                cloneItem.children[1].children[0].children[1].textContent = "NEW!";
            }
            if(obj.featured) {
                cloneItem.children[1].children[0].children[2].setAttribute("data-features", obj.featured);
                cloneItem.children[1].children[0].children[2].textContent = "FEATURED"
            }
            if(obj.new && obj.featured) {
                cloneItem.classList.add("border-left");
            }
            cloneItem.children[1].children[1].textContent = obj.position;
            cloneItem.children[1].children[2].children[0].textContent = obj.postedAt;
            cloneItem.children[1].children[2].children[1].textContent = obj.contract;
            cloneItem.children[1].children[2].children[2].textContent = obj.location;
            cloneItem.children[2].children[0].textContent = obj.role;
            cloneItem.children[2].children[1].textContent = obj.level;
            for(let index in obj.languages) {
                let li = document.createElement("li");
                li.textContent = obj.languages[index];
                cloneItem.children[2].children[2].children[0].appendChild(li);
            }
            document.querySelector("section.container").appendChild(cloneItem);
        }
        addEvent(document.querySelectorAll(".container ul.poste-skills"), items);
        setTimeout(() => {
            document.querySelectorAll(".container article.item:not(:first-of-type)").forEach((item) => {
                item.classList.add("show");
            });
        },50);
    }

function itemsFiltering(nameFilter, arrItems) {
    let arr = [];
    arr = arrItems.filter((ele) => {
        for(let name of nameFilter) {
            if(ele.level == name.textContent || ele.role == name.textContent) {
                return ele;
            }
            for(let lang of ele.languages) {
                    if(lang == name.textContent || ele.level == name.textContent || ele.role == name.textContent) {
                        return ele;
                }
            }
            for(let tol of ele.tools) {
                    if(tol == name.textContent) {
                        return ele;
                    }
                }
            }
    });
    document.querySelectorAll(".container article.item:not(:first-of-type)").forEach((ele) => {
        ele.remove();
    });
    return arr;
}

function deleteItem(items) {
    items.forEach((ele) => {
        ele.addEventListener('click',function(event) {
            if(event.target.tagName.toLowerCase() == "img") {
                event.target.parentElement.remove();
                let listLis = document.querySelectorAll(".container .filtering ul.eleFiltering li");
                if(listLis.length == 0) {
                    let filteringBox = document.querySelector(".container .filtering");
                    filteringBox.classList.remove("show");
                    getData("/javascript/data.json").then((res) => {
                        document.querySelectorAll(".container article.item:not(:first-of-type)").forEach((ele) => {
                            ele.remove();
                        });
                        addedItem(res);
                    });
                }else {
                    getData("/javascript/data.json").then((res) => {
                        document.querySelectorAll(".container article.item:not(:first-of-type)").forEach((ele) => {
                            ele.remove();
                        });
                        addedItem(itemsFiltering(listLis, res));
                    });
                }
            }
        });
    });
}

function addEvent(arrLists, arrObj) {
    arrLists.forEach(element => {
        element.addEventListener("click", function(event) {
            if(event.target.tagName == "LI") {
                let filteringBox = document.querySelector(".container .filtering");
                if(!filteringBox.classList.contains("show")) {
                    filteringBox.classList.add("show");
                    let li = event.target.cloneNode(true);
                    let img = document.createElement("img");
                    img.src = "images/icon-remove.svg";
                    li.appendChild(img);
                    document.querySelector(".container .filtering ul.eleFiltering").appendChild(li);
                    addedItem(itemsFiltering([li], arrObj));
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                    deleteItem(document.querySelectorAll(".container .filtering ul.eleFiltering li"));
                    return 0;
                }
                let eleFiltering = document.querySelectorAll(".container .filtering ul.eleFiltering li");
                let li = event.target.cloneNode(true);
                let existVal = [...eleFiltering].some((ele) => {
                    return ele.textContent == li.textContent;
                });
                if(!existVal) {
                    let img = document.createElement("img");
                    img.src = "images/icon-remove.svg";
                    li.appendChild(img);
                    document.querySelector(".container .filtering ul.eleFiltering").appendChild(li);
                    addedItem(itemsFiltering([li], arrObj));
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                }
            }
            deleteItem(document.querySelectorAll(".container .filtering ul.eleFiltering li"), arrObj);
        });
    });
}

getData("/javascript/data.json").then((res) => {
    addedItem(res);
    addEvent(document.querySelectorAll(".container ul.poste-skills"), res);
},
(rej) => {
    console.log(rej);
});
document.querySelector(".container .filtering button").addEventListener("click", function(event) {
    [...event.target.parentElement.children[0].children].forEach((ele) => {
        ele.remove();
    });
    console.log();
    event.target.parentElement.classList.remove("show");
    [...document.querySelectorAll(".container .item.show")].forEach((ele) => {
        ele.remove();
    })
    getData("/javascript/data.json").then((res) => {
        addedItem(res);
    });
});
