var fields = document.querySelectorAll("#form-user-create [name]");

fields.forEach(fields => {
    if(fields.name === "gender")
    {
        if(fields.checked)
        {
            console.log("checou")
        }
    }
    else
    {
        console.log(fields)
    }
});
