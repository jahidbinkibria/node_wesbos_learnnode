const axios = require('axios');
const domPurify = require('dompurify');

function searchResultHTML(stores){
    return stores.map(store => {
        return `
            <a href="/store/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
    }).join("")
}

function typeAhed(search){
    if(!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResult = search.querySelector('.search__results');

    console.log(searchInput, searchResult);
    searchInput.on('input', function(){
        if(!this.value) {
            //if there no value, quit it
            searchResult.style.display = 'none';
            return; //stop
        }
        searchResult.style.display = 'block';

        axios
            .get(`/api/search?q=${this.value}`)
            .then(res => {
                if(res.data.length){
                    const html = domPurify.sanitize(searchResultHTML(res.data));
                    searchResult.innerHTML = html;
                    return;
                }
                //tell them nothing found
                searchResult.innerHTML =  domPurify.sanitize(`<div class="search__result">No result found for ${this.value} found!</div>`);

            }).catch(err => {
                console.error(err);
            });
    });



    //handle keyboard inputs
    searchInput.on('keyup', (e) => {
        //if they arenot pressing up, down arrow or enter, who cares!
        if(![38, 40, 13].includes(e.keyCode)){
            return; //nah
        }
        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;

        if(e.keyCode === 40 && current){
            next = current.nextElementSibling || items[0];
        }else if(e.keyCode === 40 ){
            next = items[0];
        }else if(e.keyCode ===38 && current){
            next = current.previousElementSibling || items[items.length -1 ];
        }else if(e.keyCode === 38){
            next = items[items.length -1];
        }else if(e.keyCode === 13 && current.href){
            window.location  = current.href;
            return;
        }
        if(current){
            current.classList.remove(activeClass);
        }
        next.classList.add(activeClass);
    })
};

export default typeAhed;