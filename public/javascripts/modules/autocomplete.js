function autocomplete(input, latInput, lngInput){
    if(!input) return;  //skip this function from running if there is not input on the page
    const dropdown  = new google.maps.places.Autocomplete(input);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });
    //if someone accedently hits enter button on address field, dont submit the form
    input.on('keydown', (e) => {
        if(e.keyCode === 13) e.preventDefault();
    })
}

export default autocomplete; 