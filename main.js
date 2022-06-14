$(document).ready(function() {
    $('#title').autocomplete({          // jquery autocomplete feature
        source: async function(request,response) {
            let data = await fetch(`http://localhost:8000/search?query=${request.term}`)
                .then(results => results.json())
                .then(results => results.map(result => {
                    return {            //return new object
                        label: result.title,
                        value: result.title,
                        id: result._id
                    }
                }))
            response(data)
        },
        minLength: 2,
        select: function(event, ui) {   // hey server, can you send the id?
            console.log(ui.item.id)
            fetch(`http://localhost:8000/get/${ui.item.id}`)
            .then(result => result.json())
            .then(result => {
                $('#cast').empty()      //git rid of cast already there
                result.cast.forEach(cast => 
                    {
                        $('#cast').append(`<li>${cast}</li>`)
                    })
                    $('img').attr('src', result.poster) // set source = the object's poster img
            })
        }
    })
})